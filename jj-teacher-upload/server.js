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
const aiModel = process.env.OPENAI_MODEL_OVERRIDE || process.env.AI_MODEL_OVERRIDE || "gpt-5.5";
const aiResponsesUrl = process.env.AI_RESPONSES_URL || "https://api.openai.com/v1/responses";
const aiTranscriptionModel =
  process.env.OPENAI_TRANSCRIPTION_MODEL || process.env.AI_TRANSCRIPTION_MODEL || "gpt-4o-transcribe";
const aiTranscriptionsUrl =
  process.env.OPENAI_TRANSCRIPTIONS_URL || process.env.AI_TRANSCRIPTIONS_URL || "https://api.openai.com/v1/audio/transcriptions";
const aiStreamTimeoutMs = Number(process.env.AI_STREAM_TIMEOUT_MS || 40000);
const aiReasoningEffort = process.env.OPENAI_REASONING_EFFORT || process.env.AI_REASONING_EFFORT || "low";
const aiConvertReasoningEffort =
  process.env.OPENAI_CONVERT_REASONING_EFFORT || process.env.AI_CONVERT_REASONING_EFFORT || "medium";
const aiTextVerbosity = process.env.OPENAI_TEXT_VERBOSITY || process.env.AI_TEXT_VERBOSITY || "low";
const aiMaxOutputTokens = Number(process.env.OPENAI_MAX_OUTPUT_TOKENS || process.env.AI_MAX_OUTPUT_TOKENS || 700);
const aiConvertMaxOutputTokens = Number(
  process.env.OPENAI_CONVERT_MAX_OUTPUT_TOKENS || process.env.AI_CONVERT_MAX_OUTPUT_TOKENS || 2600
);
const aiPromptCacheKeyPrefix = process.env.OPENAI_PROMPT_CACHE_KEY || process.env.AI_PROMPT_CACHE_KEY || "jj-teacher";
const aiServiceTier = process.env.OPENAI_SERVICE_TIER || process.env.AI_SERVICE_TIER || "";
const teacherMessageBreak = "【NEXT_MESSAGE】";
const teacherCorrectionMark = "【CORRECTION】";
const targetLanguages = {
  english: { label: "英语", speech: "en-US" },
  spanish: { label: "西班牙语", speech: "es-ES" },
  japanese: { label: "日语", speech: "ja-JP" },
  korean: { label: "韩语", speech: "ko-KR" },
};
const dataDir = process.env.DATA_DIR || path.join(root, "data");
const userStoreFile = path.join(dataDir, "users.json");
const authTokenTtlMs = 1000 * 60 * 60 * 24 * 30;
const maxUserDataBytes = 1000 * 1000;
const adminUserId = "admin";
const adminUsername = "admin";
const adminPassword = "admin";
const maxAdminMessages = 80;
const maxTranscriptionAudioBytes = Number(process.env.MAX_TRANSCRIPTION_AUDIO_BYTES || 10 * 1024 * 1024);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".webm": "audio/webm",
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
    const cleanStore = {
      users: store && typeof store.users === "object" ? store.users : {},
      sessions: store && typeof store.sessions === "object" ? store.sessions : {},
    };
    cleanStore._dirty = ensureAdminUser(cleanStore);
    return cleanStore;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const cleanStore = { users: {}, sessions: {} };
    cleanStore._dirty = ensureAdminUser(cleanStore);
    return cleanStore;
  }
}

async function saveUserStore(store) {
  await fs.mkdir(dataDir, { recursive: true });
  const tempFile = `${userStoreFile}.${process.pid}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify({ users: store.users || {}, sessions: store.sessions || {} }, null, 2));
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

function ensureAdminUser(store) {
  const now = Date.now();
  let changed = false;
  let user = store.users[adminUserId];
  if (!user) {
    const credentials = hashPassword(adminPassword);
    user = {
      id: adminUserId,
      email: adminUsername,
      username: adminUsername,
      name: "admin",
      role: "admin",
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash,
      adminPasswordVersion: 1,
      createdAt: now,
      updatedAt: now,
      data: sanitizeUserData({}),
      adminMessages: [],
    };
    store.users[adminUserId] = user;
    changed = true;
  }

  if (user.email !== adminUsername) {
    user.email = adminUsername;
    changed = true;
  }
  if (user.username !== adminUsername) {
    user.username = adminUsername;
    changed = true;
  }
  if (user.name !== "admin") {
    user.name = "admin";
    changed = true;
  }
  if (user.role !== "admin") {
    user.role = "admin";
    changed = true;
  }
  if (user.adminPasswordVersion !== 1 || !user.passwordSalt || !user.passwordHash) {
    const credentials = hashPassword(adminPassword);
    user.passwordSalt = credentials.salt;
    user.passwordHash = credentials.hash;
    user.adminPasswordVersion = 1;
    changed = true;
  }
  if (!user.data || typeof user.data !== "object") {
    user.data = sanitizeUserData({});
    changed = true;
  }
  if (!Array.isArray(user.adminMessages)) {
    user.adminMessages = [];
    changed = true;
  }
  if (changed) user.updatedAt = now;
  return changed;
}

function isAdminUser(user) {
  return user?.role === "admin" || user?.id === adminUserId || user?.username === adminUsername;
}

function getActiveBanUntil(user) {
  const bannedUntil = Number(user?.bannedUntil || 0);
  return Number.isFinite(bannedUntil) && bannedUntil > Date.now() ? bannedUntil : 0;
}

function clearExpiredBan(user) {
  if (!user?.bannedUntil || Number(user.bannedUntil) > Date.now()) return false;
  delete user.bannedUntil;
  delete user.banReason;
  user.updatedAt = Date.now();
  return true;
}

function revokeUserSessions(store, userId) {
  Object.entries(store.sessions || {}).forEach(([token, session]) => {
    if (session?.userId === userId) delete store.sessions[token];
  });
}

function findUserByLogin(store, login) {
  const value = String(login || "").trim().toLowerCase();
  if (value === adminUsername) return store.users[adminUserId] || null;
  return findUserByEmail(store, normalizeEmail(value));
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
  if (!token) throw httpError(401, "请先登录账号。");

  const store = await loadUserStore();
  const session = store.sessions[token];
  if (!session) throw httpError(401, "登录已失效，请重新登录。");

  if (session.expiresAt < Date.now()) {
    delete store.sessions[token];
    await saveUserStore(store);
    throw httpError(401, "登录已过期，请重新登录。");
  }

  const user = store.users[session.userId];
  if (!user) {
    delete store.sessions[token];
    await saveUserStore(store);
    throw httpError(401, "账号不存在，请重新登录。");
  }

  if (clearExpiredBan(user)) store._dirty = true;
  const bannedUntil = getActiveBanUntil(user);
  if (bannedUntil && !isAdminUser(user)) {
    throw httpError(403, `账号已被封禁到 ${new Date(bannedUntil).toLocaleString("zh-CN")}。`);
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
    role: user.role || "user",
    isAdmin: isAdminUser(user),
    bannedUntil: getActiveBanUntil(user) || 0,
    banReason: limitText(user.banReason, 160),
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

function sanitizeSceneProgress(progress) {
  const source = progress && typeof progress === "object" ? progress : {};
  return Object.keys(targetLanguages).reduce((all, code) => {
    const item = source[code] && typeof source[code] === "object" ? source[code] : {};
    all[code] = {
      completed: Array.isArray(item.completed)
        ? item.completed.map((id) => limitText(id, 80)).filter(Boolean).slice(0, 200)
        : [],
      lastSceneId: limitText(item.lastSceneId, 80),
    };
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
  const sceneProgress = sanitizeSceneProgress(source.sceneProgress);
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
    sceneProgress,
    languages,
    sentences: languages[currentLanguage].sentences,
    teacherMessages: languages[currentLanguage].teacherMessages,
  };
}

async function readJsonBody(request, maxLength = 30000) {
  try {
    return JSON.parse(await collectBody(request, maxLength));
  } catch {
    throw httpError(400, "请求内容格式不正确。");
  }
}

async function handleAuthRegister(request, response) {
  const payload = await readJsonBody(request);
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const name = limitText(payload.name, 40);

  if (!name) throw httpError(400, "请填写昵称。");
  if (!validateEmail(email)) throw httpError(400, "邮箱格式不正确。");
  if (password.length < 6) throw httpError(400, "密码至少 6 位。");

  const store = await loadUserStore();
  if (findUserByEmail(store, email)) throw httpError(409, "这个邮箱已经注册过。");

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
  const login = limitText(payload.email || payload.username || payload.identifier, 120);
  const password = String(payload.password || "");

  const store = await loadUserStore();
  const user = findUserByLogin(store, login);
  if (!user || !verifyPassword(password, user)) throw httpError(401, "账号或密码不正确。");
  if (clearExpiredBan(user)) store._dirty = true;
  const bannedUntil = getActiveBanUntil(user);
  if (bannedUntil && !isAdminUser(user)) {
    throw httpError(403, `账号已被封禁到 ${new Date(bannedUntil).toLocaleString("zh-CN")}。`);
  }

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
  if (!name) throw httpError(400, "请填写昵称。");

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
    .filter((user) => !isAdminUser(user))
    .map(publicUser)
    .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "zh-Hans-CN"));
  sendJson(response, 200, { users });
}

function requireAdmin(user) {
  if (!isAdminUser(user)) throw httpError(403, "需要管理员权限。");
}

function adminUserItem(user) {
  const messages = Array.isArray(user.adminMessages) ? user.adminMessages : [];
  return {
    ...publicUser(user),
    messageCount: messages.length,
    unreadMessageCount: messages.filter((message) => !message.readAt).length,
  };
}

async function handleAdminUsers(request, response) {
  const { store, user } = await requireUser(request);
  requireAdmin(user);
  await saveUserStore(store);
  const users = Object.values(store.users)
    .map(adminUserItem)
    .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "zh-Hans-CN"));
  sendJson(response, 200, { users });
}

async function handleAdminBan(request, response) {
  const payload = await readJsonBody(request);
  const { store, user } = await requireUser(request);
  requireAdmin(user);

  const targetId = limitText(payload.userId, 120);
  const target = store.users[targetId];
  if (!target) throw httpError(404, "用户不存在。");
  if (isAdminUser(target)) throw httpError(400, "不能封禁管理员账号。");

  const durationMinutes = Math.min(60 * 24 * 365, Math.max(1, Number(payload.durationMinutes || 0) || 0));
  const now = Date.now();
  target.bannedUntil = now + durationMinutes * 60 * 1000;
  target.banReason = limitText(payload.reason, 160);
  target.updatedAt = now;
  revokeUserSessions(store, target.id);
  await saveUserStore(store);
  sendJson(response, 200, { ok: true, user: adminUserItem(target) });
}

async function handleAdminUnban(request, response) {
  const payload = await readJsonBody(request);
  const { store, user } = await requireUser(request);
  requireAdmin(user);

  const targetId = limitText(payload.userId, 120);
  const target = store.users[targetId];
  if (!target) throw httpError(404, "用户不存在。");

  delete target.bannedUntil;
  delete target.banReason;
  target.updatedAt = Date.now();
  await saveUserStore(store);
  sendJson(response, 200, { ok: true, user: adminUserItem(target) });
}

async function handleAdminDelete(request, response) {
  const payload = await readJsonBody(request);
  const { store, user } = await requireUser(request);
  requireAdmin(user);

  const targetId = limitText(payload.userId, 120);
  const target = store.users[targetId];
  if (!target) throw httpError(404, "用户不存在。");
  if (isAdminUser(target)) throw httpError(400, "不能删除管理员账号。");

  delete store.users[targetId];
  revokeUserSessions(store, targetId);
  await saveUserStore(store);
  sendJson(response, 200, { ok: true });
}

function buildAdminMessage(payload) {
  const title = limitText(payload.title, 60) || "管理员消息";
  const body = limitText(payload.body || payload.message, 1000);
  if (!body) throw httpError(400, "消息内容不能为空。");
  return {
    id: crypto.randomUUID(),
    title,
    body,
    from: adminUsername,
    createdAt: Date.now(),
    readAt: null,
  };
}

async function handleAdminMessage(request, response) {
  const payload = await readJsonBody(request);
  const { store, user } = await requireUser(request);
  requireAdmin(user);

  const targetId = limitText(payload.userId, 120);
  const targets = targetId
    ? [store.users[targetId]].filter(Boolean)
    : Object.values(store.users).filter((item) => !isAdminUser(item));
  if (!targets.length) throw httpError(404, "没有可发送的用户。");

  const message = buildAdminMessage(payload);
  targets.forEach((target) => {
    const messages = Array.isArray(target.adminMessages) ? target.adminMessages : [];
    target.adminMessages = [{ ...message }, ...messages].slice(0, maxAdminMessages);
    target.updatedAt = Date.now();
  });
  await saveUserStore(store);
  sendJson(response, 200, { ok: true, count: targets.length });
}

async function handleGetMessages(request, response) {
  const { store, user } = await requireUser(request);
  const messages = Array.isArray(user.adminMessages)
    ? user.adminMessages.filter((message) => message && !message.readAt).slice().reverse()
    : [];
  await saveUserStore(store);
  sendJson(response, 200, { messages });
}

async function handleReadMessages(request, response) {
  const payload = await readJsonBody(request);
  const { store, user } = await requireUser(request);
  const ids = new Set(Array.isArray(payload.ids) ? payload.ids.map((id) => String(id)) : []);
  if (Array.isArray(user.adminMessages)) {
    const now = Date.now();
    user.adminMessages.forEach((message) => {
      if (!message.readAt && (!ids.size || ids.has(String(message.id)))) message.readAt = now;
    });
  }
  await saveUserStore(store);
  sendJson(response, 200, { ok: true });
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

function normalizeTranscriptionLanguage(language) {
  const code = String(language || "").trim().toLowerCase().split("-")[0];
  return ["en", "es", "ja", "ko"].includes(code) ? code : "";
}

function normalizeAudioMimeType(mimeType) {
  const clean = String(mimeType || "").split(";")[0].trim().toLowerCase();
  if (clean === "audio/webm") return { mimeType: clean, extension: "webm" };
  if (clean === "audio/mp4" || clean === "audio/m4a") return { mimeType: clean, extension: "m4a" };
  if (clean === "audio/mpeg" || clean === "audio/mp3") return { mimeType: "audio/mpeg", extension: "mp3" };
  if (clean === "audio/wav" || clean === "audio/x-wav") return { mimeType: "audio/wav", extension: "wav" };
  return { mimeType: "audio/webm", extension: "webm" };
}

function decodeAudioBase64(audioBase64) {
  const clean = String(audioBase64 || "").replace(/^data:audio\/[^;]+;base64,/, "").trim();
  if (!clean) throw httpError(400, "Audio is required");

  const audio = Buffer.from(clean, "base64");
  if (!audio.length) throw httpError(400, "Audio is empty");
  if (audio.length > maxTranscriptionAudioBytes) throw httpError(413, "Audio is too large");
  return audio;
}

async function handleTranscribe(request, response) {
  if (!aiApiKey) {
    sendJson(response, 503, {
      error: "AI transcription is not configured",
      message: "AI transcription is not configured.",
    });
    return;
  }

  const payload = await readJsonBody(request, Math.ceil(maxTranscriptionAudioBytes * 1.45) + 2000);
  const audio = decodeAudioBase64(payload.audioBase64);
  const audioType = normalizeAudioMimeType(payload.mimeType);
  const language = normalizeTranscriptionLanguage(payload.language);

  const form = new FormData();
  form.append("model", aiTranscriptionModel);
  form.append("file", new Blob([audio], { type: audioType.mimeType }), `speech.${audioType.extension}`);
  form.append("response_format", "json");
  if (language) form.append("language", language);
  form.append("prompt", "Short learner voice input for a language learning app.");

  const aiResponse = await fetch(aiTranscriptionsUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiApiKey}`,
    },
    body: form,
  });

  const data = await aiResponse.json().catch(() => ({}));
  if (!aiResponse.ok) {
    throw httpError(502, data.error?.message || `Transcription failed: ${aiResponse.status}`);
  }

  sendJson(response, 200, { text: String(data.text || "").trim() });
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
    await streamAiTeacherResponse(response, buildChatPrompt(message, history, mode, targetLanguage), mode, targetLanguage, message);
    return;
  }

  const reply = finalizeTeacherReply(await askAiTeacher(buildChatPrompt(message, history, mode, targetLanguage), mode, targetLanguage), mode, message);
  sendJson(response, 200, { reply });
}

async function streamAiTeacherResponse(response, prompt, mode, targetLanguage = "english", rawMessage = "") {
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

    sendSse(response, "done", { reply: finalizeTeacherReply(fullReply, mode, rawMessage) });
  } catch (error) {
    sendSse(response, "error", {
      message: error.name === "AbortError" ? "AI 回复超时了，请再试一次。" : error.message || "AI 暂时没有返回内容。",
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
    `You are ZhiYu Tutor, a warm and emotionally intelligent ${language.label} coach for a Chinese native speaker.`,
    `Explain this ${language.label} sentence in Simplified Chinese for a phone screen.`,
    "Return only two parts without headings:",
    "1. A concise key explanation: meaning, common situation, and one key word or spoken usage. Keep it within 3-5 Chinese sentences.",
    `2. One natural chat question related to the sentence, plus one ${language.label} version of that question on its own line.`,
    "Do not output many examples. Do not write robotic labels such as '继续话题:', '问题:', '追问:', 'follow-up:', or markdown tables.",
    `${language.label}句子：${sentence}`,
  ].join("\n");
}

function buildConvertLanguagePrompt(payload, sourceLanguage = "english", targetLanguage = "english") {
  const source = getTargetLanguageInfo(sourceLanguage);
  const target = getTargetLanguageInfo(targetLanguage);
  const sentences = Array.isArray(payload.sentences) ? payload.sentences.slice(0, 120) : [];
  const teacherMessages = Array.isArray(payload.teacherMessages) ? payload.teacherMessages.slice(-50) : [];
  return [
    `你正在把一个语言学习 App 的用户资料从${source.label}学习切换为${target.label}学习。`,
    "请把旧的已保存句子和导师聊天内容转换成目标语言，但不要丢失学习进度。",
    "规则：",
    `1. saved sentences 里的 text 必须变成自然的${target.label}句子。`,
    "2. note 和中文解释继续使用简体中文。",
    `3. teacherMessages 中，用户原本的中文闲聊可以保留中文；原本属于学习语言的句子、问题、例句、翻译要变成${target.label}。`,
    "4. 如果消息里有“英文：”标签，标签保留为“英文：”，但标签后面的内容必须是目标语言，因为 App 需要这个标签解析。",
    "5. 如果消息里有“中文意思：”，后面继续写简体中文意思。",
    "6. 不要新增无关内容，不要删除用户消息，不要改 role。",
    "7. 只返回 JSON，不要 Markdown，不要解释。",
    "JSON 格式必须是：",
    '{"sentences":[{"text":"","note":"","learned":false,"learnedAt":null,"aiExplanation":""}],"teacherMessages":[{"role":"assistant","text":""}]}',
    `旧数据：${JSON.stringify({ sentences, teacherMessages })}`,
  ].join("\n");
}

function isDailySentenceRequest(message) {
  const clean = String(message || "");
  return /(?:3|三).{0,8}句/u.test(clean) && /(?:日常|聊天|口语|朋友)/u.test(clean) && /句子/u.test(clean);
}

function buildChatPrompt(message, history, mode = "chat", targetLanguage = "english") {
  const language = getTargetLanguageInfo(targetLanguage);
  const cleanHistory = history
    .filter((item) => item && typeof item.text === "string" && (item.role === "user" || item.role === "assistant"))
    .map((item) => `${item.role === "user" ? "学生" : "老师"}：${item.text}`)
    .join("\n");

  return [
    `当前学习语言：${language.label}`,
    mode === "freestyle" ? "当前模式：普通聊天。" : mode === "topic" ? "当前模式：话题练习。" : "当前模式：语言学习。",
    [
      "Conversation quality rules:",
      "1. Be specific, warm, emotionally intelligent, and context-aware.",
      "2. Answer the user's real intent before teaching.",
      "3. Avoid empty praise, robotic labels, repeated wording, and generic small talk.",
      "4. Use short readable paragraphs on mobile.",
      "5. When continuing a conversation, pick up one concrete detail from the user and ask one natural next question.",
    ].join("\n"),
    isDailySentenceRequest(message)
      ? [
          "日常句子请求规则：",
          "1. 必须刚好给 3 句，不要只给 1 句。",
          "2. 句子要像真实朋友聊天，不要总是天气、吃什么、你在做什么。",
          "3. 主题可以包含作息、计划、手机、消费、心情、健身、音乐、房间、周末、短途旅行、社交边界。",
          `4. 格式必须是：英文：1. ... 2. ... 3. ... 中文意思：1. ... 2. ... 3. ...`,
        ].join("\n")
      : "",
    mode === "topic"
      ? [
          "话题练习规则：",
          "1. 用户每次回复后，必须顺着用户的具体内容继续聊，不要只说“很好”。",
          "2. 不要把用户原句重复一遍当作主要回复。",
          "3. 像会聊天的人一样自然接话，必要时给一句可跟读的目标语言表达。",
          "4. 最后自然递出一个具体、好回答的小问题，但不要写“问题/追问/继续话题”这些标签。",
        ].join("\n")
      : "",
    `如果你给出${language.label}学习句子或翻译，请用“英文：”放${language.label}内容，并用“中文意思：”放中文意思。`,
    `“英文：”只是 App 的显示标记，后面的内容仍然应该是${language.label}。`,
    cleanHistory ? `最近对话：\n${cleanHistory}` : "",
    `用户：${message}`,
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

function isDirectTranslationRequest(message) {
  const clean = String(message || "").trim();
  return /[\u4e00-\u9fff]/u.test(clean) && /(?:怎么说|翻译|翻成|用.{0,12}语.{0,8}说)/u.test(clean);
}

function trimDirectTranslationReply(reply, message) {
  if (!isDirectTranslationRequest(message)) return reply;

  const englishIndex = reply.indexOf("英文：");
  if (englishIndex === -1) return reply;

  const targetStart = englishIndex + "英文：".length;
  const meaningIndex = reply.indexOf("中文意思：", targetStart);
  if (meaningIndex === -1) return reply.slice(englishIndex).trim();

  const secondEnglishIndex = reply.indexOf("英文：", meaningIndex + "中文意思：".length);
  const target = reply.slice(targetStart, meaningIndex).trim();
  const meaningEnd = secondEnglishIndex === -1 ? reply.length : secondEnglishIndex;
  const meaning = reply.slice(meaningIndex + "中文意思：".length, meaningEnd).trim();

  if (!target || !meaning) return reply.slice(englishIndex).trim();
  return `英文：${target} 中文意思：${meaning}`;
}

function extractJsonObject(text) {
  const clean = String(text || "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function handleWordLookup(request, response) {
  if (!aiApiKey) {
    sendJson(response, 503, {
      error: "AI word lookup is not configured",
      message: "AI word lookup is not configured.",
    });
    return;
  }

  const payload = await readJsonBody(request);
  const word = String(payload.word || "").trim().toLowerCase();
  if (!/^[a-z]+(?:'[a-z]+)?$/.test(word) || word.length > 40) {
    sendJson(response, 400, { error: "Invalid word" });
    return;
  }

  const prompt = [
    "Look up this English word for a Chinese language learner.",
    "Return only compact JSON, no Markdown.",
    'Required shape: {"phonetic":"","meaning":""}',
    "phonetic: IPA without slashes if you know it, otherwise empty string.",
    "meaning: concise Simplified Chinese meanings, 1 line, include common spoken usage if helpful.",
    `word: ${word}`,
  ].join("\n");

  const raw = await askAiTeacher(prompt, "word-lookup", "english");
  const data = extractJsonObject(raw) || {};
  const phonetic = String(data.phonetic || "").replace(/^\/|\/$/g, "").trim().slice(0, 80);
  const meaning = String(data.meaning || "").trim().slice(0, 160);

  if (!meaning) {
    sendJson(response, 502, { error: "No meaning returned" });
    return;
  }

  sendJson(response, 200, { word, phonetic, meaning });
}

function finalizeTeacherReply(reply, mode, rawMessage = "") {
  return compactTeacherReply(reply, mode);
}

async function askAiTeacher(prompt, mode = "chat", targetLanguage = "english") {
  const aiResponse = await fetch(aiResponsesUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildAiRequestBody(prompt, mode, targetLanguage)),
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
      body: JSON.stringify(buildAiRequestBody(prompt, mode, targetLanguage, true)),
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

function buildAiRequestBody(prompt, mode = "chat", targetLanguage = "english", stream = false) {
  const body = {
    model: aiModel,
    input: prompt,
    instructions: buildAiInstructions(mode, targetLanguage),
    reasoning: {
      effort: getAiReasoningEffort(mode),
    },
    text: {
      verbosity: aiTextVerbosity,
    },
    max_output_tokens: getAiMaxOutputTokens(mode),
    prompt_cache_key: `${aiPromptCacheKeyPrefix}:${mode}:${targetLanguage}`,
  };

  if (aiServiceTier) body.service_tier = aiServiceTier;
  if (stream) {
    body.stream = true;
    body.stream_options = { include_obfuscation: false };
  }
  return body;
}

function getAiReasoningEffort(mode) {
  return mode === "convert-language" ? aiConvertReasoningEffort : aiReasoningEffort;
}

function getAiMaxOutputTokens(mode) {
  return mode === "convert-language" ? aiConvertMaxOutputTokens : aiMaxOutputTokens;
}

function buildAiInstructions(mode = "chat", targetLanguage = "english") {
  const language = getTargetLanguageInfo(targetLanguage);
  if (mode === "convert-language") {
    return "You convert app learning data between languages. Return valid JSON only, with no Markdown or explanation.";
  }
  if (mode === "word-lookup") {
    return "You are a compact English-to-Simplified-Chinese dictionary. Return JSON only.";
  }
  if (mode === "topic") {
    return `You are ZhiYu Tutor, a smart, warm, emotionally intelligent spoken ${language.label} practice partner. Notice the student's specific meaning, respond naturally, give useful language when helpful, and keep the conversation moving with one natural next question. Do not merely praise, repeat, or use robotic labels.`;
  }

  return `You are ZhiYu Tutor, a smart, warm, emotionally intelligent language-learning assistant. The user is learning ${language.label}. Be practical, specific, conversational, and high-EQ. Avoid generic filler, robotic labels, and repeated wording.`;
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

    if (request.method === "GET" && request.url === "/api/admin/users") {
      await handleAdminUsers(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/admin/ban") {
      await handleAdminBan(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/admin/unban") {
      await handleAdminUnban(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/admin/delete") {
      await handleAdminDelete(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/admin/message") {
      await handleAdminMessage(request, response);
      return;
    }

    if (request.method === "GET" && request.url === "/api/messages") {
      await handleGetMessages(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/messages/read") {
      await handleReadMessages(request, response);
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

    if (request.method === "POST" && request.url === "/api/transcribe") {
      await handleTranscribe(request, response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/word-lookup") {
      await handleWordLookup(request, response);
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
      message: error.message || "JJ老师暂时连接不上",
    });
  }
});

server.listen(port, () => {
  console.log(`Sentence Reader is running at http://localhost:${port}`);
});
