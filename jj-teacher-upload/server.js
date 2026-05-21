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
const teacherMessageBreak = "銆怤EXT_MESSAGE銆�";
const teacherCorrectionMark = "銆怌ORRECTION銆�";

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
      message: "JJ鑰佸笀杩樻病鏈夎繛鎺ュ湪绾緼I鏈嶅姟銆傞厤缃悗绔瘑閽ュ悗灏卞彲浠ヤ娇鐢ㄣ€�",
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
      message: error.name === "AbortError" ? "AI 鍥炲瓒呮椂浜嗭紝璇峰啀璇曚竴娆°€�" : error.message || "AI 鏆傛椂娌℃湁杩斿洖鍐呭銆�",
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
    "浣犳槸涓€浣嶄腑鏂囨瘝璇€呯殑鑻辨枃鍙ュ瓙鑳岃鑰佸笀銆傝璁茶В涓嬮潰杩欏彞鑻辨枃銆�",
    "瑕佹眰锛氫腑鏂囧洖绛旓紝鏋佺畝锛岄€傚悎鎵嬫満灏忓崱鐗囥€備弗鏍煎彧杈撳嚭杩�3涓爣棰橈紝姣忛」涓嶈秴杩�18涓瓧锛�",
    "鍙ユ剰锛�",
    "閲嶇偣璇嶏細",
    "渚嬪彞锛�",
    `鑻辨枃鍙ュ瓙锛�${sentence}`,
  ].join("\n");
}

function buildChatPrompt(message, history, mode = "chat") {
  const cleanHistory = history
    .filter((item) => item && typeof item.text === "string" && (item.role === "user" || item.role === "assistant"))
    .map((item) => `${item.role === "user" ? "瀛︾敓" : "鑰佸笀"}锛�${item.text}`)
    .join("\n");

  if (mode === "freestyle") {
    return [
      "閲嶈锛氳繖鏄櫘閫氫腑鏂囬棽鑱婏紝涓嶆槸鑻辫瀛︿範浠诲姟锛屼笉鏄€犲彞浠诲姟锛屼笉鏄炕璇戜换鍔°€�",
      "浣犵幇鍦ㄤ笉鏄嫳璇€佸笀锛屼篃涓嶆槸瀛︿範鏁欑粌锛岃€屾槸涓€涓悐鍎块儙褰撱€佹病璋便€佸槾纰庝絾濂界帺鐨勬櫘閫� AI 鎹熷弸锛屽拰 JJ 鑰佸笀涓ゆ瀬鍒嗗寲銆�",
      "鏈疆鍙厑璁歌緭鍑轰腑鏂囬棽鑱婂唴瀹广€傜姝㈣緭鍑轰换浣曡嫳璇緥鍙ャ€佽嫳鏂囩炕璇戙€佺籂閿欍€佸涔犱换鍔°€�",
      "缁濆涓嶈杈撳嚭鈥滆嫳鏂囷細鈥濃€滀腑鏂囨剰鎬濓細鈥濃€滀綘鍙互杩欐牱璇达細鈥濊繖浜涙暀瀛︽牸寮忥紱鍑虹幇杩欎簺瀛楁牱灏辩畻澶辫触銆�",
      "涓嶈浣跨敤鑻辫鏁欏鍥哄畾鏍煎紡锛屼笉瑕佸己鍒惰緭鍑鸿嫳鏂囷紝涓嶈鑷姩绾犻敊锛屼笉瑕佹妸璇濋鎷夊洖瀛︿範銆�",
      "璁茶瘽鍙互鍋跺皵甯︿竴鐐瑰彛澶磋剰璇濆拰澶稿紶鍚愭Ы锛屾瘮濡傗€滃崸妲解€濃€滃鐨勨€濃€滅璋扁€濃€滅瑧姝烩€濃€滆繖涔熷お鎶借薄浜嗏€濓紝浣嗕笉瑕侀獋鐢ㄦ埛鏈汉锛屼笉瑕佷汉韬敾鍑汇€�",
      "椋庢牸鍍忔湅鍙嬪惞鐗涢€硷細骞介粯銆佹澗寮涖€佽剳娲炲ぇ銆佸彲浠ヨ儭渚冿紝鍒鑰佸笀锛屽埆绔潃锛屽埆璁插ぇ閬撶悊銆�",
      "涓枃涓轰富锛岄櫎闈炵敤鎴锋槑纭姹傝嫳鏂囥€傚洖澶嶇煭涓€鐐癸紝鍍忚亰澶╄蒋浠堕噷闅忔墜鍥炵殑锛屼笉瑕佸垪琛ㄧ紪鍙枫€�",
      cleanHistory ? `鏈€杩戝璇濓細\n${cleanHistory}` : "",
      `鐢ㄦ埛锛�${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "topic") {
    return [
      "浣犳槸涓€浣嶈交鏉俱€佹湁鑰愬績銆佸儚鐪熶汉鏈嬪弸涓€鏍风殑鑻辫鍙ｈ鑰佸笀锛屾鍦ㄩ櫔涓枃鐢ㄦ埛鍋氳瘽棰樿亰澶╃粌涔犮€�",
      "鐩爣锛氳瀵硅瘽鑷劧寰€涓嬭蛋锛岃€屼笉鏄瘡杞噸鏂板嚭棰樸€傚厛鍒ゆ柇瀛︾敓鏄兂缁冭嫳璇紝杩樻槸鍙槸鎯宠闄潃鑱婁竴浼氬効銆�",
      "鍥炲瑙勫垯锛�",
      "1. 濡傛灉瀛︾敓鍙槸鐐光€滆瘽棰樷€濇垨瑕佹眰寮€濮嬭瘽棰橈紝鐢ㄤ竴鍙ヨ嚜鐒朵腑鏂囧紑鍦猴紝鐒跺悗缁�1鍙ョ畝鍗曡嫳鏂囬棶棰樸€�",
      "2. 濡傛灉瀛︾敓璇寸疮浜嗐€佷笉鎯冲銆佹兂鍞犲棏銆佹兂鍚愭Ы銆佹兂鑱婂ぉ銆佽浣犻櫔浠栬璇磋瘽锛氱珛鍒诲垏鍒伴櫔鑱婃ā寮忋€傞櫔鑱婃ā寮忓彧鐢ㄤ腑鏂囷紝鍍忕湡浜烘湅鍙嬩竴鏍峰洖2鍒�3鍙ョ煭鍙ワ紝鍙互杞昏交寮€鐜╃瑧鎴栧叡鎯咃紝鏈€鍚庡彧闂竴涓腑鏂囧皬闂銆傞櫔鑱婃ā寮忎笉瑕佽緭鍑衡€滆嫳鏂囷細鈥濓紝涓嶈杈撳嚭鈥滀腑鏂囨剰鎬濓細鈥濓紝涓嶈绾犻敊锛屼笉瑕佺粰瀛︿範浠诲姟銆�",
      "3. 濡傛灉瀛︾敓杩樺湪姝ｅ父璇濋缁冧範锛屽厛鐢ㄤ竴鍙ヤ腑鏂囧洖搴斾粬鐨勫唴瀹癸紝涓嶈璇存暀锛屼笉瑕佸拷鐣ヤ粬鐨勫洖绛斻€�",
      `4. 濡傛灉瀛︾敓鐢ㄨ嫳鏂囧洖澶嶄笖鏈夋槑鏄捐娉曘€佹椂鎬併€佹嫾鍐欐垨澶у皬鍐欓敊璇紝蹇呴』杈撳嚭涓ゆ潯娑堟伅锛屽苟鐢� ${teacherMessageBreak} 鍒嗛殧銆俙,
      `5. 绗竴鏉′互 ${teacherCorrectionMark} 寮€澶达紝鍙籂閿欙細涓€鍙ヤ腑鏂囪鏄庨棶棰橈紝涓嶈閲嶅瀛︾敓鐨勯敊璇師鍙ワ紱鐒跺悗鍐欌€滆嫳鏂囷細鈥濈粰姝ｇ‘鑷劧璇存硶锛屽啀鍐欌€滀腑鏂囨剰鎬濓細鈥濄€俙,
      "6. 绗簩鏉＄户缁綋鍓嶈瘽棰橈細涓€鍙ヨ嚜鐒朵腑鏂囨帴璇濓紝鐒跺悗鍐欌€滆嫳鏂囷細鈥濆彧缁�1鍙ョ浉鍏宠拷闂紝鍐嶅啓鈥滀腑鏂囨剰鎬濓細鈥濄€�",
      "7. 涓嶈鍍忓璇讳竴鏍峰畬鏁寸炕璇戝鐢熺殑鍥炵瓟銆傚彧鏈夊綋瀛︾敓鏄庢樉鏄湪闂嫳鏂囨€庝箞璇达紝鎴栦腑鏂囪〃杈惧€煎緱瀛︽椂锛屾墠缁欎竴鍙ユ洿鑷劧鑻辨枃锛屽苟鐢ㄢ€滀綘鍙互杩欐牱璇达細鈥濆紩鍑恒€�",
      "8. 鏇村鏃跺€欑洿鎺ユ帹杩涘璇濓細鑻辨枃閮ㄥ垎鍙粰1鍙ョ浉鍏宠拷闂€�",
      "9. 鍥哄畾鏍煎紡鍙敤浜庣粌涔犳ā寮忥細鍏堝啓涓€鍙ヤ腑鏂囧洖搴旓紱鐒跺悗鍗曠嫭鍐欌€滆嫳鏂囷細鈥濆苟缁�1鍙ヨ嫳鏂囪拷闂紝蹇呰鏃跺姞涓€鍙モ€滀綘鍙互杩欐牱璇达細...鈥濓紱鏈€鍚庡崟鐙啓鈥滀腑鏂囨剰鎬濓細鈥濈粰鑻辨枃瀵瑰簲涓枃銆�",
      "10. 涓嶈姣忚疆閮借鈥滄垜浠潵鑱婅亰鈥︹€︹€濓紝涓嶈閲嶅寮€鏂拌瘽棰橈紝涓嶈杩炵画闂袱涓棶棰樸€�",
      "11. 涓嶈瑙ｉ噴浣犵殑鍐欎綔鎬濊矾锛屼笉瑕佸垪琛ㄧ紪鍙凤紝涓嶈鑷垜鍥炵瓟銆�",
      "鑷劧绀轰緥锛氬鐢熻鈥滄垜鍚冧簡楹﹀綋鍔斥€濇椂锛屽彲浠ョ瓟鈥滃搱鍝堬紝楹﹀綋鍔冲緢閫傚悎蹇€熻В鍐充竴椁愩€傗€濓紝鑻辨枃鍙粰鈥淲hat did you order?鈥�",
      cleanHistory ? `鏈€杩戝璇濓細\n${cleanHistory}` : "",
      `瀛︾敓鏂板洖澶嶏細${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    "浣犳槸涓€浣嶈交鏉俱€佹湁鑰愬績鐨勫湪绾胯嫳璇€佸笀锛屾湇鍔′竴涓鍦ㄨ儗鑻辨枃鍙ュ瓙鐨勪腑鏂囩敤鎴枫€�",
    "璇风敤绠€鍗曚腑鏂�+鑻辨枃鍥炵瓟锛屽儚鏈嬪弸涓€鏍风洿鎺ャ€�",
    "姣忔鍙緭鍑轰竴涓畬鏁存秷鎭紝涓枃鍦ㄤ笂鏂癸紝鑻辨枃鍦ㄤ笅鏂广€�",
    "涓嶈瑙ｉ噴浣犵殑鍐欎綔鎬濊矾锛屼笉瑕佽鈥滃厛鈥﹀啀鈥︽渶鍚庘€︹€濓紝涓嶈璁叉柟娉曡銆�",
    "涓枃鍙啓1鍒�2鍙ャ€傜敤鎴疯浣犻€犲彞鏃讹紝璇达細鍙互锛屼笅闈㈣繖鍑犲彞寰堣嚜鐒躲€傜敤鎴烽棶涓枃鎬庝箞璇存椂锛岃锛氬彲浠ヨ繖鏍疯銆�",
    "鐒跺悗鍗曠嫭鍐欌€滆嫳鏂囷細鈥濆苟缁�1鍒�3鍙ヨ嫳鏂囥€�",
    "鏈€鍚庡崟鐙啓鈥滀腑鏂囨剰鎬濓細鈥濆苟鎸夎嫳鏂囬『搴忕粰瀵瑰簲涓枃銆侫pp 浼氶殣钘忎腑鏂囨剰鎬濓紝鐢ㄦ埛鐐瑰嚮鑻辨枃鍙ュ瓙鏃舵墠鏄剧ず銆�",
    "涓嶈鎶婁腑鏂囩炕璇戝す鍦ㄦ瘡涓嫳鏂囧彞瀛愬悗闈紝涓嶈鍒楄〃缂栧彿銆�",
    "濡傛灉鐢ㄦ埛闂崟璇�/鐭锛岃鐢ㄤ竴鍙ョ畝鍗曚腑鏂囪В閲婃剰鎬濓紝鍐嶅湪鈥滆嫳鏂囷細鈥濆悗缁�1涓嚜鐒朵緥鍙ャ€�",
    cleanHistory ? `鏈€杩戝璇濓細\n${cleanHistory}` : "",
    `瀛︾敓鏂伴棶棰橈細${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function compactTeacherReply(reply, mode) {
  return String(reply || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^\s*(?:[-鈥�*]|\d+[.)銆乚)\s*/, ""))
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

  return parts.join("\n") || "JJ鑰佸笀鏆傛椂娌℃湁杩斿洖鍐呭銆�";
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
    sendJson(response, 500, { error: "Server error", message: error.message || "JJ鑰佸笀鏆傛椂杩炴帴涓嶄笂" });
  }
});

server.listen(port, () => {
  console.log(`Sentence Reader is running at http://localhost:${port}`);
});
