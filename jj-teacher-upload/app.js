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
const scenesPage = document.querySelector("#scenesPage");
const teacherPage = document.querySelector("#teacherPage");
const friendsPage = document.querySelector("#friendsPage");
const inputPanel = document.querySelector(".input-panel");
const addButton = document.querySelector("#addButton");
const clearButton = document.querySelector("#clearButton");
const learningTab = document.querySelector("#learningTab");
const learnedTab = document.querySelector("#learnedTab");
const reviewButton = document.querySelector("#reviewButton");
const sentencesNav = document.querySelector("#sentencesNav");
const scenesNav = document.querySelector("#scenesNav");
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
const adminPanel = document.querySelector("#adminPanel");
const adminUserList = document.querySelector("#adminUserList");
const adminRefreshButton = document.querySelector("#adminRefreshButton");
const adminMessageTitle = document.querySelector("#adminMessageTitle");
const adminMessageBody = document.querySelector("#adminMessageBody");
const adminSendAllButton = document.querySelector("#adminSendAllButton");
const adminBanValue = document.querySelector("#adminBanValue");
const adminBanUnit = document.querySelector("#adminBanUnit");
const adminMessageSheet = document.querySelector("#adminMessageSheet");
const adminMessageSheetTitle = document.querySelector("#adminMessageSheetTitle");
const adminMessageSheetBody = document.querySelector("#adminMessageSheetBody");
const adminMessageCloseButton = document.querySelector("#adminMessageCloseButton");
const chatMessagesEl = document.querySelector("#chatMessages");
const teacherInput = document.querySelector("#teacherInput");
const teacherSendButton = document.querySelector("#teacherSendButton");
const teacherVoiceButton = document.querySelector("#teacherVoiceButton");
const topicButton = document.querySelector("#topicButton");
const freeChatButton = document.querySelector("#freeChatButton");
const voicePip = document.querySelector("#voicePip");
const voicePipTitle = document.querySelector("#voicePipTitle");
const voicePipStatus = document.querySelector("#voicePipStatus");
const voicePipQuestion = document.querySelector("#voicePipQuestion");
const voicePipAnswer = document.querySelector("#voicePipAnswer");
const voicePipCloseButton = document.querySelector("#voicePipCloseButton");
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
const sceneModeTabs = document.querySelector("#sceneModeTabs");
const sceneGroupTabs = document.querySelector("#sceneGroupTabs");
const sceneList = document.querySelector("#sceneList");
const sceneDetail = document.querySelector("#sceneDetail");

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
const SCENE_PROGRESS_KEY = "sentence-reader-scene-progress";
const AUTH_TOKEN_KEY = "sentence-reader-auth-token";
const AUTH_USER_KEY = "sentence-reader-auth-user";
const AUTH_AVATAR_KEY = "sentence-reader-auth-avatar";
const LEARNING_LANGUAGE_KEY = "sentence-reader-learning-language";
const STALE_EMPTY_AI_REPLIES = new Set(["我暂时没有生成内容。", "我暂时没有生成内容"]);
const TEACHER_MESSAGE_BREAK = "【NEXT_MESSAGE】";
const TEACHER_CORRECTION_MARK = "【CORRECTION】";
const LEARNING_LANGUAGES = {
  english: { label: "英语", targetLabel: "英文", speech: "en-US", tts: "en", sample: "旅行时使用的英文句子" },
  spanish: { label: "西班牙语", targetLabel: "西班牙语", speech: "es-ES", tts: "es", sample: "旅行时使用的西班牙语句子" },
  japanese: { label: "日语", targetLabel: "日语", speech: "ja-JP", tts: "ja", sample: "旅行时使用的日语句子" },
  korean: { label: "韩语", targetLabel: "韩语", speech: "ko-KR", tts: "ko", sample: "旅行时使用的韩语句子" },
};
const APP_BUILD_TAG = "free40";
const APP_VERSION_CODE = 40;
const AUTH_REQUIRED = true;
const AI_RESPONSE_TIMEOUT_MS = 45000;
const UPDATE_DISMISS_KEY = "sentence-reader-dismissed-update";
const UPDATE_CHECK_TIMEOUT_MS = 6500;
const CLOUD_SYNC_DEBOUNCE_MS = 900;
const LANGUAGE_CONVERT_SENTENCE_BATCH_SIZE = 40;
const LANGUAGE_CONVERT_MESSAGE_LIMIT = 50;
const TEACHER_OPENING_TOPIC_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const ADMIN_MESSAGE_POLL_MS = 30000;
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
let currentSceneMode = "words";
let currentSceneGroup = "friends";
let currentVocabGroup = "core";
let activeSceneId = "";
let examReturnSceneId = "";
let sceneExamItems = [];
let sceneHistoryFallbackTimer = 0;
let teacherRenderFrame = 0;
let teacherOpeningTopicTimer = 0;
let teacherOpeningTopicInFlight = false;
let languageSwitchInFlight = false;
let friends = [];
let friendsLoadedAt = 0;
let adminUsers = [];
let adminLoadedAt = 0;
let adminMessagePollTimer = 0;
let adminMessageAlertActive = false;
let voiceCapture = null;
let voiceListenersReady = false;
let voicePipReplyInFlight = false;
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

const HIGH_FREQUENCY_DICTIONARY = {
  "i'm": ["aɪm", "I am 的缩写；我是；我现在"],
  "you're": ["jʊr", "you are 的缩写；你是；你现在"],
  "he's": ["hiːz", "he is / he has 的缩写；他是；他已经"],
  "she's": ["ʃiːz", "she is / she has 的缩写；她是；她已经"],
  "it's": ["ɪts", "it is / it has 的缩写；它是；这是"],
  "that's": ["ðæts", "that is 的缩写；那是；这就"],
  "what's": ["wʌts", "what is 的缩写；什么是；怎么了"],
  "what'd": ["wʌd", "what did / what would 的缩写"],
  "how's": ["haʊz", "how is 的缩写；怎么样"],
  "there's": ["ðerz", "there is 的缩写；有"],
  "i'll": ["aɪl", "I will 的缩写；我会"],
  "i'd": ["aɪd", "I would / I had 的缩写；我想；我会"],
  "i've": ["aɪv", "I have 的缩写；我已经"],
  "don't": ["doʊnt", "do not 的缩写；不要；不"],
  "doesn't": ["ˈdʌznt", "does not 的缩写；不"],
  "didn't": ["ˈdɪdnt", "did not 的缩写；没有"],
  "can't": ["kænt", "cannot 的缩写；不能"],
  "won't": ["woʊnt", "will not 的缩写；不会"],
  "wouldn't": ["ˈwʊdnt", "would not 的缩写；不会；不愿"],
  "isn't": ["ˈɪznt", "is not 的缩写；不是"],
  "aren't": ["ɑːrnt", "are not 的缩写；不是"],
  address: ["əˈdres", "地址"],
  afternoon: ["ˌæftərˈnuːn", "下午"],
  ahead: ["əˈhed", "前面；提前"],
  almost: ["ˈɔːlmoʊst", "几乎；差点"],
  alone: ["əˈloʊn", "独自；一个人"],
  already: ["ɔːlˈredi", "已经"],
  awesome: ["ˈɔːsəm", "很棒的；极好的"],
  bad: ["bæd", "坏的；糟糕的"],
  bag: ["bæɡ", "包；袋子"],
  battery: ["ˈbætəri", "电池；电量"],
  blame: ["bleɪm", "责怪"],
  brain: ["breɪn", "大脑；脑子"],
  bring: ["brɪŋ", "带来；拿来"],
  bus: ["bʌs", "公交车；巴士"],
  busy: ["ˈbɪzi", "忙的"],
  buy: ["baɪ", "买"],
  call: ["kɔːl", "打电话；称呼"],
  card: ["kɑːrd", "卡；银行卡"],
  carry: ["ˈkæri", "携带；带飞；承担"],
  cash: ["kæʃ", "现金"],
  cheap: ["tʃiːp", "便宜的"],
  check: ["tʃek", "检查；查看"],
  chicken: ["ˈtʃɪkɪn", "鸡肉；鸡"],
  cold: ["koʊld", "冷的；感冒"],
  color: ["ˈkʌlər", "颜色"],
  coffee: ["ˈkɔːfi", "咖啡"],
  corner: ["ˈkɔːrnər", "角落；街角"],
  dinner: ["ˈdɪnər", "晚饭"],
  done: ["dʌn", "完成的；结束的"],
  drink: ["drɪŋk", "喝；饮料"],
  early: ["ˈɜːrli", "早的；提前"],
  eat: ["iːt", "吃"],
  episode: ["ˈepɪsoʊd", "一集；片段"],
  expensive: ["ɪkˈspensɪv", "贵的"],
  family: ["ˈfæməli", "家人；家庭"],
  favorite: ["ˈfeɪvərɪt", "最喜欢的"],
  feeling: ["ˈfiːlɪŋ", "感觉；情绪"],
  fine: ["faɪn", "好的；没事"],
  food: ["fuːd", "食物"],
  friend: ["frend", "朋友"],
  game: ["ɡeɪm", "游戏；比赛"],
  grab: ["ɡræb", "拿；顺手买；抓住"],
  happy: ["ˈhæpi", "开心的"],
  headache: ["ˈhedeɪk", "头痛"],
  home: ["hoʊm", "家"],
  hotel: ["hoʊˈtel", "酒店"],
  hour: ["ˈaʊər", "小时"],
  ice: ["aɪs", "冰"],
  idea: ["aɪˈdiːə", "想法；主意"],
  kind: ["kaɪnd", "种类；友善的；有点"],
  late: ["leɪt", "晚的；迟到的"],
  left: ["left", "左边；剩下"],
  line: ["laɪn", "线；句子；排队"],
  look: ["lʊk", "看；看起来"],
  lost: ["lɔːst", "迷路的；丢失的"],
  love: ["lʌv", "爱；喜欢"],
  maybe: ["ˈmeɪbi", "也许；可能"],
  medicine: ["ˈmedɪsɪn", "药；医学"],
  menu: ["ˈmenjuː", "菜单"],
  message: ["ˈmesɪdʒ", "消息；短信"],
  milk: ["mɪlk", "牛奶"],
  minute: ["ˈmɪnɪt", "分钟"],
  money: ["ˈmʌni", "钱；金钱"],
  morning: ["ˈmɔːrnɪŋ", "早上"],
  movie: ["ˈmuːvi", "电影"],
  music: ["ˈmjuːzɪk", "音乐"],
  name: ["neɪm", "名字"],
  nervous: ["ˈnɜːrvəs", "紧张的"],
  night: ["naɪt", "晚上；夜晚"],
  okay: ["oʊˈkeɪ", "好的；没事"],
  online: ["ˌɑːnˈlaɪn", "在线；线上"],
  order: ["ˈɔːrdər", "点单；订单；命令"],
  phone: ["foʊn", "手机；电话"],
  place: ["pleɪs", "地方；地点"],
  plan: ["plæn", "计划"],
  play: ["pleɪ", "玩；播放；比赛"],
  price: ["praɪs", "价格"],
  problem: ["ˈprɑːbləm", "问题；麻烦"],
  receipt: ["rɪˈsiːt", "收据"],
  regular: ["ˈreɡjələr", "常规的；正常的"],
  reservation: ["ˌrezərˈveɪʃn", "预订；预约"],
  rest: ["rest", "休息；剩余部分"],
  rice: ["raɪs", "米饭；大米"],
  room: ["ruːm", "房间"],
  run: ["rʌn", "跑；运行；经营"],
  sad: ["sæd", "难过的"],
  school: ["skuːl", "学校"],
  send: ["send", "发送"],
  shower: ["ˈʃaʊər", "淋浴；洗澡"],
  sign: ["saɪn", "标志；签名"],
  size: ["saɪz", "尺码；大小"],
  slow: ["sloʊ", "慢的"],
  song: ["sɔːŋ", "歌曲"],
  sorry: ["ˈsɑːri", "抱歉；不好意思"],
  spicy: ["ˈspaɪsi", "辣的"],
  station: ["ˈsteɪʃn", "车站"],
  stay: ["steɪ", "待着；停留"],
  start: ["stɑːrt", "开始"],
  stop: ["stɑːp", "停止"],
  street: ["striːt", "街道"],
  subway: ["ˈsʌbweɪ", "地铁"],
  sugar: ["ˈʃʊɡər", "糖"],
  sweet: ["swiːt", "甜的；可爱的"],
  taxi: ["ˈtæksi", "出租车"],
  tea: ["tiː", "茶"],
  tell: ["tel", "告诉；分辨"],
  thanks: ["θæŋks", "谢谢"],
  ticket: ["ˈtɪkɪt", "票；罚单"],
  tired: ["ˈtaɪərd", "累的"],
  tiring: ["ˈtaɪərɪŋ", "累人的"],
  today: ["təˈdeɪ", "今天"],
  tomorrow: ["təˈmɑːroʊ", "明天"],
  tonight: ["təˈnaɪt", "今晚"],
  topic: ["ˈtɑːpɪk", "话题"],
  train: ["treɪn", "火车；训练"],
  understand: ["ˌʌndərˈstænd", "理解；明白"],
  walk: ["wɔːk", "走路；散步"],
  warm: ["wɔːrm", "温暖的；热身"],
  water: ["ˈwɔːtər", "水"],
  watch: ["wɑːtʃ", "看；手表"],
  weekend: ["ˈwiːkend", "周末"],
  wrong: ["rɔːŋ", "错误的；不对的"],
};

Object.entries(HIGH_FREQUENCY_DICTIONARY).forEach(([word, entry]) => {
  if (!dictionary[word]) dictionary[word] = entry;
});

const VOCAB_GROUPS = [
  { id: "core", label: "基础高频" },
  { id: "people", label: "人和关系" },
  { id: "food", label: "吃喝" },
  { id: "time", label: "时间日常" },
  { id: "travel", label: "出门交通" },
  { id: "shopping", label: "购物付款" },
  { id: "feelings", label: "情绪状态" },
];

function vocabWord(group, zh, english, spanish, japanese, korean, note = "高频单词") {
  return { group, zh, english, spanish, japanese, korean, note };
}

const VOCAB_LIBRARY = [
  vocabWord("core", "我", "I", "yo", "私", "나", "代词"),
  vocabWord("core", "你", "you", "tú", "あなた", "너", "代词"),
  vocabWord("core", "我们", "we", "nosotros", "私たち", "우리", "代词"),
  vocabWord("core", "这个", "this", "esto", "これ", "이것", "指示词"),
  vocabWord("core", "那个", "that", "eso", "それ", "그것", "指示词"),
  vocabWord("core", "这里", "here", "aquí", "ここ", "여기", "地点"),
  vocabWord("core", "那里", "there", "allí", "そこ", "거기", "地点"),
  vocabWord("core", "现在", "now", "ahora", "今", "지금", "时间"),
  vocabWord("core", "稍后", "later", "después", "あとで", "나중에", "时间"),
  vocabWord("core", "真的", "really", "de verdad", "本当に", "정말", "语气"),
  vocabWord("core", "也许", "maybe", "quizás", "たぶん", "아마", "语气"),
  vocabWord("core", "只是", "just", "solo", "ただ", "그냥", "语气"),
  vocabWord("people", "朋友", "friend", "amigo", "友達", "친구", "关系"),
  vocabWord("people", "家人", "family", "familia", "家族", "가족", "关系"),
  vocabWord("people", "名字", "name", "nombre", "名前", "이름", "个人信息"),
  vocabWord("people", "手机", "phone", "teléfono", "携帯", "휴대폰", "日常物品"),
  vocabWord("people", "消息", "message", "mensaje", "メッセージ", "메시지", "聊天"),
  vocabWord("people", "工作", "work", "trabajo", "仕事", "일", "日常"),
  vocabWord("people", "学校", "school", "escuela", "学校", "학교", "日常"),
  vocabWord("people", "家", "home", "casa", "家", "집", "地点"),
  vocabWord("people", "帮助", "help", "ayuda", "助け", "도움", "求助"),
  vocabWord("people", "想法", "idea", "idea", "アイデア", "생각", "聊天"),
  vocabWord("food", "水", "water", "agua", "水", "물", "饮品"),
  vocabWord("food", "咖啡", "coffee", "café", "コーヒー", "커피", "饮品"),
  vocabWord("food", "茶", "tea", "té", "お茶", "차", "饮品"),
  vocabWord("food", "牛奶", "milk", "leche", "牛乳", "우유", "饮品"),
  vocabWord("food", "糖", "sugar", "azúcar", "砂糖", "설탕", "口味"),
  vocabWord("food", "冰", "ice", "hielo", "氷", "얼음", "口味"),
  vocabWord("food", "食物", "food", "comida", "食べ物", "음식", "吃饭"),
  vocabWord("food", "米饭", "rice", "arroz", "ご飯", "밥", "主食"),
  vocabWord("food", "鸡肉", "chicken", "pollo", "鶏肉", "닭고기", "食物"),
  vocabWord("food", "辣的", "spicy", "picante", "辛い", "매운", "口味"),
  vocabWord("food", "甜的", "sweet", "dulce", "甘い", "달콤한", "口味"),
  vocabWord("food", "晚饭", "dinner", "cena", "夕食", "저녁", "吃饭"),
  vocabWord("time", "今天", "today", "hoy", "今日", "오늘", "时间"),
  vocabWord("time", "明天", "tomorrow", "mañana", "明日", "내일", "时间"),
  vocabWord("time", "周末", "weekend", "fin de semana", "週末", "주말", "时间"),
  vocabWord("time", "早上", "morning", "mañana", "朝", "아침", "时间"),
  vocabWord("time", "晚上", "night", "noche", "夜", "밤", "时间"),
  vocabWord("time", "分钟", "minute", "minuto", "分", "분", "时间"),
  vocabWord("time", "小时", "hour", "hora", "時間", "시간", "时间"),
  vocabWord("time", "早的", "early", "temprano", "早い", "이른", "时间"),
  vocabWord("time", "晚的", "late", "tarde", "遅い", "늦은", "时间"),
  vocabWord("travel", "地方", "place", "lugar", "場所", "장소", "地点"),
  vocabWord("travel", "地址", "address", "dirección", "住所", "주소", "地点"),
  vocabWord("travel", "街道", "street", "calle", "通り", "거리", "地点"),
  vocabWord("travel", "车站", "station", "estación", "駅", "역", "交通"),
  vocabWord("travel", "地铁", "subway", "metro", "地下鉄", "지하철", "交通"),
  vocabWord("travel", "公交", "bus", "autobús", "バス", "버스", "交通"),
  vocabWord("travel", "出租车", "taxi", "taxi", "タクシー", "택시", "交通"),
  vocabWord("travel", "酒店", "hotel", "hotel", "ホテル", "호텔", "住宿"),
  vocabWord("travel", "房间", "room", "habitación", "部屋", "방", "住宿"),
  vocabWord("travel", "票", "ticket", "boleto", "チケット", "표", "交通"),
  vocabWord("travel", "左边", "left", "izquierda", "左", "왼쪽", "方向"),
  vocabWord("travel", "右边", "right", "derecha", "右", "오른쪽", "方向"),
  vocabWord("shopping", "价格", "price", "precio", "値段", "가격", "购物"),
  vocabWord("shopping", "钱", "money", "dinero", "お金", "돈", "付款"),
  vocabWord("shopping", "银行卡", "card", "tarjeta", "カード", "카드", "付款"),
  vocabWord("shopping", "现金", "cash", "efectivo", "現金", "현금", "付款"),
  vocabWord("shopping", "尺码", "size", "talla", "サイズ", "사이즈", "购物"),
  vocabWord("shopping", "颜色", "color", "color", "色", "색", "购物"),
  vocabWord("shopping", "便宜的", "cheap", "barato", "安い", "싼", "价格"),
  vocabWord("shopping", "贵的", "expensive", "caro", "高い", "비싼", "价格"),
  vocabWord("shopping", "袋子", "bag", "bolsa", "袋", "봉투", "购物"),
  vocabWord("shopping", "收据", "receipt", "recibo", "レシート", "영수증", "付款"),
  vocabWord("feelings", "好的", "good", "bueno", "いい", "좋은", "状态"),
  vocabWord("feelings", "没事", "fine", "bien", "大丈夫", "괜찮은", "状态"),
  vocabWord("feelings", "累的", "tired", "cansado", "疲れた", "피곤한", "状态"),
  vocabWord("feelings", "忙的", "busy", "ocupado", "忙しい", "바쁜", "状态"),
  vocabWord("feelings", "开心的", "happy", "feliz", "うれしい", "행복한", "状态"),
  vocabWord("feelings", "难过的", "sad", "triste", "悲しい", "슬픈", "状态"),
  vocabWord("feelings", "紧张的", "nervous", "nervioso", "緊張した", "긴장한", "状态"),
  vocabWord("feelings", "抱歉", "sorry", "perdón", "ごめん", "미안", "礼貌"),
  vocabWord("feelings", "谢谢", "thanks", "gracias", "ありがとう", "고마워", "礼貌"),
  vocabWord("feelings", "可以", "okay", "vale", "オーケー", "오케이", "回应"),
  vocabWord("feelings", "爱", "love", "amor", "愛", "사랑", "情感"),
];

const SCENE_GROUPS = [
  { id: "friends", label: "朋友闲聊" },
  { id: "food", label: "吃喝玩乐" },
  { id: "workstudy", label: "学习工作" },
  { id: "care", label: "情绪关系" },
  { id: "life", label: "生活实用" },
];

const SCENE_LIBRARY = [
  {
    id: "daily-checkin",
    group: "friends",
    level: "入门",
    title: "今天过得怎么样",
    description: "朋友见面或聊天开头最常用。",
    items: [
      { zh: "今天过得怎么样？", english: "How was your day?", spanish: "¿Cómo estuvo tu día?", japanese: "今日はどうだった？", korean: "오늘 하루 어땠어?" },
      { zh: "我今天有点累。", english: "I'm a little tired today.", spanish: "Hoy estoy un poco cansado.", japanese: "今日は少し疲れた。", korean: "오늘은 조금 피곤해." },
      { zh: "今天还不错。", english: "Today was pretty good.", spanish: "Hoy estuvo bastante bien.", japanese: "今日はけっこうよかった。", korean: "오늘은 꽤 괜찮았어." },
      { zh: "发生了一件挺有意思的事。", english: "Something pretty interesting happened.", spanish: "Pasó algo bastante interesante.", japanese: "ちょっと面白いことがあった。", korean: "꽤 재미있는 일이 있었어." },
    ],
    dialogue: [
      { speaker: "A", zh: "今天过得怎么样？", english: "How was your day?", spanish: "¿Cómo estuvo tu día?", japanese: "今日はどうだった？", korean: "오늘 하루 어땠어?" },
      { speaker: "B", zh: "还可以，就是有点累。", english: "It was okay, just a little tiring.", spanish: "Estuvo bien, solo un poco cansado.", japanese: "まあまあ。ちょっと疲れた。", korean: "괜찮았어. 조금 피곤했을 뿐이야." },
      { speaker: "A", zh: "晚上早点休息吧。", english: "Try to rest early tonight.", spanish: "Descansa temprano esta noche.", japanese: "今夜は早めに休んでね。", korean: "오늘 밤은 일찍 쉬어." },
    ],
  },
  {
    id: "weekend-plans",
    group: "friends",
    level: "入门",
    title: "周末计划",
    description: "约朋友、安排周末、轻松开话题。",
    items: [
      { zh: "周末打算做什么？", english: "What are you doing this weekend?", spanish: "¿Qué vas a hacer este fin de semana?", japanese: "週末は何をする予定？", korean: "주말에 뭐 할 거야?" },
      { zh: "要不要出去走走？", english: "Do you want to go out for a walk?", spanish: "¿Quieres salir a caminar?", japanese: "外に散歩しに行かない？", korean: "나가서 좀 걸을래?" },
      { zh: "我想在家休息。", english: "I want to rest at home.", spanish: "Quiero descansar en casa.", japanese: "家で休みたい。", korean: "집에서 쉬고 싶어." },
      { zh: "下次一起去吧。", english: "Let's go together next time.", spanish: "Vamos juntos la próxima vez.", japanese: "次は一緒に行こう。", korean: "다음에 같이 가자." },
    ],
    dialogue: [
      { speaker: "A", zh: "周末有安排吗？", english: "Do you have plans this weekend?", spanish: "¿Tienes planes este fin de semana?", japanese: "週末は予定ある？", korean: "주말에 약속 있어?" },
      { speaker: "B", zh: "还没有，可能在家休息。", english: "Not yet. I might just rest at home.", spanish: "Todavía no. Quizás descanse en casa.", japanese: "まだない。家で休むかも。", korean: "아직 없어. 집에서 쉴지도 몰라." },
      { speaker: "A", zh: "那有空一起吃饭。", english: "Then let's eat together if you're free.", spanish: "Entonces comamos juntos si tienes tiempo.", japanese: "じゃあ時間があれば一緒にご飯を食べよう。", korean: "그럼 시간 되면 같이 밥 먹자." },
    ],
  },
  {
    id: "food-chat",
    group: "food",
    level: "入门",
    title: "吃饭与美食",
    description: "聊今天吃什么、推荐餐厅、约饭。",
    items: [
      { zh: "今天吃了什么？", english: "What did you eat today?", spanish: "¿Qué comiste hoy?", japanese: "今日は何を食べた？", korean: "오늘 뭐 먹었어?" },
      { zh: "这家店很好吃。", english: "This place is really good.", spanish: "Este lugar es muy bueno.", japanese: "この店はすごくおいしい。", korean: "이 집 정말 맛있어." },
      { zh: "我有点饿了。", english: "I'm getting a little hungry.", spanish: "Me está dando un poco de hambre.", japanese: "ちょっとお腹が空いてきた。", korean: "나 조금 배고파졌어." },
      { zh: "下次一起去吃。", english: "Let's go eat there together next time.", spanish: "Vamos a comer allí juntos la próxima vez.", japanese: "次は一緒に食べに行こう。", korean: "다음에 같이 먹으러 가자." },
    ],
    dialogue: [
      { speaker: "A", zh: "你今天吃了什么？", english: "What did you eat today?", spanish: "¿Qué comiste hoy?", japanese: "今日は何を食べた？", korean: "오늘 뭐 먹었어?" },
      { speaker: "B", zh: "吃了面，味道还不错。", english: "I had noodles. They were pretty good.", spanish: "Comí fideos. Estaban bastante buenos.", japanese: "麺を食べた。けっこうおいしかった。", korean: "면 먹었어. 꽤 맛있었어." },
      { speaker: "A", zh: "听起来不错，下次带我去。", english: "Sounds good. Take me there next time.", spanish: "Suena bien. Llévame la próxima vez.", japanese: "よさそう。次連れて行って。", korean: "좋다. 다음에 나도 데려가." },
    ],
  },
  {
    id: "coffee-tea",
    group: "food",
    level: "入门",
    title: "咖啡奶茶",
    description: "点饮料、聊口味、一起买一杯。",
    items: [
      { zh: "你想喝咖啡还是奶茶？", english: "Do you want coffee or milk tea?", spanish: "¿Quieres café o té con leche?", japanese: "コーヒーとミルクティー、どっちが飲みたい？", korean: "커피 마실래, 밀크티 마실래?" },
      { zh: "我要少冰少糖。", english: "I want less ice and less sugar.", spanish: "Quiero menos hielo y menos azúcar.", japanese: "氷少なめ、砂糖少なめで。", korean: "얼음 적게, 당도 낮게 해 주세요." },
      { zh: "这家店排队很久。", english: "The line here is really long.", spanish: "La fila aquí es muy larga.", japanese: "この店、すごく並んでいる。", korean: "이 가게 줄이 엄청 길어." },
      { zh: "买一杯边走边聊吧。", english: "Let's get a drink and talk while we walk.", spanish: "Compremos algo y hablemos mientras caminamos.", japanese: "一杯買って歩きながら話そう。", korean: "한 잔 사서 걸으면서 얘기하자." },
    ],
    dialogue: [
      { speaker: "A", zh: "你想喝点什么？", english: "What do you want to drink?", spanish: "¿Qué quieres tomar?", japanese: "何か飲みたい？", korean: "뭐 마시고 싶어?" },
      { speaker: "B", zh: "我想喝奶茶，少糖。", english: "I want milk tea, less sugar.", spanish: "Quiero té con leche, con menos azúcar.", japanese: "ミルクティーが飲みたい。砂糖少なめで。", korean: "밀크티 마시고 싶어. 당도 낮게." },
      { speaker: "A", zh: "好，我们买了边走边聊。", english: "Okay, let's get it and walk while we talk.", spanish: "Bien, compremos y caminemos mientras hablamos.", japanese: "いいね。買って歩きながら話そう。", korean: "좋아. 사서 걸으면서 얘기하자." },
    ],
  },
  {
    id: "movies-shows",
    group: "friends",
    level: "常用",
    title: "电影电视剧",
    description: "聊最近在看什么，避免剧透。",
    items: [
      { zh: "最近看了什么剧？", english: "What shows have you watched lately?", spanish: "¿Qué series has visto últimamente?", japanese: "最近どんなドラマを見た？", korean: "요즘 무슨 드라마 봤어?" },
      { zh: "这个剧好看吗？", english: "Is this show good?", spanish: "¿Esta serie está buena?", japanese: "このドラマ面白い？", korean: "이 드라마 재미있어?" },
      { zh: "别剧透。", english: "No spoilers.", spanish: "No me hagas spoiler.", japanese: "ネタバレしないで。", korean: "스포하지 마." },
      { zh: "有空一起看。", english: "Let's watch it together sometime.", spanish: "Veámosla juntos algún día.", japanese: "今度一緒に見よう。", korean: "나중에 같이 보자." },
    ],
    dialogue: [
      { speaker: "A", zh: "最近有什么好看的剧吗？", english: "Any good shows lately?", spanish: "¿Hay alguna serie buena últimamente?", japanese: "最近何か面白いドラマある？", korean: "요즘 볼 만한 드라마 있어?" },
      { speaker: "B", zh: "有一个很好看，但我不剧透。", english: "There's a really good one, but I won't spoil it.", spanish: "Hay una muy buena, pero no haré spoiler.", japanese: "すごく面白いのがあるけど、ネタバレはしない。", korean: "엄청 재미있는 거 있어. 근데 스포는 안 할게." },
      { speaker: "A", zh: "那周末一起看。", english: "Then let's watch it together this weekend.", spanish: "Entonces veámosla juntos este fin de semana.", japanese: "じゃあ週末一緒に見よう。", korean: "그럼 주말에 같이 보자." },
    ],
  },
  {
    id: "music-share",
    group: "friends",
    level: "常用",
    title: "音乐分享",
    description: "推荐歌曲、聊歌手、分享心情。",
    items: [
      { zh: "最近在听什么歌？", english: "What songs are you listening to lately?", spanish: "¿Qué canciones escuchas últimamente?", japanese: "最近どんな曲を聞いている？", korean: "요즘 무슨 노래 들어?" },
      { zh: "这首歌很洗脑。", english: "This song is really catchy.", spanish: "Esta canción es muy pegadiza.", japanese: "この曲、すごく耳に残る。", korean: "이 노래 진짜 중독성 있어." },
      { zh: "推荐我一首歌。", english: "Recommend a song to me.", spanish: "Recomiéndame una canción.", japanese: "一曲おすすめして。", korean: "노래 하나 추천해 줘." },
      { zh: "我想去看演唱会。", english: "I want to go to a concert.", spanish: "Quiero ir a un concierto.", japanese: "ライブに行きたい。", korean: "콘서트 보러 가고 싶어." },
    ],
    dialogue: [
      { speaker: "A", zh: "最近在听什么？", english: "What are you listening to lately?", spanish: "¿Qué escuchas últimamente?", japanese: "最近何を聞いている？", korean: "요즘 뭐 들어?" },
      { speaker: "B", zh: "有首歌很上头，我发给你。", english: "There's a really catchy song. I'll send it to you.", spanish: "Hay una canción muy pegadiza. Te la mando.", japanese: "すごくハマる曲がある。送るね。", korean: "진짜 중독성 있는 노래 있어. 보내줄게." },
      { speaker: "A", zh: "好，我等下听。", english: "Great, I'll listen to it later.", spanish: "Genial, la escucharé luego.", japanese: "いいね、あとで聞く。", korean: "좋아, 이따 들어볼게." },
    ],
  },
  {
    id: "gaming-chat",
    group: "friends",
    level: "常用",
    title: "游戏闲聊",
    description: "约朋友上线、输赢吐槽、轻松聊天。",
    items: [
      { zh: "最近在玩什么游戏？", english: "What games are you playing lately?", spanish: "¿Qué juegos estás jugando últimamente?", japanese: "最近どんなゲームをしている？", korean: "요즘 무슨 게임 해?" },
      { zh: "这局太难了。", english: "This round is too hard.", spanish: "Esta partida es demasiado difícil.", japanese: "この試合、難しすぎる。", korean: "이번 판 너무 어려워." },
      { zh: "晚上一起玩吗？", english: "Do you want to play together tonight?", spanish: "¿Quieres jugar juntos esta noche?", japanese: "今夜一緒にゲームしない？", korean: "오늘 밤 같이 게임할래?" },
      { zh: "别急，我马上上线。", english: "Hold on, I'll be online soon.", spanish: "Espera, me conecto enseguida.", japanese: "待って、すぐログインする。", korean: "잠깐만, 곧 접속할게." },
    ],
    dialogue: [
      { speaker: "A", zh: "晚上一起玩吗？", english: "Want to play together tonight?", spanish: "¿Jugamos juntos esta noche?", japanese: "今夜一緒にやる？", korean: "오늘 밤 같이 할래?" },
      { speaker: "B", zh: "可以，我吃完饭上线。", english: "Sure, I'll get online after dinner.", spanish: "Claro, me conecto después de cenar.", japanese: "いいよ。ご飯のあとログインする。", korean: "좋아. 저녁 먹고 접속할게." },
      { speaker: "A", zh: "好，别让我等太久。", english: "Okay, don't make me wait too long.", spanish: "Bien, no me hagas esperar mucho.", japanese: "わかった。あまり待たせないでね。", korean: "좋아, 너무 오래 기다리게 하지 마." },
    ],
  },
  {
    id: "work-vent",
    group: "workstudy",
    level: "常用",
    title: "工作吐槽",
    description: "下班聊天、开会太久、表达疲惫。",
    items: [
      { zh: "今天工作好多。", english: "I had so much work today.", spanish: "Hoy tuve muchísimo trabajo.", japanese: "今日は仕事が多すぎた。", korean: "오늘 일이 너무 많았어." },
      { zh: "开会开太久了。", english: "The meeting went on for too long.", spanish: "La reunión duró demasiado.", japanese: "会議が長すぎた。", korean: "회의가 너무 길었어." },
      { zh: "终于下班了。", english: "I'm finally off work.", spanish: "Por fin salí del trabajo.", japanese: "やっと仕事が終わった。", korean: "드디어 퇴근했어." },
      { zh: "明天还要早起。", english: "I still have to wake up early tomorrow.", spanish: "Mañana todavía tengo que levantarme temprano.", japanese: "明日も早起きしなきゃ。", korean: "내일도 일찍 일어나야 해." },
    ],
    dialogue: [
      { speaker: "A", zh: "你今天看起来很累。", english: "You look really tired today.", spanish: "Hoy te ves muy cansado.", japanese: "今日はすごく疲れて見える。", korean: "오늘 많이 피곤해 보여." },
      { speaker: "B", zh: "开了一下午会。", english: "I had meetings all afternoon.", spanish: "Tuve reuniones toda la tarde.", japanese: "午後ずっと会議だった。", korean: "오후 내내 회의했어." },
      { speaker: "A", zh: "那今晚早点休息。", english: "Then rest early tonight.", spanish: "Entonces descansa temprano esta noche.", japanese: "じゃあ今夜は早く休んで。", korean: "그럼 오늘은 일찍 쉬어." },
    ],
  },
  {
    id: "study-vent",
    group: "workstudy",
    level: "常用",
    title: "学习吐槽",
    description: "学不进去、求助、一起复习。",
    items: [
      { zh: "今天学不进去。", english: "I can't focus on studying today.", spanish: "Hoy no puedo concentrarme para estudiar.", japanese: "今日は勉強に集中できない。", korean: "오늘은 공부가 잘 안 돼." },
      { zh: "这个太难了。", english: "This is too hard.", spanish: "Esto es demasiado difícil.", japanese: "これは難しすぎる。", korean: "이거 너무 어려워." },
      { zh: "我终于弄懂了。", english: "I finally figured it out.", spanish: "Por fin lo entendí.", japanese: "やっと理解できた。", korean: "드디어 이해했어." },
      { zh: "一起复习吗？", english: "Do you want to review together?", spanish: "¿Quieres repasar juntos?", japanese: "一緒に復習しない？", korean: "같이 복습할래?" },
    ],
    dialogue: [
      { speaker: "A", zh: "你学到哪里了？", english: "How far did you get with studying?", spanish: "¿Hasta dónde estudiaste?", japanese: "どこまで勉強した？", korean: "어디까지 공부했어?" },
      { speaker: "B", zh: "卡住了，这个太难。", english: "I'm stuck. This is too hard.", spanish: "Estoy atascado. Esto es muy difícil.", japanese: "詰まってる。これ難しすぎる。", korean: "막혔어. 이거 너무 어려워." },
      { speaker: "A", zh: "我们一起看一遍。", english: "Let's go through it together.", spanish: "Vamos a verlo juntos.", japanese: "一緒に見てみよう。", korean: "같이 한번 보자." },
    ],
  },
  {
    id: "emotional-support",
    group: "care",
    level: "常用",
    title: "情绪陪伴",
    description: "朋友不开心时，用自然的话接住对方。",
    items: [
      { zh: "你还好吗？", english: "Are you okay?", spanish: "¿Estás bien?", japanese: "大丈夫？", korean: "괜찮아?" },
      { zh: "想聊聊吗？", english: "Do you want to talk about it?", spanish: "¿Quieres hablar de eso?", japanese: "話したい？", korean: "얘기하고 싶어?" },
      { zh: "没关系，慢慢来。", english: "It's okay. Take your time.", spanish: "Está bien. Tómate tu tiempo.", japanese: "大丈夫。ゆっくりでいいよ。", korean: "괜찮아. 천천히 해." },
      { zh: "我懂你的感觉。", english: "I understand how you feel.", spanish: "Entiendo cómo te sientes.", japanese: "その気持ちわかるよ。", korean: "네 기분 이해해." },
    ],
    dialogue: [
      { speaker: "A", zh: "你今天有点安静。", english: "You're a little quiet today.", spanish: "Hoy estás un poco callado.", japanese: "今日は少し静かだね。", korean: "오늘 좀 조용하네." },
      { speaker: "B", zh: "嗯，心情不太好。", english: "Yeah, I'm not feeling great.", spanish: "Sí, no me siento muy bien.", japanese: "うん、あまり気分がよくない。", korean: "응, 기분이 별로야." },
      { speaker: "A", zh: "想聊聊吗？我在。", english: "Do you want to talk? I'm here.", spanish: "¿Quieres hablar? Estoy aquí.", japanese: "話したい？そばにいるよ。", korean: "얘기하고 싶어? 나 여기 있어." },
    ],
  },
  {
    id: "late-night-chat",
    group: "care",
    level: "常用",
    title: "深夜聊天",
    description: "睡不着、陪朋友聊几句、提醒休息。",
    items: [
      { zh: "你还没睡吗？", english: "Are you still awake?", spanish: "¿Sigues despierto?", japanese: "まだ起きてる？", korean: "아직 안 자?" },
      { zh: "我有点睡不着。", english: "I can't really fall asleep.", spanish: "No puedo dormir muy bien.", japanese: "ちょっと眠れない。", korean: "잠이 잘 안 와." },
      { zh: "陪我聊一会儿。", english: "Talk with me for a bit.", spanish: "Habla conmigo un rato.", japanese: "少し話し相手になって。", korean: "나랑 잠깐 얘기해 줘." },
      { zh: "早点休息。", english: "Get some rest soon.", spanish: "Descansa pronto.", japanese: "早めに休んで。", korean: "일찍 쉬어." },
    ],
    dialogue: [
      { speaker: "A", zh: "你还没睡吗？", english: "Are you still awake?", spanish: "¿Sigues despierto?", japanese: "まだ起きてる？", korean: "아직 안 자?" },
      { speaker: "B", zh: "睡不着，脑子停不下来。", english: "I can't sleep. My mind won't stop.", spanish: "No puedo dormir. Mi mente no para.", japanese: "眠れない。頭が止まらない。", korean: "잠이 안 와. 생각이 멈추질 않아." },
      { speaker: "A", zh: "那我陪你聊一会儿。", english: "Then I'll talk with you for a bit.", spanish: "Entonces hablo contigo un rato.", japanese: "じゃあ少し話そう。", korean: "그럼 내가 잠깐 얘기해 줄게." },
    ],
  },
  {
    id: "encourage-friend",
    group: "care",
    level: "入门",
    title: "鼓励朋友",
    description: "给朋友打气，不空泛也不尴尬。",
    items: [
      { zh: "你可以的。", english: "You can do it.", spanish: "Tú puedes.", japanese: "あなたならできる。", korean: "너라면 할 수 있어." },
      { zh: "别太着急。", english: "Don't rush too much.", spanish: "No te apresures demasiado.", japanese: "あまり焦らないで。", korean: "너무 조급해하지 마." },
      { zh: "已经很好了。", english: "You're already doing well.", spanish: "Ya lo estás haciendo muy bien.", japanese: "もう十分よくできているよ。", korean: "이미 잘하고 있어." },
      { zh: "我支持你。", english: "I support you.", spanish: "Te apoyo.", japanese: "応援しているよ。", korean: "내가 응원할게." },
    ],
    dialogue: [
      { speaker: "A", zh: "我怕自己做不好。", english: "I'm afraid I won't do it well.", spanish: "Me da miedo no hacerlo bien.", japanese: "うまくできないかもって不安。", korean: "잘 못할까 봐 걱정돼." },
      { speaker: "B", zh: "别急，你已经很好了。", english: "Don't rush. You're already doing well.", spanish: "No te apresures. Ya lo haces muy bien.", japanese: "焦らないで。もう十分できているよ。", korean: "조급해하지 마. 이미 잘하고 있어." },
      { speaker: "A", zh: "谢谢，我会再试试。", english: "Thanks. I'll try again.", spanish: "Gracias. Lo intentaré otra vez.", japanese: "ありがとう。もう一度やってみる。", korean: "고마워. 다시 해볼게." },
    ],
  },
  {
    id: "shopping-share",
    group: "friends",
    level: "常用",
    title: "购物分享",
    description: "分享新买的东西、询问价格和体验。",
    items: [
      { zh: "我买了个新东西。", english: "I bought something new.", spanish: "Compré algo nuevo.", japanese: "新しいものを買った。", korean: "새로운 걸 샀어." },
      { zh: "这个好用吗？", english: "Is this easy to use?", spanish: "¿Esto es fácil de usar?", japanese: "これ使いやすい？", korean: "이거 쓰기 좋아?" },
      { zh: "多少钱买的？", english: "How much did you pay for it?", spanish: "¿Cuánto pagaste por eso?", japanese: "いくらで買ったの？", korean: "얼마에 샀어?" },
      { zh: "看起来很适合你。", english: "It looks great on you.", spanish: "Te queda muy bien.", japanese: "すごく似合っている。", korean: "너한테 잘 어울려." },
    ],
    dialogue: [
      { speaker: "A", zh: "你看，我买了个新包。", english: "Look, I bought a new bag.", spanish: "Mira, compré una bolsa nueva.", japanese: "見て、新しいバッグを買った。", korean: "봐, 새 가방 샀어." },
      { speaker: "B", zh: "很好看，多少钱？", english: "It looks nice. How much was it?", spanish: "Está muy bonita. ¿Cuánto costó?", japanese: "いいね。いくらだった？", korean: "예쁘다. 얼마였어?" },
      { speaker: "A", zh: "打折买的，还挺划算。", english: "I got it on sale. It was a good deal.", spanish: "La compré en oferta. Fue buena compra.", japanese: "セールで買った。けっこうお得だった。", korean: "세일해서 샀어. 꽤 괜찮은 가격이었어." },
    ],
  },
  {
    id: "photos-social",
    group: "friends",
    level: "常用",
    title: "拍照与发朋友圈",
    description: "拍照、夸照片、发动态。",
    items: [
      { zh: "帮我拍一张。", english: "Take a picture of me.", spanish: "Tómame una foto.", japanese: "写真を撮ってくれる？", korean: "사진 한 장 찍어 줘." },
      { zh: "这张照片很好看。", english: "This photo looks really good.", spanish: "Esta foto se ve muy bien.", japanese: "この写真すごくいい。", korean: "이 사진 정말 잘 나왔어." },
      { zh: "这个角度不错。", english: "This angle is good.", spanish: "Este ángulo está bien.", japanese: "この角度いいね。", korean: "이 각도 괜찮다." },
      { zh: "我要发朋友圈。", english: "I'm going to post this.", spanish: "Voy a publicar esto.", japanese: "これを投稿する。", korean: "이거 올릴 거야." },
    ],
    dialogue: [
      { speaker: "A", zh: "帮我拍一张。", english: "Take a picture of me.", spanish: "Tómame una foto.", japanese: "写真を撮って。", korean: "사진 좀 찍어 줘." },
      { speaker: "B", zh: "站这边，光线更好。", english: "Stand here. The light is better.", spanish: "Párate aquí. La luz es mejor.", japanese: "こっちに立って。光がいい。", korean: "여기 서 봐. 빛이 더 좋아." },
      { speaker: "A", zh: "这张可以，我要发。", english: "This one works. I'll post it.", spanish: "Esta está bien. La voy a publicar.", japanese: "これいいね。投稿する。", korean: "이거 괜찮다. 올릴게." },
    ],
  },
  {
    id: "ordering-food",
    group: "life",
    level: "实用",
    title: "点餐",
    description: "餐厅、咖啡店、外卖都能用。",
    items: [
      { zh: "我想要这个。", english: "I'd like this one.", spanish: "Quisiera este.", japanese: "これをお願いします。", korean: "이걸로 주세요." },
      { zh: "可以少放糖吗？", english: "Can you make it less sweet?", spanish: "¿Puede ponerle menos azúcar?", japanese: "甘さ控えめにできますか？", korean: "덜 달게 해 주실 수 있나요?" },
      { zh: "我要打包。", english: "I'd like it to go.", spanish: "Para llevar, por favor.", japanese: "持ち帰りでお願いします。", korean: "포장해 주세요." },
      { zh: "可以刷卡吗？", english: "Can I pay by card?", spanish: "¿Puedo pagar con tarjeta?", japanese: "カードで払えますか？", korean: "카드로 결제할 수 있나요?" },
    ],
    dialogue: [
      { speaker: "A", zh: "你好，想点什么？", english: "Hi, what would you like?", spanish: "Hola, ¿qué desea pedir?", japanese: "こんにちは。ご注文は？", korean: "안녕하세요. 무엇을 주문하시겠어요?" },
      { speaker: "B", zh: "我想要一杯咖啡，少糖。", english: "I'd like a coffee with less sugar.", spanish: "Quisiera un café con menos azúcar.", japanese: "コーヒーを一杯、砂糖少なめでお願いします。", korean: "커피 한 잔 주세요. 덜 달게요." },
      { speaker: "A", zh: "好的，堂食还是打包？", english: "Sure. For here or to go?", spanish: "Claro. ¿Para aquí o para llevar?", japanese: "かしこまりました。店内ですか、お持ち帰りですか？", korean: "네. 매장에서 드시나요, 포장인가요?" },
    ],
  },
  {
    id: "shopping-basic",
    group: "life",
    level: "实用",
    title: "购物付款",
    description: "问价格、试穿、颜色尺码、付款。",
    items: [
      { zh: "这个多少钱？", english: "How much is this?", spanish: "¿Cuánto cuesta esto?", japanese: "これはいくらですか？", korean: "이거 얼마예요?" },
      { zh: "可以试一下吗？", english: "Can I try it on?", spanish: "¿Puedo probármelo?", japanese: "試着できますか？", korean: "입어 봐도 될까요?" },
      { zh: "有别的颜色吗？", english: "Do you have another color?", spanish: "¿Tiene otro color?", japanese: "他の色はありますか？", korean: "다른 색도 있나요?" },
      { zh: "太贵了。", english: "It's too expensive.", spanish: "Es demasiado caro.", japanese: "高すぎます。", korean: "너무 비싸요." },
    ],
    dialogue: [
      { speaker: "A", zh: "这个多少钱？", english: "How much is this?", spanish: "¿Cuánto cuesta esto?", japanese: "これはいくらですか？", korean: "이거 얼마예요?" },
      { speaker: "B", zh: "二十美元。", english: "It's twenty dollars.", spanish: "Son veinte dólares.", japanese: "20ドルです。", korean: "20달러입니다." },
      { speaker: "A", zh: "有别的颜色吗？", english: "Do you have another color?", spanish: "¿Tiene otro color?", japanese: "他の色はありますか？", korean: "다른 색 있나요?" },
    ],
  },
  {
    id: "directions-transport",
    group: "life",
    level: "实用",
    title: "问路交通",
    description: "出门、坐车、迷路时最常用。",
    items: [
      { zh: "这里怎么走？", english: "How do I get there?", spanish: "¿Cómo llego allí?", japanese: "そこへはどう行けばいいですか？", korean: "거기 어떻게 가나요?" },
      { zh: "地铁站在哪里？", english: "Where is the subway station?", spanish: "¿Dónde está la estación de metro?", japanese: "地下鉄の駅はどこですか？", korean: "지하철역이 어디예요?" },
      { zh: "我要去这个地址。", english: "I need to go to this address.", spanish: "Necesito ir a esta dirección.", japanese: "この住所に行きたいです。", korean: "이 주소로 가야 해요." },
      { zh: "我迷路了。", english: "I'm lost.", spanish: "Estoy perdido.", japanese: "道に迷いました。", korean: "길을 잃었어요." },
    ],
    dialogue: [
      { speaker: "A", zh: "不好意思，地铁站在哪里？", english: "Excuse me, where is the subway station?", spanish: "Disculpe, ¿dónde está la estación de metro?", japanese: "すみません、地下鉄の駅はどこですか？", korean: "실례합니다, 지하철역이 어디예요?" },
      { speaker: "B", zh: "一直走，然后左转。", english: "Go straight, then turn left.", spanish: "Siga recto y luego gire a la izquierda.", japanese: "まっすぐ行って、左に曲がってください。", korean: "쭉 가다가 왼쪽으로 도세요." },
      { speaker: "A", zh: "谢谢，帮大忙了。", english: "Thanks, that's very helpful.", spanish: "Gracias, me ayuda mucho.", japanese: "ありがとうございます。助かります。", korean: "감사합니다. 큰 도움이 됐어요." },
    ],
  },
  {
    id: "hotel-stay",
    group: "life",
    level: "实用",
    title: "酒店住宿",
    description: "入住、Wi-Fi、房间问题、退房。",
    items: [
      { zh: "我有预订。", english: "I have a reservation.", spanish: "Tengo una reserva.", japanese: "予約しています。", korean: "예약했어요." },
      { zh: "可以办理入住吗？", english: "Can I check in?", spanish: "¿Puedo hacer el check-in?", japanese: "チェックインできますか？", korean: "체크인할 수 있나요?" },
      { zh: "Wi-Fi 密码是多少？", english: "What is the Wi-Fi password?", spanish: "¿Cuál es la contraseña del Wi-Fi?", japanese: "Wi-Fiのパスワードは何ですか？", korean: "와이파이 비밀번호가 뭐예요?" },
      { zh: "房间有点问题。", english: "There is a problem with the room.", spanish: "Hay un problema con la habitación.", japanese: "部屋に少し問題があります。", korean: "방에 문제가 조금 있어요." },
    ],
    dialogue: [
      { speaker: "A", zh: "你好，我有预订。", english: "Hello, I have a reservation.", spanish: "Hola, tengo una reserva.", japanese: "こんにちは。予約しています。", korean: "안녕하세요. 예약했어요." },
      { speaker: "B", zh: "请问您的名字？", english: "May I have your name?", spanish: "¿Cuál es su nombre?", japanese: "お名前をお願いします。", korean: "성함이 어떻게 되세요?" },
      { speaker: "A", zh: "我还想问一下 Wi-Fi 密码。", english: "I'd also like to ask for the Wi-Fi password.", spanish: "También quisiera preguntar la contraseña del Wi-Fi.", japanese: "Wi-Fiのパスワードも教えてください。", korean: "와이파이 비밀번호도 알려 주세요." },
    ],
  },
  {
    id: "doctor-pharmacy",
    group: "life",
    level: "实用",
    title: "看病买药",
    description: "描述不舒服、买药、询问用法。",
    items: [
      { zh: "我不舒服。", english: "I don't feel well.", spanish: "No me siento bien.", japanese: "具合が悪いです。", korean: "몸이 안 좋아요." },
      { zh: "我头疼。", english: "I have a headache.", spanish: "Me duele la cabeza.", japanese: "頭が痛いです。", korean: "머리가 아파요." },
      { zh: "这个药怎么吃？", english: "How should I take this medicine?", spanish: "¿Cómo debo tomar este medicamento?", japanese: "この薬はどう飲めばいいですか？", korean: "이 약은 어떻게 먹어야 하나요?" },
      { zh: "需要看医生吗？", english: "Do I need to see a doctor?", spanish: "¿Necesito ver a un médico?", japanese: "医者に診てもらう必要がありますか？", korean: "의사를 봐야 하나요?" },
    ],
    dialogue: [
      { speaker: "A", zh: "我不舒服，有点头疼。", english: "I don't feel well. I have a headache.", spanish: "No me siento bien. Me duele la cabeza.", japanese: "具合が悪くて、少し頭が痛いです。", korean: "몸이 안 좋고 머리가 좀 아파요." },
      { speaker: "B", zh: "有发烧吗？", english: "Do you have a fever?", spanish: "¿Tiene fiebre?", japanese: "熱はありますか？", korean: "열이 있나요?" },
      { speaker: "A", zh: "没有，我想买点药。", english: "No. I'd like to buy some medicine.", spanish: "No. Quisiera comprar un medicamento.", japanese: "いいえ。薬を買いたいです。", korean: "아니요. 약을 좀 사고 싶어요." },
    ],
  },
  {
    id: "emergency-help",
    group: "life",
    level: "实用",
    title: "紧急求助",
    description: "手机没电、迷路、需要帮助时使用。",
    items: [
      { zh: "请帮帮我。", english: "Please help me.", spanish: "Por favor, ayúdeme.", japanese: "助けてください。", korean: "도와주세요." },
      { zh: "我手机没电了。", english: "My phone is out of battery.", spanish: "Mi teléfono se quedó sin batería.", japanese: "携帯の充電が切れました。", korean: "휴대폰 배터리가 없어요." },
      { zh: "请说慢一点。", english: "Please speak more slowly.", spanish: "Por favor, hable más despacio.", japanese: "もう少しゆっくり話してください。", korean: "조금 천천히 말해 주세요." },
      { zh: "我需要去医院。", english: "I need to go to a hospital.", spanish: "Necesito ir al hospital.", japanese: "病院に行く必要があります。", korean: "병원에 가야 해요." },
    ],
    dialogue: [
      { speaker: "A", zh: "不好意思，请帮帮我。", english: "Excuse me, please help me.", spanish: "Disculpe, por favor ayúdeme.", japanese: "すみません、助けてください。", korean: "실례합니다, 도와주세요." },
      { speaker: "B", zh: "发生什么事了？", english: "What happened?", spanish: "¿Qué pasó?", japanese: "どうしましたか？", korean: "무슨 일이에요?" },
      { speaker: "A", zh: "我迷路了，手机也没电。", english: "I'm lost, and my phone is out of battery.", spanish: "Estoy perdido y mi teléfono no tiene batería.", japanese: "道に迷って、携帯の充電も切れました。", korean: "길을 잃었고 휴대폰 배터리도 없어요." },
    ],
  },
];

function sceneDialogueLine(speaker, zh, english, spanish, japanese, korean) {
  return { speaker, zh, english, spanish, japanese, korean };
}

const SCENE_DIALOGUE_UPDATES = {
  "daily-checkin": [
    sceneDialogueLine("A", "今天怎么样？", "How's your day going?", "¿Cómo va tu día?", "今日はどんな感じ？", "오늘 하루 어때?"),
    sceneDialogueLine("B", "挺累，脑子有点不转了。", "Pretty tiring. My brain's kind of done.", "Bastante cansado. Ya no me da la cabeza.", "けっこう疲れた。頭がもう回らない。", "꽤 피곤해. 머리가 거의 멈췄어."),
    sceneDialogueLine("A", "忙到现在吗？", "You've been busy all day?", "¿Estuviste ocupado todo el día?", "一日中忙しかったの？", "하루 종일 바빴어?"),
    sceneDialogueLine("B", "差不多，消息一直没停。", "Pretty much. My messages wouldn't stop.", "Sí, casi. Los mensajes no paraban.", "ほぼね。メッセージが止まらなかった。", "거의. 메시지가 계속 왔어."),
    sceneDialogueLine("A", "那今晚别硬撑了。", "Then don't push it tonight.", "Entonces no te fuerces esta noche.", "今夜は無理しないで。", "오늘 밤은 무리하지 마."),
    sceneDialogueLine("B", "我想洗个澡然后躺平。", "I just wanna shower and do nothing.", "Solo quiero bañarme y no hacer nada.", "シャワー浴びて何もしたくない。", "그냥 샤워하고 아무것도 안 하고 싶어."),
    sceneDialogueLine("A", "可以，剩下的明天再说。", "Yeah, leave the rest for tomorrow.", "Sí, deja lo demás para mañana.", "うん、残りは明日にしよう。", "응, 나머지는 내일 해."),
    sceneDialogueLine("B", "听起来很合理，我就这么干。", "That sounds right. I'm doing that.", "Suena bien. Eso haré.", "それがよさそう。そうする。", "그게 맞겠다. 그렇게 할게."),
  ],
  "weekend-plans": [
    sceneDialogueLine("A", "周末有什么想法？", "Any thoughts for the weekend?", "¿Algún plan para el fin de semana?", "週末、何か考えてる？", "주말에 뭐 할 생각 있어?"),
    sceneDialogueLine("B", "想出去，但又想赖在家。", "I wanna go out, but I also wanna stay in.", "Quiero salir, pero también quiero quedarme en casa.", "出かけたいけど、家にもいたい。", "나가고 싶은데 집에도 있고 싶어."),
    sceneDialogueLine("A", "经典周末矛盾。", "Classic weekend problem.", "El problema clásico del fin de semana.", "週末あるあるだね。", "전형적인 주말 고민이네."),
    sceneDialogueLine("B", "要不找个轻松点的地方？", "Maybe somewhere low-key?", "¿Quizás un lugar tranquilo?", "どこか気楽な場所にする？", "좀 편한 데 갈까?"),
    sceneDialogueLine("A", "可以，喝杯咖啡走走？", "Yeah, coffee and a walk?", "Sí, ¿café y un paseo?", "いいね、コーヒー飲んで散歩する？", "좋아, 커피 마시고 좀 걸을까?"),
    sceneDialogueLine("B", "我可以，别安排太早。", "I'm down, just not too early.", "Me apunto, pero no muy temprano.", "いいよ、でも早すぎるのはやめて。", "좋아, 너무 이르지만 않으면."),
    sceneDialogueLine("A", "中午以后，完美。", "After noon. Perfect.", "Después del mediodía. Perfecto.", "昼過ぎね。完璧。", "점심 이후. 딱 좋아."),
    sceneDialogueLine("B", "成，到时候发我地址。", "Deal. Send me the place then.", "Hecho. Mándame el lugar entonces.", "決まり。あとで場所送って。", "좋아. 그때 장소 보내줘."),
  ],
  "food-chat": [
    sceneDialogueLine("A", "今天吃什么了？", "What'd you eat today?", "¿Qué comiste hoy?", "今日は何食べた？", "오늘 뭐 먹었어?"),
    sceneDialogueLine("B", "随便吃了点，没啥灵魂。", "Just grabbed something. Nothing exciting.", "Comí cualquier cosa. Nada especial.", "適当に食べた。特に面白くない。", "그냥 대충 먹었어. 별건 아니야."),
    sceneDialogueLine("A", "那晚饭认真吃。", "Then dinner needs to be good.", "Entonces la cena tiene que ser buena.", "じゃあ夕飯はちゃんとおいしいものにしよう。", "그럼 저녁은 제대로 먹어야지."),
    sceneDialogueLine("B", "我想吃辣的，真的辣那种。", "I want something spicy. Like actually spicy.", "Quiero algo picante, de verdad picante.", "辛いものが食べたい。本当に辛いやつ。", "매운 거 먹고 싶어. 진짜 매운 거."),
    sceneDialogueLine("A", "我知道一家店，味道很顶。", "I know a spot that's really good.", "Conozco un lugar muy bueno.", "すごくおいしい店知ってる。", "진짜 맛있는 곳 알아."),
    sceneDialogueLine("B", "别光说，发地址。", "Don't just tease me. Send the address.", "No me dejes con la duda. Manda la dirección.", "気になること言わないで、住所送って。", "말만 하지 말고 주소 보내."),
    sceneDialogueLine("A", "发了，别怪我让你上瘾。", "Sent. Don't blame me if you get hooked.", "Ya te lo mandé. No me culpes si te enganchas.", "送ったよ。ハマっても私のせいにしないで。", "보냈어. 중독돼도 내 탓 하지 마."),
    sceneDialogueLine("B", "如果好吃，下次我请。", "If it's good, dinner's on me next time.", "Si está bueno, la próxima invito yo.", "おいしかったら次は私がおごる。", "맛있으면 다음엔 내가 살게."),
  ],
  "coffee-tea": [
    sceneDialogueLine("A", "我需要来点咖啡续命。", "I need coffee to function.", "Necesito café para funcionar.", "コーヒーがないと動けない。", "커피 없으면 못 움직이겠어."),
    sceneDialogueLine("B", "同感，我现在像低电量模式。", "Same. I'm on low-battery mode.", "Igual. Estoy en modo batería baja.", "同じく。今低電力モード。", "나도. 지금 배터리 부족 모드야."),
    sceneDialogueLine("A", "走，买一杯？", "Wanna grab one?", "¿Vamos por uno?", "買いに行く？", "한 잔 사러 갈래?"),
    sceneDialogueLine("B", "可以，但我想喝奶茶。", "Yeah, but I'm feeling milk tea.", "Sí, pero se me antoja té con leche.", "いいよ、でもミルクティーの気分。", "좋아, 근데 난 밀크티가 당겨."),
    sceneDialogueLine("A", "少糖还是正常糖？", "Less sugar or regular?", "¿Menos azúcar o normal?", "砂糖少なめ？普通？", "당도 낮게? 보통?"),
    sceneDialogueLine("B", "少糖少冰，我不想甜到发晕。", "Less sugar, less ice. I don't want it crazy sweet.", "Menos azúcar y menos hielo. No lo quiero tan dulce.", "砂糖少なめ、氷少なめ。甘すぎるのは無理。", "당도 낮게, 얼음 적게. 너무 달면 싫어."),
    sceneDialogueLine("A", "行，我顺手也点一杯。", "Cool, I'll order one too.", "Va, yo también pido uno.", "了解、私も一杯頼む。", "좋아, 나도 하나 시킬게."),
    sceneDialogueLine("B", "买完边走边聊。", "Let's walk and talk after we get them.", "Después caminamos y hablamos.", "買ったら歩きながら話そう。", "사고 나서 걸으면서 얘기하자."),
  ],
  "movies-shows": [
    sceneDialogueLine("A", "最近有啥好看的？", "Anything good to watch lately?", "¿Algo bueno para ver últimamente?", "最近何か面白いのある？", "요즘 볼 만한 거 있어?"),
    sceneDialogueLine("B", "有一部剧我昨晚差点看通宵。", "There's a show I almost stayed up all night watching.", "Hay una serie que casi me tuvo despierto toda la noche.", "昨日ほぼ徹夜で見そうになったドラマがある。", "어젯밤 거의 밤새 볼 뻔한 드라마 있어."),
    sceneDialogueLine("A", "别剧透，先说值不值得看。", "No spoilers. Just tell me if it's worth it.", "Sin spoilers. Solo dime si vale la pena.", "ネタバレなしで、見る価値あるかだけ教えて。", "스포 말고 볼 만한지만 말해줘."),
    sceneDialogueLine("B", "值得，节奏很快，不拖。", "Worth it. It moves fast and doesn't drag.", "Sí vale la pena. Va rápido y no se alarga.", "見る価値ある。テンポがよくてだれない。", "볼 만해. 전개 빠르고 안 늘어져."),
    sceneDialogueLine("A", "我就怕那种前两集很慢的。", "I hate when the first two episodes are super slow.", "Odio cuando los primeros episodios son lentísimos.", "最初の二話が遅いの苦手。", "초반 두 편이 너무 느린 거 싫어."),
    sceneDialogueLine("B", "这个不会，第一集就进状态。", "This one doesn't. It gets going right away.", "Esta no. Arranca enseguida.", "これは違う。第一話から面白い。", "이건 아니야. 첫 화부터 바로 몰입돼."),
    sceneDialogueLine("A", "行，周末我开看。", "Alright, I'll start it this weekend.", "Va, la empiezo este fin de semana.", "じゃあ週末見始める。", "좋아, 주말에 보기 시작할게."),
    sceneDialogueLine("B", "看完来找我吐槽。", "Come rant to me when you're done.", "Cuando termines, ven a comentarla conmigo.", "見終わったら感想言いに来て。", "다 보면 나한테 얘기해."),
  ],
  "music-share": [
    sceneDialogueLine("A", "最近循环哪首歌？", "What song's been on repeat for you?", "¿Qué canción tienes en repetición?", "最近何をリピートしてる？", "요즘 무슨 노래 반복 재생해?"),
    sceneDialogueLine("B", "有一首太上头了，我已经听腻又听回来了。", "One song has me hooked. I got sick of it and came back anyway.", "Una me tiene enganchado. Me cansé y aun así volví.", "ハマってる曲がある。飽きたのにまた戻ってきた。", "중독된 노래가 있어. 질렸는데도 다시 듣게 돼."),
    sceneDialogueLine("A", "这才是真爱。", "That's real love.", "Eso sí es amor.", "それは本物の愛だね。", "그건 진짜 사랑이네."),
    sceneDialogueLine("B", "我发你，你戴耳机听。", "I'll send it. Listen with headphones.", "Te la mando. Escúchala con audífonos.", "送るね。イヤホンで聴いて。", "보내줄게. 이어폰 끼고 들어."),
    sceneDialogueLine("A", "好，如果不好听我要吐槽。", "Okay, but if it's bad, I'm judging you.", "Vale, pero si es mala, te voy a criticar.", "いいよ。でも微妙だったら突っ込むよ。", "좋아, 별로면 놀릴 거야."),
    sceneDialogueLine("B", "随便吐槽，副歌肯定会抓住你。", "Judge away. The chorus will get you.", "Critica lo que quieras. El coro te va a atrapar.", "どうぞ。サビで絶対つかまれるから。", "마음대로 해. 후렴은 분명 꽂힐 거야."),
    sceneDialogueLine("A", "那我期待一下。", "Now I'm curious.", "Ahora me dio curiosidad.", "ちょっと気になってきた。", "이제 궁금해졌어."),
    sceneDialogueLine("B", "听完告诉我你最喜欢哪句。", "Tell me your favorite line after you listen.", "Cuando la escuches, dime tu frase favorita.", "聴いたら好きな歌詞教えて。", "듣고 나서 제일 좋은 가사 말해줘."),
  ],
  "gaming-chat": [
    sceneDialogueLine("A", "今晚上线吗？", "You getting on tonight?", "¿Te conectas esta noche?", "今夜ログインする？", "오늘 밤 접속해?"),
    sceneDialogueLine("B", "看情况，我还有点事没收尾。", "Maybe. I still have a couple things to finish.", "Depende. Todavía tengo un par de cosas que terminar.", "状況次第。まだ少し片付けることがある。", "상황 봐서. 아직 마무리할 일이 좀 있어."),
    sceneDialogueLine("A", "行，我先热身两把。", "Cool, I'll warm up with a couple rounds.", "Vale, juego un par de partidas para calentar.", "了解、先に何戦か慣らしておく。", "좋아, 나는 먼저 몇 판 몸 풀게."),
    sceneDialogueLine("B", "别又一热身就打到半夜。", "Don't turn warm-up into playing till midnight again.", "No conviertas el calentamiento en jugar hasta medianoche otra vez.", "またウォームアップが深夜までにならないでね。", "또 몸 푼다면서 자정까지 하지 마."),
    sceneDialogueLine("A", "那是意外，主要是队友太离谱。", "That was an accident. My teammates were just wild.", "Fue un accidente. Mis compañeros estaban fatal.", "あれは事故。味方がひどすぎた。", "그건 사고였어. 팀원이 너무했어."),
    sceneDialogueLine("B", "每次都怪队友，懂了。", "Always blaming the team. Got it.", "Siempre culpando al equipo, entendido.", "毎回味方のせいね、了解。", "항상 팀 탓이네, 알겠어."),
    sceneDialogueLine("A", "今晚你来带飞。", "Then you carry tonight.", "Entonces tú nos cargas esta noche.", "じゃあ今夜は君がキャリーして。", "그럼 오늘 밤 네가 캐리해."),
    sceneDialogueLine("B", "可以，但输了别甩锅给我。", "Fine, but don't blame me if we lose.", "Vale, pero si perdemos no me culpes.", "いいよ。でも負けても私のせいにしないで。", "좋아, 근데 지면 내 탓 하지 마."),
  ],
  "work-vent": [
    sceneDialogueLine("A", "你今天脸上写着下班两个字。", "Your face says you need to clock out.", "Tu cara dice que necesitas salir del trabajo.", "顔にもう退勤したいって書いてある。", "얼굴에 퇴근하고 싶다고 써 있어."),
    sceneDialogueLine("B", "太准了，我已经被会议榨干。", "Too accurate. Meetings drained me.", "Demasiado exacto. Las reuniones me dejaron seco.", "当たり。会議で全部吸い取られた。", "정확해. 회의가 나를 다 빼갔어."),
    sceneDialogueLine("A", "又是那种讲半天没结论的会？", "One of those long meetings with no point?", "¿Otra reunión larga sin conclusión?", "また長いだけで結論ない会議？", "또 길기만 하고 결론 없는 회의?"),
    sceneDialogueLine("B", "对，最后还多了两个任务。", "Yep, and somehow I got two more tasks.", "Sí, y encima me cayeron dos tareas más.", "そう。しかも最後に仕事が二つ増えた。", "맞아. 마지막에 일 두 개가 더 생겼어."),
    sceneDialogueLine("A", "太惨了，今晚别看工作消息了。", "Brutal. Don't check work messages tonight.", "Qué duro. No mires mensajes de trabajo esta noche.", "きついね。今夜は仕事のメッセージ見ないで。", "힘들겠다. 오늘 밤은 업무 메시지 보지 마."),
    sceneDialogueLine("B", "我也想，但手机一直震。", "I want to, but my phone keeps buzzing.", "Quiero, pero el teléfono no deja de vibrar.", "そうしたいけど、携帯がずっと鳴る。", "그러고 싶은데 휴대폰이 계속 울려."),
    sceneDialogueLine("A", "开勿扰，真的。", "Put it on Do Not Disturb. Seriously.", "Ponlo en no molestar, en serio.", "本当に、おやすみモードにして。", "방해 금지 켜. 진짜로."),
    sceneDialogueLine("B", "好，我给自己放个假一晚上。", "Okay, I'm giving myself the night off.", "Vale, me doy la noche libre.", "わかった。今夜は自分に休みをあげる。", "좋아, 오늘 밤은 나한테 휴가 줄게."),
  ],
  "study-vent": [
    sceneDialogueLine("A", "学得怎么样了？", "How's studying going?", "¿Cómo va el estudio?", "勉強どう？", "공부 어때?"),
    sceneDialogueLine("B", "说实话，我刚看完一页就开始走神。", "Honestly, I read one page and immediately zoned out.", "La verdad, leí una página y enseguida me distraje.", "正直、一ページ読んだだけでぼーっとした。", "솔직히 한 페이지 읽자마자 딴생각했어."),
    sceneDialogueLine("A", "那先别硬啃，换个小目标。", "Then don't force it. Pick a smaller goal.", "Entonces no te fuerces. Ponte una meta más pequeña.", "無理に続けないで、小さい目標にしよう。", "억지로 하지 말고 작은 목표로 바꿔."),
    sceneDialogueLine("B", "比如？", "Like what?", "¿Como qué?", "例えば？", "예를 들면?"),
    sceneDialogueLine("A", "先搞懂这一段，别管后面。", "Just understand this one section first. Ignore the rest.", "Primero entiende esta parte. Ignora lo demás.", "まずこの部分だけ理解しよう。後ろは置いておいて。", "일단 이 부분만 이해해. 나머지는 신경 쓰지 말고."),
    sceneDialogueLine("B", "这样听起来没那么吓人。", "That sounds way less scary.", "Así suena mucho menos pesado.", "それなら怖くない感じがする。", "그렇게 하니까 덜 무섭다."),
    sceneDialogueLine("A", "等会儿你讲给我听，我帮你卡漏洞。", "Explain it to me later, and I'll catch the gaps.", "Luego me lo explicas y te ayudo a encontrar huecos.", "あとで私に説明して。抜けてるところ見るよ。", "이따 나한테 설명해봐. 빈틈 봐줄게."),
    sceneDialogueLine("B", "成交，我先把这一段拿下。", "Deal. I'll knock out this section first.", "Hecho. Primero saco esta parte.", "決まり。まずここを片付ける。", "좋아. 이 부분부터 끝낼게."),
  ],
  "emotional-support": [
    sceneDialogueLine("A", "你今天有点不在状态。", "You seem a little off today.", "Hoy te noto un poco apagado.", "今日は少し元気なさそう。", "오늘 좀 평소 같지 않아 보여."),
    sceneDialogueLine("B", "嗯，有点烦，但也说不上来。", "Yeah, I'm upset, but I can't really explain it.", "Sí, estoy molesto, pero no sé explicarlo.", "うん、もやもやするけど説明しにくい。", "응, 좀 답답한데 설명을 잘 못하겠어."),
    sceneDialogueLine("A", "不用马上说清楚。", "You don't have to make sense of it right away.", "No tienes que entenderlo todo ahora mismo.", "すぐに整理しなくてもいいよ。", "지금 바로 정리하지 않아도 돼."),
    sceneDialogueLine("B", "我就是觉得心里堵。", "I just feel heavy.", "Solo siento un peso dentro.", "ただ胸が重い感じ。", "그냥 마음이 무거워."),
    sceneDialogueLine("A", "那我陪你待会儿，不逼你聊天。", "I'll hang out with you. No pressure to talk.", "Me quedo contigo. No tienes que hablar si no quieres.", "そばにいるよ。話さなくても大丈夫。", "내가 옆에 있을게. 억지로 말 안 해도 돼."),
    sceneDialogueLine("B", "谢谢，这样就好多了。", "Thanks. That already helps.", "Gracias. Eso ya ayuda.", "ありがとう。それだけで少し楽。", "고마워. 그것만으로도 좀 낫다."),
    sceneDialogueLine("A", "要不要出去走一小圈？", "Want to take a short walk?", "¿Quieres dar una vuelta corta?", "少し散歩する？", "잠깐 산책할래?"),
    sceneDialogueLine("B", "好，换个空气也许会好点。", "Yeah, some fresh air might help.", "Sí, un poco de aire fresco puede ayudar.", "うん、空気変えたら少しよくなるかも。", "응, 바람 좀 쐬면 나아질 것 같아."),
  ],
  "late-night-chat": [
    sceneDialogueLine("A", "你怎么还没睡？", "Why are you still up?", "¿Por qué sigues despierto?", "なんでまだ起きてるの？", "왜 아직 안 자?"),
    sceneDialogueLine("B", "睡不着，脑子一直开小剧场。", "Can't sleep. My brain keeps making up scenarios.", "No puedo dormir. Mi cabeza no para de inventar cosas.", "眠れない。頭が勝手にいろいろ考える。", "잠이 안 와. 머릿속에서 계속 상상해."),
    sceneDialogueLine("A", "深夜脑子最会加戏。", "Late-night brain is dramatic like that.", "La mente de noche siempre exagera.", "夜中の頭って大げさだよね。", "밤에는 머리가 괜히 과장하지."),
    sceneDialogueLine("B", "真的，越想越清醒。", "Seriously. The more I think, the more awake I get.", "En serio. Cuanto más pienso, más despierto estoy.", "本当。考えるほど目が覚める。", "진짜. 생각할수록 더 깨어 있어."),
    sceneDialogueLine("A", "那先别刷手机了。", "Then stop scrolling for a bit.", "Entonces deja el celular un rato.", "じゃあ少しスマホ見るのやめよう。", "그럼 잠깐 폰 내려놔."),
    sceneDialogueLine("B", "被抓到了，我刚还在刷。", "Caught me. I was literally scrolling.", "Me atrapaste. Justo estaba mirando el celular.", "ばれた。まさに今見てた。", "들켰네. 방금도 보고 있었어."),
    sceneDialogueLine("A", "我陪你聊五分钟，然后你去睡。", "I'll talk with you for five minutes, then you sleep.", "Hablo contigo cinco minutos y luego duermes.", "五分だけ話そう。そのあと寝て。", "5분만 얘기하고 자자."),
    sceneDialogueLine("B", "行，五分钟后你要赶我去睡。", "Deal. Kick me off after five.", "Vale. Después de cinco minutos me mandas a dormir.", "わかった。五分後に寝ろって言って。", "좋아. 5분 뒤엔 나 자라고 해줘."),
  ],
  "encourage-friend": [
    sceneDialogueLine("A", "我有点不敢试。", "I'm kind of scared to try.", "Me da un poco de miedo intentarlo.", "ちょっと挑戦するのが怖い。", "시도하기가 좀 무서워."),
    sceneDialogueLine("B", "怕也正常，但你不是没准备。", "Being scared makes sense, but you're not unprepared.", "Es normal tener miedo, pero no estás sin preparación.", "怖いのは普通。でも準備してないわけじゃない。", "무서운 건 당연해. 그래도 준비 안 한 건 아니잖아."),
    sceneDialogueLine("A", "我总觉得自己不够好。", "I keep feeling like I'm not good enough.", "Sigo sintiendo que no soy suficiente.", "自分が足りない気がする。", "내가 부족한 것 같아."),
    sceneDialogueLine("B", "你是在紧张，不是在失败。", "You're nervous, not failing.", "Estás nervioso, no fracasando.", "緊張してるだけで、失敗してるわけじゃない。", "긴장한 거지 실패한 게 아니야."),
    sceneDialogueLine("A", "这句话有点救我。", "That actually helps.", "Eso sí me ayuda.", "その言葉、ちょっと救われる。", "그 말 좀 도움이 된다."),
    sceneDialogueLine("B", "先迈一小步，别一次想太远。", "Take one small step. Don't zoom too far ahead.", "Da un paso pequeño. No pienses tan lejos.", "まず一歩だけ。先のことを考えすぎないで。", "작게 한 발만 떼. 너무 멀리 보지 말고."),
    sceneDialogueLine("A", "好，我先把第一步做了。", "Okay, I'll do the first step.", "Vale, haré el primer paso.", "うん、まず最初の一歩をやる。", "좋아, 첫 단계부터 할게."),
    sceneDialogueLine("B", "做完告诉我，我给你鼓掌。", "Tell me when it's done. I'll clap for you.", "Cuando lo hagas, dime. Te aplaudo.", "終わったら教えて。拍手するから。", "끝나면 알려줘. 박수 쳐줄게."),
  ],
  "shopping-share": [
    sceneDialogueLine("A", "我刚看到一个东西，差点下单。", "I just saw something and almost bought it.", "Acabo de ver algo y casi lo compro.", "さっき見たもの、危うく買いそうだった。", "방금 뭐 봤는데 거의 살 뻔했어."),
    sceneDialogueLine("B", "发来，我帮你冷静一下。", "Send it. I'll talk you down.", "Mándalo. Te ayudo a pensarlo.", "送って。冷静にさせてあげる。", "보내봐. 내가 진정시켜줄게."),
    sceneDialogueLine("A", "但它真的很好看。", "But it's honestly so nice.", "Pero de verdad está muy bonito.", "でも本当にすごくいい。", "근데 진짜 예뻐."),
    sceneDialogueLine("B", "好看和需要是两回事。", "Cute and necessary are two different things.", "Bonito y necesario son dos cosas distintas.", "かわいいのと必要なのは別。", "예쁜 거랑 필요한 건 다르지."),
    sceneDialogueLine("A", "你怎么这么清醒。", "Why are you being so reasonable?", "¿Por qué eres tan sensato?", "なんでそんなに冷静なの。", "왜 이렇게 이성적이야."),
    sceneDialogueLine("B", "因为我上周刚冲动消费过。", "Because I impulse-bought something last week.", "Porque yo compré por impulso la semana pasada.", "先週衝動買いしたばかりだから。", "지난주에 내가 충동구매했거든."),
    sceneDialogueLine("A", "行，那我先放购物车。", "Fine, I'll just leave it in the cart.", "Vale, lo dejo en el carrito.", "じゃあ一旦カートに入れておく。", "좋아, 일단 장바구니에 넣어둘게."),
    sceneDialogueLine("B", "明天还想要再买，今天先别冲。", "If you still want it tomorrow, buy it then. Not tonight.", "Si mañana todavía lo quieres, cómpralo. Hoy no.", "明日も欲しかったら買おう。今日はやめて。", "내일도 사고 싶으면 그때 사. 오늘은 참아."),
  ],
  "photos-social": [
    sceneDialogueLine("A", "帮我拍一张，别拍成证件照。", "Take a pic of me, but don't make it look like a passport photo.", "Tómame una foto, pero que no parezca de pasaporte.", "写真撮って。証明写真みたいにはしないで。", "사진 찍어줘. 증명사진처럼 찍지는 말고."),
    sceneDialogueLine("B", "放心，我有点审美。", "Relax, I have some taste.", "Tranqui, tengo algo de gusto.", "大丈夫、少しはセンスあるから。", "걱정 마, 나 감각 좀 있어."),
    sceneDialogueLine("A", "这边光线可以吗？", "Is the light okay here?", "¿La luz está bien aquí?", "ここ光いい？", "여기 빛 괜찮아?"),
    sceneDialogueLine("B", "往左一点，背景更干净。", "Move left a bit. The background's cleaner.", "Muévete un poco a la izquierda. El fondo se ve mejor.", "少し左に。背景がすっきりする。", "왼쪽으로 조금. 배경이 더 깔끔해."),
    sceneDialogueLine("A", "别拍太近，我会紧张。", "Don't get too close. I'll get awkward.", "No te acerques tanto. Me pongo raro.", "近すぎないで。ぎこちなくなる。", "너무 가까이 찍지 마. 어색해져."),
    sceneDialogueLine("B", "自然点，假装你没看镜头。", "Act natural, like you're not looking at the camera.", "Hazlo natural, como si no miraras la cámara.", "自然に。カメラ見てないふりして。", "자연스럽게, 카메라 안 보는 척해."),
    sceneDialogueLine("A", "这张不错，我能发。", "This one's good. I can post it.", "Esta está buena. La puedo subir.", "これいいね。投稿できる。", "이거 괜찮다. 올려도 되겠어."),
    sceneDialogueLine("B", "我就说我有点东西。", "Told you I know what I'm doing.", "Te dije que sabía lo que hacía.", "言ったでしょ、ちょっとできるって。", "내가 좀 한다고 했지."),
  ],
  "ordering-food": [
    sceneDialogueLine("A", "欢迎光临，想吃点什么？", "Hey, what can I get for you?", "Hola, ¿qué te pongo?", "いらっしゃいませ。何にしますか？", "어서 오세요. 뭐 드릴까요?"),
    sceneDialogueLine("B", "我先看一下菜单。", "Let me take a quick look at the menu.", "Déjame ver el menú un momento.", "メニューを少し見ます。", "메뉴 좀 볼게요."),
    sceneDialogueLine("A", "没问题，今天这个套餐卖得很好。", "No rush. This combo's been popular today.", "Sin prisa. Este combo se está vendiendo mucho hoy.", "どうぞ。今日はこのセットが人気です。", "천천히 보세요. 오늘 이 세트가 잘 나가요."),
    sceneDialogueLine("B", "那我来这个，饮料可以换吗？", "I'll do that one. Can I swap the drink?", "Entonces quiero ese. ¿Puedo cambiar la bebida?", "それにします。飲み物は変えられますか？", "그걸로 할게요. 음료 바꿀 수 있나요?"),
    sceneDialogueLine("A", "可以，咖啡、茶或者可乐。", "Yep. Coffee, tea, or Coke.", "Sí. Café, té o cola.", "できます。コーヒー、お茶、コーラがあります。", "네. 커피, 차, 콜라 있어요."),
    sceneDialogueLine("B", "要冰茶，少冰。", "Iced tea, light ice, please.", "Té frío, con poco hielo, por favor.", "アイスティー、氷少なめで。", "아이스티요. 얼음 적게 해 주세요."),
    sceneDialogueLine("A", "堂食还是带走？", "For here or to go?", "¿Para aquí o para llevar?", "店内ですか、お持ち帰りですか？", "매장에서 드시나요, 포장인가요?"),
    sceneDialogueLine("B", "带走，谢谢。", "To go, thanks.", "Para llevar, gracias.", "持ち帰りでお願いします。", "포장해 주세요. 감사합니다."),
  ],
  "shopping-basic": [
    sceneDialogueLine("A", "这个有别的颜色吗？", "Does this come in another color?", "¿Esto viene en otro color?", "これ、他の色ありますか？", "이거 다른 색도 있나요?"),
    sceneDialogueLine("B", "有，黑色和浅蓝色。", "Yeah, black and light blue.", "Sí, negro y azul claro.", "あります。黒と水色です。", "네, 검정색이랑 연파랑 있어요."),
    sceneDialogueLine("A", "我可以试一下浅蓝色吗？", "Can I try the light blue one?", "¿Puedo probarme el azul claro?", "水色を試着できますか？", "연파랑 입어봐도 될까요?"),
    sceneDialogueLine("B", "当然，试衣间在右边。", "Of course. Fitting rooms are on the right.", "Claro. Los probadores están a la derecha.", "もちろんです。試着室は右側です。", "물론이죠. 피팅룸은 오른쪽이에요."),
    sceneDialogueLine("A", "这个有点大，有小一号吗？", "This is a little big. Do you have one size down?", "Me queda un poco grande. ¿Tiene una talla menos?", "少し大きいです。一つ小さいサイズありますか？", "이거 좀 커요. 한 사이즈 작은 거 있나요?"),
    sceneDialogueLine("B", "我帮你看一下库存。", "Let me check the stock for you.", "Déjame revisar el inventario.", "在庫を確認しますね。", "재고 확인해드릴게요."),
    sceneDialogueLine("A", "如果有的话我就拿。", "If you have it, I'll take it.", "Si la tienen, me la llevo.", "あったらそれにします。", "있으면 그걸로 할게요."),
    sceneDialogueLine("B", "有，我拿过来给你。", "We do. I'll bring it over.", "Sí hay. Te la traigo.", "あります。持ってきます。", "있어요. 가져다드릴게요."),
  ],
  "directions-transport": [
    sceneDialogueLine("A", "不好意思，这附近有地铁站吗？", "Excuse me, is there a subway station around here?", "Disculpa, ¿hay una estación de metro por aquí?", "すみません、この辺に地下鉄の駅はありますか？", "실례합니다, 이 근처에 지하철역 있나요?"),
    sceneDialogueLine("B", "有，走路大概五分钟。", "Yeah, about a five-minute walk.", "Sí, a unos cinco minutos caminando.", "あります。歩いて五分くらいです。", "네, 걸어서 5분 정도예요."),
    sceneDialogueLine("A", "往哪边走？我有点迷路。", "Which way? I'm a little turned around.", "¿Por dónde? Estoy un poco perdido.", "どっちですか？少し迷っています。", "어느 쪽이에요? 제가 좀 헷갈려서요."),
    sceneDialogueLine("B", "直走到路口，然后右转。", "Go straight to the corner, then turn right.", "Sigue recto hasta la esquina y gira a la derecha.", "角までまっすぐ行って、右に曲がってください。", "모퉁이까지 쭉 가서 오른쪽으로 도세요."),
    sceneDialogueLine("A", "右转之后能看到标志吗？", "Will I see a sign after I turn?", "¿Veré un letrero después de girar?", "曲がったら標識が見えますか？", "돌면 표지판이 보이나요?"),
    sceneDialogueLine("B", "能，入口就在便利店旁边。", "Yep, the entrance is right next to the convenience store.", "Sí, la entrada está al lado de la tienda.", "はい、入口はコンビニのすぐ隣です。", "네, 입구가 편의점 바로 옆에 있어요."),
    sceneDialogueLine("A", "太好了，谢谢你。", "Perfect, thanks so much.", "Perfecto, muchas gracias.", "助かりました。ありがとうございます。", "좋아요. 정말 감사합니다."),
    sceneDialogueLine("B", "没事，别走反方向就行。", "No problem. Just don't go the other way.", "De nada. Solo no vayas hacia el otro lado.", "どういたしまして。逆方向に行かなければ大丈夫です。", "괜찮아요. 반대쪽으로만 가지 마세요."),
  ],
  "hotel-stay": [
    sceneDialogueLine("A", "你好，我来办理入住。", "Hi, I'm here to check in.", "Hola, vengo a hacer el check-in.", "こんにちは、チェックインお願いします。", "안녕하세요, 체크인하려고요."),
    sceneDialogueLine("B", "好的，请问预订姓名？", "Sure. What's the name on the reservation?", "Claro. ¿A nombre de quién está la reserva?", "はい、ご予約のお名前は？", "네. 예약자 성함이 어떻게 되세요?"),
    sceneDialogueLine("A", "是 Jay，应该订了两晚。", "It's under Jay. It should be for two nights.", "Está a nombre de Jay. Debería ser por dos noches.", "Jayです。二泊のはずです。", "Jay로 예약했어요. 2박일 거예요."),
    sceneDialogueLine("B", "找到了，房间已经准备好了。", "Got it. Your room is ready.", "Aquí está. Su habitación ya está lista.", "確認できました。お部屋はご用意できています。", "확인됐습니다. 방 준비되어 있어요."),
    sceneDialogueLine("A", "太好了，Wi-Fi 密码在哪里看？", "Great. Where can I find the Wi-Fi password?", "Genial. ¿Dónde encuentro la contraseña del Wi-Fi?", "よかったです。Wi-Fiのパスワードはどこで見られますか？", "좋아요. 와이파이 비밀번호는 어디서 볼 수 있나요?"),
    sceneDialogueLine("B", "房卡套上有，也可以扫码。", "It's on the key card sleeve, or you can scan this code.", "Está en la funda de la tarjeta, o puede escanear este código.", "カードケースにあります。こちらのQRコードでも確認できます。", "키 카드 케이스에 있고, 이 QR코드로도 확인할 수 있어요."),
    sceneDialogueLine("A", "退房时间是几点？", "What time is checkout?", "¿A qué hora es el check-out?", "チェックアウトは何時ですか？", "체크아웃은 몇 시인가요?"),
    sceneDialogueLine("B", "上午十一点，需要延迟可以告诉我们。", "Eleven in the morning. Let us know if you need a late checkout.", "A las once de la mañana. Avísenos si necesita salida tarde.", "午前11時です。延長が必要ならお知らせください。", "오전 11시입니다. 늦은 체크아웃이 필요하면 말씀해 주세요."),
  ],
  "doctor-pharmacy": [
    sceneDialogueLine("A", "你好，我想买点感冒药。", "Hi, I'm looking for something for a cold.", "Hola, busco algo para el resfriado.", "こんにちは、風邪薬を探しています。", "안녕하세요, 감기약을 찾고 있어요."),
    sceneDialogueLine("B", "有什么症状？", "What symptoms do you have?", "¿Qué síntomas tienes?", "どんな症状がありますか？", "어떤 증상이 있나요?"),
    sceneDialogueLine("A", "喉咙痛，还有点头疼。", "Sore throat and a bit of a headache.", "Dolor de garganta y un poco de dolor de cabeza.", "喉が痛くて、少し頭も痛いです。", "목이 아프고 머리도 조금 아파요."),
    sceneDialogueLine("B", "有发烧吗？", "Any fever?", "¿Tienes fiebre?", "熱はありますか？", "열은 있나요?"),
    sceneDialogueLine("A", "没有，就是整个人没精神。", "No, I just feel really run-down.", "No, solo me siento sin energía.", "ないです。ただ体がだるいです。", "아니요. 그냥 몸이 많이 축 처져요."),
    sceneDialogueLine("B", "这个可以缓解喉咙痛，饭后吃。", "This should help with the sore throat. Take it after meals.", "Esto ayuda con la garganta. Tómalo después de comer.", "これは喉の痛みに効きます。食後に飲んでください。", "이건 목 통증에 도움이 돼요. 식후에 드세요."),
    sceneDialogueLine("A", "一天吃几次？", "How many times a day?", "¿Cuántas veces al día?", "一日何回ですか？", "하루에 몇 번 먹나요?"),
    sceneDialogueLine("B", "一天两次，如果更严重就去看医生。", "Twice a day. If it gets worse, see a doctor.", "Dos veces al día. Si empeora, ve al médico.", "一日二回です。悪化したら病院へ行ってください。", "하루 두 번이요. 더 심해지면 병원에 가세요."),
  ],
  "emergency-help": [
    sceneDialogueLine("A", "不好意思，可以帮我一下吗？", "Excuse me, could you help me for a second?", "Disculpa, ¿me puedes ayudar un momento?", "すみません、少し助けてもらえますか？", "실례합니다, 잠깐 도와주실 수 있나요?"),
    sceneDialogueLine("B", "当然，怎么了？", "Of course. What's wrong?", "Claro. ¿Qué pasó?", "もちろんです。どうしましたか？", "물론이죠. 무슨 일이에요?"),
    sceneDialogueLine("A", "我迷路了，手机也快没电。", "I'm lost, and my phone's almost dead.", "Estoy perdido y mi teléfono casi no tiene batería.", "道に迷って、携帯の電池ももうすぐ切れます。", "길을 잃었고 휴대폰 배터리도 거의 없어요."),
    sceneDialogueLine("B", "你要去哪里？", "Where are you trying to go?", "¿A dónde necesitas ir?", "どこへ行きたいですか？", "어디로 가려고 하세요?"),
    sceneDialogueLine("A", "我要去这个地址。", "I'm trying to get to this address.", "Necesito llegar a esta dirección.", "この住所に行きたいです。", "이 주소로 가야 해요."),
    sceneDialogueLine("B", "这里不远，我帮你叫车更快。", "It's not far. Calling a ride would be faster.", "No está lejos. Pedir un coche sería más rápido.", "ここから遠くないです。車を呼ぶ方が早いです。", "멀지 않아요. 차를 부르는 게 더 빠를 거예요."),
    sceneDialogueLine("A", "太谢谢了，我有点慌。", "Thank you so much. I was getting nervous.", "Muchas gracias. Me estaba poniendo nervioso.", "本当にありがとうございます。少し焦っていました。", "정말 감사합니다. 좀 당황했어요."),
    sceneDialogueLine("B", "没事，先站这边安全一点。", "No worries. Stand over here where it's safer.", "No pasa nada. Quédate aquí, es más seguro.", "大丈夫です。まず安全なこちらに立ってください。", "괜찮아요. 우선 이쪽이 더 안전하니 여기 서 계세요."),
  ],
};

SCENE_LIBRARY.forEach((scene) => {
  const dialogue = SCENE_DIALOGUE_UPDATES[scene.id];
  if (!dialogue) return;
  scene.items = [];
  scene.dialogue = dialogue;
});

function normalizeLearningLanguage(code) {
  return LEARNING_LANGUAGES[code] ? code : "english";
}

function getLearningLanguageConfig(code = currentLearningLanguage) {
  return LEARNING_LANGUAGES[normalizeLearningLanguage(code)] || LEARNING_LANGUAGES.english;
}

function getOnlineTtsLanguage() {
  const language = getLearningLanguageConfig();
  return language.tts || language.speech;
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

function getWordLookupVariants(word) {
  const clean = normalizeWord(word).replace(/[’‘]/g, "'");
  const variants = [clean];

  if (clean.includes("'")) {
    variants.push(clean.replace(/'s$/, ""));
    variants.push(clean.replace(/'d$/, ""));
    variants.push(clean.replace(/'ll$/, ""));
    variants.push(clean.replace(/'ve$/, ""));
    variants.push(clean.replace(/n't$/, ""));
  }

  if (clean.endsWith("ies") && clean.length > 4) variants.push(`${clean.slice(0, -3)}y`);
  if (clean.endsWith("es") && clean.length > 3) variants.push(clean.slice(0, -2));
  if (clean.endsWith("s") && clean.length > 3) variants.push(clean.slice(0, -1));

  if (clean.endsWith("ing") && clean.length > 5) {
    const base = clean.slice(0, -3);
    variants.push(base, `${base}e`);
    if (/([bcdfghjklmnpqrstvwxyz])\1$/i.test(base)) variants.push(base.slice(0, -1));
  }

  if (clean.endsWith("ed") && clean.length > 4) {
    const base = clean.slice(0, -2);
    variants.push(base, `${base}e`);
    if (/([bcdfghjklmnpqrstvwxyz])\1$/i.test(base)) variants.push(base.slice(0, -1));
  }

  return [...new Set(variants.filter(Boolean))];
}

function lookupWord(word) {
  const variants = getWordLookupVariants(word);
  for (const variant of variants) {
    if (dictionary[variant]) return dictionary[variant];
  }

  return ["", "这个词还在离线词库扩展中。你可以先问智语导师，也可以继续点其它常用词。"];
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

    const cacheKey = `${currentLearningLanguage}:${getOnlineTtsLanguage()}:${mode}:${chunk}`;
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
      body: JSON.stringify({ text, mode, language: currentLearningLanguage, voiceLanguage: getOnlineTtsLanguage() }),
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
    tl: getOnlineTtsLanguage(),
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
  window.speechSynthesis?.cancel?.();

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

function canUseSystemSpeech(mode) {
  return mode === "sentence" && currentLearningLanguage !== "english" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function getSystemSpeechVoice(languageCode) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const exact = languageCode.toLowerCase();
  const base = exact.split("-")[0];
  return (
    voices.find((voice) => voice.lang.toLowerCase() === exact) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(`${base}-`)) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(base)) ||
    null
  );
}

function speakWithSystemVoice(text) {
  return new Promise((resolve, reject) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      reject(new Error("System speech is unavailable"));
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    synth.cancel();

    const language = getLearningLanguageConfig();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language.speech;
    utterance.voice = getSystemSpeechVoice(language.speech);
    utterance.rate = Math.min(1.15, Math.max(0.72, Number(speedSlider.value || "1") * 0.92));
    utterance.pitch = currentLearningLanguage === "spanish" ? 1.06 : 1;
    utterance.onend = resolve;
    utterance.onerror = reject;
    synth.speak(utterance);
  });
}

async function speak(text, mode = "sentence") {
  const phrase = mode === "sentence" && currentLearningLanguage === "english" ? softenForCasualSpeech(text) : text;

  if (canUseSystemSpeech(mode)) {
    try {
      await speakWithSystemVoice(phrase);
      return;
    } catch {
      // Fall back to the existing online audio path below.
    }
  }

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
  startAdminMessagePolling();
}

function clearAuthSession() {
  authToken = "";
  authUser = null;
  stopAdminMessagePolling();
  adminUsers = [];
  adminLoadedAt = 0;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  updateAuthUi();
}

function getAuthDisplayName() {
  return authUser?.name || authUser?.email || "账号";
}

function isAdminAccount() {
  return Boolean(authUser?.isAdmin || authUser?.role === "admin");
}

function enforceAuthGate(message = "请先登录后使用智语导师。") {
  if (!AUTH_REQUIRED || authToken) return;
  showAuthSheet("login");
  if (authStatusText) authStatusText.textContent = message;
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
  if (adminPanel) adminPanel.hidden = !(authMode === "account" && isAdminAccount());
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
  if (adminPanel) adminPanel.hidden = !(isAccount && isAdminAccount());
  authName.hidden = !isRegister;
  authEmail.hidden = isAccount;
  authPassword.hidden = isAccount;
  authSubmitButton.hidden = isAccount;
  authLogoutButton.hidden = !isAccount;
  authSubmitButton.textContent = isRegister ? "注册并同步" : "登录";
  authModeButton.textContent = isAccount ? "立即同步" : isRegister ? "已有账号？登录" : "还没有账号？注册";
  authCancelButton.textContent = isAccount ? "关闭" : "稍后";
  authCancelButton.hidden = AUTH_REQUIRED && !authToken;
  if (authEmail) {
    authEmail.placeholder = isRegister ? "邮箱" : "邮箱或管理员账号";
  }
  if (authPassword) {
    authPassword.placeholder = isRegister ? "密码，至少 6 位" : "密码";
  }
  renderLanguageOptions();
  updateAuthUi();
  if (isAccount && isAdminAccount()) loadAdminUsers();

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
  if (currentPage === "scenes") renderScenes();
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
    if (currentPage === "scenes") renderScenes();
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
  setAuthMode(authUser || mode !== "account" ? mode : "login");
  requestAnimationFrame(() => authSheet.classList.add("is-open"));
}

function hideAuthSheet(options = {}) {
  if (!authSheet) return;
  if (AUTH_REQUIRED && !authToken && !options.force) {
    enforceAuthGate();
    return;
  }

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
    authStatusText.textContent = authMode === "register" ? "昵称、邮箱和密码都要填。" : "账号和密码都要填。";
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
    if (isAdminAccount()) await loadAdminUsers(true);
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
  hideAuthSheet({ force: true });
  if (AUTH_REQUIRED) setTimeout(() => enforceAuthGate("已退出登录，请重新登录。"), 180);

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

async function verifyAuthSession() {
  if (!authToken) {
    enforceAuthGate();
    return;
  }

  try {
    const data = await authApiRequest("/api/auth/me", { method: "GET" });
    authUser = { ...(authUser || {}), ...(data.user || {}) };
    if (authUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      updateAuthUi();
    }
    startAdminMessagePolling();
    await pullCloudDataAndMerge();
    await loadFriends(true);
    if (isAdminAccount()) await loadAdminUsers(true);
  } catch (error) {
    clearAuthSession();
    enforceAuthGate(error.message || "登录已失效，请重新登录。");
  }
}

function getAdminBanMinutes() {
  const value = Math.max(1, Number(adminBanValue?.value || 30) || 30);
  const unit = adminBanUnit?.value || "minutes";
  if (unit === "days") return Math.round(value * 24 * 60);
  if (unit === "hours") return Math.round(value * 60);
  return Math.round(value);
}

function formatAdminUserStatus(user) {
  if (user?.bannedUntil && Number(user.bannedUntil) > Date.now()) {
    return `封禁到 ${new Date(Number(user.bannedUntil)).toLocaleString()}`;
  }
  return user?.isAdmin ? "管理员" : "正常";
}

function renderAdminUsers(status = "") {
  if (!adminUserList) return;

  adminUserList.innerHTML = "";
  if (status) {
    const line = document.createElement("p");
    line.className = "friend-empty";
    line.textContent = status;
    adminUserList.appendChild(line);
    return;
  }

  const visibleUsers = adminUsers.filter((user) => !user.isAdmin);
  if (!visibleUsers.length) {
    const empty = document.createElement("p");
    empty.className = "friend-empty";
    empty.textContent = "还没有普通用户。";
    adminUserList.appendChild(empty);
    return;
  }

  visibleUsers.forEach((user) => {
    const card = document.createElement("article");
    card.className = "admin-user-card";

    const main = document.createElement("div");
    main.className = "admin-user-main";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = user.name || "未命名用户";
    const email = document.createElement("span");
    email.textContent = user.email || user.id;
    info.append(name, email);

    const statusText = document.createElement("span");
    statusText.className = "admin-user-status";
    statusText.classList.toggle("is-banned", Boolean(user.bannedUntil && Number(user.bannedUntil) > Date.now()));
    statusText.textContent = formatAdminUserStatus(user);
    main.append(info, statusText);

    const actions = document.createElement("div");
    actions.className = "admin-user-actions";

    const messageButton = document.createElement("button");
    messageButton.type = "button";
    messageButton.className = "ghost-button";
    messageButton.textContent = "发消息";
    messageButton.addEventListener("click", () => sendAdminMessage(user.id));

    const banButton = document.createElement("button");
    banButton.type = "button";
    banButton.className = "ghost-button";
    banButton.textContent = user.bannedUntil && Number(user.bannedUntil) > Date.now() ? "改封禁" : "封禁";
    banButton.addEventListener("click", () => banAdminUser(user.id));

    const unbanButton = document.createElement("button");
    unbanButton.type = "button";
    unbanButton.className = "ghost-button";
    unbanButton.textContent = "解封";
    unbanButton.disabled = !(user.bannedUntil && Number(user.bannedUntil) > Date.now());
    unbanButton.addEventListener("click", () => unbanAdminUser(user.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost-button";
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => deleteAdminUser(user.id, user.name || user.email || "这个用户"));

    actions.append(messageButton, banButton, unbanButton, deleteButton);
    card.append(main, actions);
    adminUserList.appendChild(card);
  });
}

async function loadAdminUsers(force = false) {
  if (!authToken || !isAdminAccount() || (!force && Date.now() - adminLoadedAt < 8000)) return;

  renderAdminUsers("正在加载用户...");
  try {
    const data = await authApiRequest("/api/admin/users", { method: "GET" });
    adminUsers = Array.isArray(data.users) ? data.users : [];
    adminLoadedAt = Date.now();
    renderAdminUsers();
  } catch (error) {
    renderAdminUsers(error.message || "用户管理暂时加载失败。");
  }
}

async function banAdminUser(userId) {
  if (!userId) return;

  renderAdminUsers("正在封禁用户...");
  try {
    await authApiRequest("/api/admin/ban", {
      method: "POST",
      body: JSON.stringify({ userId, durationMinutes: getAdminBanMinutes() }),
    });
    await loadAdminUsers(true);
  } catch (error) {
    renderAdminUsers(error.message || "封禁失败。");
  }
}

async function unbanAdminUser(userId) {
  if (!userId) return;

  renderAdminUsers("正在解封用户...");
  try {
    await authApiRequest("/api/admin/unban", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    await loadAdminUsers(true);
  } catch (error) {
    renderAdminUsers(error.message || "解封失败。");
  }
}

async function deleteAdminUser(userId, label) {
  if (!userId) return;
  if (!window.confirm(`确定删除 ${label} 吗？这个账号会被移除。`)) return;

  renderAdminUsers("正在删除用户...");
  try {
    await authApiRequest("/api/admin/delete", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    await loadAdminUsers(true);
  } catch (error) {
    renderAdminUsers(error.message || "删除失败。");
  }
}

async function sendAdminMessage(userId = "") {
  const title = adminMessageTitle?.value.trim() || "智语导师管理员消息";
  const body = adminMessageBody?.value.trim();
  if (!body) {
    renderAdminUsers("先填写推送内容。");
    return;
  }

  renderAdminUsers("正在发送消息...");
  try {
    const data = await authApiRequest("/api/admin/message", {
      method: "POST",
      body: JSON.stringify({ userId, title, body }),
    });
    renderAdminUsers(`已发送给 ${data.count || 0} 个用户。`);
    await loadAdminUsers(true);
  } catch (error) {
    renderAdminUsers(error.message || "消息发送失败。");
  }
}

function startAdminMessagePolling() {
  stopAdminMessagePolling();
  if (!authToken || isAdminAccount()) return;
  pollAdminMessages();
  adminMessagePollTimer = window.setInterval(pollAdminMessages, ADMIN_MESSAGE_POLL_MS);
}

function stopAdminMessagePolling() {
  if (!adminMessagePollTimer) return;
  window.clearInterval(adminMessagePollTimer);
  adminMessagePollTimer = 0;
}

async function pollAdminMessages() {
  if (!authToken || isAdminAccount() || adminMessageAlertActive) return;

  try {
    const data = await authApiRequest("/api/messages", { method: "GET" });
    const messages = Array.isArray(data.messages) ? data.messages : [];
    if (!messages.length) return;

    const latest = messages[messages.length - 1];
    showAdminMessage(latest.title || "管理员消息", latest.body || "");
    triggerAdminMessageFeedback();
    await authApiRequest("/api/messages/read", {
      method: "POST",
      body: JSON.stringify({ ids: messages.map((message) => message.id).filter(Boolean) }),
    });
  } catch (error) {
    if (/登录|失效|过期|banned|ban|封禁/i.test(error.message || "")) {
      clearAuthSession();
      enforceAuthGate(error.message || "请重新登录。");
    }
  }
}

function showAdminMessage(title, body) {
  if (!adminMessageSheet) return;
  adminMessageAlertActive = true;
  adminMessageSheetTitle.textContent = title;
  adminMessageSheetBody.textContent = body || "管理员给你发来一条消息。";
  adminMessageSheet.hidden = false;
  requestAnimationFrame(() => adminMessageSheet.classList.add("is-open"));
}

function hideAdminMessage() {
  if (!adminMessageSheet) return;
  adminMessageSheet.classList.remove("is-open");
  adminMessageAlertActive = false;
  setTimeout(() => {
    adminMessageSheet.hidden = true;
  }, 160);
}

function triggerAdminMessageFeedback() {
  try {
    navigator.vibrate?.([420, 120, 420]);
  } catch {
    // Vibration is best-effort and depends on the device.
  }

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.34);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.36);
    setTimeout(() => context.close(), 520);
  } catch {
    // Some mobile webviews only allow sound after a user gesture.
  }
}

function getNativeSpeechPlugin() {
  return window.Capacitor?.Plugins?.NativeSpeech || null;
}

function getVoiceLanguageCode() {
  return getLearningLanguageConfig().speech || navigator.language || "en-US";
}

function setVoiceButtonListening(button, isListening) {
  if (!button) return;
  button.classList.toggle("is-listening", isListening);
  button.setAttribute("aria-pressed", String(isListening));
}

function installVoiceListeners() {
  if (voiceListenersReady) return;
  const nativeSpeech = getNativeSpeechPlugin();
  if (!nativeSpeech?.addListener) return;

  voiceListenersReady = true;
  nativeSpeech.addListener("speechReady", () => {
    if (!voiceCapture) return;
    setVoiceButtonListening(voiceCapture.button, true);
    updateVoicePipStatus("正在收听");
  });
  nativeSpeech.addListener("speechPartial", (event) => handleVoicePartial(event?.text || ""));
  nativeSpeech.addListener("speechResult", (event) => handleVoiceFinal(event?.text || ""));
  nativeSpeech.addListener("speechError", (event) => handleVoiceError(event?.message || "语音识别暂时不可用"));
}

async function startVoiceCapture(options) {
  if (voiceCapture) return;

  const capture = {
    ...options,
    transcript: "",
    finalHandled: false,
    stopTimer: 0,
    webRecognition: null,
  };
  voiceCapture = capture;
  setVoiceButtonListening(capture.button, true);

  if (capture.source === "sentence") {
    showVoicePip({
      title: "语音发送",
      status: "正在收听",
      question: "按住说出你想问的问题，松开后发送给智语导师。",
      answer: "",
    });
  }

  installVoiceListeners();
  const nativeSpeech = getNativeSpeechPlugin();
  if (nativeSpeech?.start) {
    try {
      await nativeSpeech.start({ language: getVoiceLanguageCode() });
      return;
    } catch (error) {
      handleVoiceError(error?.message || "系统语音识别启动失败");
      return;
    }
  }

  startWebSpeechCapture(capture);
}

function startWebSpeechCapture(capture) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    handleVoiceError("这台设备暂时不支持语音识别。");
    return;
  }

  const recognition = new SpeechRecognition();
  capture.webRecognition = recognition;
  recognition.lang = getVoiceLanguageCode();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    let transcript = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      transcript += event.results[index][0]?.transcript || "";
    }
    const clean = transcript.trim();
    if (!clean) return;
    if (event.results[event.results.length - 1]?.isFinal) {
      handleVoiceFinal(clean);
    } else {
      handleVoicePartial(clean);
    }
  };
  recognition.onerror = (event) => handleVoiceError(event.error || "语音识别失败");
  recognition.onend = () => {
    if (voiceCapture === capture && capture.transcript && !capture.finalHandled) {
      handleVoiceFinal(capture.transcript);
    }
  };

  try {
    recognition.start();
  } catch (error) {
    handleVoiceError(error?.message || "语音识别启动失败");
  }
}

function stopVoiceCapture() {
  const capture = voiceCapture;
  if (!capture) return;

  const nativeSpeech = getNativeSpeechPlugin();
  if (nativeSpeech?.stop) {
    nativeSpeech.stop().catch(() => {});
  }
  try {
    capture.webRecognition?.stop();
  } catch {
    // The browser fallback may already be stopped.
  }

  clearTimeout(capture.stopTimer);
  capture.stopTimer = window.setTimeout(() => {
    if (voiceCapture !== capture || capture.finalHandled) return;
    if (capture.transcript) {
      handleVoiceFinal(capture.transcript);
    } else {
      handleVoiceError("没有听清，再按住说一次。");
    }
  }, 1300);
}

function handleVoicePartial(text) {
  const capture = voiceCapture;
  if (!capture || !text.trim()) return;

  capture.transcript = text.trim();
  if (capture.source === "chat") {
    teacherInput.value = capture.transcript;
  } else {
    updateVoicePipStatus("正在收听");
    if (voicePipQuestion) voicePipQuestion.textContent = capture.transcript;
  }
}

function handleVoiceFinal(text) {
  const capture = voiceCapture;
  const transcript = String(text || capture?.transcript || "").trim();
  if (!capture || capture.finalHandled) return;

  capture.finalHandled = true;
  clearTimeout(capture.stopTimer);
  setVoiceButtonListening(capture.button, false);
  voiceCapture = null;

  if (!transcript) {
    if (capture.source === "sentence") {
      showVoicePip({
        title: "语音发送",
        status: "没有听清",
        question: "",
        answer: "没有听清，再按住说一次。",
      });
    }
    return;
  }

  if (capture.source === "chat") {
    teacherInput.value = transcript;
    teacherInput.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  sendSentenceVoiceQuestion(capture.sentenceText, transcript);
}

function handleVoiceError(message) {
  const capture = voiceCapture;
  if (!capture) return;
  if (capture.transcript && !capture.finalHandled) {
    handleVoiceFinal(capture.transcript);
    return;
  }

  clearTimeout(capture.stopTimer);
  setVoiceButtonListening(capture.button, false);
  voiceCapture = null;

  if (capture.source === "sentence") {
    showVoicePip({
      title: "语音发送",
      status: "没有听清",
      question: capture.transcript || "",
      answer: message || "语音识别暂时不可用。",
    });
  }
}

function bindHoldVoiceButton(button, options) {
  if (!button) return;
  let pressTimer = 0;
  let started = false;

  button.addEventListener("contextmenu", (event) => event.preventDefault());
  button.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    started = false;
    button.setPointerCapture?.(event.pointerId);
    pressTimer = window.setTimeout(() => {
      started = true;
      startVoiceCapture({ ...options, button });
    }, 180);
  });

  const endPress = () => {
    clearTimeout(pressTimer);
    if (started) stopVoiceCapture();
    started = false;
  };

  button.addEventListener("pointerup", endPress);
  button.addEventListener("pointercancel", endPress);
  button.addEventListener("lostpointercapture", () => {
    clearTimeout(pressTimer);
  });
}

function showVoicePip({ title, status, question, answer }) {
  if (!voicePip) return;
  if (voicePipTitle) voicePipTitle.textContent = title || "智语导师";
  if (voicePipStatus) voicePipStatus.textContent = status || "";
  if (voicePipQuestion) voicePipQuestion.textContent = question || "";
  if (voicePipAnswer) voicePipAnswer.textContent = answer || "";
  voicePip.hidden = false;
  requestAnimationFrame(() => voicePip.classList.add("is-open"));
}

function hideVoicePip() {
  if (!voicePip) return;
  voicePip.classList.remove("is-open");
  setTimeout(() => {
    if (!voicePipReplyInFlight) voicePip.hidden = true;
  }, 160);
}

function updateVoicePipStatus(status) {
  if (voicePipStatus) voicePipStatus.textContent = status;
}

async function sendSentenceVoiceQuestion(sentenceText, question) {
  const language = getLearningLanguageConfig();
  const prompt = [
    `用户正在学习这句${language.label}：${sentenceText}`,
    `用户用语音问的问题：${question}`,
    "语音转文字可能有少量误识别，请结合句子上下文判断用户真正想问什么。",
    "请直接回答，不要写开场白。先用中文解释，再给出简短目标语言示范。",
  ].join("\n");

  showVoicePip({
    title: "智语导师",
    status: "AI 正在回复",
    question,
    answer: "正在生成回复...",
  });
  voicePipReplyInFlight = true;

  try {
    const data = await requestAiTeacherStream(
      {
        mode: "chat",
        message: prompt,
        messages: [],
      },
      {
        onDelta: (_delta, text) => {
          if (!text.trim() || !voicePipAnswer) return;
          voicePipAnswer.textContent = renameTeacherText(text);
        },
      }
    );
    const reply = compactTeacherReply(data.reply) || voicePipAnswer?.textContent || "这次没有拿到回复，请再试一次。";
    if (voicePipAnswer) voicePipAnswer.textContent = reply;
    updateVoicePipStatus("回复完成");
  } catch (error) {
    if (voicePipAnswer) voicePipAnswer.textContent = renameTeacherText(error.message || "智语导师暂时连接不上。");
    updateVoicePipStatus("回复失败");
  } finally {
    voicePipReplyInFlight = false;
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

function normalizeSceneProgress(progress) {
  const source = progress && typeof progress === "object" ? progress : {};
  return {
    completed: Array.isArray(source.completed)
      ? source.completed
          .map((id) => String(id || "").trim())
          .filter((id) => SCENE_LIBRARY.some((scene) => scene.id === id))
          .slice(0, 200)
      : [],
    lastSceneId: typeof source.lastSceneId === "string" ? source.lastSceneId : "",
  };
}

function loadSceneProgress(languageCode = currentLearningLanguage) {
  try {
    return normalizeSceneProgress(JSON.parse(localStorage.getItem(getLanguageStorageKey(SCENE_PROGRESS_KEY, languageCode)) || "{}"));
  } catch {
    return normalizeSceneProgress({});
  }
}

function saveSceneProgress(languageCode, progress, options = {}) {
  localStorage.setItem(getLanguageStorageKey(SCENE_PROGRESS_KEY, languageCode), JSON.stringify(normalizeSceneProgress(progress)));
  if (options.sync !== false) queueCloudSync();
}

function getAllSceneProgress() {
  return Object.keys(LEARNING_LANGUAGES).reduce((all, code) => {
    all[code] = loadSceneProgress(code);
    return all;
  }, {});
}

function mergeSceneProgress(localProgress, remoteProgress) {
  const local = normalizeSceneProgress(localProgress);
  const remote = normalizeSceneProgress(remoteProgress);
  return {
    completed: Array.from(new Set([...local.completed, ...remote.completed])),
    lastSceneId: remote.lastSceneId || local.lastSceneId,
  };
}

function getSceneText(item) {
  return item?.[currentLearningLanguage] || item?.english || "";
}

function getVocabText(item) {
  return item?.[currentLearningLanguage] || item?.english || "";
}

function getSceneById(sceneId) {
  return SCENE_LIBRARY.find((scene) => scene.id === sceneId) || null;
}

function getSceneLearningItems(scene) {
  if (!scene) return [];
  const sourceItems = scene.dialogue;
  const seen = new Set();
  return sourceItems
    .map((item) => ({
      text: getSceneText(item).trim(),
      note: item.zh || "",
      learned: false,
      learnedAt: null,
      aiExplanation: "",
    }))
    .filter((item) => {
      const key = item.text.toLowerCase();
      if (!item.text || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function addSceneItemToLearning(item, options = {}) {
  const text = getSceneText(item).trim();
  if (!text) return false;

  const key = text.toLowerCase();
  if (savedSentences.some((sentence) => sentence.text.toLowerCase() === key)) return false;

  savedSentences = [
    { text, note: item.zh || "", learned: false, learnedAt: null, aiExplanation: "" },
    ...savedSentences,
  ];
  saveSentences({ sync: options.sync });
  render();
  return true;
}

function addSceneToLearning(sceneId, options = {}) {
  const scene = getSceneById(sceneId);
  if (!scene) return 0;

  const existing = new Set(savedSentences.map((item) => item.text.toLowerCase()));
  const additions = getSceneLearningItems(scene).filter((item) => !existing.has(item.text.toLowerCase()));
  if (additions.length) {
    savedSentences = [...additions, ...savedSentences];
    saveSentences({ sync: options.sync });
    render();
  }

  const progress = loadSceneProgress();
  if (!progress.completed.includes(scene.id)) progress.completed.push(scene.id);
  progress.lastSceneId = scene.id;
  saveSceneProgress(currentLearningLanguage, progress, { sync: options.sync });
  return additions.length;
}

function renderSceneModeTabs(hasActiveScene) {
  if (!sceneModeTabs) return;

  sceneModeTabs.hidden = Boolean(hasActiveScene);
  sceneModeTabs.innerHTML = "";
  [
    { id: "words", label: "单词" },
    { id: "scenes", label: "场景" },
  ].forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scene-mode-tab";
    button.classList.toggle("is-active", currentSceneMode === mode.id);
    button.textContent = mode.label;
    button.addEventListener("click", () => {
      currentSceneMode = mode.id;
      if (mode.id === "words") {
        activeSceneId = "";
        replaceSceneDetailHistoryWithList();
      }
      renderScenes();
    });
    sceneModeTabs.appendChild(button);
  });
}

function renderVocabulary() {
  sceneGroupTabs.innerHTML = "";
  VOCAB_GROUPS.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scene-group-tab";
    button.classList.toggle("is-active", group.id === currentVocabGroup);
    button.textContent = group.label;
    button.addEventListener("click", () => {
      currentVocabGroup = group.id;
      renderScenes();
    });
    sceneGroupTabs.appendChild(button);
  });

  sceneList.innerHTML = "";
  VOCAB_LIBRARY.filter((item) => item.group === currentVocabGroup).forEach((item) => {
    const targetText = getVocabText(item);
    const card = document.createElement("article");
    card.className = "vocab-card";

    const content = document.createElement("div");
    content.className = "vocab-content";

    const meta = document.createElement("span");
    meta.className = "vocab-meta";
    meta.textContent = item.note;

    const title = document.createElement("strong");
    title.textContent = targetText;

    const meaning = document.createElement("span");
    meaning.textContent = item.zh;

    content.append(meta, title, meaning);

    const speakButton = document.createElement("button");
    speakButton.type = "button";
    speakButton.className = "round-button";
    speakButton.textContent = "▶";
    speakButton.setAttribute("aria-label", `朗读：${targetText}`);
    speakButton.addEventListener("click", () => speak(targetText, "sentence"));

    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      speak(targetText, "sentence");
    });

    card.append(content, speakButton);
    sceneList.appendChild(card);
  });
}

function renderScenes() {
  if (!sceneGroupTabs || !sceneList || !sceneDetail) return;

  const isWordsMode = currentSceneMode === "words";
  if (isWordsMode && activeSceneId) {
    activeSceneId = "";
    replaceSceneDetailHistoryWithList();
  }

  const progress = loadSceneProgress();
  const activeScene = getSceneById(activeSceneId);
  renderSceneModeTabs(Boolean(activeScene));
  sceneGroupTabs.hidden = Boolean(activeScene);
  sceneList.hidden = Boolean(activeScene);
  sceneDetail.hidden = !activeScene;

  if (isWordsMode) {
    activeSceneId = "";
    sceneDetail.hidden = true;
    sceneGroupTabs.hidden = false;
    sceneList.hidden = false;
    sceneGroupTabs.setAttribute("aria-label", "单词分类");
    renderVocabulary();
    return;
  }

  sceneGroupTabs.setAttribute("aria-label", "场景分类");
  sceneGroupTabs.innerHTML = "";
  SCENE_GROUPS.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scene-group-tab";
    button.classList.toggle("is-active", group.id === currentSceneGroup);
    button.textContent = group.label;
    button.addEventListener("click", () => {
      currentSceneGroup = group.id;
      activeSceneId = "";
      renderScenes();
    });
    sceneGroupTabs.appendChild(button);
  });

  if (activeScene) {
    renderSceneDetail(activeScene, progress);
    return;
  }

  sceneList.innerHTML = "";
  SCENE_LIBRARY.filter((scene) => scene.group === currentSceneGroup).forEach((scene) => {
    const card = document.createElement("article");
    card.className = "scene-card";
    card.classList.toggle("is-complete", progress.completed.includes(scene.id));

    const header = document.createElement("div");
    header.className = "scene-card-header";
    const title = document.createElement("h3");
    title.textContent = scene.title;
    const tag = document.createElement("span");
    tag.textContent = scene.level;
    header.append(title, tag);

    const description = document.createElement("p");
    description.textContent = scene.description;

    const meta = document.createElement("p");
    meta.className = "scene-meta";
    meta.textContent = `${scene.dialogue.length} 句自然对话`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "primary-button";
    button.textContent = progress.completed.includes(scene.id) ? "继续学习" : "打开场景";
    button.addEventListener("click", () => openSceneDetail(scene.id));

    card.append(header, description, meta, button);
    sceneList.appendChild(card);
  });
}

function appendSceneLine(container, item, options = {}) {
  const row = document.createElement("div");
  const isDialogue = Boolean(options.dialogue);
  const isUserLine = isDialogue && item.speaker === "B";
  row.className = isDialogue
    ? `scene-dialogue-line ${isUserLine ? "is-user" : "is-ai"}`
    : "scene-line";

  const message = document.createElement("div");
  message.className = "scene-message";

  if (isDialogue) {
    const name = document.createElement("span");
    name.className = "scene-speaker";
    name.textContent = isUserLine ? getSceneUserDisplayName() : "智语导师";
    message.appendChild(name);
  }

  const bubble = document.createElement("div");
  bubble.className = "scene-bubble";

  const target = document.createElement("strong");
  target.textContent = getSceneText(item);
  const note = document.createElement("span");
  note.textContent = item.zh || "";
  bubble.append(target, note);

  const actions = document.createElement("div");
  actions.className = "scene-line-actions";
  const speakButton = document.createElement("button");
  speakButton.type = "button";
  speakButton.className = "round-button";
  speakButton.textContent = "▶";
  speakButton.setAttribute("aria-label", "朗读");
  speakButton.addEventListener("click", () => speak(getSceneText(item), "sentence"));

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "round-button";
  addButton.textContent = "+";
  addButton.setAttribute("aria-label", "加入句子");
  addButton.addEventListener("click", () => {
    addSceneItemToLearning(item);
    addButton.textContent = "✓";
  });

  actions.append(speakButton, addButton);
  message.appendChild(bubble);

  if (isDialogue) {
    message.appendChild(actions);
    const avatar = createSceneAvatar(isUserLine);
    if (isUserLine) {
      row.append(message, avatar);
    } else {
      row.append(avatar, message);
    }
  } else {
    row.append(message, actions);
  }

  container.appendChild(row);
}

function getSceneUserDisplayName() {
  return authUser ? getAuthDisplayName() : "你";
}

function createSceneAvatar(isUserLine) {
  const avatar = document.createElement("div");
  avatar.className = `scene-chat-avatar ${isUserLine ? "is-user" : "is-ai"}`;

  if (!isUserLine) {
    const mark = document.createElement("span");
    mark.textContent = "AI";
    avatar.appendChild(mark);
    return avatar;
  }

  const avatarSource = getAvatarSource();
  avatar.textContent = avatarSource ? "" : (authUser ? getAvatarInitial() : "我");
  avatar.style.backgroundImage = avatarSource ? `url("${avatarSource}")` : "";
  avatar.classList.toggle("has-image", Boolean(avatarSource));
  return avatar;
}

function renderSceneDetail(scene, progress) {
  sceneDetail.innerHTML = "";

  const header = document.createElement("div");
  header.className = "scene-detail-header";
  const title = document.createElement("h2");
  title.textContent = scene.title;
  const description = document.createElement("p");
  description.textContent = scene.description;
  header.append(title, description);

  const actionRow = document.createElement("div");
  actionRow.className = "scene-actions";
  const addAllButton = document.createElement("button");
  addAllButton.type = "button";
  addAllButton.className = "primary-button";
  addAllButton.textContent = progress.completed.includes(scene.id) ? "已加入，继续复习" : "加入学习";
  addAllButton.addEventListener("click", () => {
    const count = addSceneToLearning(scene.id);
    updateAuthUi(count ? `已加入 ${count} 句。` : "这个场景已经在句子里。");
    renderScenes();
  });

  const practiceButton = document.createElement("button");
  practiceButton.type = "button";
  practiceButton.className = "ghost-button";
  practiceButton.textContent = "默写练习";
  practiceButton.addEventListener("click", () => {
    openScenePractice(scene.id);
  });

  actionRow.append(addAllButton, practiceButton);

  const dialogueTitle = document.createElement("h3");
  dialogueTitle.textContent = "场景对话";
  const dialogueList = document.createElement("div");
  dialogueList.className = "scene-dialogue";
  scene.dialogue.forEach((line) => appendSceneLine(dialogueList, line, { dialogue: true }));

  sceneDetail.append(header, actionRow, dialogueTitle, dialogueList);
}

function canUseSceneSystemBack() {
  return currentPage === "scenes" && Boolean(activeSceneId) && authSheet?.hidden !== false && updateSheet?.hidden !== false;
}

function canReturnFromSceneExam() {
  return currentPage === "exam" && Boolean(examReturnSceneId) && authSheet?.hidden !== false && updateSheet?.hidden !== false;
}

function openScenePractice(sceneId) {
  const scene = getSceneById(sceneId);
  if (!scene) return;

  sceneExamItems = getSceneLearningItems(scene);
  currentExamPosition = 0;
  examReturnSceneId = sceneId;
  pushScenePracticeHistory(sceneId);
  setPage("exam");
}

function openSceneDetail(sceneId) {
  if (!getSceneById(sceneId)) return;

  activeSceneId = sceneId;
  pushSceneDetailHistory(sceneId);
  renderScenes();
  scrollAppToTop();
}

function pushSceneDetailHistory(sceneId) {
  try {
    window.history.pushState(
      { ...(window.history.state || {}), zhiyuSceneDetail: true, sceneId },
      "",
      window.location.href
    );
  } catch {
    // History state is a progressive enhancement for native-style back gestures.
  }
}

function replaceSceneDetailHistoryWithList() {
  try {
    if (!window.history.state?.zhiyuSceneDetail) return;
    window.history.replaceState(
      { ...(window.history.state || {}), zhiyuSceneDetail: false, sceneId: "" },
      "",
      window.location.href
    );
  } catch {
    // Ignore unsupported history writes.
  }
}

function pushScenePracticeHistory(sceneId) {
  try {
    window.history.pushState(
      { ...(window.history.state || {}), zhiyuSceneDetail: false, zhiyuScenePractice: true, sceneId },
      "",
      window.location.href
    );
  } catch {
    // History state is a progressive enhancement for native-style back gestures.
  }
}

function returnToSceneList(options = {}) {
  if (!activeSceneId) return;

  activeSceneId = "";
  renderScenes();
  if (options.replaceHistory) replaceSceneDetailHistoryWithList();
}

function returnToSceneFromExam(options = {}) {
  const scene = getSceneById(examReturnSceneId);
  if (!scene) return false;

  examReturnSceneId = "";
  currentSceneGroup = scene.group || currentSceneGroup;
  activeSceneId = scene.id;
  setPage("scenes");
  if (options.replaceHistory) {
    try {
      window.history.replaceState(
        { ...(window.history.state || {}), zhiyuSceneDetail: true, zhiyuScenePractice: false, sceneId: scene.id },
        "",
        window.location.href
      );
    } catch {
      // Ignore unsupported history writes.
    }
  } else {
    pushSceneDetailHistory(scene.id);
  }
  renderScenes();
  scrollAppToTop();
  return true;
}

function requestSceneExamBack() {
  if (!canReturnFromSceneExam()) return false;

  clearTimeout(sceneHistoryFallbackTimer);
  if (window.history.state?.zhiyuScenePractice && window.history.length > 1) {
    window.history.back();
    sceneHistoryFallbackTimer = window.setTimeout(() => {
      if (examReturnSceneId) returnToSceneFromExam({ replaceHistory: true });
    }, 260);
  } else {
    returnToSceneFromExam({ replaceHistory: true });
  }
  return true;
}

function requestSceneSystemBack() {
  if (!canUseSceneSystemBack()) return false;

  clearTimeout(sceneHistoryFallbackTimer);
  if (window.history.state?.zhiyuSceneDetail && window.history.length > 1) {
    window.history.back();
    sceneHistoryFallbackTimer = window.setTimeout(() => {
      if (activeSceneId) returnToSceneList({ replaceHistory: true });
    }, 260);
  } else {
    returnToSceneList({ replaceHistory: true });
  }
  return true;
}

function requestAppSystemBack() {
  if (canReturnFromSceneExam()) return requestSceneExamBack();
  return requestSceneSystemBack();
}

function handleScenePopState(event) {
  clearTimeout(sceneHistoryFallbackTimer);
  const state = event.state || {};

  if (currentPage === "exam" && examReturnSceneId && !state.zhiyuScenePractice) {
    returnToSceneFromExam({ replaceHistory: true });
    return;
  }

  if (activeSceneId && !state.zhiyuSceneDetail) {
    returnToSceneList();
    return;
  }

  if (currentPage === "scenes" && state.zhiyuSceneDetail && getSceneById(state.sceneId)) {
    activeSceneId = state.sceneId;
    renderScenes();
  }
}

window.zhiyuHandleNativeBack = requestAppSystemBack;

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
    sceneProgress: getAllSceneProgress(),
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

      if (remoteData.sceneProgress && typeof remoteData.sceneProgress === "object") {
        saveSceneProgress(code, mergeSceneProgress(loadSceneProgress(code), remoteData.sceneProgress[code]), { sync: false });
      }
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
    if (currentPage === "scenes") renderScenes();
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

    if (currentLearningLanguage === "english") {
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
    } else {
      sentenceText.textContent = sentence;
    }

    const note = document.createElement("textarea");
    note.className = "sentence-note";
    note.placeholder = "添加中文句意...";
    note.value = item.note;
    note.setAttribute("aria-label", `添加句意：${sentence}`);
    note.addEventListener("input", () => updateSentenceNote(index, note.value));
    attachDoubleTapToEdit(note);

    const aiTools = document.createElement("div");
    aiTools.className = "sentence-ai-tools";

    const voiceButton = document.createElement("button");
    voiceButton.className = "ai-button voice-send-button";
    voiceButton.type = "button";
    voiceButton.innerHTML = '<span class="mic-icon" aria-hidden="true"></span><span>语音发送</span>';
    voiceButton.setAttribute("aria-label", "长按语音提问");
    voiceButton.title = "长按语音提问";
    bindHoldVoiceButton(voiceButton, { source: "sentence", sentenceText: sentence });
    aiTools.appendChild(voiceButton);

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
    content.append(sentenceText, note, aiTools);
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
  if (sceneExamItems.length) {
    return sceneExamItems.map((item, index) => ({ item, index })).filter(({ item }) => item.note.trim());
  }

  return savedSentences
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.learned && item.note.trim());
}

function getLearningItems() {
  if (sceneExamItems.length) return sceneExamItems;
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
  const isSceneExam = sceneExamItems.length > 0;
  const learningItems = getLearningItems();
  const { pool, entry } = getCurrentExamItem();
  const missingNotes = Math.max(0, learningItems.length - pool.length);

  if (!entry) {
    examProgress.textContent = isSceneExam
      ? "这个场景暂无可默写内容"
      : learningItems.length
      ? `${learningItems.length} 句学习中，${missingNotes} 句还没中文句意`
      : "学习中暂无句子";
    examPrompt.textContent = isSceneExam
      ? "先回到场景页选择其它场景。"
      : learningItems.length
        ? "先回到句子页，给句子双点添加中文句意。"
        : `先添加要背的${getLearningLanguageConfig().label}句子。`;
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
  examProgress.textContent = isSceneExam
    ? `${currentExamPosition + 1} / ${pool.length} 题 · 场景默写`
    : `${currentExamPosition + 1} / ${pool.length} 题 · 学习中 ${learningItems.length} 句`;
  if (!isSceneExam && missingNotes) examProgress.textContent += ` · ${missingNotes} 句未填句意`;
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
  if (!sceneExamItems.length) localStorage.setItem(getLanguageStorageKey(EXAM_INDEX_KEY), String(currentExamPosition));
  renderExam(true);
  examAnswer.focus();
}

function scrollAppToTop() {
  requestAnimationFrame(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      window.scrollTo(0, 0);
    }
    document.scrollingElement?.scrollTo?.(0, 0);
    document.querySelector(".app-shell")?.scrollTo?.(0, 0);
    scenesPage?.scrollTo?.(0, 0);
    examPage?.scrollTo?.(0, 0);
  });
}

function setPage(page) {
  const wasTeacher = teacherPage.classList.contains("is-active");
  currentPage = page === "teacher" || page === "exam" || page === "scenes" || page === "friends" ? page : "sentences";
  const isTeacher = currentPage === "teacher";
  const isExam = currentPage === "exam";
  const isScenes = currentPage === "scenes";
  const isFriends = currentPage === "friends";

  if (!isScenes && activeSceneId) {
    activeSceneId = "";
    replaceSceneDetailHistoryWithList();
  }

  if (!isExam && !isScenes) {
    examReturnSceneId = "";
  }

  if (!isExam) {
    sceneExamItems = [];
  }

  sentencesPage.classList.toggle("is-active", !isTeacher && !isExam && !isScenes && !isFriends);
  examPage.classList.toggle("is-active", isExam);
  scenesPage.classList.toggle("is-active", isScenes);
  teacherPage.classList.toggle("is-active", isTeacher);
  friendsPage.classList.toggle("is-active", isFriends);
  sentencesNav.classList.toggle("is-active", !isTeacher && !isExam && !isScenes && !isFriends);
  scenesNav.classList.toggle("is-active", isScenes);
  teacherNav.classList.toggle("is-active", isTeacher);
  friendsNav.classList.toggle("is-active", isFriends);
  sentencesNav.setAttribute("aria-current", !isTeacher && !isExam && !isScenes && !isFriends ? "page" : "false");
  scenesNav.setAttribute("aria-current", isScenes ? "page" : "false");
  teacherNav.setAttribute("aria-current", isTeacher ? "page" : "false");
  friendsNav.setAttribute("aria-current", isFriends ? "page" : "false");
  clearButton.classList.toggle("is-hidden", isTeacher || isExam || isScenes || isFriends);
  pageEyebrow.textContent = isTeacher
    ? (teacherFreeMode ? "Off-duty AI" : "AI Teacher")
    : isExam
      ? "Sentence Review"
      : isScenes
        ? "Words & Scenes"
        : isFriends
          ? "Community"
          : "Sentence Reader";
  pageTitle.textContent = isTeacher ? (teacherFreeMode ? "闲聊模式" : "智语导师") : isExam ? "复习" : isScenes ? "单词/场景" : isFriends ? "好友" : "句读";
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
    scrollAppToTop();
  }

  if (isScenes) {
    closeWordSheet();
    renderScenes();
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
    `我们开始一个轻松的${language.label}日常话题吧。`,
    `随便找个自然的${language.label}聊天话题开始吧。`,
    `开启一个适合日常聊天的${language.label}话题吧。`,
    `找一个好接话的${language.label}小话题吧。`,
  ];
  return prompts[Math.floor(Math.random() * prompts.length)];
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
  return message;
}

function shouldTranslateUserMessage(message, mode, displayText) {
  if (displayText) return false;
  if (!/[\u4e00-\u9fff]/.test(message)) return false;
  if (/^话题$/.test(message.trim())) return false;
  if (isDirectTranslationQuestion(message)) return false;
  return ["topic", "chat"].includes(mode);
}

function isDirectTranslationQuestion(message) {
  return /(?:怎么说|翻译|翻成|用.{0,12}语.{0,8}说)/u.test(String(message || ""));
}

function buildUserTranslationRequest(message) {
  const language = getLearningLanguageConfig();
  return [
    `请把下面这句中文口语变成1句自然${language.label}。`,
    "返回格式：",
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

function isTeacherTranslationMeta(text) {
  const clean = String(text || "").trim();
  if (!clean) return false;

  return (
    /(?:想把|要把|把|将)[^。！？]{0,80}(?:翻(?:成|译成)?|怎么说|用[^。！？]{0,24}说)/u.test(clean) ||
    /(?:我给你|给你)(?:一个|一条)?(?:比较|更)?(?:常用|自然|地道)?(?:的)?说法/u.test(clean) ||
    /(?:你可以这样说|可以这样说)[：:]?$/u.test(clean)
  );
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

function extractEchoedChineseMeaning(text) {
  const match = String(text || "").match(/(?:把|将)\s*[“"']([^“”"'\n]{1,60})[”"']\s*(?:翻(?:成|译成)?|译成|怎么说|用[^。！？\n]{0,24}说)/u);
  if (!match || !/[\u4e00-\u9fa5]/.test(match[1])) return "";
  return cleanChineseMeaningText(match[1]);
}

function extractChineseMeanings(text, expectedCount) {
  const markerMatch = String(text || "").match(/(?:中文意思|意思|翻译)\s*[：:]\s*([\s\S]+)$/u);
  if (markerMatch) {
    const meanings = splitChineseMeanings(markerMatch[1]).filter((item) => !isTeacherTranslationMeta(item));
    if (meanings.length) return meanings.slice(0, expectedCount);
  }

  const beforeEnglish = String(text || "").split(/英文\s*[：:]/u)[0] || "";
  const compact = beforeEnglish
    .replace(/可以[，,]?\s*下面这几句(?:更简单)?很自然[：:]?/g, "")
    .replace(/可以[，,]?\s*这(?:样|么)说(?:就很自然)?[：:]?/g, "")
    .trim();
  const fallback = splitChineseMeanings(compact).filter((item) => !isTeacherTranslationMeta(item));
  if (fallback.length) return fallback.slice(Math.max(0, fallback.length - expectedCount));

  const echoedMeaning = extractEchoedChineseMeaning(text);
  return echoedMeaning ? Array.from({ length: expectedCount }, () => echoedMeaning) : [];
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

function cleanTeacherChineseDisplay(text, sourceText) {
  const clean = String(text || "")
    .replace(/(?:你是?想把|你想把|是不是想把|是否想把|你要把)[^。！？]{0,160}[。！？]?/gu, " ")
    .replace(/(?:我给你|给你)(?:一个|一条)?(?:比较|更)?(?:常用|自然|地道)?(?:的)?说法[。！？]?/gu, " ")
    .replace(/(?:你可以这样说|可以这样说)[：:]?/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (isTeacherTranslationMeta(text) && /(?:英文|目标语|西班牙语|日语|韩语)\s*[：:]|你可以这样说/u.test(sourceText)) {
    return "";
  }

  return clean;
}

function isTeacherMetaTargetSentence(sentence, sourceText) {
  const lower = String(sentence || "").toLowerCase();
  if (!/(formal|informal|formale|informelle|フォーマル|인포멀|격식)/u.test(lower)) return false;
  return /(?:想把|翻(?:成|译成)?|怎么说|你可以这样说|可以这样说|常用说法)/u.test(sourceText);
}

function buildTeacherDisplay(text) {
  const cleanText = compactTeacherReply(text);
  const visibleText = removeMeaningSection(cleanText);
  const detectedTargetSentences = extractTargetSentences(visibleText);
  const allEnglishSentences = detectedTargetSentences.filter((sentence) => !isTeacherMetaTargetSentence(sentence, visibleText));
  let englishSentences = allEnglishSentences;
  const isTopicStarter = /我们来聊聊|聊聊|话题/.test(visibleText) && englishSentences.some((sentence) => sentence.endsWith("?"));
  if (isTopicStarter) {
    englishSentences = [englishSentences.find((sentence) => sentence.endsWith("?")) || englishSentences[0]].filter(Boolean);
  }
  const meanings = extractChineseMeanings(cleanText, englishSentences.length);
  const rawChineseText = removeEnglishFromTeacherText(visibleText, detectedTargetSentences);
  const chineseText = cleanTeacherChineseDisplay(
    isTopicStarter ? simplifyTopicIntro(rawChineseText) : simplifyTeacherChinese(rawChineseText, englishSentences.length),
    cleanText
  );

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

  englishButton.addEventListener("click", () => {
    speak(pair.sentence, "sentence");
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
  card.append(note, row);
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

      const meaning = document.createElement("p");
      meaning.className = "teacher-sentence-meaning";
      meaning.textContent = suggestion.note || "中文意思待补充。";

      const sentenceButton = document.createElement("button");
      sentenceButton.className = "teacher-english-sentence";
      sentenceButton.type = "button";
      sentenceButton.textContent = suggestion.sentence;
      sentenceButton.setAttribute("aria-label", `朗读：${suggestion.sentence}`);

      sentenceButton.addEventListener("click", () => {
        speak(suggestion.sentence, "sentence");
      });

      item.append(meaning, sentenceButton);
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

    if (suggestion.note) {
      const note = document.createElement("small");
      note.textContent = suggestion.note;
      option.appendChild(note);
    }

    const english = document.createElement("span");
    english.textContent = suggestion.sentence;
    option.appendChild(english);

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
  panel.hidden = false;
  card.classList.add("is-open");

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
  let userTranslationStarted = false;
  const startDeferredUserTranslation = () => {
    if (!shouldTranslateMessage || userTranslationStarted) return Promise.resolve(null);

    userTranslationStarted = true;
    return requestAiTeacher({ mode: "chat", message: buildUserTranslationRequest(message), messages: [] })
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
      });
  };

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
      .filter((item) => item !== userMessage)
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
    startDeferredUserTranslation();
  }
}

function startTopicPractice() {
  setTeacherTopicMode(true);
  const language = getLearningLanguageConfig();
  sendTeacherMessage(
    `我们开始一个轻松自然的${language.label}日常话题吧。`,
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
adminRefreshButton?.addEventListener("click", () => loadAdminUsers(true));
adminSendAllButton?.addEventListener("click", () => sendAdminMessage(""));
adminMessageCloseButton?.addEventListener("click", hideAdminMessage);
voicePipCloseButton?.addEventListener("click", hideVoicePip);
bindHoldVoiceButton(teacherVoiceButton, { source: "chat" });
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
reviewButton?.addEventListener("click", () => setPage("exam"));
speedSlider.addEventListener("input", updateSpeedLabel);
sentencesNav.addEventListener("click", () => setPage("sentences"));
scenesNav.addEventListener("click", () => setPage("scenes"));
teacherNav.addEventListener("click", () => setPage("teacher"));
friendsNav.addEventListener("click", () => setPage("friends"));
window.addEventListener("popstate", handleScenePopState);
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
currentPage = ["teacher", "exam", "scenes", "friends"].includes(localStorage.getItem(APP_PAGE_KEY))
  ? localStorage.getItem(APP_PAGE_KEY)
  : "sentences";
updateSpeedLabel();
updateLanguageUi();
updateTeacherTopicUi();
updateAuthUi();
render();
renderChatMessages();
setPage(currentPage);
if (authToken) {
  setTimeout(verifyAuthSession, 450);
} else {
  setTimeout(() => enforceAuthGate("请先登录后使用智语导师。"), 300);
}
setTimeout(checkForAppUpdate, 900);
