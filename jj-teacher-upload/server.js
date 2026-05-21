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
      message: "JJ老师还没有连接在线AI服务。配置后端密钥后就可以使用。",
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

    const reply = await askAiTeacher(buildExplainPrompt(sentence));
    sendJson(response, 200, { reply });
    return;
  }

  const message = String(payload.message || "").trim();
  if (!message) {
    sendJson(response, 400, { error: "Message is required" });
    return;
  }

  const history = Array.isArray(payload.messages) ? payload.messages.slice(-10) : [];
  const reply = compactTeacherReply(await askAiTeacher(buildChatPrompt(message, history, mode)), mode);
  sendJson(response, 200, { reply });
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
    "你是一位中文母语者的英文句子背诵老师。请讲解下面这句英文。",
    "要求：中文回答，极简，适合手机小卡片。严格只输出这3个标题，每项不超过18个字：",
    "句意：",
    "重点词：",
    "例句：",
    `英文句子：${sentence}`,
  ].join("\n");
}

function buildChatPrompt(message, history, mode = "chat") {
  const cleanHistory = history
    .filter((item) => item && typeof item.text === "string" && (item.role === "user" || item.role === "assistant"))
    .map((item) => `${item.role === "user" ? "学生" : "老师"}：${item.text}`)
    .join("\n");

  if (mode === "topic") {
    return [
      "你是一位轻松、有耐心的在线英语口语老师，正在陪中文用户做话题聊天练习。",
      "目标：像朋友一样开启一个简单话题，让用户立刻知道要聊什么并回答一句英文问题。",
      "回复规则：",
      "1. 每次只输出一个完整消息，语言简单直白。",
      "2. 如果学生点的是“话题”或要求开始话题，只输出一句中文开场，例如：我们来聊聊今天的早餐吧。",
      "3. 然后单独写“英文：”并只给1句英文问题，例如：What did you have for breakfast today?",
      "4. 最后单独写“中文意思：”并给这句英文问题的中文。",
      "5. 不要自我回答，不要描述你自己的经历，不要第二个问题，不要给例句。",
      "6. 不要解释你的写作思路，不要说“先…再…最后…”，不要列表编号。",
      cleanHistory ? `最近对话：\n${cleanHistory}` : "",
      `学生新回复：${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    "你是一位轻松、有耐心的在线英语老师，服务一个正在背英文句子的中文用户。",
    "请用简单中文+英文回答，像朋友一样直接。",
    "每次只输出一个完整消息，中文在上方，英文在下方。",
    "不要解释你的写作思路，不要说“先…再…最后…”，不要讲方法论。",
    "中文只写1到2句。用户让你造句时，说：可以，下面这几句很自然。用户问中文怎么说时，说：可以这样说。",
    "然后单独写“英文：”并给1到3句英文。",
    "最后单独写“中文意思：”并按英文顺序给对应中文。App 会隐藏中文意思，用户点击英文句子时才显示。",
    "不要把中文翻译夹在每个英文句子后面，不要列表编号。",
    "如果用户问单词/短语，请用一句简单中文解释意思，再在“英文：”后给1个自然例句。",
    cleanHistory ? `最近对话：\n${cleanHistory}` : "",
    `学生新问题：${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function compactTeacherReply(reply, mode) {
  return String(reply || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)、])\s*/, ""))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

async function askAiTeacher(prompt) {
  const aiResponse = await fetch(aiResponsesUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: aiModel,
      input: prompt,
      instructions:
        "You are an English learning teacher for Chinese speakers. Be accurate, friendly, concise, and practical.",
    }),
  });

  const data = await aiResponse.json().catch(() => ({}));
  if (!aiResponse.ok) {
    throw new Error(data.error?.message || `AI request failed: ${aiResponse.status}`);
  }

  return extractAiText(data).trim();
}

function extractAiText(data) {
  if (typeof data.output_text === "string") return data.output_text;

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
    }
  }

  return parts.join("\n") || "JJ老师暂时没有返回内容。";
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
    sendJson(response, 500, { error: "Server error", message: error.message || "JJ老师暂时连接不上" });
  }
});

server.listen(port, () => {
  console.log(`Sentence Reader is running at http://localhost:${port}`);
});
