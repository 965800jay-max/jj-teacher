const input = document.querySelector("#sentenceInput");
const list = document.querySelector("#sentenceList");
const count = document.querySelector("#sentenceCount");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = emptyState.querySelector("h2");
const emptyCopy = emptyState.querySelector("p");
const pageEyebrow = document.querySelector("#pageEyebrow");
const pageTitle = document.querySelector("#pageTitle");
const sentencesPage = document.querySelector("#sentencesPage");
const examPage = document.querySelector("#examPage");
const teacherPage = document.querySelector("#teacherPage");
const inputPanel = document.querySelector(".input-panel");
const addButton = document.querySelector("#addButton");
const clearButton = document.querySelector("#clearButton");
const learningTab = document.querySelector("#learningTab");
const learnedTab = document.querySelector("#learnedTab");
const sentencesNav = document.querySelector("#sentencesNav");
const examNav = document.querySelector("#examNav");
const teacherNav = document.querySelector("#teacherNav");
const speedSlider = document.querySelector("#speedSlider");
const speedValue = document.querySelector("#speedValue");
const wordSheet = document.querySelector("#wordSheet");
const selectedWord = document.querySelector("#selectedWord");
const phoneticText = document.querySelector("#phoneticText");
const meaningText = document.querySelector("#meaningText");
const wordSpeakButton = document.querySelector("#wordSpeakButton");
const closeSheetButton = document.querySelector("#closeSheetButton");
const chatMessagesEl = document.querySelector("#chatMessages");
const teacherInput = document.querySelector("#teacherInput");
const teacherSendButton = document.querySelector("#teacherSendButton");
const topicButton = document.querySelector("#topicButton");
const examProgress = document.querySelector("#examProgress");
const examPrompt = document.querySelector("#examPrompt");
const examAnswer = document.querySelector("#examAnswer");
const examCheckButton = document.querySelector("#examCheckButton");
const examDontKnowButton = document.querySelector("#examDontKnowButton");
const examNextButton = document.querySelector("#examNextButton");
const examFeedback = document.querySelector("#examFeedback");
const examAnswerPanel = document.querySelector("#examAnswerPanel");
const barrageLayer = document.querySelector("#barrageLayer");

const STORAGE_KEY = "sentence-reader-text";
const DRAFT_KEY = "sentence-reader-draft";
const SENTENCES_KEY = "sentence-reader-sentences";
const SPEED_KEY = "sentence-reader-speed";
const VIEW_KEY = "sentence-reader-view";
const APP_PAGE_KEY = "sentence-reader-page";
const TEACHER_CHAT_KEY = "sentence-reader-ai-chat";
const TEACHER_TOPIC_KEY = "sentence-reader-topic-mode";
const EXAM_INDEX_KEY = "sentence-reader-exam-index";
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
let currentView = "learning";
let currentPage = "sentences";
let currentExamPosition = 0;

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

    const cacheKey = `${mode}:${chunk}`;
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
      body: JSON.stringify({ text, mode }),
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
    tl: "en-US",
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
  const phrase = mode === "sentence" ? softenForCasualSpeech(text) : text;

  try {
    await fetchOnlineSpeech(phrase, mode);
  } catch {
    if (mode === "word" && !meaningText.textContent.includes("联网语音暂时不可用")) {
      meaningText.textContent = `${meaningText.textContent}（联网语音暂时不可用）`;
    }
  }
}

function loadSavedSentences() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SENTENCES_KEY) || "[]");
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
  saveSentences();
  localStorage.removeItem(STORAGE_KEY);
}

function saveSentences() {
  localStorage.setItem(SENTENCES_KEY, JSON.stringify(savedSentences));
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
    throw new Error("JJ老师还没连接在线AI服务。APK需要配置一个手机能访问的后端地址。");
  }

  return "/api/ai-teacher";
}

async function requestAiTeacher(payload) {
  const endpoint = getAiEndpoint();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => {
    throw new Error(`JJ老师接口没有返回JSON内容：${endpoint}`);
  });
  if (!response.ok) {
    throw new Error(renameTeacherText(data.message || data.error || "JJ老师暂时连接不上"));
  }

  if (!String(data.reply || "").trim()) {
    throw new Error("JJ老师接口连上了，但没有返回内容。请检查后端 OpenAI 配置。");
  }

  return data;
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
      button.textContent = "查看JJ讲解";
      return;
    }

    openAiIndex = index;
    renderAiText(container, savedSentences[index].aiExplanation);
    button.textContent = "收起JJ讲解";
    return;
  }

  openAiIndex = index;
  button.disabled = true;
  button.textContent = "思考中";
  renderAiMessage(container, "JJ老师正在看这句话...");

  try {
    const data = await requestAiTeacher({ mode: "explain", sentence });
    const explanation = data.reply || "";
    updateSentenceAiExplanation(index, explanation);
    renderAiText(container, explanation);
  } catch (error) {
    renderAiMessage(container, renameTeacherText(error.message || "JJ老师暂时连接不上"));
  } finally {
    button.disabled = false;
    button.textContent = openAiIndex === index ? "收起JJ讲解" : "问JJ老师";
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
  emptyCopy.textContent = isLearnedView ? "学会的句子会放在这里。" : "整句点右侧按钮，单词直接点英文。";
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
      if (/^[A-Za-z]+(?:'[A-Za-z]+)?$/.test(token)) {
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
    note.placeholder = "添加句意...";
    note.value = item.note;
    note.setAttribute("aria-label", `添加句意：${sentence}`);
    note.addEventListener("input", () => updateSentenceNote(index, note.value));
    attachDoubleTapToEdit(note);

    const aiTools = document.createElement("div");
    aiTools.className = "sentence-ai-tools";

    const aiButton = document.createElement("button");
    aiButton.className = "ai-button";
    aiButton.type = "button";
    aiButton.textContent = openAiIndex === index && item.aiExplanation ? "收起JJ讲解" : item.aiExplanation ? "查看JJ讲解" : "问JJ老师";

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
    examPrompt.textContent = learningItems.length ? "先回到句子页，给句子双点添加中文句意。" : "先添加要背的英文句子。";
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
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getExamWords(text) {
  return normalizeExamText(text).match(/[a-z0-9]+(?:'[a-z0-9]+)?/g) || [];
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
    examFeedback.textContent = "先写一句英文答案。";
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
  label.textContent = "英文答案";

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

function runBarrageBeforeAnswer() {
  barrageLayer.innerHTML = "";
  barrageLayer.classList.add("is-active");

  const phrases = [
    "有笨蛋",
    "你个傻逼",
    "这都不会",
    "答案逃跑了",
    "脑袋短路中",
    "今日份投降",
    "英文离家出走",
    "救命我忘了",
    "再背一遍吧",
    "小脑袋冒烟",
    "记忆加载失败",
    "先欠着这题",
    "老师笑而不语",
    "别看答案啊",
    "但是可以原谅",
    "大笨比上线",
    "你是真不会啊",
    "背了个寂寞",
    "这都能忘？",
    "别装了你不会",
    "脑袋离线中",
    "今天脑子不营业",
    "答案都看不下去了",
    "英文被你气笑了",
    "这把丢人了",
    "别挣扎了",
    "尊严暂时掉线",
    "你又摆烂",
    "给我重新背",
    "罚你再读三遍",
    "你在写天书吗",
    "这波很抽象",
    "不会就说不会",
    "手比脑子快",
    "记忆已关机",
    "小废物模式启动",
    "老师开始沉默",
    "答案就在旁边啊",
    "这题不该跪",
    "你怎么敢忘",
    "离谱但真实",
    "别急先挨骂",
    "下次不许不会",
  ];

  for (let i = 0; i < 36; i += 1) {
    const item = document.createElement("span");
    item.className = "barrage-item";
    item.textContent = phrases[i % phrases.length];
    item.style.top = `${8 + (i * 11) % 78}%`;
    item.style.animationDelay = `${i * 58}ms`;
    item.style.fontSize = `${18 + (i % 5) * 2}px`;
    barrageLayer.appendChild(item);
  }

  setTimeout(() => {
    barrageLayer.classList.remove("is-active");
    barrageLayer.innerHTML = "";
    showExamAnswer();
  }, 1900);
}

function nextExamQuestion() {
  const { pool } = getCurrentExamItem();
  if (!pool.length) return;

  currentExamPosition = (currentExamPosition + 1) % pool.length;
  localStorage.setItem(EXAM_INDEX_KEY, String(currentExamPosition));
  renderExam(true);
  examAnswer.focus();
}

function setPage(page) {
  currentPage = page === "teacher" || page === "exam" ? page : "sentences";
  const isTeacher = currentPage === "teacher";
  const isExam = currentPage === "exam";

  sentencesPage.classList.toggle("is-active", !isTeacher && !isExam);
  examPage.classList.toggle("is-active", isExam);
  teacherPage.classList.toggle("is-active", isTeacher);
  sentencesNav.classList.toggle("is-active", !isTeacher && !isExam);
  examNav.classList.toggle("is-active", isExam);
  teacherNav.classList.toggle("is-active", isTeacher);
  sentencesNav.setAttribute("aria-current", !isTeacher && !isExam ? "page" : "false");
  examNav.setAttribute("aria-current", isExam ? "page" : "false");
  teacherNav.setAttribute("aria-current", isTeacher ? "page" : "false");
  clearButton.classList.toggle("is-hidden", isTeacher || isExam);
  pageEyebrow.textContent = isTeacher ? "AI Teacher" : isExam ? "Sentence Quiz" : "Sentence Reader";
  pageTitle.textContent = isTeacher ? "JJ老师" : isExam ? "考试" : "句读";
  document.body.dataset.page = currentPage;
  localStorage.setItem(APP_PAGE_KEY, currentPage);

  if (isTeacher) {
    closeWordSheet();
    renderChatMessages();
    requestAnimationFrame(() => {
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    });
    teacherInput.focus();
  }

  if (isExam) {
    closeWordSheet();
    renderExam(true);
    examAnswer.focus();
  }
}

function loadTeacherMessages() {
  try {
    const parsed = JSON.parse(localStorage.getItem(TEACHER_CHAT_KEY) || "[]");
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.text === "string")
        .map((item) => ({ ...item, text: renameTeacherText(item.text) }))
        .slice(-24);
    }
  } catch {
    // Ignore malformed chat history and start fresh.
  }

  return [];
}

function saveTeacherMessages() {
  const cleanMessages = teacherMessages
    .filter((message) => !message.pending)
    .map(({ role, text }) => ({ role, text }))
    .slice(-24);
  localStorage.setItem(TEACHER_CHAT_KEY, JSON.stringify(cleanMessages));
}

function updateTeacherTopicUi() {
  topicButton?.classList.toggle("is-active", teacherTopicMode);
  topicButton?.setAttribute("aria-pressed", String(teacherTopicMode));
  teacherInput.placeholder = teacherTopicMode
    ? "正在话题练习：可以用英文回答，也可以先用中文回答..."
    : "问JJ老师，比如：给我几句适合旅行时使用的英文句子...";
}

function setTeacherTopicMode(isActive) {
  teacherTopicMode = isActive;
  localStorage.setItem(TEACHER_TOPIC_KEY, String(teacherTopicMode));
  updateTeacherTopicUi();
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
    .replace(/在线AI英语老师/g, "在线JJ英语老师")
    .replace(/AI英语老师/g, "JJ英语老师")
    .replace(/AI老师/g, "JJ老师");
}

function compactTeacherReply(text) {
  const lines = renameTeacherText(text)
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)、])\s*/, ""))
    .filter(Boolean);

  return lines.join(" ").replace(/\s+/g, " ").trim();
}

function buildTeacherRequestMessage(message, mode) {
  const limitRule =
    mode === "topic"
      ? "回复要非常简单。只开启一个话题：先用一句中文说“我们来聊聊……吧。”，然后写“英文：”并只给1句英文问题，最后写“中文意思：”给这句英文的中文。不要自我回答，不要第二个问题，不要给例句。"
      : "回复要非常简单，像朋友一样说话。不要解释你的思路，不要说“先…再…最后…”。如果我让你造句，就只说“可以，下面这几句很自然：”然后写“英文：”给句子，最后写“中文意思：”并按英文顺序给对应中文；如果我问中文怎么说，就说“可以这样说：”然后给英文。";

  return `${message}\n\n${limitRule}`;
}

function extractEnglishSentences(text) {
  const matches = String(text || "").match(/["“]?[A-Za-z][A-Za-z0-9’'",;:()\/\-\s—]+[.!?]["”]?/g) || [];
  const sentences = [];

  matches.forEach((match) => {
    const sentence = match
      .replace(/^["“]+|["”]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const wordCount = (sentence.match(/[A-Za-z]+/g) || []).length;
    if (wordCount < 2 || sentence.length > 180) return;
    if (!sentences.includes(sentence)) sentences.push(sentence);
  });

  return sentences.slice(0, 8);
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
    .replace(/英文\s*[：:]\s*/g, "")
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

  extractEnglishSentences(clean).forEach((sentence) => {
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
  const allEnglishSentences = extractEnglishSentences(visibleText);
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
  speakButton.title = "朗读英文";
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

function getChatMessageParts(message) {
  return [{ text: message.text }];
}

function renderTeacherMessageContent(bubble, part, role) {
  const text = part.text || "";

  if (role !== "assistant") {
    const textEl = document.createElement("p");
    textEl.className = "chat-text";
    textEl.textContent = text;
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
  speakButton.title = "朗读英文";
  speakButton.setAttribute("aria-label", "朗读英文");
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
        text: "我是你的JJ英语老师。你可以让我给你新句子、解释表达、改写成更口语的说法，或者帮你做背诵练习。",
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
      label.textContent = message.role === "user" ? "你" : "JJ老师";

      bubble.appendChild(label);
      renderTeacherMessageContent(bubble, { ...part, text: renameTeacherText(part.text) }, message.role);

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

  const mode = modeOverride || (teacherTopicMode ? "topic" : "chat");
  teacherMessages.push({ role: "user", text: (displayText || message).trim() });
  teacherMessages.push({ role: "assistant", text: "JJ正在思考...", pending: true });
  teacherInput.value = "";
  if (teacherSendButton) teacherSendButton.disabled = true;
  renderChatMessages();

  try {
    const history = teacherMessages
      .filter((item) => !item.pending)
      .slice(-10)
      .map(({ role, text }) => ({ role, text }));
    const data = await requestAiTeacher({ mode, message: buildTeacherRequestMessage(message, mode), messages: history });
    teacherMessages = teacherMessages.filter((item) => !item.pending);
    teacherMessages.push({ role: "assistant", text: compactTeacherReply(data.reply || "我暂时没有生成内容。") });
  } catch (error) {
    teacherMessages = teacherMessages.filter((item) => !item.pending);
    teacherMessages.push({
      role: "assistant",
      text: renameTeacherText(error.message || "JJ老师暂时连接不上。等在线AI服务配置好后，这里就能聊天。"),
    });
  } finally {
    if (teacherSendButton) teacherSendButton.disabled = false;
    saveTeacherMessages();
    renderChatMessages();
    teacherInput.focus();
  }
}

function startTopicPractice() {
  setTeacherTopicMode(true);
  sendTeacherMessage(
    "请随机找一个轻松日常话题开始聊天。只需要一句中文介绍话题，再给一句英文问题。不要自我回答，不要再问第二个问题。",
    "topic",
    "话题"
  );
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
examCheckButton.addEventListener("click", checkExamAnswer);
examDontKnowButton.addEventListener("click", runBarrageBeforeAnswer);
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

    setTeacherTopicMode(false);
    sendTeacherMessage(button.dataset.prompt || "");
  });
});

savedSentences = loadSavedSentences();
teacherMessages = loadTeacherMessages();
migrateOldTextStorage();
input.value = localStorage.getItem(DRAFT_KEY) || "";
speedSlider.value = localStorage.getItem(SPEED_KEY) || "1";
teacherTopicMode = localStorage.getItem(TEACHER_TOPIC_KEY) === "true";
currentView = localStorage.getItem(VIEW_KEY) === "learned" ? "learned" : "learning";
currentExamPosition = Number(localStorage.getItem(EXAM_INDEX_KEY) || "0") || 0;
currentPage = ["teacher", "exam"].includes(localStorage.getItem(APP_PAGE_KEY))
  ? localStorage.getItem(APP_PAGE_KEY)
  : "sentences";
updateSpeedLabel();
updateTeacherTopicUi();
render();
renderChatMessages();
setPage(currentPage);
