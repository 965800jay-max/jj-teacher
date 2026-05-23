const http = require("http");
const crypto = require("crypto");
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
const labelEnglish = "\u82f1\u6587\uff1a";
const labelMeaning = "\u4e2d\u6587\u610f\u601d\uff1a";
const labelYouCanSay = "\u4f60\u53ef\u4ee5\u8fd9\u6837\u8bf4\uff1a";
const labelSentenceMeaning = "\u53e5\u610f\uff1a";
const labelKeyWords = "\u91cd\u70b9\u8bcd\uff1a";
const labelExample = "\u4f8b\u53e5\uff1a";
const targetLanguages = {
  english: { label: "English", speech: "en-US" },
  spanish: { label: "Spanish", speech: "es-ES" },
  japanese: { label: "Japanese", speech: "ja-JP" },
  korean: { label: "Korean", speech: "ko-KR" },
};
const dataDir = process.env.DATA_DIR || path.join(root, "data");
const userStoreFile = path.join(dataDir, "users.json");
const authTokenTtlMs = 1000 * 60 * 60 * 24 * 30;
const maxUserDataBytes = 1000 * 1000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
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

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function loadUserStore() {
  try {
    const raw = await fs.readFile(userStoreFile, "utf8");
    const store = JSON.parse(raw);
    return {
      users: store && typeof store.users === "object" ? store.users : {},
      sessions: store && typeof store.sessions === "object" ? store.sessions : {},
    };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { users: {}, sessions: {} };
  }
}

async function saveUserStore(store) {
  await fs.mkdir(dataDir, { recursive: true });
  const tempFile = `${userStoreFile}.${process.pid}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(store, null, 2));
  await fs.rename(tempFile, userStoreFile);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function findUserByEmail(store, email) {
  return Object.values(store.users).find((user) => user.email === email) || null;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 32, "sha256").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  if (!user?.passwordSalt || !user?.passwordHash) return false;
  const { hash } = hashPassword(password, user.passwordSalt);
  const expected = Buffer.from(user.passwordHash, "hex");
  const actual = Buffer.from(hash, "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function createSession(store, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  store.sessions[token] = {
    userId,
    createdAt: now,
    expiresAt: now + authTokenTtlMs,
  };
  return token;
}

function getBearerToken(request) {
  const auth = String(request.headers.authorization || "");
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

async function requireUser(request) {
  const token = getBearerToken(request);
  if (!token) throw httpError(401, "Please log in first.");

  const store = await loadUserStore();
  const session = store.sessions[token];
  if (!session) throw httpError(401, "Your login has expired. Please log in again.");

  if (session.expiresAt < Date.now()) {
    delete store.sessions[token];
    await saveUserStore(store);
    throw httpError(401, "Your login has expired. Please log in again.");
  }

  const user = store.users[session.userId];
  if (!user) {
    delete store.sessions[token];
    await saveUserStore(store);
    throw httpError(401, "Account not found. Please log in again.");
  }

  session.expiresAt = Date.now() + authTokenTtlMs;
  return { store, user, token };
}

function publicUser(user) {
  const settings = sanitizeSettings(user.data?.settings || {
    learningLanguage: user.data?.learningLanguage,
    avatar: user.data?.avatar,
  });
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: settings.avatar,
    learningLanguage: settings.learningLanguage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function limitText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeTargetLanguage(code) {
  return targetLanguages[code] ? code : "english";
}

function getTargetLanguageInfo(code) {
  return targetLanguages[normalizeTargetLanguage(code)] || targetLanguages.english;
}

function normalizeSpeechLanguage(code) {
  const value = String(code || "").trim();
  const shortCodes = {
    "en-US": "en",
    "es-ES": "es",
    "ja-JP": "ja",
    "ko-KR": "ko",
  };
  return shortCodes[value] || value;
}

function sanitizeSettings(settings) {
  const source = settings && typeof settings === "object" ? settings : {};
  const avatar = limitText(source.avatar, 16000);
  return {
    learningLanguage: normalizeTargetLanguage(source.learningLanguage),
    avatar: avatar.startsWith("data:image/") ? avatar : "",
  };
}

function sanitizeSentence(item) {
  if (!item || typeof item !== "object") return null;
  const text = limitText(item.text, 240);
  if (!text) return null;

  return {
    text,
    note: limitText(item.note, 500),
    learned: Boolean(item.learned),
    learnedAt: typeof item.learnedAt === "number" ? item.learnedAt : null,
    aiExplanation: limitText(item.aiExplanation, 1200),
  };
}

function sanitizeTeacherMessage(item) {
  if (!item || typeof item !== "object") return null;
  if (item.role !== "user" && item.role !== "assistant") return null;

  const text = limitText(item.text, 2000);
  if (!text) return null;

  const clean = { role: item.role, text };
  if (item.mode === "freestyle") clean.mode = "freestyle";

  if (item.translation && typeof item.translation === "object") {
    const sentence = limitText(item.translation.sentence, 240);
    if (sentence) {
      clean.translation = {
        sentence,
        note: limitText(item.translation.note, 500),
      };
    }
  }

  return clean;
}

function sanitizeLanguageData(data) {
  const source = data && typeof data === "object" ? data : {};
  return {
    savedAt: typeof source.savedAt === "number" ? source.savedAt : Date.now(),
    sentences: Array.isArray(source.sentences)
      ? source.sentences.map(sanitizeSentence).filter(Boolean).slice(0, 1000)
      : [],
    teacherMessages: Array.isArray(source.teacherMessages)
      ? source.teacherMessages.map(sanitizeTeacherMessage).filter(Boolean).slice(-80)
      : [],
  };
}

function sanitizeLanguages(languages) {
  const source = languages && typeof languages === "object" ? languages : {};
  return Object.keys(targetLanguages).reduce((all, code) => {
    all[code] = sanitizeLanguageData(source[code]);
    return all;
  }, {});
}

function sanitizeUserData(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  const settings = sanitizeSettings(source.settings || {
    learningLanguage: source.learningLanguage,
    avatar: source.avatar,
  });
  const languages = sanitizeLanguages(source.languages);
  const currentLanguage = normalizeTargetLanguage(settings.learningLanguage || source.learningLanguage);
  if (!languages[currentLanguage].sentences.length && Array.isArray(source.sentences)) {
    languages[currentLanguage].sentences = source.sentences.map(sanitizeSentence).filter(Boolean).slice(0, 1000);
  }
  if (!languages[currentLanguage].teacherMessages.length && Array.isArray(source.teacherMessages)) {
    languages[currentLanguage].teacherMessages = source.teacherMessages.map(sanitizeTeacherMessage).filter(Boolean).slice(-80);
  }

  return {
    appVersion: limitText(source.appVersion, 40),
    savedAt: Date.now(),
    settings,
    learningLanguage: currentLanguage,
    languages,
    sentences: languages[currentLanguage].sentences,
    teacherMessages: languages[currentLanguage].teacherMessages,
  };
}

async function readJsonBody(request, maxLength = 30000) {
  try {
    return JSON.parse(await collectBody(request, maxLength));
  } catch {
    throw httpError(400, "Invalid request body.");
  }
}

async function handleAuthRegister(request, response) {
  const payload = await readJsonBody(request);
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const name = limitText(payload.name, 40);

  if (!name) throw httpError(400, "Please enter a display name.");
  if (!validateEmail(email)) throw httpError(400, "Invalid email address.");
  if (password.length < 6) throw httpError(400, "Password must be at least 6 characters.");

  const store = await loadUserStore();
  if (findUserByEmail(store, email)) throw httpError(409, "This email is already registered.");

  const now = Date.now();
  const { salt, hash } = hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordSalt: salt,
    passwordHash: hash,
    createdAt: now,
    updatedAt: now,
    data: sanitizeUserData({}),
  };

  store.users[user.id] = user;
  const token = createSession(store, user.id);
  await saveUserStore(store);
  sendJson(response, 200, { token, user: publicUser(user) });
}

async function handleAuthLogin(request, response) {
  const payload = await readJsonBody(request);
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");

  const store = await loadUserStore();
  const user = findUserByEmail(store, email);
  if (!user || !verifyPassword(password, user)) throw httpError(401, "Incorrect email or password.");

  const token = createSession(store, user.id);
  await saveUserStore(store);
  sendJson(response, 200, { token, user: publicUser(user) });
}

async function handleAuthLogout(request, response) {
  const token = getBearerToken(request);
  if (token) {
    const store = await loadUserStore();
    delete store.sessions[token];
    await saveUserStore(store);
  }
  sendJson(response, 200, { ok: true });
}

async function handleAuthMe(request, response) {
  const { store, user } = await requireUser(request);
  await saveUserStore(store);
  sendJson(response, 200, { user: publicUser(user) });
}

async function handleGetUserData(request, response) {
  const { store, user } = await requireUser(request);
  await saveUserStore(store);
  sendJson(response, 200, { user: publicUser(user), data: sanitizeUserData(user.data || {}) });
}

async function handleSaveUserData(request, response) {
  const payload = await readJsonBody(request, maxUserDataBytes);
  const { store, user } = await requireUser(request);
  user.data = sanitizeUserData(payload.data || payload);
  user.updatedAt = Date.now();
  await saveUserStore(store);
  sendJson(response, 200, { ok: true, user: publicUser(user), data: user.data });
}

async function handleAuthProfile(request, response) {
  const payload = await readJsonBody(request);
  const { store, user } = await requireUser(request);
  const name = limitText(payload.name || user.name, 40);
  if (!name) throw httpError(400, "Please enter a display name.");

  const currentSettings = sanitizeSettings(user.data?.settings || {
    learningLanguage: user.data?.learningLanguage,
    avatar: user.data?.avatar,
  });
  const avatar = limitText(payload.avatar, 16000);
  const learningLanguage = normalizeTargetLanguage(payload.learningLanguage || currentSettings.learningLanguage);
  user.name = name;
  user.data = sanitizeUserData({
    ...(user.data || {}),
    settings: {
      ...currentSettings,
      learningLanguage,
      avatar: avatar.startsWith("data:image/") ? avatar : currentSettings.avatar,
    },
  });
  user.updatedAt = Date.now();
  await saveUserStore(store);
  sendJson(response, 200, { ok: true, user: publicUser(user), data: user.data });
}

async function handleListUsers(request, response) {
  const { store } = await requireUser(request);
  await saveUserStore(store);
  const users = Object.values(store.users)
    .map(publicUser)
    .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "zh-Hans-CN"));
  sendJson(response, 200, { users });
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
  const voiceLanguage = normalizeSpeechLanguage(limitText(payload.voiceLanguage, 12) || getTargetLanguageInfo(payload.language).speech);

  if (!text) {
    sendJson(response, 400, { error: "Text is required" });
    return;
  }

  if (text.length > 200) {
    sendJson(response, 400, { error: "Text is too long" });
    return;
  }

  const cacheKey = `online-tts\n${voiceLanguage}\n${mode}\n${text}`;
  if (speechCache.has(cacheKey)) {
    response.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=3600",
      "X-Voice-Source": "online",
    });
    response.end(speechCache.get(cacheKey));
    return;
  }

  const audio = await fetchOnlineSpeech(text, voiceLanguage);
  speechCache.set(cacheKey, audio);
  response.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Cache-Control": "private, max-age=3600",
    "X-Voice-Source": "online",
  });
  response.end(audio);
}

async function fetchOnlineSpeech(text, voiceLanguage = "en-US") {
  const params = new URLSearchParams({
    ie: "UTF-8",
    client: "tw-ob",
    tl: voiceLanguage,
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
      message: "The AI teacher backend is not configured yet. Add the API key on the server to enable it.",
    });
    return;
  }

  const mode = String(payload.mode || "chat");
  const targetLanguage = normalizeTargetLanguage(payload.targetLanguage);
  if (mode === "convert-language") {
    const sourceLanguage = normalizeTargetLanguage(payload.sourceLanguage);
    const reply = await askAiTeacher(buildConvertLanguagePrompt(payload, sourceLanguage, targetLanguage), mode, targetLanguage);
    sendJson(response, 200, { reply });
    return;
  }

  if (mode === "explain") {
    const sentence = String(payload.sentence || "").trim();
    if (!sentence) {
      sendJson(response, 400, { error: "Sentence is required" });
      return;
    }

    const reply = await askAiTeacher(buildExplainPrompt(sentence, targetLanguage), mode, targetLanguage);
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
    await streamAiTeacherResponse(response, buildChatPrompt(message, history, mode, targetLanguage), mode, targetLanguage);
    return;
  }

  const reply = compactTeacherReply(await askAiTeacher(buildChatPrompt(message, history, mode, targetLanguage), mode, targetLanguage), mode);
  sendJson(response, 200, { reply });
}

async function streamAiTeacherResponse(response, prompt, mode, targetLanguage = "english") {
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
    const fullReply = await askAiTeacherStream(prompt, mode, targetLanguage, (delta, accumulated) => {
      if (!delta || accumulated === lastFlush) return;

      lastFlush = accumulated;
      sendSse(response, "delta", { delta, text: accumulated });
    });

    sendSse(response, "done", { reply: compactTeacherReply(fullReply, mode) });
  } catch (error) {
    sendSse(response, "error", {
      message: error.name === "AbortError" ? "The AI response timed out. Please try again." : error.message || "The AI did not return content.",
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

function buildExplainPrompt(sentence, targetLanguage = "english") {
  const language = getTargetLanguageInfo(targetLanguage);
  return [
    `You are a ${language.label} memorization teacher for native Chinese speakers.`,
    "Reply in Simplified Chinese. Keep it extremely short for a mobile card.",
    "Output exactly these three headings, with each section under 18 Chinese characters:",
    labelSentenceMeaning,
    labelKeyWords,
    labelExample,
    `${language.label} sentence: ${sentence}`,
  ].join("\n");
}

function buildConvertLanguagePrompt(payload, sourceLanguage = "english", targetLanguage = "english") {
  const source = getTargetLanguageInfo(sourceLanguage);
  const target = getTargetLanguageInfo(targetLanguage);
  const sentences = Array.isArray(payload.sentences) ? payload.sentences.slice(0, 120) : [];
  const teacherMessages = Array.isArray(payload.teacherMessages) ? payload.teacherMessages.slice(-50) : [];
  return [
    `You are converting one language-learning app user's saved data from ${source.label} study to ${target.label} study.`,
    "Convert saved sentences and teacher chat history into the target study language without losing progress.",
    "Rules:",
    `1. In saved sentences, every text field must become a natural ${target.label} sentence.`,
    "2. Keep note and explanation fields in Simplified Chinese.",
    `3. In teacherMessages, leave casual Chinese chat in Simplified Chinese, but convert any old study-language sentences, questions, examples, or translations into ${target.label}.`,
    `4. If a message contains the app label ${labelEnglish}, keep that exact label, but the content after it must be ${target.label}.`,
    `5. If a message contains ${labelMeaning}, keep the meaning after it in Simplified Chinese.`,
    "6. Do not add unrelated content, do not delete user messages, and do not change role values.",
    "7. Return JSON only. No Markdown, no explanation.",
    "The JSON shape must be:",
    '{"sentences":[{"text":"","note":"","learned":false,"learnedAt":null,"aiExplanation":""}],"teacherMessages":[{"role":"assistant","text":""}]}',
    `Old data: ${JSON.stringify({ sentences, teacherMessages })}`,
  ].join("\n");
}

function buildChatPrompt(message, history, mode = "chat", targetLanguage = "english") {
  const language = getTargetLanguageInfo(targetLanguage);
  const cleanHistory = history
    .filter((item) => item && typeof item.text === "string" && (item.role === "user" || item.role === "assistant"))
    .map((item) => `${item.role === "user" ? "Student" : "Teacher"}: ${item.text}`)
    .join("\n");

  if (mode === "freestyle") {
    return [
      `Important: this is casual Chinese chat, not a ${language.label} lesson, sentence-making task, translation task, or grammar correction task.`,
      `You are not acting as a ${language.label} teacher now. You are a natural, warm, normal Chinese chat AI.`,
      `Only output casual Simplified Chinese unless the user clearly asks for ${language.label}.`,
      `Do not use teaching labels such as ${labelEnglish}, ${labelMeaning}, or ${labelYouCanSay}.`,
      "Do not force English, do not auto-correct, and do not pull the conversation back to studying.",
      "Reply like a friend. Be relaxed, but do not over-act, do not use profanity, and do not perform exaggerated comedy.",
      "Keep the reply short, usually 2 to 4 sentences. Do not use numbered lists.",
      cleanHistory ? `Recent conversation:\n${cleanHistory}` : "",
      `User: ${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "topic") {
    return [
      `You are a relaxed and patient spoken-${language.label} teacher for a Chinese user. You should feel like a real friendly person, not a rigid machine.`,
      "Goal: keep the conversation moving naturally. Do not restart a new exercise every turn.",
      `First decide whether the student wants to practice ${language.label} or just wants a little casual company.`,
      "Rules:",
      `1. If the student only starts a topic, open with one natural Simplified Chinese sentence, then give exactly one simple ${language.label} question.`,
      `2. Use the exact label ${labelEnglish} before ${language.label} questions, and ${labelMeaning} before the Chinese meaning. The label is only for app parsing; the content after it must be ${language.label}.`,
      "3. If the student says they are tired, do not want to study, want to chat, vent, or be accompanied, switch to casual companion mode. In that mode, only use Simplified Chinese, reply in 2 to 3 short sentences, and ask one natural Chinese follow-up. Do not correct or give study tasks.",
      "4. If the student is still practicing, first respond naturally in Simplified Chinese to what they just said. Do not ignore the content.",
      `5. If the student replies in ${language.label} with clear grammar, tense, spelling, or expression mistakes, output two messages separated by ${teacherMessageBreak}.`,
      `6. The first message must start with ${teacherCorrectionMark}. It only corrects the mistake: one Chinese sentence explaining the issue, then ${labelEnglish} with the correct natural ${language.label} sentence, then ${labelMeaning}.`,
      `7. The second message continues the topic: one natural Chinese response, then ${labelEnglish} with exactly one related follow-up question, then ${labelMeaning}.`,
      `8. Do not repeat the student's answer like a translation machine. Only use ${labelYouCanSay} when the user clearly asks how to say something in ${language.label} or when a Chinese expression is worth learning.`,
      `9. Most of the time, continue the conversation directly. The ${language.label} part should be only one related follow-up question.`,
      `10. In practice mode, the format is: one Chinese response, then ${labelEnglish} one ${language.label} follow-up, optionally ${labelYouCanSay} one natural expression, then ${labelMeaning} the matching Chinese meaning.`,
      "11. Do not explain your thinking, do not use numbered lists in the final answer, and do not answer your own question.",
      "Natural example: if the student says they had McDonald's, respond in Chinese like a real person and only ask: What did you order?",
      cleanHistory ? `Recent conversation:\n${cleanHistory}` : "",
      `Student new message: ${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    `You are a relaxed and patient online ${language.label} teacher for a Chinese user memorizing ${language.label} sentences.`,
    `Reply with simple Simplified Chinese plus ${language.label}. Be direct and friendly.`,
    `Output one complete message. Put Chinese first and ${language.label} below it.`,
    "Do not explain your reasoning or methodology.",
    "Use only 1 to 2 Chinese sentences before the English part.",
    `Then write ${labelEnglish} and give 1 to 3 ${language.label} sentences. The label is only for app parsing; the content after it must be ${language.label}.`,
    `Finally write ${labelMeaning} and give the matching Chinese meanings in the same order. The app will hide this meaning until the user taps the sentence.`,
    `Do not attach the Chinese translation after each ${language.label} sentence. Do not use numbered lists.`,
    `If the user asks how to say something in ${language.label}, use ${labelYouCanSay} before the ${language.label} expression.`,
    `If the user asks about a word or phrase, explain it briefly in Simplified Chinese, then give one natural ${language.label} example after the app label.`,
    cleanHistory ? `Recent conversation:\n${cleanHistory}` : "",
    `Student new question: ${message}`,
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

async function askAiTeacher(prompt, mode = "chat", targetLanguage = "english") {
  const aiResponse = await fetch(aiResponsesUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: aiModel,
      input: prompt,
      instructions: buildAiInstructions(mode, targetLanguage),
    }),
  });

  const data = await aiResponse.json().catch(() => ({}));
  if (!aiResponse.ok) {
    throw new Error(data.error?.message || `AI request failed: ${aiResponse.status}`);
  }

  return extractAiText(data).trim();
}

async function askAiTeacherStream(prompt, mode = "chat", targetLanguage = "english", onDelta = () => {}) {
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
        instructions: buildAiInstructions(mode, targetLanguage),
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!aiResponse.ok) {
      const data = await aiResponse.json().catch(() => ({}));
      throw new Error(data.error?.message || `AI request failed: ${aiResponse.status}`);
    }

    if (!aiResponse.body?.getReader) {
      return askAiTeacher(prompt, mode, targetLanguage);
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
    return fullText.trim() || askAiTeacher(prompt, mode, targetLanguage);
  } finally {
    clearTimeout(timeout);
  }
}

function buildAiInstructions(mode = "chat", targetLanguage = "english") {
  const language = getTargetLanguageInfo(targetLanguage);
  if (mode === "convert-language") {
    return "You convert app learning data between languages. Return valid JSON only, with no Markdown or explanation.";
  }

  return mode === "freestyle"
    ? "You are a natural Chinese chat friend. Be calm, normal, warm, concise, and do not use English-teacher formatting unless asked."
    : `You are a ${language.label} learning teacher for Chinese speakers. Be accurate, friendly, concise, and practical.`;
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

  return parts.join("\n") || "The AI did not return content.";
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

    if (request.method === "POST" && request.url === "/api/auth/register") {
      await handleAuthRegister(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/auth/login") {
      await handleAuthLogin(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/auth/logout") {
      await handleAuthLogout(request, response);
      return;
    }

    if (request.method === "GET" && request.url === "/api/auth/me") {
      await handleAuthMe(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/auth/profile") {
      await handleAuthProfile(request, response);
      return;
    }

    if (request.method === "GET" && request.url === "/api/users") {
      await handleListUsers(request, response);
      return;
    }

    if (request.method === "GET" && request.url === "/api/user-data") {
      await handleGetUserData(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/user-data") {
      await handleSaveUserData(request, response);
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
    const status = Number(error.status || 500);
    sendJson(response, status, {
      error: status >= 500 ? "Server error" : error.message,
      message: error.message || "The AI teacher backend is temporarily unavailable.",
    });
  }
});

server.listen(port, () => {
  console.log(`Sentence Reader is running at http://localhost:${port}`);
});
