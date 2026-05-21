const http = require("http");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");

const root = __dirname;
loadLocalEnv(path.join(root, ".env"));

const port = Number(process.env.PORT || 4173);
const speechCache = new Map();
const aiApiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY || "";
const aiModel = process.env.OPENAI_MODEL || process.env.AI_MODEL || "gpt-5-mini";
const aiResponsesUrl = process.env.AI_RESPONSES_URL || "https://api.openai.com/v1/responses";
const aiStreamTimeoutMs = Number(process.env.AI_STREAM_TIMEOUT_MS || 40000);
const teacherMessageBreak = "\u3010NEXT_MESSAGE\u3011";
const teacherCorrectionMark = "\u3010CORRECTION\u3011";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

function loadLocalEnv(filePath) {
  if (!fsSync.existsSync(filePath)) return;

  const lines = fsSync.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if (!key || process.env[key]) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  response.end(JSON.stringify(payload));
}

function collectBody(request, maxLength = 30000) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxLength) {
        reject(new Error("Request body is too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function handleSpeech(request, response) {
  let payload;
  try {
    payload = JSON.parse(await collectBody(request));
  } catch {
    sendJson(response, 400, { error: "Invalid request" });
    return;
  }

  const text = String(payload.text || "").trim();
  const mode = String(payload.mode || "sentence");

  if (!text) {
    sendJson(response, 400, { error: "Text is required" });
    return;
  }

  if (text.length > 200) {
    sendJson(response, 400, { error: "Text is too long" });
    return;
  }

  const cacheKey = `online-tts\n${mode}\n${text}`;
  if (speechCache.has(cacheKey)) {
    response.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=3600",
      "X-Voice-Source": "online",
    });
    response.end(speechCache.get(cacheKey));
    return;
  }

  const audio = await fetchOnlineSpeech(text);
  speechCache.set(cacheKey, audio);
  response.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Cache-Control": "private, max-age=3600",
    "X-Voice-Source": "online",
  });
  response.end(audio);
}

async function fetchOnlineSpeech(text) {
  const params = new URLSearchParams({
    ie: "UTF-8",
    client: "tw-ob",
    tl: "en-US",
    q: text,
    ttsspeed: "1",
  });
  const response = await fetch(`https://translate.google.com/translate_tts?${params}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      Referer: "https://translate.google.com/",
    },
  });

  if (!response.ok) {
    throw new Error(`Online speech failed: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function handleAiTeacher(request, response) {
  let payload;
  try {
    payload = JSON.parse(await collectBody(request));
  } catch {
    sendJson(response, 400, { error: "Invalid request" });
    return;
  }

  if (!aiApiKey) {
    sendJson(response, 503, {
      error: "AI teacher is not configured",
      message: "JJ\u8001\u5e08\u8fd8\u6ca1\u6709\u8fde\u63a5\u5728\u7ebfAI\u670d\u52a1\u3002\u914d\u7f6e\u540e\u7aef\u5bc6\u94a5\u540e\u5c31\u53ef\u4ee5\u4f7f\u7528\u3002",
    });
    return;
  }

  const mode = String(payload.mode || "chat");
  if (mode === "explain") {
    const sentence = String(payload.sentence || "").trim();
    if (!sentence) {
      sendJson(response, 400, { error: "Sentence is required" });
      return;
    }

    const reply = await askAiTeacher(buildExplainPrompt(sentence), mode);
    sendJson(response, 200, { reply });
    return;
  }

  const message = String(payload.message || "").trim();
  if (!message) {
    sendJson(response, 400, { error: "Message is required" });
    return;
  }

  const history = Array.isArray(payload.messages) ? payload.messages.slice(-10) : [];
  if (payload.stream === true) {
    await streamAiTeacherResponse(response, buildChatPrompt(message, history, mode), mode);
    return;
  }

  const reply = compactTeacherReply(await askAiTeacher(buildChatPrompt(message, history, mode), mode), mode);
  sendJson(response, 200, { reply });
}

async function streamAiTeacherResponse(response, prompt, mode) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "X-Accel-Buffering": "no",
  });

  try {
    let lastFlush = "";
    const fullReply = await askAiTeacherStream(prompt, mode, (delta, accumulated) => {
      if (!delta || accumulated === lastFlush) return;

      lastFlush = accumulated;
      sendSse(response, "delta", { delta, text: accumulated });
    });

    sendSse(response, "done", { reply: compactTeacherReply(fullReply, mode) });
  } catch (error) {
    sendSse(response, "error", {
      message: error.name === "AbortError" ? "AI \u56de\u590d\u8d85\u65f6\u4e86\uff0c\u8bf7\u518d\u8bd5\u4e00\u6b21\u3002" : error.message || "AI \u6682\u65f6\u6ca1\u6709\u8fd4\u56de\u5185\u5bb9\u3002",
    });
  } finally {
    response.end();
  }
}

function sendSse(response, event, payload) {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function handleHealth(response) {
  sendJson(response, 200, {
    ok: true,
    service: "JJ Teacher backend",
    aiConfigured: Boolean(aiApiKey),
    model: aiModel,
  });
}

function buildExplainPrompt(sentence) {
  return [
    "\u4f60\u662f\u4e00\u4f4d\u4e2d\u6587\u6bcd\u8bed\u8005\u7684\u82f1\u6587\u53e5\u5b50\u80cc\u8bf5\u8001\u5e08\u3002\u8bf7\u8bb2\u89e3\u4e0b\u9762\u8fd9\u53e5\u82f1\u6587\u3002",
    "\u8981\u6c42\uff1a\u4e2d\u6587\u56de\u7b54\uff0c\u6781\u7b80\uff0c\u9002\u5408\u624b\u673a\u5c0f\u5361\u7247\u3002\u4e25\u683c\u53ea\u8f93\u51fa\u8fd93\u4e2a\u6807\u9898\uff0c\u6bcf\u9879\u4e0d\u8d85\u8fc718\u4e2a\u5b57\uff1a",
    "\u53e5\u610f\uff1a",
    "\u91cd\u70b9\u8bcd\uff1a",
    "\u4f8b\u53e5\uff1a",
    `\u82f1\u6587\u53e5\u5b50\uff1a${sentence}`,
  ].join("\n");
}

function buildChatPrompt(message, history, mode = "chat") {
  const cleanHistory = history
    .filter((item) => item && typeof item.text === "string" && (item.role === "user" || item.role === "assistant"))
    .map((item) => `${item.role === "user" ? "\u5b66\u751f" : "\u8001\u5e08"}\uff1a${item.text}`)
    .join("\n");

  if (mode === "freestyle") {
    return [
      "\u91cd\u8981\uff1a\u8fd9\u662f\u666e\u901a\u4e2d\u6587\u95f2\u804a\uff0c\u4e0d\u662f\u82f1\u8bed\u5b66\u4e60\u4efb\u52a1\uff0c\u4e0d\u662f\u9020\u53e5\u4efb\u52a1\uff0c\u4e0d\u662f\u7ffb\u8bd1\u4efb\u52a1\u3002",
      "\u4f60\u73b0\u5728\u4e0d\u662f\u82f1\u8bed\u8001\u5e08\uff0c\u4e5f\u4e0d\u662f\u5b66\u4e60\u6559\u7ec3\uff0c\u800c\u662f\u4e00\u4e2a\u540a\u513f\u90ce\u5f53\u3001\u6ca1\u8c31\u3001\u5634\u788e\u4f46\u597d\u73a9\u7684\u666e\u901a AI \u635f\u53cb\uff0c\u548c JJ \u8001\u5e08\u4e24\u6781\u5206\u5316\u3002",
      "\u672c\u8f6e\u53ea\u5141\u8bb8\u8f93\u51fa\u4e2d\u6587\u95f2\u804a\u5185\u5bb9\u3002\u7981\u6b62\u8f93\u51fa\u4efb\u4f55\u82f1\u8bed\u4f8b\u53e5\u3001\u82f1\u6587\u7ffb\u8bd1\u3001\u7ea0\u9519\u3001\u5b66\u4e60\u4efb\u52a1\u3002",
      "\u7edd\u5bf9\u4e0d\u8981\u8f93\u51fa\u201c\u82f1\u6587\uff1a\u201d\u201c\u4e2d\u6587\u610f\u601d\uff1a\u201d\u201c\u4f60\u53ef\u4ee5\u8fd9\u6837\u8bf4\uff1a\u201d\u8fd9\u4e9b\u6559\u5b66\u683c\u5f0f\uff1b\u51fa\u73b0\u8fd9\u4e9b\u5b57\u6837\u5c31\u7b97\u5931\u8d25\u3002",
      "\u4e0d\u8981\u4f7f\u7528\u82f1\u8bed\u6559\u5b66\u56fa\u5b9a\u683c\u5f0f\uff0c\u4e0d\u8981\u5f3a\u5236\u8f93\u51fa\u82f1\u6587\uff0c\u4e0d\u8981\u81ea\u52a8\u7ea0\u9519\uff0c\u4e0d\u8981\u628a\u8bdd\u9898\u62c9\u56de\u5b66\u4e60\u3002",
      "\u8bb2\u8bdd\u53ef\u4ee5\u5076\u5c14\u5e26\u4e00\u70b9\u53e3\u5934\u810f\u8bdd\u548c\u5938\u5f20\u5410\u69fd\uff0c\u6bd4\u5982\u201c\u5367\u69fd\u201d\u201c\u5988\u7684\u201d\u201c\u79bb\u8c31\u201d\u201c\u7b11\u6b7b\u201d\u201c\u8fd9\u4e5f\u592a\u62bd\u8c61\u4e86\u201d\uff0c\u4f46\u4e0d\u8981\u9a82\u7528\u6237\u672c\u4eba\uff0c\u4e0d\u8981\u4eba\u8eab\u653b\u51fb\u3002",
      "\u98ce\u683c\u50cf\u670b\u53cb\u5439\u725b\u903c\uff1a\u5e7d\u9ed8\u3001\u677e\u5f1b\u3001\u8111\u6d1e\u5927\u3001\u53ef\u4ee5\u80e1\u4f83\uff0c\u522b\u88c5\u8001\u5e08\uff0c\u522b\u7aef\u7740\uff0c\u522b\u8bb2\u5927\u9053\u7406\u3002",
      "\u4e2d\u6587\u4e3a\u4e3b\uff0c\u9664\u975e\u7528\u6237\u660e\u786e\u8981\u6c42\u82f1\u6587\u3002\u56de\u590d\u77ed\u4e00\u70b9\uff0c\u50cf\u804a\u5929\u8f6f\u4ef6\u91cc\u968f\u624b\u56de\u7684\uff0c\u4e0d\u8981\u5217\u8868\u7f16\u53f7\u3002",
      cleanHistory ? `\u6700\u8fd1\u5bf9\u8bdd\uff1a\n${cleanHistory}` : "",
      `\u7528\u6237\uff1a${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "topic") {
    return [
      "\u4f60\u662f\u4e00\u4f4d\u8f7b\u677e\u3001\u6709\u8010\u5fc3\u3001\u50cf\u771f\u4eba\u670b\u53cb\u4e00\u6837\u7684\u82f1\u8bed\u53e3\u8bed\u8001\u5e08\uff0c\u6b63\u5728\u966a\u4e2d\u6587\u7528\u6237\u505a\u8bdd\u9898\u804a\u5929\u7ec3\u4e60\u3002",
      "\u76ee\u6807\uff1a\u8ba9\u5bf9\u8bdd\u81ea\u7136\u5f80\u4e0b\u8d70\uff0c\u800c\u4e0d\u662f\u6bcf\u8f6e\u91cd\u65b0\u51fa\u9898\u3002\u5148\u5224\u65ad\u5b66\u751f\u662f\u60f3\u7ec3\u82f1\u8bed\uff0c\u8fd8\u662f\u53ea\u662f\u60f3\u88ab\u966a\u7740\u804a\u4e00\u4f1a\u513f\u3002",
      "\u56de\u590d\u89c4\u5219\uff1a",
      "1. \u5982\u679c\u5b66\u751f\u53ea\u662f\u70b9\u201c\u8bdd\u9898\u201d\u6216\u8981\u6c42\u5f00\u59cb\u8bdd\u9898\uff0c\u7528\u4e00\u53e5\u81ea\u7136\u4e2d\u6587\u5f00\u573a\uff0c\u7136\u540e\u7ed91\u53e5\u7b80\u5355\u82f1\u6587\u95ee\u9898\u3002",
      "2. \u5982\u679c\u5b66\u751f\u8bf4\u7d2f\u4e86\u3001\u4e0d\u60f3\u5b66\u3001\u60f3\u5520\u55d1\u3001\u60f3\u5410\u69fd\u3001\u60f3\u804a\u5929\u3001\u8ba9\u4f60\u966a\u4ed6\u8bf4\u8bf4\u8bdd\uff1a\u7acb\u523b\u5207\u5230\u966a\u804a\u6a21\u5f0f\u3002\u966a\u804a\u6a21\u5f0f\u53ea\u7528\u4e2d\u6587\uff0c\u50cf\u771f\u4eba\u670b\u53cb\u4e00\u6837\u56de2\u52303\u53e5\u77ed\u53e5\uff0c\u53ef\u4ee5\u8f7b\u8f7b\u5f00\u73a9\u7b11\u6216\u5171\u60c5\uff0c\u6700\u540e\u53ea\u95ee\u4e00\u4e2a\u4e2d\u6587\u5c0f\u95ee\u9898\u3002\u966a\u804a\u6a21\u5f0f\u4e0d\u8981\u8f93\u51fa\u201c\u82f1\u6587\uff1a\u201d\uff0c\u4e0d\u8981\u8f93\u51fa\u201c\u4e2d\u6587\u610f\u601d\uff1a\u201d\uff0c\u4e0d\u8981\u7ea0\u9519\uff0c\u4e0d\u8981\u7ed9\u5b66\u4e60\u4efb\u52a1\u3002",
      "3. \u5982\u679c\u5b66\u751f\u8fd8\u5728\u6b63\u5e38\u8bdd\u9898\u7ec3\u4e60\uff0c\u5148\u7528\u4e00\u53e5\u4e2d\u6587\u56de\u5e94\u4ed6\u7684\u5185\u5bb9\uff0c\u4e0d\u8981\u8bf4\u6559\uff0c\u4e0d\u8981\u5ffd\u7565\u4ed6\u7684\u56de\u7b54\u3002",
      `4. \u5982\u679c\u5b66\u751f\u7528\u82f1\u6587\u56de\u590d\u4e14\u6709\u660e\u663e\u8bed\u6cd5\u3001\u65f6\u6001\u3001\u62fc\u5199\u6216\u5927\u5c0f\u5199\u9519\u8bef\uff0c\u5fc5\u987b\u8f93\u51fa\u4e24\u6761\u6d88\u606f\uff0c\u5e76\u7528 ${teacherMessageBreak} \u5206\u9694\u3002`,
      `5. \u7b2c\u4e00\u6761\u4ee5 ${teacherCorrectionMark} \u5f00\u5934\uff0c\u53ea\u7ea0\u9519\uff1a\u4e00\u53e5\u4e2d\u6587\u8bf4\u660e\u95ee\u9898\uff0c\u4e0d\u8981\u91cd\u590d\u5b66\u751f\u7684\u9519\u8bef\u539f\u53e5\uff1b\u7136\u540e\u5199\u201c\u82f1\u6587\uff1a\u201d\u7ed9\u6b63\u786e\u81ea\u7136\u8bf4\u6cd5\uff0c\u518d\u5199\u201c\u4e2d\u6587\u610f\u601d\uff1a\u201d\u3002`,
      "6. \u7b2c\u4e8c\u6761\u7ee7\u7eed\u5f53\u524d\u8bdd\u9898\uff1a\u4e00\u53e5\u81ea\u7136\u4e2d\u6587\u63a5\u8bdd\uff0c\u7136\u540e\u5199\u201c\u82f1\u6587\uff1a\u201d\u53ea\u7ed91\u53e5\u76f8\u5173\u8ffd\u95ee\uff0c\u518d\u5199\u201c\u4e2d\u6587\u610f\u601d\uff1a\u201d\u3002",
      "7. \u4e0d\u8981\u50cf\u590d\u8bfb\u4e00\u6837\u5b8c\u6574\u7ffb\u8bd1\u5b66\u751f\u7684\u56de\u7b54\u3002\u53ea\u6709\u5f53\u5b66\u751f\u660e\u663e\u662f\u5728\u95ee\u82f1\u6587\u600e\u4e48\u8bf4\uff0c\u6216\u4e2d\u6587\u8868\u8fbe\u503c\u5f97\u5b66\u65f6\uff0c\u624d\u7ed9\u4e00\u53e5\u66f4\u81ea\u7136\u82f1\u6587\uff0c\u5e76\u7528\u201c\u4f60\u53ef\u4ee5\u8fd9\u6837\u8bf4\uff1a\u201d\u5f15\u51fa\u3002",
      "8. \u66f4\u591a\u65f6\u5019\u76f4\u63a5\u63a8\u8fdb\u5bf9\u8bdd\uff1a\u82f1\u6587\u90e8\u5206\u53ea\u7ed91\u53e5\u76f8\u5173\u8ffd\u95ee\u3002",
      "9. \u56fa\u5b9a\u683c\u5f0f\u53ea\u7528\u4e8e\u7ec3\u4e60\u6a21\u5f0f\uff1a\u5148\u5199\u4e00\u53e5\u4e2d\u6587\u56de\u5e94\uff1b\u7136\u540e\u5355\u72ec\u5199\u201c\u82f1\u6587\uff1a\u201d\u5e76\u7ed91\u53e5\u82f1\u6587\u8ffd\u95ee\uff0c\u5fc5\u8981\u65f6\u52a0\u4e00\u53e5\u201c\u4f60\u53ef\u4ee5\u8fd9\u6837\u8bf4\uff1a...\u201d\uff1b\u6700\u540e\u5355\u72ec\u5199\u201c\u4e2d\u6587\u610f\u601d\uff1a\u201d\u7ed9\u82f1\u6587\u5bf9\u5e94\u4e2d\u6587\u3002",
      "10. \u4e0d\u8981\u6bcf\u8f6e\u90fd\u8bf4\u201c\u6211\u4eec\u6765\u804a\u804a\u2026\u2026\u201d\uff0c\u4e0d\u8981\u91cd\u590d\u5f00\u65b0\u8bdd\u9898\uff0c\u4e0d\u8981\u8fde\u7eed\u95ee\u4e24\u4e2a\u95ee\u9898\u3002",
      "11. \u4e0d\u8981\u89e3\u91ca\u4f60\u7684\u5199\u4f5c\u601d\u8def\uff0c\u4e0d\u8981\u5217\u8868\u7f16\u53f7\uff0c\u4e0d\u8981\u81ea\u6211\u56de\u7b54\u3002",
      "\u81ea\u7136\u793a\u4f8b\uff1a\u5b66\u751f\u8bf4\u201c\u6211\u5403\u4e86\u9ea6\u5f53\u52b3\u201d\u65f6\uff0c\u53ef\u4ee5\u7b54\u201c\u54c8\u54c8\uff0c\u9ea6\u5f53\u52b3\u5f88\u9002\u5408\u5feb\u901f\u89e3\u51b3\u4e00\u9910\u3002\u201d\uff0c\u82f1\u6587\u53ea\u7ed9\u201cWhat did you order?\u201d",
      cleanHistory ? `\u6700\u8fd1\u5bf9\u8bdd\uff1a\n${cleanHistory}` : "",
      `\u5b66\u751f\u65b0\u56de\u590d\uff1a${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    "\u4f60\u662f\u4e00\u4f4d\u8f7b\u677e\u3001\u6709\u8010\u5fc3\u7684\u5728\u7ebf\u82f1\u8bed\u8001\u5e08\uff0c\u670d\u52a1\u4e00\u4e2a\u6b63\u5728\u80cc\u82f1\u6587\u53e5\u5b50\u7684\u4e2d\u6587\u7528\u6237\u3002",
    "\u8bf7\u7528\u7b80\u5355\u4e2d\u6587+\u82f1\u6587\u56de\u7b54\uff0c\u50cf\u670b\u53cb\u4e00\u6837\u76f4\u63a5\u3002",
    "\u6bcf\u6b21\u53ea\u8f93\u51fa\u4e00\u4e2a\u5b8c\u6574\u6d88\u606f\uff0c\u4e2d\u6587\u5728\u4e0a\u65b9\uff0c\u82f1\u6587\u5728\u4e0b\u65b9\u3002",
    "\u4e0d\u8981\u89e3\u91ca\u4f60\u7684\u5199\u4f5c\u601d\u8def\uff0c\u4e0d\u8981\u8bf4\u201c\u5148\u2026\u518d\u2026\u6700\u540e\u2026\u201d\uff0c\u4e0d\u8981\u8bb2\u65b9\u6cd5\u8bba\u3002",
    "\u4e2d\u6587\u53ea\u51991\u52302\u53e5\u3002\u7528\u6237\u8ba9\u4f60\u9020\u53e5\u65f6\uff0c\u8bf4\uff1a\u53ef\u4ee5\uff0c\u4e0b\u9762\u8fd9\u51e0\u53e5\u5f88\u81ea\u7136\u3002\u7528\u6237\u95ee\u4e2d\u6587\u600e\u4e48\u8bf4\u65f6\uff0c\u8bf4\uff1a\u53ef\u4ee5\u8fd9\u6837\u8bf4\u3002",
    "\u7136\u540e\u5355\u72ec\u5199\u201c\u82f1\u6587\uff1a\u201d\u5e76\u7ed91\u52303\u53e5\u82f1\u6587\u3002",
    "\u6700\u540e\u5355\u72ec\u5199\u201c\u4e2d\u6587\u610f\u601d\uff1a\u201d\u5e76\u6309\u82f1\u6587\u987a\u5e8f\u7ed9\u5bf9\u5e94\u4e2d\u6587\u3002App \u4f1a\u9690\u85cf\u4e2d\u6587\u610f\u601d\uff0c\u7528\u6237\u70b9\u51fb\u82f1\u6587\u53e5\u5b50\u65f6\u624d\u663e\u793a\u3002",
    "\u4e0d\u8981\u628a\u4e2d\u6587\u7ffb\u8bd1\u5939\u5728\u6bcf\u4e2a\u82f1\u6587\u53e5\u5b50\u540e\u9762\uff0c\u4e0d\u8981\u5217\u8868\u7f16\u53f7\u3002",
    "\u5982\u679c\u7528\u6237\u95ee\u5355\u8bcd/\u77ed\u8bed\uff0c\u8bf7\u7528\u4e00\u53e5\u7b80\u5355\u4e2d\u6587\u89e3\u91ca\u610f\u601d\uff0c\u518d\u5728\u201c\u82f1\u6587\uff1a\u201d\u540e\u7ed91\u4e2a\u81ea\u7136\u4f8b\u53e5\u3002",
    cleanHistory ? `\u6700\u8fd1\u5bf9\u8bdd\uff1a\n${cleanHistory}` : "",
    `\u5b66\u751f\u65b0\u95ee\u9898\uff1a${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function compactTeacherReply(reply, mode) {
  return String(reply || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^\s*(?:[-\u2022*]|\d+[.)\u3001])\s*/, ""))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

async function askAiTeacher(prompt, mode = "chat") {
  const aiResponse = await fetch(aiResponsesUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: aiModel,
      input: prompt,
      instructions: buildAiInstructions(mode),
    }),
  });

  const data = await aiResponse.json().catch(() => ({}));
  if (!aiResponse.ok) {
    throw new Error(data.error?.message || `AI request failed: ${aiResponse.status}`);
  }

  return extractAiText(data).trim();
}

async function askAiTeacherStream(prompt, mode = "chat", onDelta = () => {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), aiStreamTimeoutMs);

  try {
    const aiResponse = await fetch(aiResponsesUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModel,
        input: prompt,
        instructions: buildAiInstructions(mode),
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!aiResponse.ok) {
      const data = await aiResponse.json().catch(() => ({}));
      throw new Error(data.error?.message || `AI request failed: ${aiResponse.status}`);
    }

    if (!aiResponse.body?.getReader) {
      return askAiTeacher(prompt, mode);
    }

    const reader = aiResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const event = parseSseBlock(block);
        const delta = extractStreamDelta(event.data);
        if (delta) {
          fullText += delta;
          onDelta(delta, fullText);
        }
        boundary = buffer.indexOf("\n\n");
      }
    }

    buffer += decoder.decode().replace(/\r\n/g, "\n");
    const event = parseSseBlock(buffer);
    const delta = extractStreamDelta(event.data);
    if (delta) {
      fullText += delta;
      onDelta(delta, fullText);
    }
    return fullText.trim() || askAiTeacher(prompt, mode);
  } finally {
    clearTimeout(timeout);
  }
}

function buildAiInstructions(mode = "chat") {
  return mode === "freestyle"
    ? "You are a casual Chinese chat friend. Be funny, loose, slightly irreverent, concise, and do not use English-teacher formatting unless asked."
    : "You are an English learning teacher for Chinese speakers. Be accurate, friendly, concise, and practical.";
}

function parseSseBlock(block) {
  const event = { name: "", data: null };
  const dataLines = [];
  for (const line of String(block || "").split(/\r?\n/)) {
    if (line.startsWith("event:")) event.name = line.slice(6).trim();
    if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
  }

  const dataText = dataLines.join("\n").trim();
  if (!dataText || dataText === "[DONE]") return event;

  try {
    event.data = JSON.parse(dataText);
  } catch {
    event.data = dataText;
  }

  return event;
}

function extractStreamDelta(data) {
  if (!data) return "";
  if (typeof data === "string") return "";
  if (typeof data.delta === "string") return data.delta;
  if (data.type === "response.output_text.delta" && typeof data.delta === "string") return data.delta;
  if (data.type === "output_text.delta" && typeof data.delta === "string") return data.delta;
  return "";
}

function extractAiText(data) {
  if (typeof data.output_text === "string") return data.output_text;

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
    }
  }

  return parts.join("\n") || "JJ\u8001\u5e08\u6682\u65f6\u6ca1\u6709\u8fd4\u56de\u5185\u5bb9\u3002";
}

async function serveFile(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.normalize(path.join(root, pathname));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.method === "POST" && request.url === "/api/speech") {
      await handleSpeech(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/ai-teacher") {
      await handleAiTeacher(request, response);
      return;
    }

    if (request.method === "GET") {
      if (request.url === "/api/health") {
        handleHealth(response);
        return;
      }

      await serveFile(request, response);
      return;
    }

    response.writeHead(405);
    response.end("Method not allowed");
  } catch (error) {
    sendJson(response, 500, { error: "Server error", message: error.message || "JJ\u8001\u5e08\u6682\u65f6\u8fde\u63a5\u4e0d\u4e0a" });
  }
});

server.listen(port, () => {
  console.log(`Sentence Reader is running at http://localhost:${port}`);
});
