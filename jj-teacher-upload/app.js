const input = document.querySelector("#sentenceInput");
const list = document.querySelector("#sentenceList");
const count = document.querySelector("#sentenceCount");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = emptyState.querySelector("h2");
const emptyCopy = emptyState.querySelector("p");
const pageEyebrow = document.querySelector("#pageEyebrow");
const pageTitle = document.querySelector("#pageTitle");
const accountButton = document.querySelector("#accountButton");
const sentencesPage = document.querySelector("#sentencesPage");
const examPage = document.querySelector("#examPage");
const teacherPage = document.querySelector("#teacherPage");
const friendsPage = document.querySelector("#friendsPage");
const inputPanel = document.querySelector(".input-panel");
const addButton = document.querySelector("#addButton");
const clearButton = document.querySelector("#clearButton");
const learningTab = document.querySelector("#learningTab");
const learnedTab = document.querySelector("#learnedTab");
const sentencesNav = document.querySelector("#sentencesNav");
const examNav = document.querySelector("#examNav");
const teacherNav = document.querySelector("#teacherNav");
const friendsNav = document.querySelector("#friendsNav");
const speedSlider = document.querySelector("#speedSlider");
const speedValue = document.querySelector("#speedValue");
const wordSheet = document.querySelector("#wordSheet");
const selectedWord = document.querySelector("#selectedWord");
const phoneticText = document.querySelector("#phoneticText");
const meaningText = document.querySelector("#meaningText");
const wordSpeakButton = document.querySelector("#wordSpeakButton");
const closeSheetButton = document.querySelector("#closeSheetButton");
const updateSheet = document.querySelector("#updateSheet");
const updateVersionText = document.querySelector("#updateVersionText");
const updateNotesText = document.querySelector("#updateNotesText");
const updateNowButton = document.querySelector("#updateNowButton");
const updateLaterButton = document.querySelector("#updateLaterButton");
const authSheet = document.querySelector("#authSheet");
const authTitle = document.querySelector("#authTitle");
const authStatusText = document.querySelector("#authStatusText");
const accountProfile = document.querySelector("#accountProfile");
const authAvatarButton = document.querySelector("#authAvatarButton");
const authAvatarFile = document.querySelector("#authAvatarFile");
const authProfileName = document.querySelector("#authProfileName");
const authProfileEmail = document.querySelector("#authProfileEmail");
const editProfileButton = document.querySelector("#editProfileButton");
const profileEditor = document.querySelector("#profileEditor");
const profileNameInput = document.querySelector("#profileNameInput");
const saveProfileButton = document.querySelector("#saveProfileButton");
const accountSettings = document.querySelector("#accountSettings");
const languageOptions = document.querySelector("#languageOptions");
const authName = document.querySelector("#authName");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const authSubmitButton = document.querySelector("#authSubmitButton");
const authModeButton = document.querySelector("#authModeButton");
const authLogoutButton = document.querySelector("#authLogoutButton");
const authCancelButton = document.querySelector("#authCancelButton");
const chatMessagesEl = document.querySelector("#chatMessages");
const teacherInput = document.querySelector("#teacherInput");
const teacherSendButton = document.querySelector("#teacherSendButton");
const topicButton = document.querySelector("#topicButton");
const freeChatButton = document.querySelector("#freeChatButton");
const examProgress = document.querySelector("#examProgress");
const examPrompt = document.querySelector("#examPrompt");
const examAnswer = document.querySelector("#examAnswer");
const examCheckButton = document.querySelector("#examCheckButton");
const examDontKnowButton = document.querySelector("#examDontKnowButton");
const examNextButton = document.querySelector("#examNextButton");
const examFeedback = document.querySelector("#examFeedback");
const examAnswerPanel = document.querySelector("#examAnswerPanel");
const friendList = document.querySelector("#friendList");
const refreshFriendsButton = document.querySelector("#refreshFriendsButton");

const STORAGE_KEY = "sentence-reader-text";
const DRAFT_KEY = "sentence-reader-draft";
const SENTENCES_KEY = "sentence-reader-sentences";
const SPEED_KEY = "sentence-reader-speed";
const VIEW_KEY = "sentence-reader-view";
const APP_PAGE_KEY = "sentence-reader-page";
const TEACHER_CHAT_KEY = "sentence-reader-ai-chat";
const TEACHER_TOPIC_KEY = "sentence-reader-topic-mode";
const TEACHER_FREE_KEY = "sentence-reader-free-chat-mode";
const TEACHER_OPENING_TOPIC_KEY = "sentence-reader-opening-topic-at-free25";
const EXAM_INDEX_KEY = "sentence-reader-exam-index";
const AUTH_TOKEN_KEY = "sentence-reader-auth-token";
const AUTH_USER_KEY = "sentence-reader-auth-user";
const AUTH_AVATAR_KEY = "sentence-reader-auth-avatar";
const LEARNING_LANGUAGE_KEY = "sentence-reader-learning-language";
const STALE_EMPTY_AI_REPLIES = new Set(["我暂时没有生成内容。", "我暂时没有生成内容"]);
const TEACHER_MESSAGE_BREAK = "【NEXT_MESSAGE】";
const TEACHER_CORRECTION_MARK = "【CORRECTION】";
const LEARNING_LANGUAGES = {
  english: { label: "英语", targetLabel: "英文", speech: "en-US", sample: "旅行时使用的英文句子" },
  spanish: { label: "西班牙语", targetLabel: "西班牙语", speech: "es-ES", sample: "旅行时使用的西班牙语句子" },
  japanese: { label: "日语", targetLabel: "日语", speech: "ja-JP", sample: "旅行时使用的日语句子" },
  korean: { label: "韩语", targetLabel: "韩语", speech: "ko-KR", sample: "旅行时使用的韩语句子" },
};
const APP_BUILD_TAG = "free27";
const APP_VERSION_CODE = 27;
const AI_RESPONSE_TIMEOUT_MS = 45000;
const UPDATE_DISMISS_KEY = "sentence-reader-dismissed-update";
const UPDATE_CHECK_TIMEOUT_MS = 6500;
const CLOUD_SYNC_DEBOUNCE_MS = 900;
const LANGUAGE_CONVERT_SENTENCE_BATCH_SIZE = 40;
const LANGUAGE_CONVERT_MESSAGE_LIMIT = 50;
const TEACHER_OPENING_TOPIC_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const DOUBLE_TAP_MS = 420;
const DELETE_CONFIRM_MS = 1500;
let currentWord = "";
let currentAudio = null;
let nativeAudioAvailable = true;
let speechSessionId = 0;
let openAiIndex = null;
const audioCache = new Map();
let savedSentences = [];
let teacherMessages = [];
let teacherTopicMode = false;
let teacherFreeMode = false;
let teacherSendInFlight = false;
let lastTeacherSendSignature = "";
let lastTeacherSendAt = 0;
let currentView = "learning";
let currentPage = "sentences";
let currentExamPosition = 0;
let currentLearningLanguage = "english";
let teacherRenderFrame = 0;
let teacherOpeningTopicTimer = 0;
let teacherOpeningTopicInFlight = false;
let languageSwitchInFlight = false;
let friends = [];
let friendsLoadedAt = 0;
let pendingUpdateInfo = null;
let authToken = "";
let authUser = null;
let authMode = "login";
let cloudSyncTimer = 0;
let cloudSyncInFlight = false;
let cloudSyncQueued = false;

const dictionary = {
  a: ["ə", "一个；一种"],
  about: ["əˈbaʊt", "关于；大约"],
  actually: ["ˈæktʃuəli", "实际上；其实"],
  after: ["ˈæftər", "在...之后"],
  again: ["əˈɡen", "再次"],
  all: ["ɔːl", "全部；所有"],
  always: ["ˈɔːlweɪz", "总是"],
  am: ["æm", "是"],
  an: ["ən", "一个；一种"],
  and: ["ænd", "和；并且"],
  are: ["ɑːr", "是"],
  as: ["æz", "作为；像...一样"],
  ask: ["æsk", "问；请求"],
  at: ["æt", "在"],
  be: ["biː", "是；成为"],
  because: ["bɪˈkɔːz", "因为"],
  before: ["bɪˈfɔːr", "在...之前"],
  better: ["ˈbetər", "更好的"],
  but: ["bʌt", "但是"],
  by: ["baɪ", "通过；在...旁边"],
  can: ["kæn", "能够；可以"],
  change: ["tʃeɪndʒ", "改变；变化"],
  difficult: ["ˈdɪfɪkəlt", "困难的"],
  do: ["duː", "做"],
  english: ["ˈɪŋɡlɪʃ", "英语；英文"],
  even: ["ˈiːvən", "甚至"],
  every: ["ˈevri", "每个"],
  feel: ["fiːl", "感觉"],
  for: ["fɔːr", "为了；对于"],
  from: ["frʌm", "来自"],
  get: ["ɡet", "得到；变得"],
  give: ["ɡɪv", "给"],
  go: ["ɡoʊ", "去"],
  good: ["ɡʊd", "好的"],
  had: ["hæd", "有；have 的过去式"],
  has: ["hæz", "有"],
  have: ["hæv", "有；经历"],
  he: ["hiː", "他"],
  help: ["help", "帮助"],
  her: ["hər", "她的；她"],
  here: ["hɪr", "这里"],
  him: ["hɪm", "他"],
  his: ["hɪz", "他的"],
  how: ["haʊ", "怎样；多么"],
  i: ["aɪ", "我"],
  if: ["ɪf", "如果"],
  important: ["ɪmˈpɔːrtnt", "重要的"],
  improve: ["ɪmˈpruːv", "提高；改善"],
  in: ["ɪn", "在...里面"],
  is: ["ɪz", "是"],
  it: ["ɪt", "它；这件事"],
  just: ["dʒʌst", "只是；刚刚"],
  know: ["noʊ", "知道"],
  language: ["ˈlæŋɡwɪdʒ", "语言"],
  later: ["ˈleɪtər", "后来；稍后"],
  learn: ["lɜːrn", "学习"],
  let: ["let", "让"],
  like: ["laɪk", "喜欢；像"],
  listen: ["ˈlɪsn", "听"],
  make: ["meɪk", "制作；使得"],
  me: ["miː", "我"],
  mean: ["miːn", "意思是"],
  meant: ["ment", "mean 的过去式；意思是"],
  more: ["mɔːr", "更多"],
  my: ["maɪ", "我的"],
  need: ["niːd", "需要"],
  never: ["ˈnevər", "从不"],
  not: ["nɑːt", "不"],
  now: ["naʊ", "现在"],
  of: ["əv", "...的"],
  on: ["ɑːn", "在...上"],
  one: ["wʌn", "一；一个"],
  only: ["ˈoʊnli", "只；仅仅"],
  or: ["ɔːr", "或者"],
  people: ["ˈpiːpl", "人们"],
  practice: ["ˈpræktɪs", "练习"],
  read: ["riːd", "阅读；朗读"],
  realize: ["ˈriːəlaɪz", "意识到；明白"],
  really: ["ˈriːəli", "真正地；确实"],
  right: ["raɪt", "正确的；右边"],
  say: ["seɪ", "说"],
  sentence: ["ˈsentəns", "句子"],
  she: ["ʃiː", "她"],
  should: ["ʃʊd", "应该"],
  so: ["soʊ", "所以；如此"],
  something: ["ˈsʌmθɪŋ", "某事；某物"],
  speak: ["spiːk", "说；讲"],
  speaking: ["ˈspiːkɪŋ", "口语；说话"],
  still: ["stɪl", "仍然"],
  take: ["teɪk", "拿；花费"],
  than: ["ðæn", "比"],
  that: ["ðæt", "那个；那件事"],
  the: ["ðə", "这个；那个"],
  their: ["ðer", "他们的"],
  them: ["ðem", "他们；它们"],
  then: ["ðen", "然后；那时"],
  there: ["ðer", "那里"],
  they: ["ðeɪ", "他们；它们"],
  thing: ["θɪŋ", "事情；东西"],
  think: ["θɪŋk", "认为；思考"],
  this: ["ðɪs", "这个"],
  time: ["taɪm", "时间；次数"],
  to: ["tuː", "到；为了"],
  try: ["traɪ", "尝试"],
  until: ["ənˈtɪl", "直到"],
  up: ["ʌp", "向上"],
  use: ["juːz", "使用"],
  very: ["ˈveri", "非常"],
  want: ["wɑːnt", "想要"],
  was: ["wʌz", "是"],
  way: ["weɪ", "方式；道路"],
  we: ["wiː", "我们"],
  well: ["wel", "好地；嗯"],
  what: ["wʌt", "什么"],
  when: ["wen", "当...时候"],
  where: ["wer", "哪里"],
  who: ["huː", "谁"],
  why: ["waɪ", "为什么"],
  will: ["wɪl", "将会"],
  with: ["wɪð", "和；带有"],
  word: ["wɜːrd", "单词"],
  work: ["wɜːrk", "工作；运转"],
  would: ["wʊd", "将会；愿意"],
  you: ["juː", "你；你们"],
  your: ["jʊr", "你的；你们的"],
};

function normalizeLearningLanguage(code) {
  return LEARNING_LANGUAGES[code] ? code : "english";
}

function getLearningLanguageConfig(code = currentLearningLanguage) {
  return LEARNING_LANGUAGES[normalizeLearningLanguage(code)] || LEARNING_LANGUAGES.english;
}

function getLanguageStorageKey(baseKey, code = currentLearningLanguage) {
  return `${baseKey}:${normalizeLearningLanguage(code)}`;
}

function getLanguageOpeningTopicKey() {
  return `${TEACHER_OPENING_TOPIC_KEY}:${currentLearningLanguage}`;
}

function getTargetLanguagePayload() {
  const language = getLearningLanguageConfig();
  return {
    targetLanguage: currentLearningLanguage,
    targetLanguageName: language.label,
    targetLanguageLabel: language.targetLabel,
  };
}

function getTeacherIntroText() {
  const language = getLearningLanguageConfig();
  return `我是你的智语${language.label}导师。你可以让我给你新句子、解释表达、改写成更口语的说法，或者帮你做背诵练习。`;
}

function getAvatarInitial() {
  const name = getAuthDisplayName();
  return authUser ? name.trim().slice(0, 1).toUpperCase() || "我" : "登";
}

function getAvatarSource() {
  return authUser?.avatar || localStorage.getItem(AUTH_AVATAR_KEY) || "";
}

function setAvatarPreview(element) {
  if (!element) return;

  const avatar = getAvatarSource();
  element.textContent = avatar ? "" : getAvatarInitial();
  element.style.backgroundImage = avatar ? `url("${avatar}")` : "";
  element.classList.toggle("has-image", Boolean(avatar));
}

function splitSentences(text) {
  return text
    .split(/\n+|(?<=[.!?。！？])\s+/)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function splitTokens(sentence) {
  return sentence.match(/[A-Za-z]+(?:'[A-Za-z]+)?|[0-9]+|[^\sA-Za-z0-9]/g) || [];
}

function normalizeWord(word) {
  return word.toLowerCase().replace(/^'+|'+$/g, "");
}

function lookupWord(word) {
  const clean = normalizeWord(word);
  if (dictionary[clean]) return dictionary[clean];

  const withoutPlural = clean.endsWith("s") ? clean.slice(0, -1) : clean;
  if (dictionary[withoutPlural]) return dictionary[withoutPlural];

  const withoutIng = clean.endsWith("ing") ? clean.slice(0, -3) : clean;
  if (dictionary[withoutIng]) return dictionary[withoutIng];

  const withoutEd = clean.endsWith("ed") ? clean.slice(0, -2) : clean;
  if (dictionary[withoutEd]) return dictionary[withoutEd];

  return ["", "本地词库暂未收录。正式版可以接入在线词典，点击后自动显示准确中文释义。"];
}

function softenForCasualSpeech(text) {
  return text
    .replace(/\bI am\b/g, "I'm")
    .replace(/\bI will\b/g, "I'll")
    .replace(/\byou are\b/gi, "you're")
    .replace(/\bdo not\b/gi, "don't")
    .replace(/\bdid not\b/gi, "didn't")
    .replace(/\bcannot\b/gi, "can't")
    .replace(/\bis not\b/gi, "isn't")
    .replace(/\bare not\b/gi, "aren't")
    .replace(/\bwas not\b/gi, "wasn't")
    .replace(/\bwere not\b/gi, "weren't");
}

async function fetchOnlineSpeech(phrase, mode) {
  const chunks = splitSpeechChunks(phrase);
  const sessionId = ++speechSessionId;

  for (const chunk of chunks) {
    if (sessionId !== speechSessionId) return;

    const cacheKey = `${currentLearningLanguage}:${mode}:${chunk}`;
    const audioUrl = audioCache.get(cacheKey) || (await fetchSpeechAudioUrl(chunk, mode));
    audioCache.set(cacheKey, audioUrl);
    await playAudio(audioUrl);
  }
}

async function fetchSpeechAudioUrl(text, mode) {
  try {
    const response = await fetch("/api/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode, language: currentLearningLanguage, voiceLanguage: getLearningLanguageConfig().speech }),
    });

    if (!response.ok) throw new Error("Speech proxy failed");
    const contentType = response.headers.get("Content-Type") || "";
    if (!contentType.includes("audio")) throw new Error("Speech proxy did not return audio");

    const audioBlob = await response.blob();
    if (!audioBlob.size) throw new Error("Empty speech audio");

    return URL.createObjectURL(audioBlob);
  } catch {
    return buildSpeechUrl(text);
  }
}

function buildSpeechUrl(text) {
  const params = new URLSearchParams({
    ie: "UTF-8",
    client: "tw-ob",
    tl: getLearningLanguageConfig().speech,
    q: text,
    ttsspeed: "1",
  });

  return `https://translate.google.com/translate_tts?${params}`;
}

function splitSpeechChunks(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 180) return [clean];

  const parts = clean.match(/[^.!?]+[.!?]?/g) || [clean];
  const chunks = [];
  let current = "";

  parts.forEach((part) => {
    const next = `${current} ${part}`.trim();
    if (next.length <= 180) {
      current = next;
      return;
    }

    if (current) chunks.push(current);
    current = part.trim();
  });

  if (current) chunks.push(current);
  return chunks.flatMap((chunk) => {
    if (chunk.length <= 180) return [chunk];

    const words = chunk.split(" ");
    const wordChunks = [];
    let current = "";
    words.forEach((word) => {
      const next = `${current} ${word}`.trim();
      if (next.length <= 180) {
        current = next;
      } else {
        if (current) wordChunks.push(current);
        current = word;
      }
    });
    if (current) wordChunks.push(current);
    return wordChunks;
  });
}

function getNativeAudio() {
  return window.Capacitor?.Plugins?.NativeAudio || null;
}

async function playAudio(audioUrl) {
  const nativeAudio = getNativeAudio();
  if (nativeAudioAvailable && nativeAudio?.play) {
    try {
      await nativeAudio.play({
        url: audioUrl,
        rate: Number(speedSlider.value || "1"),
      });
      return;
    } catch {
      nativeAudioAvailable = false;
    }
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(audioUrl);
  currentAudio.playbackRate = Number(speedSlider.value || "1");
  currentAudio.preservesPitch = true;
  currentAudio.mozPreservesPitch = true;
  currentAudio.webkitPreservesPitch = true;
  await currentAudio.play();
}

function updateSpeedLabel() {
  const speed = Number(speedSlider.value || "1");
  speedValue.textContent = `${speed.toFixed(2)}x`;
  if (currentAudio) currentAudio.playbackRate = speed;
  localStorage.setItem(SPEED_KEY, speedSlider.value);
}

async function speak(text, mode = "sentence") {
  const phrase = mode === "sentence" && currentLearningLanguage === "english" ? softenForCasualSpeech(text) : text;

  try {
    await fetchOnlineSpeech(phrase, mode);
  } catch {
    if (mode === "word" && !meaningText.textContent.includes("联网语音暂时不可用")) {
      meaningText.textContent = `${meaningText.textContent}（联网语音暂时不可用）`;
    }
  }
}

function loadSavedSentences(languageCode = currentLearningLanguage) {
  try {
    const key = getLanguageStorageKey(SENTENCES_KEY, languageCode);
    const fallback = normalizeLearningLanguage(languageCode) === "english" ? localStorage.getItem(SENTENCES_KEY) : "[]";
    const parsed = JSON.parse(localStorage.getItem(key) || fallback || "[]");
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (typeof item === "string") {
            return { text: item.trim(), note: "", learned: false, learnedAt: null, aiExplanation: "" };
          }

          if (item && typeof item === "object" && typeof item.text === "string") {
            return {
              text: item.text.trim(),
              note: typeof item.note === "string" ? item.note : "",
              learned: Boolean(item.learned),
              learnedAt: typeof item.learnedAt === "number" ? item.learnedAt : null,
              aiExplanation: typeof item.aiExplanation === "string" ? item.aiExplanation : "",
            };
          }

          return null;
        })
        .filter((item) => item && item.text);
    }
  } catch {
    // Ignore malformed storage and fall back to the older text storage below.
  }

  return [];
}

function migrateOldTextStorage() {
  if (currentLearningLanguage !== "english") return;
  if (savedSentences.length) return;

  const oldText = localStorage.getItem(STORAGE_KEY) || "";
  const oldSentences = splitSentences(oldText);
  if (!oldSentences.length) return;

  savedSentences = oldSentences.map((sentence) => ({
    text: sentence,
    note: "",
    learned: false,
    learnedAt: null,
    aiExplanation: "",
  }));
  saveSentences({ sync: false });
  localStorage.removeItem(STORAGE_KEY);
}

function saveSentencesForLanguage(languageCode, sentences) {
  const clean = normalizeCloudSentences(sentences);
  localStorage.setItem(getLanguageStorageKey(SENTENCES_KEY, languageCode), JSON.stringify(clean));
  if (normalizeLearningLanguage(languageCode) === "english") {
    localStorage.setItem(SENTENCES_KEY, JSON.stringify(clean));
  }
}

function saveSentences(options = {}) {
  saveSentencesForLanguage(currentLearningLanguage, savedSentences);
  if (options.sync !== false) queueCloudSync();
}

function getBackendBaseUrl() {
  const configuredBase = window.SENTENCE_READER_API_BASE?.trim();
  if (configuredBase) return configuredBase.replace(/\/+$/, "");

  try {
    const aiUrl = new URL(getAiEndpoint(), window.location.href);
    return aiUrl.origin;
  } catch {
    return "";
  }
}

async function authApiRequest(pathname, options = {}) {
  const baseUrl = getBackendBaseUrl();
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "账号服务暂时不可用");
  }

  return data;
}

function loadAuthSession() {
  authToken = localStorage.getItem(AUTH_TOKEN_KEY) || "";
  try {
    authUser = JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
  } catch {
    authUser = null;
  }
  if (authUser && !authUser.avatar) {
    authUser.avatar = localStorage.getItem(AUTH_AVATAR_KEY) || "";
  }

  if (!authToken || !authUser) {
    authToken = "";
    authUser = null;
  }
}

function saveAuthSession(data) {
  authToken = String(data.token || "");
  const storedAvatar = localStorage.getItem(AUTH_AVATAR_KEY) || "";
  authUser = data.user
    ? { ...data.user, avatar: data.user.avatar || storedAvatar, learningLanguage: data.user.learningLanguage || currentLearningLanguage }
    : null;
  if (!authToken || !authUser) return clearAuthSession();

  localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  updateAuthUi("已登录，正在同步学习内容。");
}

function clearAuthSession() {
  authToken = "";
  authUser = null;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  updateAuthUi();
}

function getAuthDisplayName() {
  return authUser?.name || authUser?.email || "账号";
}

function updateAuthUi(status = "") {
  if (accountButton) {
    setAvatarPreview(accountButton);
    accountButton.title = authUser ? `已登录：${getAuthDisplayName()}` : "登录账号";
  }

  setAvatarPreview(authAvatarButton);
  if (authProfileName) authProfileName.textContent = authUser ? getAuthDisplayName() : "未登录";
  if (authProfileEmail) authProfileEmail.textContent = authUser?.email || "登录后同步学习内容";
  if (profileNameInput && authUser) profileNameInput.value = authUser.name || "";
  if (authStatusText && status) authStatusText.textContent = status;
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === "register";
  const isAccount = mode === "account";

  authTitle.textContent = isAccount ? "个人信息与设置" : isRegister ? "注册账号" : "登录账号";
  authStatusText.textContent = isAccount
    ? `当前学习语言：${getLearningLanguageConfig().label}`
    : "登录后会同步你的句子、学习状态和导师聊天记录。";
  accountProfile.hidden = !isAccount;
  editProfileButton.hidden = !isAccount;
  profileEditor.hidden = true;
  accountSettings.hidden = !isAccount;
  authName.hidden = !isRegister;
  authEmail.hidden = isAccount;
  authPassword.hidden = isAccount;
  authSubmitButton.hidden = isAccount;
  authLogoutButton.hidden = !isAccount;
  authSubmitButton.textContent = isRegister ? "注册并同步" : "登录";
  authModeButton.textContent = isAccount ? "立即同步" : isRegister ? "已有账号？登录" : "还没有账号？注册";
  authCancelButton.textContent = isAccount ? "关闭" : "稍后";
  renderLanguageOptions();
  updateAuthUi();

  if (!isAccount) {
    authPassword.value = "";
  }
}

function renderLanguageOptions() {
  if (!languageOptions) return;

  languageOptions.innerHTML = "";
  Object.entries(LEARNING_LANGUAGES).forEach(([code, language]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-option";
    button.classList.toggle("is-active", code === currentLearningLanguage);
    button.disabled = languageSwitchInFlight;
    button.setAttribute("aria-pressed", String(code === currentLearningLanguage));
    button.textContent = language.label;
    button.addEventListener("click", () => setLearningLanguage(code));
    languageOptions.appendChild(button);
  });
}

function updateLanguageUi() {
  const language = getLearningLanguageConfig();
  inputPanel?.setAttribute("aria-label", `添加${language.label}句子`);
  input.placeholder = `输入或粘贴要添加的${language.label}句子...`;
  examAnswer.placeholder = `输入完整${language.label}句子...`;
  emptyCopy.textContent = currentView === "learned" ? "学会的句子会放在这里。" : `整句点右侧按钮，${language.label === "英语" ? "单词直接点英文" : "可以直接播放整句"}。`;
  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.textContent = `${language.label}日常句子`;
    button.dataset.prompt = `给我3句适合日常聊天的${language.label}句子。`;
  });
  teacherPage.setAttribute("aria-label", `智语${language.label}导师`);
  teacherInput.placeholder = teacherFreeMode
    ? `闲聊模式 ${APP_BUILD_TAG}：可以随便聊聊，不按教学来。`
    : teacherTopicMode
      ? `正在${language.label}话题练习：可以用${language.label}回答，也可以先用中文回答...`
      : `问智语导师，比如：给我几句适合${language.sample}...`;
  renderLanguageOptions();
}

async function setLearningLanguage(code, options = {}) {
  const nextLanguage = normalizeLearningLanguage(code);
  if (nextLanguage === currentLearningLanguage) {
    updateLanguageUi();
    updateAuthUi(`当前已是${getLearningLanguageConfig().label}。`);
    return;
  }
  if (languageSwitchInFlight) return;

  const previousLanguage = currentLearningLanguage;
  const previousSentences = normalizeCloudSentences(savedSentences);
  const previousMessages = getCleanTeacherMessages();
  languageSwitchInFlight = true;
  saveSentences({ sync: false });
  saveTeacherMessages({ sync: false });
  localStorage.setItem(getLanguageStorageKey(EXAM_INDEX_KEY), String(currentExamPosition));

  currentLearningLanguage = nextLanguage;
  localStorage.setItem(LEARNING_LANGUAGE_KEY, currentLearningLanguage);
  if (authUser) {
    authUser = { ...authUser, learningLanguage: currentLearningLanguage };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  }
  savedSentences = previousSentences;
  teacherMessages = previousMessages.length
    ? [
        ...previousMessages,
        { role: "assistant", text: `正在把句子和聊天转换成${getLearningLanguageConfig().label}...` },
      ]
    : [{ role: "assistant", text: getTeacherIntroText() }];
  currentExamPosition = 0;
  openAiIndex = null;
  closeWordSheet();
  updateLanguageUi();
  updateTeacherTopicUi();
  render();
  renderChatMessages();
  updateAuthUi(`正在转换成${getLearningLanguageConfig().label}...`);

  try {
    const converted = await convertLearningContent(previousSentences, previousMessages, previousLanguage, nextLanguage);
    savedSentences = converted.sentences.length ? converted.sentences : previousSentences;
    teacherMessages = converted.teacherMessages.length ? converted.teacherMessages : buildLanguageSwitchFallbackMessages(previousMessages, nextLanguage);
    updateAuthUi(`已切换并转换成${getLearningLanguageConfig().label}。`);
  } catch {
    savedSentences = previousSentences;
    teacherMessages = buildLanguageSwitchFallbackMessages(previousMessages, nextLanguage);
    updateAuthUi(`已切换到${getLearningLanguageConfig().label}，转换暂时失败，内容已保留。`);
  } finally {
    languageSwitchInFlight = false;
    saveSentences({ sync: false });
    saveTeacherMessages({ sync: false });
    updateLanguageUi();
    render();
    renderChatMessages();
    if (options.sync !== false) queueCloudSync(true);
  }
}

function buildLanguageSwitchFallbackMessages(messages, languageCode) {
  const language = getLearningLanguageConfig(languageCode);
  const cleanMessages = getCleanTeacherMessages(messages);
  return [
    ...cleanMessages.slice(-18),
    {
      role: "assistant",
      text: `已经切换到${language.label}。刚才网络没把旧内容完整转换成功，但你的句子和聊天没有丢。你可以继续发一句，我会按${language.label}来教。`,
    },
  ];
}

function extractJsonObject(text) {
  const clean = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) throw new Error("No JSON found");
    return JSON.parse(clean.slice(start, end + 1));
  }
}

function normalizeConvertedContent(data) {
  const sentences = Array.isArray(data?.sentences)
    ? data.sentences.map(normalizeCloudSentence).filter(Boolean)
    : [];
  const teacherMessages = Array.isArray(data?.teacherMessages)
    ? data.teacherMessages
        .map((message) => ({
          role: message?.role === "user" ? "user" : "assistant",
          text: String(message?.text || "").trim(),
          ...(message?.mode === "freestyle" ? { mode: "freestyle" } : {}),
        }))
        .filter((message) => message.text)
        .slice(-50)
    : [];
  return { sentences, teacherMessages };
}

async function convertLearningContent(sentences, messages, sourceLanguage, targetLanguage) {
  if (!sentences.length && !messages.length) {
    return {
      sentences: [],
      teacherMessages: [{ role: "assistant", text: getTeacherIntroText() }],
    };
  }

  const sentenceChunks = sentences.length
    ? Array.from({ length: Math.ceil(sentences.length / LANGUAGE_CONVERT_SENTENCE_BATCH_SIZE) }, (_, index) =>
        sentences.slice(index * LANGUAGE_CONVERT_SENTENCE_BATCH_SIZE, (index + 1) * LANGUAGE_CONVERT_SENTENCE_BATCH_SIZE)
      )
    : [[]];
  const convertedSentences = [];
  let convertedMessages = [];

  for (let index = 0; index < sentenceChunks.length; index += 1) {
    const chunk = sentenceChunks[index];
    try {
      const data = await requestAiTeacher(
        {
          mode: "convert-language",
          sourceLanguage,
          targetLanguage,
          sentences: chunk,
          teacherMessages: index === 0 ? messages.slice(-LANGUAGE_CONVERT_MESSAGE_LIMIT) : [],
        },
        { timeoutMs: 65000 }
      );
      const converted = normalizeConvertedContent(extractJsonObject(data.reply));
      convertedSentences.push(...(converted.sentences.length ? converted.sentences : chunk));
      if (index === 0) convertedMessages = converted.teacherMessages;
    } catch (error) {
      convertedSentences.push(...chunk);
      if (index === 0 && !sentences.length) throw error;
    }
  }

  return {
    sentences: convertedSentences,
    teacherMessages: convertedMessages,
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function compressAvatarFile(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const size = 120;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const sourceSize = Math.min(image.width, image.height);
  const sx = Math.max(0, (image.width - sourceSize) / 2);
  const sy = Math.max(0, (image.height - sourceSize) / 2);
  ctx.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", 0.78);
}

async function handleAvatarChange(file) {
  if (!file || !authUser) return;

  authStatusText.textContent = "正在更新头像...";
  try {
    const avatar = await compressAvatarFile(file);
    authUser = { ...authUser, avatar };
    localStorage.setItem(AUTH_AVATAR_KEY, avatar);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    updateAuthUi("头像已更新。");
    await saveProfileSettings({ avatar });
    queueCloudSync(true);
  } catch {
    updateAuthUi("头像读取失败，换一张图片试试。");
  }
}

function showAuthSheet(mode = authUser ? "account" : "login") {
  if (!authSheet) return;

  authSheet.hidden = false;
  setAuthMode(mode);
  requestAnimationFrame(() => authSheet.classList.add("is-open"));
}

function hideAuthSheet() {
  if (!authSheet) return;

  authSheet.classList.remove("is-open");
  setTimeout(() => {
    authSheet.hidden = true;
  }, 160);
}

async function submitAuth() {
  const name = authName.value.trim();
  const email = authEmail.value.trim();
  const password = authPassword.value;

  if (!email || !password || (authMode === "register" && !name)) {
    authStatusText.textContent = authMode === "register" ? "昵称、邮箱和密码都要填。" : "邮箱和密码都要填。";
    return;
  }

  authSubmitButton.disabled = true;
  authStatusText.textContent = "正在连接账号服务...";

  try {
    const data = await authApiRequest(authMode === "register" ? "/api/auth/register" : "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    saveAuthSession(data);
    hideAuthSheet();
    await pullCloudDataAndMerge();
    await loadFriends(true);
  } catch (error) {
    authStatusText.textContent = error.message || "登录失败，请稍后再试。";
  } finally {
    authSubmitButton.disabled = false;
  }
}

async function logoutAuth() {
  const token = authToken;
  clearAuthSession();
  friends = [];
  friendsLoadedAt = 0;
  renderFriends();
  hideAuthSheet();

  if (!token) return;
  try {
    await authApiRequest("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Local logout should succeed even if the network is unavailable.
  }
}

function setProfileEditing(isEditing) {
  if (!profileEditor || !profileNameInput) return;

  profileEditor.hidden = !isEditing;
  if (isEditing) {
    profileNameInput.value = authUser?.name || "";
    requestAnimationFrame(() => profileNameInput.focus());
  }
}

async function saveProfile() {
  if (!authUser) return;

  const name = profileNameInput.value.trim();
  if (!name) {
    updateAuthUi("昵称不能为空。");
    return;
  }

  saveProfileButton.disabled = true;
  updateAuthUi("正在保存资料...");
  try {
    const data = await authApiRequest("/api/auth/profile", {
      method: "POST",
      body: JSON.stringify({ name, avatar: getAvatarSource() }),
    });
    authUser = { ...authUser, ...(data.user || {}), name, avatar: getAvatarSource() };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    setProfileEditing(false);
    updateAuthUi("资料已保存。");
    await loadFriends(true);
    queueCloudSync(true);
  } catch (error) {
    updateAuthUi(error.message || "资料保存失败。");
  } finally {
    saveProfileButton.disabled = false;
  }
}

async function saveProfileSettings(partial = {}) {
  if (!authUser) return;

  try {
    const data = await authApiRequest("/api/auth/profile", {
      method: "POST",
      body: JSON.stringify({
        name: partial.name || authUser.name || getAuthDisplayName(),
        avatar: partial.avatar ?? getAvatarSource(),
      }),
    });
    authUser = { ...authUser, ...(data.user || {}) };
    if (partial.avatar) authUser.avatar = partial.avatar;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    updateAuthUi();
  } catch {
    // Keep local profile edits even if the network is temporarily unavailable.
  }
}

function renderFriends() {
  if (!friendList) return;

  friendList.innerHTML = "";
  if (!authToken) {
    const empty = document.createElement("p");
    empty.className = "friend-empty";
    empty.textContent = "登录后可以看到所有注册用户。";
    friendList.appendChild(empty);
    return;
  }

  if (!friends.length) {
    const empty = document.createElement("p");
    empty.className = "friend-empty";
    empty.textContent = "还没有加载到用户，点刷新试试。";
    friendList.appendChild(empty);
    return;
  }

  friends.forEach((friend) => {
    const card = document.createElement("article");
    card.className = "friend-card";

    const avatar = document.createElement("div");
    avatar.className = "friend-avatar";
    const avatarSource = typeof friend.avatar === "string" && friend.avatar.startsWith("data:image/") ? friend.avatar : "";
    avatar.textContent = avatarSource ? "" : String(friend.name || "用").slice(0, 1).toUpperCase();
    avatar.style.backgroundImage = avatarSource ? `url("${avatarSource}")` : "";
    avatar.classList.toggle("has-image", Boolean(avatarSource));

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = friend.name || "未命名用户";
    const meta = document.createElement("span");
    meta.textContent = `${getLearningLanguageConfig(friend.learningLanguage).label}学习中`;
    info.append(name, meta);

    card.append(avatar, info);
    friendList.appendChild(card);
  });
}

async function loadFriends(force = false) {
  if (!authToken || (!force && Date.now() - friendsLoadedAt < 10000)) return;

  try {
    const data = await authApiRequest("/api/users", { method: "GET" });
    friends = Array.isArray(data.users) ? data.users : [];
    friendsLoadedAt = Date.now();
    renderFriends();
  } catch (error) {
    if (!friendList) return;
    friendList.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "friend-empty";
    empty.textContent = error.message || "好友列表暂时加载失败。";
    friendList.appendChild(empty);
  }
}

function normalizeCloudSentence(item) {
  if (typeof item === "string") {
    return { text: item.trim(), note: "", learned: false, learnedAt: null, aiExplanation: "" };
  }

  if (!item || typeof item !== "object" || typeof item.text !== "string") return null;

  const text = item.text.trim();
  if (!text) return null;

  return {
    text,
    note: typeof item.note === "string" ? item.note : "",
    learned: Boolean(item.learned),
    learnedAt: typeof item.learnedAt === "number" ? item.learnedAt : null,
    aiExplanation: typeof item.aiExplanation === "string" ? item.aiExplanation : "",
  };
}

function normalizeCloudSentences(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map(normalizeCloudSentence)
    .filter(Boolean)
    .slice(0, 1000);
}

function mergeSentenceLists(localItems, remoteItems) {
  const merged = [];
  const seen = new Map();

  [...localItems, ...remoteItems].forEach((rawItem) => {
    const item = normalizeCloudSentence(rawItem);
    if (!item) return;

    const key = item.text.toLowerCase();
    const existing = seen.get(key);
    if (!existing) {
      const copy = { ...item };
      seen.set(key, copy);
      merged.push(copy);
      return;
    }

    existing.note = existing.note || item.note;
    existing.learned = existing.learned || item.learned;
    existing.learnedAt = Math.max(existing.learnedAt || 0, item.learnedAt || 0) || null;
    existing.aiExplanation = existing.aiExplanation || item.aiExplanation;
  });

  return merged;
}

function getCleanTeacherMessages(messages = teacherMessages) {
  return messages
    .filter((message) => !message.pending)
    .map(({ role, text, translation, mode }) => {
      const clean = { role, text };
      const normalized = normalizeTeacherTranslation(translation);
      if (normalized) clean.translation = normalized;
      if (mode === "freestyle") clean.mode = mode;
      return clean;
    })
    .filter((message) => (message.role === "user" || message.role === "assistant") && String(message.text || "").trim())
    .slice(-50);
}

function normalizeCloudTeacherMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => message && (message.role === "user" || message.role === "assistant") && typeof message.text === "string")
    .map((message) => {
      const clean = {
        role: message.role,
        text: renameFreeChatText(renameTeacherText(message.text)).trim(),
      };
      const translation = normalizeTeacherTranslation(message.translation);
      if (translation) clean.translation = translation;
      if (message.mode === "freestyle") clean.mode = "freestyle";
      return clean;
    })
    .filter((message) => message.text)
    .slice(-50);
}

function normalizeCloudSettings(settings) {
  const source = settings && typeof settings === "object" ? settings : {};
  return {
    learningLanguage: normalizeLearningLanguage(source.learningLanguage),
    avatar: typeof source.avatar === "string" && source.avatar.startsWith("data:image/") ? source.avatar.slice(0, 16000) : "",
  };
}

function getStoredLanguageData(languageCode) {
  const code = normalizeLearningLanguage(languageCode);
  const isCurrent = code === currentLearningLanguage;
  return {
    sentences: normalizeCloudSentences(isCurrent ? savedSentences : loadSavedSentences(code)),
    teacherMessages: getCleanTeacherMessages(isCurrent ? teacherMessages : loadTeacherMessages(code)),
    savedAt: Date.now(),
  };
}

function getAllLanguageData() {
  return Object.keys(LEARNING_LANGUAGES).reduce((all, code) => {
    all[code] = getStoredLanguageData(code);
    return all;
  }, {});
}

function normalizeCloudLanguages(languages) {
  const source = languages && typeof languages === "object" ? languages : {};
  return Object.keys(LEARNING_LANGUAGES).reduce((all, code) => {
    const data = source[code] && typeof source[code] === "object" ? source[code] : {};
    all[code] = {
      sentences: normalizeCloudSentences(data.sentences),
      teacherMessages: normalizeCloudTeacherMessages(data.teacherMessages),
      savedAt: typeof data.savedAt === "number" ? data.savedAt : 0,
    };
    return all;
  }, {});
}

function getCloudPayload() {
  const languages = getAllLanguageData();
  return {
    appVersion: APP_BUILD_TAG,
    savedAt: Date.now(),
    settings: {
      learningLanguage: currentLearningLanguage,
      avatar: getAvatarSource(),
    },
    learningLanguage: currentLearningLanguage,
    languages,
    sentences: languages[currentLearningLanguage].sentences,
    teacherMessages: languages[currentLearningLanguage].teacherMessages,
  };
}

async function pullCloudDataAndMerge() {
  if (!authToken) return;

  try {
    updateAuthUi("正在同步学习内容...");
    const data = await authApiRequest("/api/user-data", { method: "GET" });
    const remoteData = data.data || {};
    const remoteSettings = normalizeCloudSettings(remoteData.settings || {
      learningLanguage: remoteData.learningLanguage,
      avatar: remoteData.avatar,
    });
    if (remoteSettings.avatar && authUser) {
      authUser.avatar = remoteSettings.avatar;
      localStorage.setItem(AUTH_AVATAR_KEY, remoteSettings.avatar);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    }

    const remoteLanguages = normalizeCloudLanguages(remoteData.languages);
    if (!Object.values(remoteLanguages).some((item) => item.sentences.length || item.teacherMessages.length)) {
      remoteLanguages[currentLearningLanguage] = {
        sentences: normalizeCloudSentences(remoteData.sentences),
        teacherMessages: normalizeCloudTeacherMessages(remoteData.teacherMessages),
        savedAt: Number(remoteData.savedAt || 0),
      };
    }

    Object.keys(LEARNING_LANGUAGES).forEach((code) => {
      const localSentences = code === currentLearningLanguage ? savedSentences : loadSavedSentences(code);
      const mergedSentences = mergeSentenceLists(localSentences, remoteLanguages[code].sentences);
      saveSentencesForLanguage(code, mergedSentences);

      const localMessages = code === currentLearningLanguage ? getCleanTeacherMessages() : loadTeacherMessages(code);
      const remoteMessages = remoteLanguages[code].teacherMessages;
      const mergedMessages = remoteMessages.length > localMessages.length ? remoteMessages : localMessages;
      saveTeacherMessagesForLanguage(code, mergedMessages);
    });

    if (remoteSettings.learningLanguage && !localStorage.getItem(LEARNING_LANGUAGE_KEY)) {
      currentLearningLanguage = remoteSettings.learningLanguage;
      localStorage.setItem(LEARNING_LANGUAGE_KEY, currentLearningLanguage);
    }
    if (authUser) {
      authUser = { ...authUser, avatar: getAvatarSource(), learningLanguage: currentLearningLanguage };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    }
    savedSentences = loadSavedSentences();
    teacherMessages = loadTeacherMessages();
    updateLanguageUi();
    render();
    renderChatMessages();
    updateAuthUi();
    updateAuthUi("同步完成。");
    queueCloudSync(true);
  } catch (error) {
    updateAuthUi(error.message || "同步失败，稍后会再试。");
  }
}

function queueCloudSync(immediate = false) {
  if (!authToken) return;

  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(syncCloudData, immediate ? 0 : CLOUD_SYNC_DEBOUNCE_MS);
}

async function syncCloudData() {
  if (!authToken) return;
  if (cloudSyncInFlight) {
    cloudSyncQueued = true;
    return;
  }

  cloudSyncInFlight = true;
  cloudSyncQueued = false;
  try {
    await authApiRequest("/api/user-data", {
      method: "POST",
      body: JSON.stringify({ data: getCloudPayload() }),
    });
    updateAuthUi("已同步。");
  } catch (error) {
    updateAuthUi(error.message || "同步失败。");
  } finally {
    cloudSyncInFlight = false;
    if (cloudSyncQueued) queueCloudSync(true);
  }
}

function addSentences() {
  const additions = splitSentences(input.value);
  if (!additions.length) {
    input.focus();
    return;
  }

  const newItems = additions.map((sentence) => ({
    text: sentence,
    note: "",
    learned: false,
    learnedAt: null,
    aiExplanation: "",
  }));

  savedSentences = [
    ...newItems,
    ...savedSentences,
  ];
  saveSentences();
  input.value = "";
  localStorage.setItem(DRAFT_KEY, "");
  render();
  input.focus();
}

function deleteSentence(index) {
  savedSentences.splice(index, 1);
  saveSentences();
  render();
  if (!savedSentences.length) wordSheet.classList.remove("is-open");
}

function updateSentenceNote(index, note) {
  savedSentences[index].note = note;
  saveSentences();
}

function updateSentenceAiExplanation(index, explanation) {
  if (!savedSentences[index]) return;

  savedSentences[index].aiExplanation = explanation;
  saveSentences();
}

function getAiEndpoint() {
  const configuredEndpoint = window.SENTENCE_READER_AI_ENDPOINT?.trim();
  if (configuredEndpoint) return configuredEndpoint;

  const capacitor = window.Capacitor;
  const isNativeApp =
    Boolean(capacitor?.isNativePlatform?.()) ||
    Boolean(capacitor?.getPlatform && capacitor.getPlatform() !== "web");

  if (isNativeApp) {
    throw new Error("智语导师还没连接在线AI服务。APK需要配置一个手机能访问的后端地址。");
  }

  return "/api/ai-teacher";
}

function getAiTimeoutMessage() {
  return "AI这次想太久了，先别一直等。你可以换个短点的问题再试。";
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

function getUpdateConfigUrls() {
  const urls = [];
  const configured = window.SENTENCE_READER_UPDATE_URL?.trim();
  if (configured) urls.push(configured);

  try {
    const aiUrl = new URL(getAiEndpoint(), window.location.href);
    urls.push(`${aiUrl.origin}/version.json`);
    urls.push(`${aiUrl.origin}/api/app-version`);
  } catch {
    urls.push("/version.json");
  }

  urls.push("https://raw.githubusercontent.com/965800jay-max/jj-teacher/main/jj-teacher-upload/version.json");
  return [...new Set(urls)];
}

async function fetchJsonWithTimeout(url, timeoutMs = UPDATE_CHECK_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Update config failed: ${response.status}`);
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeUpdateInfo(data) {
  if (!data || typeof data !== "object") return null;

  const versionCode = Number(data.versionCode || data.androidVersionCode || 0);
  const versionName = String(data.versionName || data.name || "").trim();
  const apkUrl = String(data.apkUrl || data.url || data.downloadUrl || "").trim();
  if (!Number.isFinite(versionCode) || versionCode <= APP_VERSION_CODE || !apkUrl) return null;

  return {
    versionCode,
    versionName: versionName || `free${versionCode}`,
    apkUrl,
    notes: String(data.notes || data.changelog || "新版本已经准备好。").trim(),
    force: Boolean(data.force),
  };
}

function shouldShowUpdate(info) {
  if (!info) return false;
  if (info.force) return true;
  return localStorage.getItem(UPDATE_DISMISS_KEY) !== String(info.versionCode);
}

async function checkForAppUpdate() {
  for (const url of getUpdateConfigUrls()) {
    try {
      const info = normalizeUpdateInfo(await fetchJsonWithTimeout(url));
      if (shouldShowUpdate(info)) {
        showUpdateSheet(info);
        return;
      }
    } catch {
      // Ignore unavailable update manifests; the app should never block startup.
    }
  }
}

function showUpdateSheet(info) {
  if (!updateSheet || !info) return;

  pendingUpdateInfo = info;
  updateVersionText.textContent = `发现新版本 ${info.versionName}`;
  updateNotesText.textContent = info.notes || "新版本已经准备好。";
  updateLaterButton.hidden = Boolean(info.force);
  updateSheet.hidden = false;
  requestAnimationFrame(() => updateSheet.classList.add("is-open"));
}

function hideUpdateSheet(remember = true) {
  if (!updateSheet || !pendingUpdateInfo) return;

  if (remember) {
    localStorage.setItem(UPDATE_DISMISS_KEY, String(pendingUpdateInfo.versionCode));
  }
  updateSheet.classList.remove("is-open");
  setTimeout(() => {
    updateSheet.hidden = true;
  }, 180);
}

function openUpdateDownload() {
  if (!pendingUpdateInfo?.apkUrl) return;

  window.open(pendingUpdateInfo.apkUrl, "_blank", "noopener,noreferrer");
}

async function requestAiTeacher(payload, options = {}) {
  const endpoint = getAiEndpoint();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || AI_RESPONSE_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...getTargetLanguagePayload(), ...payload }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => {
      throw new Error(`智语导师接口没有返回JSON内容：${endpoint}`);
    });
    if (!response.ok) {
      throw new Error(renameTeacherText(data.message || data.error || "智语导师暂时连接不上"));
    }

    if (!String(data.reply || "").trim()) {
      throw new Error("智语导师接口连上了，但没有返回内容。请检查后端 OpenAI 配置。");
    }

    return data;
  } catch (error) {
    if (isAbortError(error)) throw new Error(getAiTimeoutMessage());
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function requestAiTeacherStream(payload, options = {}) {
  const endpoint = getAiEndpoint();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || AI_RESPONSE_TIMEOUT_MS);
  let accumulated = "";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "text/event-stream, application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...getTargetLanguagePayload(), ...payload, stream: true }),
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/event-stream")) {
      const data = await response.json().catch(() => {
        throw new Error(`智语导师接口没有返回JSON内容：${endpoint}`);
      });
      if (!response.ok) {
        throw new Error(renameTeacherText(data.message || data.error || "智语导师暂时连接不上"));
      }
      if (!String(data.reply || "").trim()) {
        throw new Error("智语导师接口连上了，但没有返回内容。请检查后端 OpenAI 配置。");
      }
      if (payload.mode === "freestyle") data.reply = cleanFreestyleReply(data.reply);
      await replayTextAsDeltas(data.reply, options.onDelta);
      return data;
    }

    if (!response.ok) {
      throw new Error("智语导师流式接口暂时不可用。");
    }
    if (!response.body?.getReader) {
      return requestAiTeacher(payload, options);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalReply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parsed = consumeSseBuffer(buffer);
      buffer = parsed.rest;
      for (const event of parsed.events) {
        if (event.name === "error") {
          throw new Error(event.data?.message || "AI 回复中断了。");
        }
        if (event.name === "done") {
          finalReply = String(event.data?.reply || accumulated).trim();
          continue;
        }

        const delta = String(event.data?.delta || "");
        const text = String(event.data?.text || "");
        if (!delta && !text) continue;

        accumulated = text || `${accumulated}${delta}`;
        options.onDelta?.(delta, accumulated);
      }
    }

    return { reply: (finalReply || accumulated).trim() };
  } catch (error) {
    if (isAbortError(error) && accumulated.trim()) {
      return { reply: `${accumulated.trim()}（后面有点卡住了，先回到这儿。）` };
    }
    if (isAbortError(error)) throw new Error(getAiTimeoutMessage());
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function consumeSseBuffer(buffer) {
  const normalized = String(buffer || "").replace(/\r\n/g, "\n");
  const events = [];
  let rest = normalized;
  let boundary = rest.indexOf("\n\n");

  while (boundary !== -1) {
    const block = rest.slice(0, boundary);
    rest = rest.slice(boundary + 2);
    const event = parseSseEvent(block);
    if (event.data !== null) events.push(event);
    boundary = rest.indexOf("\n\n");
  }

  return { events, rest };
}

function parseSseEvent(block) {
  const event = { name: "message", data: null };
  const dataLines = [];

  String(block || "")
    .split("\n")
    .forEach((line) => {
      if (line.startsWith("event:")) event.name = line.slice(6).trim();
      if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
    });

  const dataText = dataLines.join("\n").trim();
  if (!dataText || dataText === "[DONE]") return event;

  try {
    event.data = JSON.parse(dataText);
  } catch {
    event.data = { text: dataText };
  }

  return event;
}

function replayTextAsDeltas(text, onDelta) {
  if (typeof onDelta !== "function") return Promise.resolve();

  const chunks = String(text || "").match(/[\s\S]{1,8}/g) || [];
  let visible = "";
  return chunks.reduce((promise, chunk) => {
    return promise.then(
      () =>
        new Promise((resolve) => {
          visible += chunk;
          onDelta(chunk, visible);
          setTimeout(resolve, 14);
        })
    );
  }, Promise.resolve());
}

function scheduleChatMessagesRender() {
  if (teacherRenderFrame) return;

  teacherRenderFrame = requestAnimationFrame(() => {
    teacherRenderFrame = 0;
    renderChatMessages();
  });
}

function renderAiText(container, text) {
  container.innerHTML = "";
  container.classList.add("is-open");

  getCompactAiSections(text).forEach(({ title, body }) => {
    const heading = document.createElement("h3");
    heading.textContent = title;
    container.appendChild(heading);

    const copy = document.createElement("p");
    copy.textContent = body;
    container.appendChild(copy);
  });
}

function getCompactAiSections(text) {
  const sections = {};
  let currentTitle = "";

  text
    .split(/\n+/)
    .map((line) => line.replace(/^#+\s*/, "").replace(/^[-•]\s*/, "").trim())
    .filter(Boolean)
    .forEach((line) => {
      const sectionMatch = line.match(/^(句意|语法|重点词|重点短语|例句|背诵提示|口语用法|小测试)[:：]\s*(.*)$/);
      if (sectionMatch) {
        currentTitle = sectionMatch[1];
        sections[currentTitle] = sectionMatch[2] || "";
        return;
      }

      if (currentTitle && !sections[currentTitle]) {
        sections[currentTitle] = line;
      }
    });

  const compact = [
    { title: "句意", body: sections["句意"] },
    { title: "重点", body: sections["重点词"] || sections["重点短语"] || sections["语法"] },
    { title: "例句", body: sections["例句"] || sections["背诵提示"] },
  ]
    .filter((section) => section.body)
    .map((section) => ({ ...section, body: shortenAiLine(section.body) }));

  if (compact.length) return compact.slice(0, 3);

  return text
    .split(/\n+/)
    .map((line) => line.replace(/^#+\s*/, "").replace(/^[-•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((line, index) => ({ title: ["句意", "重点", "例句"][index] || "重点", body: shortenAiLine(line) }));
}

function shortenAiLine(line) {
  const clean = String(line || "")
    .replace(/\s+/g, " ")
    .replace(/。.*$/, "。")
    .trim();

  return clean.length > 42 ? `${clean.slice(0, 42)}...` : clean;
}

function renderAiMessage(container, message) {
  container.innerHTML = "";
  container.classList.add("is-open");

  const copy = document.createElement("p");
  copy.textContent = message;
  container.appendChild(copy);
}

async function explainSentence(index, sentence, container, button) {
  if (savedSentences[index]?.aiExplanation) {
    if (openAiIndex === index && container.classList.contains("is-open")) {
      openAiIndex = null;
      container.classList.remove("is-open");
      container.innerHTML = "";
      button.textContent = "查看导师讲解";
      return;
    }

    openAiIndex = index;
    renderAiText(container, savedSentences[index].aiExplanation);
    button.textContent = "收起导师讲解";
    return;
  }

  openAiIndex = index;
  button.disabled = true;
  button.textContent = "思考中";
  renderAiMessage(container, "智语导师正在看这句话...");

  try {
    const data = await requestAiTeacher({ mode: "explain", sentence });
    const explanation = data.reply || "";
    updateSentenceAiExplanation(index, explanation);
    renderAiText(container, explanation);
  } catch (error) {
    renderAiMessage(container, renameTeacherText(error.message || "智语导师暂时连接不上"));
  } finally {
    button.disabled = false;
    button.textContent = openAiIndex === index ? "收起导师讲解" : "问智语导师";
  }
}

function unlockNoteEditor(note) {
  note.readOnly = false;
  note.classList.add("is-editing");
  note.focus();
  note.setSelectionRange(note.value.length, note.value.length);
}

function lockNoteEditor(note) {
  note.readOnly = true;
  note.classList.remove("is-editing");
}

function attachDoubleTapToEdit(note) {
  let lastTap = 0;
  note.readOnly = true;

  note.addEventListener("pointerup", (event) => {
    if (!note.readOnly) return;

    event.preventDefault();
    const now = Date.now();
    if (now - lastTap <= DOUBLE_TAP_MS) {
      lastTap = 0;
      unlockNoteEditor(note);
      return;
    }

    lastTap = now;
  });

  note.addEventListener("dblclick", (event) => {
    if (!note.readOnly) return;

    event.preventDefault();
    unlockNoteEditor(note);
  });

  note.addEventListener("focus", () => {
    if (note.readOnly) note.blur();
  });

  note.addEventListener("blur", () => lockNoteEditor(note));
}

function attachDoubleTapToDelete(button, index) {
  let confirmTimer = null;

  button.addEventListener("click", () => {
    if (button.classList.contains("is-confirming")) {
      clearTimeout(confirmTimer);
      deleteSentence(index);
      return;
    }

    button.classList.add("is-confirming");
    button.title = "再次点击删除";
    button.setAttribute("aria-label", "再次点击删除句子");
    confirmTimer = setTimeout(() => {
      button.classList.remove("is-confirming");
      button.title = "删除句子";
      button.setAttribute("aria-label", "删除句子");
    }, DELETE_CONFIRM_MS);
  });
}

function markSentenceLearned(index) {
  savedSentences[index].learned = true;
  savedSentences[index].learnedAt = Date.now();
  saveSentences();
  render();
}

function setCurrentView(view) {
  currentView = view;
  localStorage.setItem(VIEW_KEY, currentView);
  render();
}

function attachSwipeToLearn(card, index) {
  let startX = 0;
  let offsetX = 0;
  let dragging = false;

  card.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, textarea, input, select")) return;

    startX = event.clientX;
    offsetX = 0;
    dragging = true;
    card.classList.add("is-swiping");
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    offsetX = Math.max(0, event.clientX - startX);
    card.style.transform = `translateX(${Math.min(offsetX, 150)}px)`;
    card.style.opacity = String(Math.max(0.35, 1 - offsetX / 180));
  });

  const finishSwipe = () => {
    if (!dragging) return;

    dragging = false;
    card.classList.remove("is-swiping");

    if (offsetX >= 96) {
      card.classList.add("is-learned-exit");
      setTimeout(() => markSentenceLearned(index), 150);
      return;
    }

    card.style.transform = "";
    card.style.opacity = "";
  };

  card.addEventListener("pointerup", finishSwipe);
  card.addEventListener("pointercancel", finishSwipe);
}

function render() {
  list.innerHTML = "";
  const language = getLearningLanguageConfig();
  const isLearnedView = currentView === "learned";
  const visibleItems = savedSentences
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => Boolean(item.learned) === isLearnedView);

  inputPanel.classList.toggle("is-hidden", isLearnedView);
  learningTab.classList.toggle("is-active", !isLearnedView);
  learnedTab.classList.toggle("is-active", isLearnedView);
  learningTab.setAttribute("aria-selected", String(!isLearnedView));
  learnedTab.setAttribute("aria-selected", String(isLearnedView));

  count.textContent = `${visibleItems.length} 句`;
  emptyTitle.textContent = isLearnedView ? "还没有已学会的句子" : "添加句子后就能直接听";
  emptyCopy.textContent = isLearnedView
    ? "学会的句子会放在这里。"
    : language.label === "英语"
      ? "整句点右侧按钮，单词直接点英文。"
      : `整句点右侧按钮，当前学习${language.label}。`;
  emptyState.classList.toggle("is-hidden", visibleItems.length > 0);

  visibleItems.forEach(({ item, index }) => {
    const sentence = item.text;
    const card = document.createElement("article");
    card.className = "sentence-card";
    if (!isLearnedView) attachSwipeToLearn(card, index);

    const content = document.createElement("div");
    content.className = "sentence-content";

    const sentenceText = document.createElement("div");
    sentenceText.className = "sentence-text";

    splitTokens(sentence).forEach((token) => {
      if (currentLearningLanguage === "english" && /^[A-Za-z]+(?:'[A-Za-z]+)?$/.test(token)) {
        const button = document.createElement("button");
        button.className = "word-token";
        button.type = "button";
        button.textContent = token;
        button.addEventListener("click", () => showWord(token, button));
        sentenceText.appendChild(button);
      } else {
        const punctuation = document.createElement("span");
        punctuation.className = "punctuation";
        punctuation.textContent = token;
        sentenceText.appendChild(punctuation);
      }
    });

    const note = document.createElement("textarea");
    note.className = "sentence-note";
    note.placeholder = "添加中文句意...";
    note.value = item.note;
    note.setAttribute("aria-label", `添加句意：${sentence}`);
    note.addEventListener("input", () => updateSentenceNote(index, note.value));
    attachDoubleTapToEdit(note);

    const aiTools = document.createElement("div");
    aiTools.className = "sentence-ai-tools";

    const aiButton = document.createElement("button");
    aiButton.className = "ai-button";
    aiButton.type = "button";
    aiButton.textContent = openAiIndex === index && item.aiExplanation ? "收起导师讲解" : item.aiExplanation ? "查看导师讲解" : "问智语导师";

    const aiPanel = document.createElement("div");
    aiPanel.className = "ai-explain";
    aiPanel.setAttribute("aria-live", "polite");
    if (openAiIndex === index && item.aiExplanation) {
      renderAiText(aiPanel, item.aiExplanation);
    }
    aiButton.addEventListener("click", () => explainSentence(index, sentence, aiPanel, aiButton));
    aiTools.appendChild(aiButton);

    const speakButton = document.createElement("button");
    speakButton.className = "speak-button";
    speakButton.type = "button";
    speakButton.title = "朗读整句";
    speakButton.setAttribute("aria-label", "朗读整句");
    speakButton.textContent = "▶";
    speakButton.addEventListener("click", () => speak(sentence, "sentence"));

    const actions = document.createElement("div");
    actions.className = "sentence-actions";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.title = "删除句子";
    deleteButton.setAttribute("aria-label", "删除句子");
    deleteButton.textContent = "×";
    attachDoubleTapToDelete(deleteButton, index);

    actions.append(speakButton, deleteButton);
    content.append(sentenceText, note, aiTools, aiPanel);
    card.append(content, actions);
    list.appendChild(card);
  });

  if (currentPage === "exam") renderExam(false);
}

function showWord(word, target) {
  document.querySelectorAll(".word-token.is-active").forEach((item) => {
    item.classList.remove("is-active");
  });
  target.classList.add("is-active");

  currentWord = word;
  const [phonetic, meaning] = lookupWord(word);
  selectedWord.textContent = word;
  phoneticText.textContent = phonetic ? `/${phonetic}/` : "音标待查询";
  meaningText.textContent = meaning;
  wordSheet.classList.add("is-open");
  speak(word, "word");
}

function closeWordSheet() {
  wordSheet.classList.remove("is-open");
  currentWord = "";
  document.querySelectorAll(".word-token.is-active").forEach((item) => {
    item.classList.remove("is-active");
  });
}

function getExamPool() {
  return savedSentences
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.learned && item.note.trim());
}

function getLearningItems() {
  return savedSentences.filter((item) => !item.learned);
}

function getCurrentExamItem() {
  const pool = getExamPool();
  if (!pool.length) return { pool, entry: null };

  currentExamPosition = Math.max(0, Math.min(currentExamPosition, pool.length - 1));
  return { pool, entry: pool[currentExamPosition] };
}

function resetExamAnswer() {
  examAnswer.value = "";
  examFeedback.className = "exam-feedback";
  examFeedback.textContent = "";
  examAnswerPanel.classList.remove("is-open");
  examAnswerPanel.innerHTML = "";
}

function renderExam(shouldResetAnswer = false) {
  const learningItems = getLearningItems();
  const { pool, entry } = getCurrentExamItem();
  const missingNotes = Math.max(0, learningItems.length - pool.length);

  if (!entry) {
    examProgress.textContent = learningItems.length
      ? `${learningItems.length} 句学习中，${missingNotes} 句还没中文句意`
      : "学习中暂无句子";
    examPrompt.textContent = learningItems.length ? "先回到句子页，给句子双点添加中文句意。" : `先添加要背的${getLearningLanguageConfig().label}句子。`;
    examAnswer.value = "";
    examAnswer.disabled = true;
    examCheckButton.disabled = true;
    examDontKnowButton.disabled = true;
    examNextButton.disabled = true;
    examFeedback.className = "exam-feedback";
    examFeedback.textContent = "";
    examAnswerPanel.classList.remove("is-open");
    examAnswerPanel.innerHTML = "";
    return;
  }

  examAnswer.disabled = false;
  examCheckButton.disabled = false;
  examDontKnowButton.disabled = false;
  examNextButton.disabled = pool.length <= 1;
  examProgress.textContent = `${currentExamPosition + 1} / ${pool.length} 题 · 学习中 ${learningItems.length} 句`;
  if (missingNotes) examProgress.textContent += ` · ${missingNotes} 句未填句意`;
  examPrompt.textContent = entry.item.note.trim();
  examAnswer.dataset.expected = entry.item.text;

  if (shouldResetAnswer) resetExamAnswer();
}

function normalizeExamText(text) {
  const clean = String(text || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (currentLearningLanguage === "japanese" || currentLearningLanguage === "korean") {
    return clean.replace(/[^\p{L}\p{N}]+/gu, "");
  }

  return clean.replace(/[^\p{L}\p{N}']+/gu, " ").replace(/\s+/g, " ").trim();
}

function getExamWords(text) {
  const clean = normalizeExamText(text);
  if (currentLearningLanguage === "japanese" || currentLearningLanguage === "korean") {
    return Array.from(clean);
  }

  return clean.match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)?/gu) || [];
}

function levenshteinDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

function isMinorWordMistake(expected, actual) {
  if (!expected || !actual) return false;
  if (expected[0] !== actual[0]) return false;

  const distance = levenshteinDistance(expected, actual);
  return distance <= 1 && Math.max(expected.length, actual.length) >= 4;
}

function compareExamWords(expectedWords, actualWords) {
  const rows = expectedWords.length + 1;
  const cols = actualWords.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));
  const back = Array.from({ length: rows }, () => Array(cols).fill(null));

  for (let i = 1; i < rows; i += 1) {
    dp[i][0] = i;
    back[i][0] = "delete";
  }
  for (let j = 1; j < cols; j += 1) {
    dp[0][j] = j;
    back[0][j] = "insert";
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const expected = expectedWords[i - 1];
      const actual = actualWords[j - 1];
      const sameCost = expected === actual ? 0 : isMinorWordMistake(expected, actual) ? 0.35 : 1;
      const options = [
        { cost: dp[i - 1][j - 1] + sameCost, op: sameCost === 0 ? "same" : sameCost < 1 ? "minor" : "replace" },
        { cost: dp[i - 1][j] + 1, op: "delete" },
        { cost: dp[i][j - 1] + 1, op: "insert" },
      ].sort((a, b) => a.cost - b.cost);
      dp[i][j] = options[0].cost;
      back[i][j] = options[0].op;
    }
  }

  const operations = [];
  let i = expectedWords.length;
  let j = actualWords.length;

  while (i > 0 || j > 0) {
    const op = back[i][j];
    if (op === "same" || op === "minor" || op === "replace") {
      operations.unshift({ op, expected: expectedWords[i - 1], actual: actualWords[j - 1] });
      i -= 1;
      j -= 1;
    } else if (op === "delete") {
      operations.unshift({ op, expected: expectedWords[i - 1], actual: "" });
      i -= 1;
    } else {
      operations.unshift({ op: "insert", expected: "", actual: actualWords[j - 1] });
      j -= 1;
    }
  }

  return { cost: dp[expectedWords.length][actualWords.length], operations };
}

function buildExamIssues(operations) {
  return operations
    .filter(({ op }) => op !== "same")
    .slice(0, 4)
    .map(({ op, expected, actual }) => {
      if (op === "minor") return `可能拼错：${actual} → ${expected}`;
      if (op === "replace") return `这里应是 ${expected}，你写成了 ${actual}`;
      if (op === "delete") return `少了 ${expected}`;
      return `多了 ${actual}`;
    });
}

function checkExamAnswer() {
  const { entry } = getCurrentExamItem();
  if (!entry) return;

  const expected = entry.item.text;
  const answer = examAnswer.value.trim();
  if (!answer) {
    examFeedback.className = "exam-feedback is-wrong";
    examFeedback.textContent = `先写一句${getLearningLanguageConfig().label}答案。`;
    return;
  }

  const expectedWords = getExamWords(expected);
  const actualWords = getExamWords(answer);
  const exactEnough = normalizeExamText(expected) === normalizeExamText(answer);
  const result = compareExamWords(expectedWords, actualWords);
  const threshold = Math.max(0.75, expectedWords.length * 0.16);
  const passed = exactEnough || result.cost <= threshold;
  const issues = buildExamIssues(result.operations);

  examFeedback.className = `exam-feedback ${passed ? "is-correct" : "is-wrong"}`;
  if (passed && !issues.length) {
    examFeedback.textContent = "通过，完全正确。";
  } else if (passed) {
    examFeedback.textContent = `通过，小错误：${issues.join("；")}。`;
  } else {
    examFeedback.textContent = `还差一点：${issues.join("；")}。`;
  }
}

function showExamAnswer() {
  const { entry } = getCurrentExamItem();
  if (!entry) return;

  examAnswerPanel.classList.add("is-open");
  examAnswerPanel.innerHTML = "";

  const label = document.createElement("p");
  label.textContent = `${getLearningLanguageConfig().label}答案`;

  const answer = document.createElement("strong");
  answer.textContent = entry.item.text;

  const answerRow = document.createElement("div");
  answerRow.className = "exam-answer-row";

  const speakAnswerButton = document.createElement("button");
  speakAnswerButton.className = "exam-answer-speak";
  speakAnswerButton.type = "button";
  speakAnswerButton.title = "朗读答案";
  speakAnswerButton.setAttribute("aria-label", "朗读答案");
  speakAnswerButton.textContent = "▶";
  speakAnswerButton.addEventListener("click", () => speak(entry.item.text, "sentence"));

  answerRow.append(answer, speakAnswerButton);
  examAnswerPanel.append(label, answerRow);
}

function nextExamQuestion() {
  const { pool } = getCurrentExamItem();
  if (!pool.length) return;

  currentExamPosition = (currentExamPosition + 1) % pool.length;
  localStorage.setItem(getLanguageStorageKey(EXAM_INDEX_KEY), String(currentExamPosition));
  renderExam(true);
  examAnswer.focus();
}

function setPage(page) {
  const wasTeacher = teacherPage.classList.contains("is-active");
  currentPage = page === "teacher" || page === "exam" || page === "friends" ? page : "sentences";
  const isTeacher = currentPage === "teacher";
  const isExam = currentPage === "exam";
  const isFriends = currentPage === "friends";

  sentencesPage.classList.toggle("is-active", !isTeacher && !isExam && !isFriends);
  examPage.classList.toggle("is-active", isExam);
  teacherPage.classList.toggle("is-active", isTeacher);
  friendsPage.classList.toggle("is-active", isFriends);
  sentencesNav.classList.toggle("is-active", !isTeacher && !isExam && !isFriends);
  examNav.classList.toggle("is-active", isExam);
  teacherNav.classList.toggle("is-active", isTeacher);
  friendsNav.classList.toggle("is-active", isFriends);
  sentencesNav.setAttribute("aria-current", !isTeacher && !isExam && !isFriends ? "page" : "false");
  examNav.setAttribute("aria-current", isExam ? "page" : "false");
  teacherNav.setAttribute("aria-current", isTeacher ? "page" : "false");
  friendsNav.setAttribute("aria-current", isFriends ? "page" : "false");
  clearButton.classList.toggle("is-hidden", isTeacher || isExam || isFriends);
  pageEyebrow.textContent = isTeacher ? (teacherFreeMode ? "Off-duty AI" : "AI Teacher") : isExam ? "Sentence Quiz" : isFriends ? "Community" : "Sentence Reader";
  pageTitle.textContent = isTeacher ? (teacherFreeMode ? "闲聊模式" : "智语导师") : isExam ? "考试" : isFriends ? "好友" : "句读";
  document.body.dataset.page = currentPage;
  localStorage.setItem(APP_PAGE_KEY, currentPage);

  if (isTeacher) {
    closeWordSheet();
    renderChatMessages();
    if (!wasTeacher) scheduleTeacherOpeningTopic();
    requestAnimationFrame(() => {
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    });
  } else {
    clearTimeout(teacherOpeningTopicTimer);
    teacherOpeningTopicTimer = 0;
  }

  if (isExam) {
    closeWordSheet();
    renderExam(true);
    examAnswer.focus();
  }

  if (isFriends) {
    closeWordSheet();
    renderFriends();
    if (authToken && Date.now() - friendsLoadedAt > 10000) loadFriends();
  }
}

function loadTeacherMessages(languageCode = currentLearningLanguage) {
  try {
    const key = getLanguageStorageKey(TEACHER_CHAT_KEY, languageCode);
    const fallback = normalizeLearningLanguage(languageCode) === "english" ? localStorage.getItem(TEACHER_CHAT_KEY) : "[]";
    const parsed = JSON.parse(localStorage.getItem(key) || fallback || "[]");
    if (Array.isArray(parsed)) {
      let freeHistoryActive = false;
      return parsed
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.text === "string")
        .map((item) => ({
          ...item,
          text: renameFreeChatText(renameTeacherText(item.text)),
          translation: normalizeTeacherTranslation(item.translation),
        }))
        .map((item) => {
          const text = item.text.trim();
          if (item.role === "user") {
            if (text === "闲聊模式") freeHistoryActive = true;
            if (text === "话题" || text.includes("日常口语句子")) freeHistoryActive = false;
            if (freeHistoryActive) item.mode = "freestyle";
          }

          if (item.role === "assistant" && (item.mode === "freestyle" || freeHistoryActive)) {
            item.mode = "freestyle";
            item.text = cleanFreestyleReply(item.text);
          }

          return item;
        })
        .filter((item) => !(item.role === "assistant" && STALE_EMPTY_AI_REPLIES.has(item.text.trim())))
        .slice(-LANGUAGE_CONVERT_MESSAGE_LIMIT);
    }
  } catch {
    // Ignore malformed chat history and start fresh.
  }

  return [];
}

function saveTeacherMessages(options = {}) {
  const cleanMessages = getCleanTeacherMessages().slice(-LANGUAGE_CONVERT_MESSAGE_LIMIT);
  saveTeacherMessagesForLanguage(currentLearningLanguage, cleanMessages);
  if (options.sync !== false) queueCloudSync();
}

function saveTeacherMessagesForLanguage(languageCode, messages) {
  const cleanMessages = getCleanTeacherMessages(messages).slice(-50);
  localStorage.setItem(getLanguageStorageKey(TEACHER_CHAT_KEY, languageCode), JSON.stringify(cleanMessages));
  if (normalizeLearningLanguage(languageCode) === "english") {
    localStorage.setItem(TEACHER_CHAT_KEY, JSON.stringify(cleanMessages));
  }
}

function normalizeTeacherTranslation(translation) {
  if (!translation) return null;

  const sentence = String(translation.sentence || "").trim();
  if (!sentence) return null;

  return {
    sentence,
    note: String(translation.note || "").trim(),
  };
}

function updateTeacherTopicUi() {
  const language = getLearningLanguageConfig();
  topicButton?.classList.toggle("is-active", teacherTopicMode);
  topicButton?.setAttribute("aria-pressed", String(teacherTopicMode));
  freeChatButton?.classList.toggle("is-active", teacherFreeMode);
  freeChatButton?.classList.toggle("is-free", teacherFreeMode);
  freeChatButton?.setAttribute("aria-pressed", String(teacherFreeMode));
  if (currentPage === "teacher") {
    pageEyebrow.textContent = teacherFreeMode ? "Off-duty AI" : "AI Teacher";
    pageTitle.textContent = teacherFreeMode ? "闲聊模式" : "智语导师";
  }
  teacherInput.placeholder = teacherFreeMode
    ? `闲聊模式 ${APP_BUILD_TAG}：可以随便聊聊，不按教学来。`
    : teacherTopicMode
      ? `正在${language.label}话题练习：可以用${language.label}回答，也可以先用中文回答...`
      : `问智语导师，比如：给我几句适合${language.sample}...`;
}

function setTeacherTopicMode(isActive) {
  teacherTopicMode = isActive;
  if (isActive) teacherFreeMode = false;
  localStorage.setItem(TEACHER_TOPIC_KEY, String(teacherTopicMode));
  localStorage.setItem(TEACHER_FREE_KEY, String(teacherFreeMode));
  updateTeacherTopicUi();
}

function setTeacherFreeMode(isActive) {
  teacherFreeMode = isActive;
  if (isActive) teacherTopicMode = false;
  localStorage.setItem(TEACHER_FREE_KEY, String(teacherFreeMode));
  localStorage.setItem(TEACHER_TOPIC_KEY, String(teacherTopicMode));
  updateTeacherTopicUi();
}

function setTeacherTeachingMode() {
  teacherTopicMode = false;
  teacherFreeMode = false;
  localStorage.setItem(TEACHER_TOPIC_KEY, "false");
  localStorage.setItem(TEACHER_FREE_KEY, "false");
  updateTeacherTopicUi();
}

function scheduleTeacherOpeningTopic() {
  clearTimeout(teacherOpeningTopicTimer);
  teacherOpeningTopicTimer = setTimeout(() => {
    teacherOpeningTopicTimer = 0;
    startTeacherOpeningTopic();
  }, authToken ? 1200 : 360);
}

function shouldStartTeacherOpeningTopic() {
  if (currentPage !== "teacher") return false;
  if (teacherFreeMode || teacherSendInFlight || teacherOpeningTopicInFlight) return false;

  const lastOpenedAt = Number(localStorage.getItem(getLanguageOpeningTopicKey()) || "0");
  if (Number.isFinite(lastOpenedAt) && Date.now() - lastOpenedAt < TEACHER_OPENING_TOPIC_COOLDOWN_MS) {
    return false;
  }

  const lastMessage = teacherMessages.filter((message) => !message.pending).at(-1);
  return lastMessage?.role !== "user";
}

function buildTeacherOpeningTopicPrompt() {
  const language = getLearningLanguageConfig();
  const prompts = [
    `请主动开启一个轻松的${language.label}日常口语话题，像真人老师刚进教室时自然开场。`,
    `请主动找一个适合今天练${language.label}口语的小话题，语气轻松一点。`,
    `请先发起一个不尴尬的聊天话题，让学生可以很容易接一句${language.label}。`,
    `请用一个年轻人也愿意聊的日常话题开场，不要像做题，目标语言是${language.label}。`,
  ];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  return [
    prompt,
    `只需要一句自然中文开场，再写“英文：”并给一句简单${language.label}问题。`,
    "不要自我回答，不要连续问两个问题，不要列表编号。",
  ].join("\n");
}

function getTeacherOpeningFallback() {
  const fallbacksByLanguage = {
    english: [
      "今天先从一个轻松话题开始吧。英文：What is one small thing that made you feel good today? 中文意思：今天有什么小事让你觉得挺开心？",
      "先聊个不费脑子的日常话题。英文：What did you eat today? 中文意思：你今天吃了什么？",
    ],
    spanish: [
      "今天先从一个轻松话题开始吧。英文：¿Qué cosa pequeña te hizo sentir bien hoy? 中文意思：今天有什么小事让你觉得挺开心？",
      "先聊个不费脑子的日常话题。英文：¿Qué comiste hoy? 中文意思：你今天吃了什么？",
    ],
    japanese: [
      "今天先从一个轻松话题开始吧。英文：今日は何を食べましたか。中文意思：你今天吃了什么？",
      "我们从一个很好接的话题开始。英文：週末は何をしたいですか。中文意思：周末你想做什么？",
    ],
    korean: [
      "今天先从一个轻松话题开始吧。英文：오늘 뭐 먹었어요? 中文意思：你今天吃了什么？",
      "我们从一个很好接的话题开始。英文：주말에 뭐 하고 싶어요? 中文意思：周末你想做什么？",
    ],
  };
  const fallbacks = fallbacksByLanguage[currentLearningLanguage] || fallbacksByLanguage.english;

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

async function startTeacherOpeningTopic() {
  if (!shouldStartTeacherOpeningTopic()) return;

  teacherOpeningTopicInFlight = true;
  teacherSendInFlight = true;
  if (teacherSendButton) teacherSendButton.disabled = true;
  localStorage.setItem(getLanguageOpeningTopicKey(), String(Date.now()));
  setTeacherTopicMode(true);

  const pendingMessage = {
    role: "assistant",
    text: "导师正在想一个轻松话题...",
    pending: true,
    mode: "topic",
  };
  teacherMessages.push(pendingMessage);
  renderChatMessages();

  try {
    const message = buildTeacherOpeningTopicPrompt();
    const history = teacherMessages
      .filter((item) => !item.pending)
      .filter((item) => item.mode !== "freestyle")
      .slice(-6)
      .map(({ role, text }) => ({ role, text }));
    const data = await requestAiTeacherStream(
      {
        mode: "topic",
        message: buildTeacherRequestMessage(message, "topic"),
        messages: history,
      },
      {
        onDelta: (_delta, text) => {
          if (!text.trim()) return;
          pendingMessage.text = text;
          scheduleChatMessagesRender();
        },
      }
    );
    const reply = compactTeacherReply(data.reply) || getTeacherOpeningFallback();
    teacherMessages = teacherMessages.filter((item) => item !== pendingMessage);
    teacherMessages.push({ role: "assistant", text: reply, mode: "topic" });
  } catch {
    teacherMessages = teacherMessages.filter((item) => item !== pendingMessage);
    teacherMessages.push({ role: "assistant", text: getTeacherOpeningFallback(), mode: "topic" });
  } finally {
    teacherOpeningTopicInFlight = false;
    teacherSendInFlight = false;
    if (teacherSendButton) teacherSendButton.disabled = false;
    saveTeacherMessages();
    renderChatMessages();
  }
}

function normalizeSuggestionLine(line) {
  return line
    .replace(/^\s*(?:[-•*]|\d+[.)、])\s*/, "")
    .replace(/^["“”]+|["“”]+$/g, "")
    .trim();
}

function cleanSuggestionNote(note) {
  return note
    .replace(/^[—–\-:：\s]+/, "")
    .replace(/[）)]$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSentenceFromLine(line) {
  const clean = normalizeSuggestionLine(line);
  const match = clean.match(/^(.+?[.!?])(?:\s*[—–]\s*|\s+-\s+|\s*[:：]\s*|\s*[（(]\s*|\s+)(.*)$/);
  if (!match) return null;

  const sentence = match[1].replace(/^["“”]+|["“”]+$/g, "").trim();
  const note = cleanSuggestionNote(match[2] || "");
  const wordCount = (sentence.match(/[A-Za-z]+/g) || []).length;
  const hasChineseNote = /[\u4e00-\u9fa5]/.test(note);

  if (wordCount < 2 || sentence.length > 180) return null;
  return { sentence, note: hasChineseNote ? note : "" };
}

function extractTeacherSentenceSuggestions(text) {
  const suggestions = [];

  text.split(/\n+/).forEach((line) => {
    const pair = extractSentenceFromLine(line);
    if (!pair) return;

    const duplicate = suggestions.some((item) => item.sentence === pair.sentence);
    if (!duplicate) suggestions.push(pair);
  });

  if (suggestions.length) return suggestions.slice(0, 6);

  extractEnglishSentences(text).forEach((sentence) => {
    if (!suggestions.some((item) => item.sentence === sentence)) {
      suggestions.push({ sentence, note: inferSuggestionNote(text, sentence) });
    }
  });

  return suggestions.slice(0, 6);
}

function renameTeacherText(text) {
  return String(text || "")
    .replace(/JJ英语老师/g, "智语英语导师")
    .replace(/JJ老师/g, "智语导师")
    .replace(/JJ 老师/g, "智语导师")
    .replace(/在线AI英语老师/g, "在线智语英语导师")
    .replace(/AI英语老师/g, "智语英语导师")
    .replace(/AI老师/g, "智语导师");
}

function renameFreeChatText(text) {
  return String(text || "").replace(/吹牛逼模式/g, "闲聊模式");
}

function compactTeacherReply(text) {
  const lines = renameFreeChatText(renameTeacherText(text))
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)、])\s*/, ""))
    .filter(Boolean);

  return lines.join(" ").replace(/\s+/g, " ").trim();
}

function cleanFreestyleReply(text) {
  const compact = compactTeacherReply(text);
  const teachingIndex = compact.search(/(?:英文|中文意思|你可以这样说)\s*[：:]/u);
  if (teachingIndex > 0) {
    return compact.slice(0, teachingIndex).trim() || compact;
  }

  return compact;
}

function buildTeacherRequestMessage(message, mode) {
  const language = getLearningLanguageConfig();
  if (mode === "freestyle") {
    return [
      `重要：这是普通中文闲聊，不是${language.label}学习任务，不是造句任务，不是翻译任务。`,
      `本轮只允许输出中文闲聊内容。除非用户明确要求，不要输出${language.label}例句、翻译、纠错、学习任务。`,
      "绝对不要输出“英文：”“中文意思：”“你可以这样说：”这些教学格式；出现这些字样就算失败。",
      `除非用户明确要求学${language.label}、翻译、造句，否则不要输出任何${language.label}句子。`,
      "你现在是一个自然、温和、正常的中文聊天 AI，像朋友一样接话。",
      "不要刻意搞笑，不要说脏话，不要夸张表演，不要阴阳怪气，不要装老师，不要讲大道理。",
      "回复中文为主，短一点，2到4句就好。可以关心用户，也可以顺着话题问一个自然的小问题。",
      `用户：${message}`,
    ].join("\n");
  }

  if (mode === "topic") {
    const isStartingTopic =
      message === "话题" ||
      /请随机找一个轻松日常话题开始聊天|找一个.*话题.*开始|开始.*话题|开启.*话题|start topic/i.test(message);
    const topicRule = isStartingTopic
      ? [
          "回复要像真人老师轻松开场。",
          `只开启一个日常话题：一句自然中文开场，然后写“英文：”并给1句简单${language.label}问题，最后写“中文意思：”给这句${language.label}的中文。`,
          `注意：“英文：”只是 App 解析标签，标签后面的内容必须是${language.label}。`,
          "不要自我回答，不要连续问两个问题，不要列表编号。",
        ].join("")
      : [
          "先判断我的意图，再决定要不要教学。不要默认进入练习题模式。",
          "如果我说累了、不想学、想唠嗑、想吐槽、想聊天、让我陪你说说话：立刻切到陪聊模式。陪聊模式只用中文，像真人朋友一样回2到3句短句，可以轻轻开玩笑或共情，最后只问一个中文小问题。陪聊模式不要输出“英文：”，不要输出“中文意思：”，不要纠错，不要给学习任务。",
          "如果我还在正常话题练习，再先接住我刚说的内容，不要重新开话题。",
          "正常话题练习里，先用一句自然中文回应我，语气像真人聊天，可以轻松一点。",
          `如果我用${language.label}回复且有明显语法、时态、拼写或表达错误，必须输出两条消息，并用 ${TEACHER_MESSAGE_BREAK} 分隔。`,
          `第一条以 ${TEACHER_CORRECTION_MARK} 开头，只纠错：一句中文说明问题，不要重复我的错误原句；然后写“英文：”给正确自然的${language.label}说法，再写“中文意思：”。`,
          "第二条继续当前话题：一句自然中文接话，然后写“英文：”只给1句相关追问，再写“中文意思：”。",
          `不要像复读一样完整翻译我的回答。只有当我的中文明显需要${language.label}表达时，才给一句更自然的${language.label}说法，并用“你可以这样说：”引出。`,
          `${language.label}部分只给1句相关追问。`,
          "固定格式：中文回应。英文：1句自然追问，必要时加一句“你可以这样说：...”。中文意思：对应中文。",
          `注意：“英文：”只是 App 解析标签，标签后面的内容必须是${language.label}。`,
          "不要每轮都说“我们来聊聊……”，不要说教，不要列表编号。",
        ].join("");

    return `${message}\n\n${topicRule}`;
  }

  const limitRule =
    `回复要非常简单，像朋友一样说话。目标学习语言是${language.label}。不要解释你的思路，不要说“先…再…最后…”。如果我让你造句，就只说“可以，下面这几句很自然：”然后写“英文：”给${language.label}句子，最后写“中文意思：”并按顺序给对应中文；如果我问中文怎么说，就说“可以这样说：”然后给${language.label}。注意：“英文：”只是 App 解析标签，标签后面的内容必须是${language.label}。`;

  return `${message}\n\n${limitRule}`;
}

function shouldTranslateUserMessage(message, mode, displayText) {
  if (displayText) return false;
  if (!/[\u4e00-\u9fff]/.test(message)) return false;
  if (/^话题$/.test(message.trim())) return false;
  return ["topic", "chat"].includes(mode);
}

function buildUserTranslationRequest(message) {
  const language = getLearningLanguageConfig();
  return [
    `请把下面这句中文口语变成1句自然${language.label}。`,
    "只输出这个格式，不要解释，不要追问：",
    "英文：",
    "中文意思：",
    `中文：${message}`,
  ].join("\n");
}

function extractUserTranslation(reply, originalText) {
  const sentence = extractTargetSentences(reply)[0] || "";
  if (!sentence) return null;

  return {
    sentence,
    note: cleanChineseMeaningText(originalText),
  };
}

function extractEnglishSentences(text) {
  const matches = String(text || "").match(/["“]?[A-Za-zÀ-ÖØ-öø-ÿ¿¡][A-Za-zÀ-ÖØ-öø-ÿ0-9’'",;:()\/\-\s—¿¡]+[.!?]["”]?/g) || [];
  const sentences = [];

  matches.forEach((match) => {
    const sentence = match
      .replace(/^["“]+|["”]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const wordCount = (sentence.match(/\p{L}+/gu) || []).length;
    if (wordCount < 2 || sentence.length > 180) return;
    if (!sentences.includes(sentence)) sentences.push(sentence);
  });

  return sentences.slice(0, 8);
}

function extractTargetSection(text) {
  const match = String(text || "").match(/(?:英文|目标语|西班牙语|日语|韩语)\s*[：:]\s*([\s\S]*?)(?=(?:中文意思|意思|翻译)\s*[：:]|$)/u);
  return match ? match[1].trim() : "";
}

function splitTargetLines(text) {
  return String(text || "")
    .split(/\n+|(?<=[.!?。！？¿؟])\s+|\s*(?:\d+[.)、]|[-•])\s*/u)
    .map((item) => item.replace(/^["“”]+|["“”]+$/g, "").trim())
    .map((item) => item.replace(/^(?:英文|目标语|西班牙语|日语|韩语)\s*[：:]\s*/u, "").trim())
    .filter((item) => item && !/^(?:中文意思|意思|翻译)\s*[：:]/u.test(item))
    .filter((item) => item.length <= 180)
    .slice(0, 8);
}

function extractTargetSentences(text) {
  const section = extractTargetSection(text);
  if (section) return splitTargetLines(section);
  if (currentLearningLanguage === "english" || currentLearningLanguage === "spanish") return extractEnglishSentences(text);
  if (currentLearningLanguage === "japanese" && !/[\u3040-\u30ff]/u.test(text)) return [];
  if (currentLearningLanguage === "korean" && !/[\uac00-\ud7af]/u.test(text)) return [];
  return splitTargetLines(text).filter((item) =>
    currentLearningLanguage === "japanese" ? /[\u3040-\u30ff]/u.test(item) : /[\uac00-\ud7af]/u.test(item)
  );
}

function inferSuggestionNote(text, sentence) {
  const sentenceIndex = text.indexOf(sentence);
  if (sentenceIndex === -1) return "";

  const before = text.slice(0, sentenceIndex);
  const after = text.slice(sentenceIndex + sentence.length);
  const dashMatch = after.match(/^\s*[—–-]\s*([^.!?。！？\n]{2,80}[。！？]?)/);
  if (dashMatch) return cleanSuggestionNote(dashMatch[1]);

  const afterMatch = after.match(/(?:意思是|中文是|翻译是|也就是|相当于|=|：|:)\s*([^。！？\n]{2,80}[。！？]?)/);
  if (afterMatch) return cleanSuggestionNote(afterMatch[1]);

  const beforeMatch = before.match(/([^。！？\n]{2,60}?)(?:可以这么说|可以说成|英文可以说|可以表达为|就可以说成)[：:\s]*$/);
  if (beforeMatch) return cleanSuggestionNote(beforeMatch[1]);

  return "";
}

function removeEnglishFromTeacherText(text, englishSentences) {
  let chinese = text;
  englishSentences.forEach((sentence) => {
    chinese = chinese.split(sentence).join(" ");
  });

  return chinese
    .replace(/(?:英文|目标语|西班牙语|日语|韩语)\s*[：:]\s*/g, "")
    .replace(/(?:这个|这句)?可以(?:这么|这样)?说(?:成|为)?\s*[：:]?\s*(?=(意思|就是|中文|$))/g, "")
    .replace(/\s*[—–-]\s*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*([，。！？；：])/g, "$1")
    .replace(/[：:]\s*([。！？]|$)/g, "$1")
    .trim();
}

function removeMeaningSection(text) {
  return String(text || "")
    .replace(/(?:中文意思|意思|翻译)\s*[：:]\s*[\s\S]*$/u, "")
    .trim();
}

function splitChineseMeanings(text) {
  return String(text || "")
    .replace(/^\s*(?:中文意思|意思|翻译)\s*[：:]\s*/u, "")
    .split(/(?:\s*[；;]\s*|\s*(?<=。|！|？)\s*|\s*\d+[.)、]\s*|\s*[-•]\s*)/u)
    .map((item) => item.replace(/^\s*(?:[-•*]|\d+[.)、])\s*/, "").trim())
    .filter((item) => /[\u4e00-\u9fa5]/.test(item))
    .map(cleanChineseMeaningText);
}

function cleanChineseMeaningText(text) {
  let clean = String(text || "").trim();
  const dashParts = clean.split(/[—–-]/).map((item) => item.trim()).filter(Boolean);
  const dashChinese = [...dashParts].reverse().find((item) => /[\u4e00-\u9fa5]/.test(item));
  if (dashChinese) clean = dashChinese;

  extractTargetSentences(clean).forEach((sentence) => {
    clean = clean.split(sentence).join(" ");
  });

  return clean
    .replace(/^[：:，,。；;\s]+/, "")
    .replace(/\s+/g, " ")
    .replace(/[。！？]*$/, "。")
    .trim();
}

function extractChineseMeanings(text, expectedCount) {
  const markerMatch = String(text || "").match(/(?:中文意思|意思|翻译)\s*[：:]\s*([\s\S]+)$/u);
  if (markerMatch) {
    const meanings = splitChineseMeanings(markerMatch[1]);
    if (meanings.length) return meanings.slice(0, expectedCount);
  }

  const beforeEnglish = String(text || "").split(/英文\s*[：:]/u)[0] || "";
  const compact = beforeEnglish
    .replace(/可以[，,]?\s*下面这几句(?:更简单)?很自然[：:]?/g, "")
    .replace(/可以[，,]?\s*这(?:样|么)说(?:就很自然)?[：:]?/g, "")
    .trim();
  const fallback = splitChineseMeanings(compact);
  return fallback.slice(Math.max(0, fallback.length - expectedCount));
}

function simplifyTeacherChinese(text, englishCount) {
  const clean = text.trim();
  if (!clean) return "";

  const soundsLikeMethod = /先|再|最后|总体感受|具体小事|写法|结构|尾/.test(clean);
  if (englishCount >= 2 && (clean.length > 42 || soundsLikeMethod)) {
    return "可以，下面这几句更简单自然。";
  }

  if (englishCount === 1 && clean.length > 70 && soundsLikeMethod) {
    return "可以，这样说就很自然。";
  }

  return clean.length > 90 ? `${clean.slice(0, 90)}...` : clean;
}

function simplifyTopicIntro(text) {
  const clean = text.trim();
  if (!clean) return "我们来聊聊这个话题吧。";

  const sentences = clean
    .split(/(?<=[。！？])\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
  const topicSentence = sentences.find((sentence) => /聊|话题|早餐|午餐|晚餐|周末|旅行|电影|音乐|工作|学习/.test(sentence));

  return topicSentence || sentences[0] || "我们来聊聊这个话题吧。";
}

function buildTeacherDisplay(text) {
  const cleanText = compactTeacherReply(text);
  const visibleText = removeMeaningSection(cleanText);
  const allEnglishSentences = extractTargetSentences(visibleText);
  let englishSentences = allEnglishSentences;
  const isTopicStarter = /我们来聊聊|聊聊|话题/.test(visibleText) && englishSentences.some((sentence) => sentence.endsWith("?"));
  if (isTopicStarter) {
    englishSentences = [englishSentences.find((sentence) => sentence.endsWith("?")) || englishSentences[0]].filter(Boolean);
  }
  const meanings = extractChineseMeanings(cleanText, englishSentences.length);
  const rawChineseText = removeEnglishFromTeacherText(visibleText, allEnglishSentences);
  const chineseText = isTopicStarter
    ? simplifyTopicIntro(rawChineseText)
    : simplifyTeacherChinese(rawChineseText, englishSentences.length);

  return {
    cleanText,
    chineseText,
    englishSentences,
    suggestions: englishSentences.map((sentence, index) => ({
      sentence,
      note: meanings[index] || inferSuggestionNote(cleanText, sentence) || "",
    })),
  };
}

function renderTeacherLinePair(container, pair) {
  const language = getLearningLanguageConfig();
  const card = document.createElement("div");
  card.className = "teacher-line-card";

  const row = document.createElement("div");
  row.className = "teacher-line-row";

  const englishButton = document.createElement("button");
  englishButton.className = "teacher-english-toggle";
  englishButton.type = "button";
  englishButton.textContent = pair.sentence;

  const speakButton = document.createElement("button");
  speakButton.className = "teacher-line-speak";
  speakButton.type = "button";
  speakButton.title = `朗读${language.label}`;
  speakButton.setAttribute("aria-label", `朗读：${pair.sentence}`);
  speakButton.textContent = "▶";

  const addButton = document.createElement("button");
  addButton.className = "teacher-line-add";
  addButton.type = "button";
  addButton.title = "加入句子";
  addButton.setAttribute("aria-label", `加入句子：${pair.sentence}`);
  addButton.textContent = "+";

  const note = document.createElement("p");
  note.className = "teacher-line-note";
  note.textContent = pair.note || "暂无中文意思";
  note.hidden = true;

  englishButton.addEventListener("click", () => {
    note.hidden = !note.hidden;
    card.classList.toggle("is-open", !note.hidden);
  });
  speakButton.addEventListener("click", (event) => {
    event.stopPropagation();
    speak(pair.sentence, "sentence");
  });
  addButton.addEventListener("click", (event) => {
    event.stopPropagation();
    addTeacherSentence(pair, addButton);
  });

  row.append(englishButton, speakButton, addButton);
  card.append(row, note);
  container.appendChild(card);
}

function splitTeacherMessageText(text) {
  return String(text || "")
    .split(TEACHER_MESSAGE_BREAK)
    .map((part) => part.replaceAll(TEACHER_CORRECTION_MARK, "").trim())
    .filter(Boolean);
}

function getChatMessageParts(message) {
  if (message.role === "assistant") {
    return splitTeacherMessageText(message.text).map((text) => ({ text, mode: message.mode, pending: message.pending }));
  }

  return [
    {
      text: message.text,
      translation: normalizeTeacherTranslation(message.translation),
      translationPending: Boolean(message.translationPending),
    },
  ];
}

function renderTeacherMessageContent(bubble, part, role) {
  const language = getLearningLanguageConfig();
  const text = part.text || "";

  if (role !== "assistant") {
    renderUserMessageContent(bubble, part);
    return;
  }

  if (part.mode === "freestyle") {
    const textEl = document.createElement("p");
    textEl.className = "chat-text teacher-chinese-text";
    textEl.textContent = part.pending ? text : cleanFreestyleReply(text);
    bubble.appendChild(textEl);
    return;
  }

  const display = buildTeacherDisplay(text);

  if (display.chineseText || !display.englishSentences.length) {
    const textEl = document.createElement("p");
    textEl.className = "chat-text teacher-chinese-text";
    textEl.textContent = display.chineseText || display.cleanText;
    bubble.appendChild(textEl);
  }

  if (display.englishSentences.length) {
    const englishBlock = document.createElement("div");
    englishBlock.className = "teacher-english-block";
    display.suggestions.forEach((suggestion) => {
      const item = document.createElement("div");
      item.className = "teacher-english-item";

      const sentenceButton = document.createElement("button");
      sentenceButton.className = "teacher-english-sentence";
      sentenceButton.type = "button";
      sentenceButton.textContent = suggestion.sentence;

      const meaning = document.createElement("p");
      meaning.className = "teacher-sentence-meaning";
      meaning.textContent = suggestion.note || "中文意思待补充。";
      meaning.hidden = true;

      sentenceButton.addEventListener("click", () => {
        meaning.hidden = !meaning.hidden;
        item.classList.toggle("is-open", !meaning.hidden);
      });

      item.append(sentenceButton, meaning);
      englishBlock.appendChild(item);
    });
    bubble.appendChild(englishBlock);
  }

  if (!display.suggestions.length) return;

  const actions = document.createElement("div");
  actions.className = "teacher-inline-actions";

  const speakButton = document.createElement("button");
  speakButton.className = "teacher-line-speak";
  speakButton.type = "button";
  speakButton.title = `朗读${language.label}`;
  speakButton.setAttribute("aria-label", `朗读${language.label}`);
  speakButton.textContent = "▶";

  const addButton = document.createElement("button");
  addButton.className = "teacher-line-add";
  addButton.type = "button";
  addButton.title = "选择要加入的句子";
  addButton.setAttribute("aria-label", "选择要加入的句子");
  addButton.textContent = "+";

  const picker = document.createElement("div");
  picker.className = "teacher-sentence-picker";
  picker.hidden = true;

  const pickerTitle = document.createElement("p");
  pickerTitle.className = "teacher-picker-title";
  pickerTitle.textContent = "选择要加入的句子";
  picker.appendChild(pickerTitle);

  display.suggestions.forEach((suggestion) => {
    const option = document.createElement("button");
    option.className = "teacher-picker-option";
    option.type = "button";

    const english = document.createElement("span");
    english.textContent = suggestion.sentence;
    option.appendChild(english);

    if (suggestion.note) {
      const note = document.createElement("small");
      note.textContent = suggestion.note;
      option.appendChild(note);
    }

    option.addEventListener("click", (event) => {
      event.stopPropagation();
      addTeacherSentence(suggestion, option);
    });

    picker.appendChild(option);
  });

  speakButton.addEventListener("click", (event) => {
    event.stopPropagation();
    speak(display.englishSentences.join(" "), "sentence");
  });
  addButton.addEventListener("click", (event) => {
    event.stopPropagation();
    picker.hidden = !picker.hidden;
    addButton.classList.toggle("is-open", !picker.hidden);
    if (!picker.hidden) revealTeacherPicker(picker);
  });

  actions.append(speakButton, addButton);
  bubble.appendChild(actions);
  bubble.appendChild(picker);
}

function renderUserMessageContent(bubble, part) {
  const language = getLearningLanguageConfig();
  const translation = normalizeTeacherTranslation(part.translation);
  const translationPending = Boolean(part.translationPending && !translation);

  if (!translation && !translationPending) {
    const textEl = document.createElement("p");
    textEl.className = "chat-text";
    textEl.textContent = part.text || "";
    bubble.appendChild(textEl);
    return;
  }

  const card = document.createElement("div");
  card.className = "user-translation-card";

  const chineseButton = document.createElement("button");
  chineseButton.className = "user-chinese-toggle";
  chineseButton.type = "button";
  chineseButton.textContent = part.text || "";
  chineseButton.setAttribute("aria-label", `查看${language.label}表达`);

  const panel = document.createElement("div");
  panel.className = "user-translation-panel";
  panel.hidden = true;

  const english = document.createElement("p");
  english.className = "user-translation-english";
  if (translationPending) english.classList.add("is-pending");
  english.textContent = translationPending ? `正在生成${language.label}表达...` : translation.sentence;

  if (translationPending) {
    panel.classList.add("is-pending");
    panel.appendChild(english);
    card.append(chineseButton, panel);
    bubble.appendChild(card);
    return;
  }

  const speakButton = document.createElement("button");
  speakButton.className = "teacher-line-speak";
  speakButton.type = "button";
  speakButton.title = `朗读${language.label}`;
  speakButton.setAttribute("aria-label", `朗读：${translation.sentence}`);
  speakButton.textContent = "▶";
  speakButton.addEventListener("click", (event) => {
    event.stopPropagation();
    speak(translation.sentence, "sentence");
  });

  const addButton = document.createElement("button");
  addButton.className = "teacher-line-add";
  addButton.type = "button";
  addButton.title = "加入句子";
  addButton.setAttribute("aria-label", `加入句子：${translation.sentence}`);
  addButton.textContent = "+";
  addButton.addEventListener("click", (event) => {
    event.stopPropagation();
    addTeacherSentence(translation, addButton);
  });

  chineseButton.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    card.classList.toggle("is-open", !panel.hidden);
  });

  panel.append(english, speakButton, addButton);
  card.append(chineseButton, panel);
  bubble.appendChild(card);
}

function addTeacherSentence(suggestion, button) {
  savedSentences = [
    {
      text: suggestion.sentence,
      note: suggestion.note || "",
      learned: false,
      learnedAt: null,
      aiExplanation: "",
    },
    ...savedSentences,
  ];
  saveSentences();
  render();

  if (button) {
    button.textContent = button.classList.contains("teacher-line-add") ? "✓" : "已加入";
    button.title = "已加入句子";
    button.setAttribute("aria-label", "已加入句子");
    button.disabled = true;
  }
}

function revealTeacherPicker(picker) {
  document.querySelectorAll(".teacher-sentence-picker").forEach((item) => {
    if (item === picker) return;

    item.hidden = true;
    item.parentElement?.querySelector(".teacher-line-add.is-open")?.classList.remove("is-open");
  });

  requestAnimationFrame(() => {
    const pickerRect = picker.getBoundingClientRect();
    const chatRect = chatMessagesEl.getBoundingClientRect();
    const overflow = pickerRect.bottom - chatRect.bottom + 44;

    if (overflow > 0) {
      chatMessagesEl.scrollTop += overflow;
      return;
    }

    picker.scrollIntoView({ block: "nearest" });
  });
}

function renderChatMessages() {
  chatMessagesEl.innerHTML = "";

  if (!teacherMessages.length) {
    teacherMessages = [
      {
        role: "assistant",
        text: getTeacherIntroText(),
      },
    ];
  }

  teacherMessages.forEach((message) => {
    getChatMessageParts(message).forEach((part, partIndex) => {
      const bubble = document.createElement("article");
      bubble.className = `chat-bubble ${message.role === "user" ? "is-user" : "is-teacher"}`;
      if (partIndex > 0) bubble.classList.add("is-continuation");

      const label = document.createElement("p");
      label.className = "chat-label";
      label.textContent = message.role === "user" ? "你" : message.mode === "freestyle" ? "闲聊AI" : "智语导师";

      bubble.appendChild(label);
      renderTeacherMessageContent(bubble, { ...part, text: renameTeacherText(part.text), mode: message.mode }, message.role);

      chatMessagesEl.appendChild(bubble);
    });
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

async function sendTeacherMessage(prompt, modeOverride = "", displayText = "") {
  const message = (prompt || teacherInput.value).trim();
  if (!message) {
    teacherInput.focus();
    return;
  }

  const mode = modeOverride || (teacherFreeMode ? "freestyle" : teacherTopicMode ? "topic" : "chat");
  const now = Date.now();
  const sendSignature = [mode, message, displayText || ""].join("\n");
  const recentDuplicate = sendSignature === lastTeacherSendSignature && now - lastTeacherSendAt < 8000;
  if (teacherSendInFlight || recentDuplicate) return;

  teacherSendInFlight = true;
  lastTeacherSendSignature = sendSignature;
  lastTeacherSendAt = now;
  const userMessage = { role: "user", text: (displayText || message).trim() };
  if (mode === "freestyle") userMessage.mode = mode;
  const shouldTranslateMessage = shouldTranslateUserMessage(message, mode, displayText);
  if (shouldTranslateMessage) userMessage.translationPending = true;
  const translationPromise = shouldTranslateMessage
    ? requestAiTeacher({ mode: "chat", message: buildUserTranslationRequest(message), messages: [] })
        .then((translationData) => extractUserTranslation(translationData.reply || "", userMessage.text))
        .then((translation) => {
          userMessage.translationPending = false;
          if (translation) userMessage.translation = translation;
          saveTeacherMessages();
          scheduleChatMessagesRender();
          return translation;
        })
        .catch(() => {
          userMessage.translationPending = false;
          saveTeacherMessages();
          scheduleChatMessagesRender();
          return null;
        })
    : Promise.resolve(null);

  const pendingMessage = {
    role: "assistant",
    text: mode === "freestyle" ? "闲聊AI正在回复..." : "导师正在打字...",
    pending: true,
    mode,
  };
  teacherMessages.push(userMessage);
  teacherMessages.push(pendingMessage);
  teacherInput.value = "";
  if (teacherSendButton) teacherSendButton.disabled = true;
  renderChatMessages();

  try {
    const historySource = teacherMessages
      .filter((item) => !item.pending)
      .filter((item) => (mode === "freestyle" ? item.mode === "freestyle" : item.mode !== "freestyle"));
    const history = historySource
      .slice(-10)
      .map(({ role, text }) => ({ role, text }));
    const data = await requestAiTeacherStream(
      {
        mode,
      message: buildTeacherRequestMessage(message, mode),
      messages: history,
      },
      {
        onDelta: (_delta, text) => {
          if (!text.trim()) return;
          pendingMessage.text = text;
          scheduleChatMessagesRender();
        },
      }
    );
    const reply = mode === "freestyle" ? cleanFreestyleReply(data.reply) : compactTeacherReply(data.reply);
    if (!reply) {
      throw new Error("智语导师连上了线上接口，但这次没有拿到回复内容。请再试一次。");
    }
    teacherMessages = teacherMessages.filter((item) => !item.pending);
    teacherMessages.push({ role: "assistant", text: reply, mode });
  } catch (error) {
    teacherMessages = teacherMessages.filter((item) => !item.pending);
    teacherMessages.push({
      role: "assistant",
      text:
        mode === "freestyle"
          ? "刚才连接有点卡，你接着说，我继续陪你聊。"
          : renameTeacherText(error.message || "智语导师暂时连接不上。等在线AI服务配置好后，这里就能聊天。"),
      mode,
    });
  } finally {
    teacherSendInFlight = false;
    if (teacherSendButton) teacherSendButton.disabled = false;
    saveTeacherMessages();
    renderChatMessages();
  }
}

function startTopicPractice() {
  setTeacherTopicMode(true);
  const language = getLearningLanguageConfig();
  sendTeacherMessage(
    `请随机找一个轻松日常话题开始聊天。只需要一句中文介绍话题，再给一句${language.label}问题。不要自我回答，不要再问第二个问题。`,
    "topic",
    "话题"
  );
}

function startFreeChatMode() {
  const recentFreeModeEntry = teacherMessages
    .slice(-2)
    .some((message) => message.role === "user" && renameFreeChatText(message.text) === "闲聊模式");
  if (teacherFreeMode && recentFreeModeEntry) {
    return;
  }

  setTeacherFreeMode(true);
  teacherMessages.push({ role: "user", text: "闲聊模式", mode: "freestyle" });
  teacherMessages.push({
    role: "assistant",
    text: `好，已经切到闲聊模式了。这里不用练${getLearningLanguageConfig().label}，你想随便聊点什么都可以。`,
    mode: "freestyle",
  });
  saveTeacherMessages();
  renderChatMessages();
}

input.addEventListener("input", () => {
  localStorage.setItem(DRAFT_KEY, input.value);
});
input.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    addSentences();
  }
});
addButton.addEventListener("click", addSentences);
clearButton.addEventListener("click", () => {
  input.value = "";
  localStorage.setItem(DRAFT_KEY, "");
  closeWordSheet();
  input.focus();
});
wordSpeakButton.addEventListener("click", () => {
  if (currentWord) speak(currentWord, "word");
});
closeSheetButton?.addEventListener("click", closeWordSheet);
updateNowButton?.addEventListener("click", openUpdateDownload);
updateLaterButton?.addEventListener("click", () => hideUpdateSheet(true));
accountButton?.addEventListener("click", () => showAuthSheet(authUser ? "account" : "login"));
authAvatarButton?.addEventListener("click", () => authAvatarFile?.click());
authAvatarFile?.addEventListener("change", () => {
  handleAvatarChange(authAvatarFile.files?.[0]);
  authAvatarFile.value = "";
});
authSubmitButton?.addEventListener("click", submitAuth);
editProfileButton?.addEventListener("click", () => setProfileEditing(profileEditor?.hidden !== false));
saveProfileButton?.addEventListener("click", saveProfile);
refreshFriendsButton?.addEventListener("click", () => loadFriends(true));
authModeButton?.addEventListener("click", () => {
  if (authMode === "account") {
    pullCloudDataAndMerge();
    return;
  }

  setAuthMode(authMode === "register" ? "login" : "register");
});
authLogoutButton?.addEventListener("click", logoutAuth);
authCancelButton?.addEventListener("click", hideAuthSheet);
authSheet?.addEventListener("click", (event) => {
  if (event.target === authSheet) hideAuthSheet();
});
document.addEventListener("pointerdown", (event) => {
  if (!wordSheet.classList.contains("is-open")) return;
  if (event.target.closest("#wordSheet, .word-token")) return;

  closeWordSheet();
});
learningTab.addEventListener("click", () => setCurrentView("learning"));
learnedTab.addEventListener("click", () => setCurrentView("learned"));
speedSlider.addEventListener("input", updateSpeedLabel);
sentencesNav.addEventListener("click", () => setPage("sentences"));
examNav.addEventListener("click", () => setPage("exam"));
teacherNav.addEventListener("click", () => setPage("teacher"));
friendsNav.addEventListener("click", () => setPage("friends"));
examCheckButton.addEventListener("click", checkExamAnswer);
examDontKnowButton.addEventListener("click", showExamAnswer);
examNextButton.addEventListener("click", nextExamQuestion);
examAnswer.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    checkExamAnswer();
  }
});
teacherSendButton?.addEventListener("click", () => sendTeacherMessage());
teacherInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    sendTeacherMessage();
  }
});
document.querySelectorAll(".quick-prompts button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.topic === "start") {
      startTopicPractice();
      return;
    }

    if (button.dataset.freeChat === "start") {
      startFreeChatMode();
      return;
    }

    setTeacherTeachingMode();
    sendTeacherMessage(button.dataset.prompt || "");
  });
});

loadAuthSession();
currentLearningLanguage = normalizeLearningLanguage(localStorage.getItem(LEARNING_LANGUAGE_KEY) || authUser?.learningLanguage || "english");
localStorage.setItem(LEARNING_LANGUAGE_KEY, currentLearningLanguage);
savedSentences = loadSavedSentences();
teacherMessages = loadTeacherMessages();
migrateOldTextStorage();
input.value = localStorage.getItem(DRAFT_KEY) || "";
speedSlider.value = localStorage.getItem(SPEED_KEY) || "1";
teacherTopicMode = localStorage.getItem(TEACHER_TOPIC_KEY) === "true";
teacherFreeMode = localStorage.getItem(TEACHER_FREE_KEY) === "true";
if (teacherFreeMode) teacherTopicMode = false;
currentView = localStorage.getItem(VIEW_KEY) === "learned" ? "learned" : "learning";
currentExamPosition = Number(localStorage.getItem(getLanguageStorageKey(EXAM_INDEX_KEY)) || localStorage.getItem(EXAM_INDEX_KEY) || "0") || 0;
currentPage = ["teacher", "exam", "friends"].includes(localStorage.getItem(APP_PAGE_KEY))
  ? localStorage.getItem(APP_PAGE_KEY)
  : "sentences";
updateSpeedLabel();
updateLanguageUi();
updateTeacherTopicUi();
updateAuthUi();
render();
renderChatMessages();
setPage(currentPage);
if (authToken) setTimeout(pullCloudDataAndMerge, 700);
setTimeout(checkForAppUpdate, 900);
