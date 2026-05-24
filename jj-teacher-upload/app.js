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
const chatComposer = document.querySelector(".chat-composer");
const teacherInput = document.querySelector("#teacherInput");
const teacherSendButton = document.querySelector("#teacherSendButton");
const teacherVoiceButton = document.querySelector("#teacherVoiceButton");
const topicButton = document.querySelector("#topicButton");
const freeChatButton = document.querySelector("#freeChatButton");
const voicePip = document.querySelector("#voicePip");
const voicePipTitle = document.querySelector("#voicePipTitle");
const voicePipStatus = document.querySelector("#voicePipStatus");
const voicePipQuestion = document.querySelector("#voicePipQuestion");
const voicePipMessages = document.querySelector("#voicePipMessages");
const voicePipAnswer = document.querySelector("#voicePipAnswer");
const voicePipForm = document.querySelector("#voicePipForm");
const voicePipInput = document.querySelector("#voicePipInput");
const voicePipSendButton = document.querySelector("#voicePipSendButton");
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
const WORD_LOOKUP_CACHE_KEY = "sentence-reader-word-lookup-cache";
const STALE_EMPTY_AI_REPLIES = new Set(["我暂时没有生成内容。", "我暂时没有生成内容"]);
const TEACHER_MESSAGE_BREAK = "【NEXT_MESSAGE】";
const TEACHER_CORRECTION_MARK = "【CORRECTION】";
const LEARNING_LANGUAGES = {
  english: { label: "英语", targetLabel: "英文", speech: "en-US", tts: "en", sample: "旅行时使用的英文句子" },
  spanish: { label: "西班牙语", targetLabel: "西班牙语", speech: "es-ES", tts: "es", sample: "旅行时使用的西班牙语句子" },
  japanese: { label: "日语", targetLabel: "日语", speech: "ja-JP", tts: "ja", sample: "旅行时使用的日语句子" },
  korean: { label: "韩语", targetLabel: "韩语", speech: "ko-KR", tts: "ko", sample: "旅行时使用的韩语句子" },
};
const APP_BUILD_TAG = "free52";
const APP_VERSION_CODE = 52;
const DAILY_CHAT_REPEAT_KEY = "sentence-reader-daily-chat-last";
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
let currentVocabGroup = "greeting";
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
let voicePipRequestId = 0;
let sentenceAiChatState = null;
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
  have: ["hæv", "有；吃；喝；经历"],
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

const EXTRA_COMMON_DICTIONARY = {
  accept: ["əkˈsept", "接受；同意"],
  actually: ["ˈæktʃuəli", "其实；实际上"],
  add: ["æd", "添加；加上"],
  after: ["ˈæftər", "在...之后"],
  ago: ["əˈɡoʊ", "以前"],
  air: ["er", "空气"],
  airport: ["ˈerpɔːrt", "机场"],
  also: ["ˈɔːlsoʊ", "也；而且"],
  answer: ["ˈænsər", "回答；答案"],
  app: ["æp", "应用；软件"],
  around: ["əˈraʊnd", "周围；大约"],
  ask: ["æsk", "问；请求"],
  back: ["bæk", "回来；后面"],
  bathroom: ["ˈbæθruːm", "浴室；厕所"],
  because: ["bɪˈkɔːz", "因为"],
  before: ["bɪˈfɔːr", "在...之前"],
  better: ["ˈbetər", "更好的；好些"],
  bit: ["bɪt", "一点；小块"],
  boring: ["ˈbɔːrɪŋ", "无聊的"],
  breakfast: ["ˈbrekfəst", "早餐"],
  cafe: ["kæˈfeɪ", "咖啡馆"],
  care: ["ker", "关心；照顾"],
  change: ["tʃeɪndʒ", "改变；零钱"],
  class: ["klæs", "课；班级"],
  close: ["kloʊz", "关闭；靠近"],
  clothes: ["kloʊðz", "衣服"],
  cool: ["kuːl", "酷的；不错的"],
  could: ["kʊd", "可以；能够"],
  day: ["deɪ", "一天；白天"],
  delicious: ["dɪˈlɪʃəs", "好吃的；美味的"],
  different: ["ˈdɪfrənt", "不同的"],
  easy: ["ˈiːzi", "容易的；轻松的"],
  else: ["els", "其他；另外"],
  enjoy: ["ɪnˈdʒɔɪ", "享受；喜欢"],
  evening: ["ˈiːvnɪŋ", "晚上；傍晚"],
  everything: ["ˈevriθɪŋ", "所有事；一切"],
  example: ["ɪɡˈzæmpəl", "例子"],
  excited: ["ɪkˈsaɪtɪd", "兴奋的；期待的"],
  fast: ["fæst", "快的；快速地"],
  few: ["fjuː", "几个；少数"],
  finish: ["ˈfɪnɪʃ", "完成；结束"],
  fun: ["fʌn", "有趣；好玩"],
  going: ["ˈɡoʊɪŋ", "go 的现在分词；去；进展"],
  great: ["ɡreɪt", "很棒的；伟大的"],
  guess: ["ɡes", "猜；估计"],
  have: ["hæv", "有；吃；喝；经历"],
  hello: ["həˈloʊ", "你好"],
  help: ["help", "帮助"],
  hope: ["hoʊp", "希望"],
  hungry: ["ˈhʌŋɡri", "饿的"],
  interesting: ["ˈɪntrəstɪŋ", "有趣的"],
  job: ["dʒɑːb", "工作"],
  just: ["dʒʌst", "只是；刚刚"],
  learn: ["lɜːrn", "学习"],
  little: ["ˈlɪtəl", "小的；一点"],
  long: ["lɔːŋ", "长的；久的"],
  lunch: ["lʌntʃ", "午饭"],
  make: ["meɪk", "做；制造；让"],
  many: ["ˈmeni", "许多"],
  meal: ["miːl", "一餐；饭"],
  meat: ["miːt", "肉"],
  meet: ["miːt", "见面；认识"],
  most: ["moʊst", "最；大多数"],
  much: ["mʌtʃ", "很多；非常"],
  next: ["nekst", "下一个；接下来"],
  nice: ["naɪs", "好的；令人愉快的"],
  noodle: ["ˈnuːdəl", "面条"],
  noodles: ["ˈnuːdəlz", "面条"],
  normal: ["ˈnɔːrməl", "正常的；普通的"],
  often: ["ˈɔːfən", "经常"],
  open: ["ˈoʊpən", "打开；开放的"],
  pasta: ["ˈpɑːstə", "意大利面"],
  pizza: ["ˈpiːtsə", "披萨"],
  question: ["ˈkwestʃən", "问题"],
  quick: ["kwɪk", "快的；迅速的"],
  quite: ["kwaɪt", "相当；很"],
  reply: ["rɪˈplaɪ", "回复；回答"],
  restaurant: ["ˈrestərɑːnt", "餐厅"],
  salad: ["ˈsæləd", "沙拉"],
  same: ["seɪm", "相同的"],
  simple: ["ˈsɪmpəl", "简单的"],
  sleep: ["sliːp", "睡觉"],
  small: ["smɔːl", "小的"],
  sound: ["saʊnd", "听起来；声音"],
  steak: ["steɪk", "牛排"],
  study: ["ˈstʌdi", "学习；研究"],
  sure: ["ʃʊr", "当然；确定"],
  thing: ["θɪŋ", "事情；东西"],
  usually: ["ˈjuːʒuəli", "通常；平常"],
  wait: ["weɪt", "等待"],
  yes: ["jes", "是的；对"],
  yesterday: ["ˈjestərdeɪ", "昨天"],
};

Object.entries(HIGH_FREQUENCY_DICTIONARY).forEach(([word, entry]) => {
  if (!dictionary[word]) dictionary[word] = entry;
});

Object.entries(EXTRA_COMMON_DICTIONARY).forEach(([word, entry]) => {
  if (!dictionary[word]) dictionary[word] = entry;
});

const VOCAB_GROUPS = [
  { id: "greeting", label: "日常打招呼 Greeting" },
  { id: "reaction", label: "聊天反应 Reaction" },
  { id: "time", label: "时间 Time" },
  { id: "food", label: "吃饭 Food" },
  { id: "transportation", label: "出门交通 Transportation" },
  { id: "shopping", label: "购物 Shopping" },
  { id: "work", label: "工作 Appointment / Work" },
  { id: "feelings", label: "情绪 Feelings" },
  { id: "health", label: "身体 Health" },
  { id: "verbs", label: "常用动词 Common Verbs" },
  { id: "salon", label: "发型师 Hair Salon" },
  { id: "gym", label: "健身 Gym" },
  { id: "dating", label: "恋爱聊天 Dating" },
  { id: "airport", label: "机场旅行 Airport & Travel" },
];

function vocabWord(group, word, meaning, example) {
  return { group, word, meaning, example, zh: meaning, english: word, note: example };
}

const VOCAB_LIBRARY = [
  vocabWord("greeting", "hi", "嗨", "Hi, how are you?"),
  vocabWord("greeting", "hello", "你好", "Hello, nice to meet you."),
  vocabWord("greeting", "morning", "早上好", "Morning! How's it going?"),
  vocabWord("greeting", "bye", "再见", "Bye, see you tomorrow."),
  vocabWord("greeting", "later", "回头见", "See you later."),
  vocabWord("greeting", "thanks", "谢谢", "Thanks a lot."),
  vocabWord("greeting", "sorry", "不好意思 / 对不起", "Sorry, I'm late."),
  vocabWord("reaction", "really", "真的吗", "Really? That's crazy."),
  vocabWord("reaction", "wow", "哇", "Wow, that looks good."),
  vocabWord("reaction", "nice", "不错", "Nice! I like it."),
  vocabWord("reaction", "cool", "酷 / 可以", "Cool, sounds good."),
  vocabWord("reaction", "sure", "当然 / 可以", "Sure, no problem."),
  vocabWord("reaction", "maybe", "可能吧", "Maybe next time."),
  vocabWord("reaction", "actually", "其实", "Actually, I'm busy today."),
  vocabWord("reaction", "honestly", "说实话", "Honestly, I don't know."),
  vocabWord("time", "today", "今天", "I'm busy today."),
  vocabWord("time", "tomorrow", "明天", "Are you free tomorrow?"),
  vocabWord("time", "yesterday", "昨天", "I saw him yesterday."),
  vocabWord("time", "now", "现在", "I'm working now."),
  vocabWord("time", "soon", "很快", "I'll be there soon."),
  vocabWord("time", "early", "早", "I woke up early."),
  vocabWord("time", "late", "晚 / 迟到", "Sorry, I'm late."),
  vocabWord("food", "hungry", "饿", "I'm hungry."),
  vocabWord("food", "full", "饱", "I'm full."),
  vocabWord("food", "breakfast", "早餐", "I had breakfast already."),
  vocabWord("food", "lunch", "午餐", "What do you want for lunch?"),
  vocabWord("food", "dinner", "晚餐", "Let's get dinner."),
  vocabWord("food", "drink", "喝 / 饮料", "Do you want a drink?"),
  vocabWord("food", "taste", "味道", "It tastes good."),
  vocabWord("food", "spicy", "辣", "Is it spicy?"),
  vocabWord("transportation", "drive", "开车", "I'll drive there."),
  vocabWord("transportation", "walk", "走路", "It's close. We can walk."),
  vocabWord("transportation", "train", "火车 / 地铁", "I'll take the train."),
  vocabWord("transportation", "bus", "公交车", "The bus is late."),
  vocabWord("transportation", "uber", "打车", "Let's take an Uber."),
  vocabWord("transportation", "traffic", "堵车", "There's a lot of traffic."),
  vocabWord("transportation", "parking", "停车", "Is there parking here?"),
  vocabWord("transportation", "address", "地址", "Send me the address."),
  vocabWord("shopping", "price", "价格", "What's the price?"),
  vocabWord("shopping", "cheap", "便宜", "That's pretty cheap."),
  vocabWord("shopping", "expensive", "贵", "It's too expensive."),
  vocabWord("shopping", "discount", "折扣", "Is there a discount?"),
  vocabWord("shopping", "size", "尺码", "Do you have my size?"),
  vocabWord("shopping", "cash", "现金", "Can I pay cash?"),
  vocabWord("shopping", "card", "卡", "Can I use card?"),
  vocabWord("shopping", "receipt", "收据", "Can I get a receipt?"),
  vocabWord("work", "available", "有空 / 有位置", "I'm available at 3pm."),
  vocabWord("work", "busy", "忙", "I'm busy today."),
  vocabWord("work", "book", "预约", "Can I book an appointment?"),
  vocabWord("work", "appointment", "预约", "I have an appointment at 2."),
  vocabWord("work", "cancel", "取消", "Can I cancel my appointment?"),
  vocabWord("work", "reschedule", "改时间", "Can we reschedule?"),
  vocabWord("work", "confirm", "确认", "Can you confirm the time?"),
  vocabWord("work", "walk-in", "直接进店", "Do you accept walk-ins?"),
  vocabWord("work", "deposit", "订金", "A deposit is required."),
  vocabWord("feelings", "happy", "开心", "I'm happy today."),
  vocabWord("feelings", "tired", "累", "I'm so tired."),
  vocabWord("feelings", "sleepy", "困", "I feel sleepy."),
  vocabWord("feelings", "angry", "生气", "He looks angry."),
  vocabWord("feelings", "sad", "难过", "I feel sad."),
  vocabWord("feelings", "nervous", "紧张", "I'm nervous."),
  vocabWord("feelings", "excited", "兴奋", "I'm excited for tomorrow."),
  vocabWord("feelings", "stressed", "压力大", "I'm stressed out."),
  vocabWord("health", "hurt", "疼", "My back hurts."),
  vocabWord("health", "sick", "生病", "I feel sick."),
  vocabWord("health", "headache", "头疼", "I have a headache."),
  vocabWord("health", "stomach", "胃 / 肚子", "My stomach hurts."),
  vocabWord("health", "sleep", "睡觉", "I need more sleep."),
  vocabWord("health", "rest", "休息", "You should rest."),
  vocabWord("health", "medicine", "药", "Did you take medicine?"),
  vocabWord("health", "doctor", "医生", "You should see a doctor."),
  vocabWord("verbs", "go", "去", "Let's go."),
  vocabWord("verbs", "come", "来", "Can you come here?"),
  vocabWord("verbs", "get", "得到 / 去拿 / 变得", "I'll get it."),
  vocabWord("verbs", "make", "做", "I'll make coffee."),
  vocabWord("verbs", "take", "拿 / 带 / 花费", "Take your time."),
  vocabWord("verbs", "want", "想要", "What do you want?"),
  vocabWord("verbs", "need", "需要", "I need help."),
  vocabWord("verbs", "know", "知道", "I don't know."),
  vocabWord("verbs", "think", "觉得 / 想", "I think so."),
  vocabWord("verbs", "feel", "感觉", "I feel better."),
  vocabWord("salon", "trim", "修一下", "I just want a trim."),
  vocabWord("salon", "fade", "渐变", "Can you do a low fade?"),
  vocabWord("salon", "taper", "渐短", "I want a taper on the sides."),
  vocabWord("salon", "bangs", "刘海", "Keep the bangs longer."),
  vocabWord("salon", "layer", "层次", "Add some layers on top."),
  vocabWord("salon", "perm", "烫发", "I'm thinking about getting a perm."),
  vocabWord("salon", "volume", "蓬松感", "I want more volume."),
  vocabWord("salon", "texture", "纹理感", "Add more texture to the top."),
  vocabWord("salon", "thin out", "打薄", "Can you thin it out a little?"),
  vocabWord("salon", "blend", "衔接", "Blend the sides naturally."),
  vocabWord("gym", "workout", "训练", "I had a good workout today."),
  vocabWord("gym", "bulk", "增肌", "I'm trying to bulk up."),
  vocabWord("gym", "cut", "减脂", "I'm cutting right now."),
  vocabWord("gym", "protein", "蛋白质", "I need more protein."),
  vocabWord("gym", "carbs", "碳水", "Carbs give you energy."),
  vocabWord("gym", "muscle", "肌肉", "I want to build muscle."),
  vocabWord("gym", "sore", "酸痛", "My legs are sore today."),
  vocabWord("gym", "rep", "次数", "Do 10 reps."),
  vocabWord("gym", "set", "组", "I did 4 sets today."),
  vocabWord("gym", "cardio", "有氧", "I hate cardio."),
  vocabWord("dating", "cute", "可爱", "You look cute today."),
  vocabWord("dating", "miss", "想念", "I miss you already."),
  vocabWord("dating", "date", "约会", "Do you want to go on a date?"),
  vocabWord("dating", "crush", "暗恋对象", "I have a crush on her."),
  vocabWord("dating", "relationship", "关系", "We're in a relationship."),
  vocabWord("dating", "text", "发消息", "Text me when you get home."),
  vocabWord("dating", "flirt", "调情", "He's flirting with you."),
  vocabWord("dating", "awkward", "尴尬", "That was awkward."),
  vocabWord("airport", "passport", "护照", "Don't forget your passport."),
  vocabWord("airport", "boarding", "登机", "Boarding starts at 8."),
  vocabWord("airport", "flight", "航班", "My flight is delayed."),
  vocabWord("airport", "luggage", "行李", "Where's my luggage?"),
  vocabWord("airport", "customs", "海关", "I'm going through customs."),
  vocabWord("airport", "gate", "登机口", "Which gate is it?"),
  vocabWord("airport", "carry-on", "随身行李", "This is my carry-on."),
  vocabWord("airport", "delay", "延误", "The flight got delayed."),
];

const SCENE_GROUPS = [
  { id: "friends", label: "朋友闲聊" },
  { id: "appointment", label: "预约" },
  { id: "salon", label: "发型店" },
  { id: "food", label: "吃饭" },
  { id: "gym", label: "健身" },
  { id: "dating", label: "约会聊天" },
  { id: "shopping", label: "购物" },
  { id: "driving", label: "开车" },
  { id: "travel", label: "旅行" },
];

function sceneDialogueLine(speaker, english, zh) {
  return { speaker, english, zh };
}

const SCENE_LIBRARY = [
  {
    id: "friends-weekend",
    group: "friends",
    level: "常用",
    title: "聊周末",
    description: "朋友闲聊场景：聊周末。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "What are you up to this weekend?", "你这周末准备干嘛？"),
      sceneDialogueLine("B", "I might just stay home and chill.", "我可能就在家放松一下。"),
      sceneDialogueLine("A", "Honestly, that sounds pretty nice.", "说实话，听起来挺不错的。"),
      sceneDialogueLine("B", "Yeah, I’ve been exhausted lately.", "对，我最近真的累坏了。"),
    ],
  },
  {
    id: "friends-work",
    group: "friends",
    level: "常用",
    title: "聊工作",
    description: "朋友闲聊场景：聊工作。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "How’s work been lately?", "最近工作怎么样？"),
      sceneDialogueLine("B", "Pretty busy, honestly.", "说实话，挺忙的。"),
      sceneDialogueLine("A", "Same here. I barely get any sleep.", "我也是，最近都没什么睡觉。"),
      sceneDialogueLine("B", "Yeah, I feel you.", "对，我懂你。"),
    ],
  },
  {
    id: "friends-late-night",
    group: "friends",
    level: "常用",
    title: "深夜聊天",
    description: "朋友闲聊场景：深夜聊天。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Why are you still awake?", "你怎么还没睡？"),
      sceneDialogueLine("B", "I can’t fall asleep.", "我睡不着。"),
      sceneDialogueLine("A", "Same. My sleep schedule is messed up.", "我也是，我作息乱了。"),
      sceneDialogueLine("B", "Mine’s been terrible lately.", "我最近作息也很糟糕。"),
    ],
  },
  {
    id: "friends-grab-food",
    group: "friends",
    level: "常用",
    title: "约朋友吃饭",
    description: "朋友闲聊场景：约朋友吃饭。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "You trying to grab food later?", "晚点要不要一起吃饭？"),
      sceneDialogueLine("B", "I’m down.", "可以啊。"),
      sceneDialogueLine("A", "What are you in the mood for?", "你想吃什么？"),
      sceneDialogueLine("B", "Honestly, anything sounds good.", "说实话，吃什么都行。"),
    ],
  },
  {
    id: "friends-disappear",
    group: "friends",
    level: "常用",
    title: "突然消失",
    description: "朋友闲聊场景：突然消失。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Bro, where have you been?", "兄弟，你最近跑哪去了？"),
      sceneDialogueLine("B", "I’ve just been busy.", "最近一直在忙。"),
      sceneDialogueLine("A", "You disappeared for like a week.", "你都消失快一周了。"),
      sceneDialogueLine("B", "Yeah, life’s been crazy lately.", "对，最近事情太多了。"),
    ],
  },
  {
    id: "appointment-time",
    group: "appointment",
    level: "常用",
    title: "预约时间",
    description: "预约场景：预约时间。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Are you free this weekend?", "你这周末有空吗？"),
      sceneDialogueLine("B", "Yeah, Sunday works for me.", "有，周日可以。"),
      sceneDialogueLine("A", "I have 3pm available.", "我下午3点有空。"),
      sceneDialogueLine("B", "Perfect.", "可以。"),
    ],
  },
  {
    id: "appointment-reschedule",
    group: "appointment",
    level: "常用",
    title: "改时间",
    description: "预约场景：改时间。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Hey, can we reschedule?", "嘿，我们可以改时间吗？"),
      sceneDialogueLine("B", "Yeah, no problem.", "可以，没问题。"),
      sceneDialogueLine("A", "Something came up today.", "我今天突然有点事。"),
      sceneDialogueLine("B", "All good.", "没事。"),
    ],
  },
  {
    id: "appointment-late",
    group: "appointment",
    level: "常用",
    title: "迟到",
    description: "预约场景：迟到。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Are you almost here?", "你快到了吗？"),
      sceneDialogueLine("B", "I’m running late.", "我要迟到了。"),
      sceneDialogueLine("A", "No worries. Drive safe.", "没事，注意安全。"),
      sceneDialogueLine("B", "I’ll be there in 10.", "我10分钟到。"),
    ],
  },
  {
    id: "salon-first-consult",
    group: "salon",
    level: "常用",
    title: "第一次咨询",
    description: "发型店场景：第一次咨询。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "What are we doing today?", "今天想怎么剪？"),
      sceneDialogueLine("B", "Just a cleanup, not too short.", "稍微修一下，不要太短。"),
      sceneDialogueLine("A", "Do you usually style your hair?", "你平时会抓头发吗？"),
      sceneDialogueLine("B", "Not really.", "不太会。"),
    ],
  },
  {
    id: "salon-natural-sides",
    group: "salon",
    level: "常用",
    title: "两边不要太短",
    description: "发型店场景：两边不要太短。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "How short do you want the sides?", "两边想剪多短？"),
      sceneDialogueLine("B", "Not too short.", "不要太短。"),
      sceneDialogueLine("A", "More natural or more clean?", "想自然一点还是干净一点？"),
      sceneDialogueLine("B", "More natural.", "自然一点。"),
    ],
  },
  {
    id: "salon-grow-out",
    group: "salon",
    level: "常用",
    title: "想留长",
    description: "发型店场景：想留长。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Are you trying to grow it out?", "你是在留长吗？"),
      sceneDialogueLine("B", "Yeah, but it looks awkward right now.", "对，但现在有点尴尬。"),
      sceneDialogueLine("A", "That’s normal.", "这很正常。"),
      sceneDialogueLine("A", "I’ll shape it up for you.", "我帮你修顺一点。"),
    ],
  },
  {
    id: "salon-thick-hair",
    group: "salon",
    level: "常用",
    title: "头发太厚",
    description: "发型店场景：头发太厚。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Your hair is really thick.", "你的头发挺厚的。"),
      sceneDialogueLine("B", "Yeah, it gets puffy fast.", "对，很容易炸。"),
      sceneDialogueLine("A", "I’ll thin it out a little.", "我帮你稍微打薄一点。"),
      sceneDialogueLine("B", "That would help a lot.", "那会好很多。"),
    ],
  },
  {
    id: "salon-perm-consult",
    group: "salon",
    level: "常用",
    title: "烫发咨询",
    description: "发型店场景：烫发咨询。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Have you ever gotten a perm before?", "你以前烫过头发吗？"),
      sceneDialogueLine("B", "No, this is my first time.", "没有，这是第一次。"),
      sceneDialogueLine("A", "I’d recommend a soft perm.", "我会推荐自然一点的烫发。"),
      sceneDialogueLine("B", "That’s exactly what I want.", "这就是我想要的。"),
    ],
  },
  {
    id: "food-decide",
    group: "food",
    level: "常用",
    title: "决定吃什么",
    description: "吃饭场景：决定吃什么。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "What do you want to eat?", "你想吃什么？"),
      sceneDialogueLine("B", "I’m down for anything.", "我吃什么都可以。"),
      sceneDialogueLine("A", "I’m starving.", "我快饿死了。"),
      sceneDialogueLine("B", "Same here.", "我也是。"),
    ],
  },
  {
    id: "food-order",
    group: "food",
    level: "常用",
    title: "餐厅点餐",
    description: "吃饭场景：餐厅点餐。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Are you ready to order?", "准备好点餐了吗？"),
      sceneDialogueLine("B", "Yeah, I’ll get the burger.", "好，我要汉堡。"),
      sceneDialogueLine("A", "Do you want fries with that?", "要配薯条吗？"),
      sceneDialogueLine("B", "Sure.", "好。"),
    ],
  },
  {
    id: "gym-training",
    group: "gym",
    level: "常用",
    title: "聊训练",
    description: "健身场景：聊训练。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "What are you training today?", "你今天练什么？"),
      sceneDialogueLine("B", "Chest and shoulders.", "胸和肩。"),
      sceneDialogueLine("A", "Trying to bulk up?", "在增肌？"),
      sceneDialogueLine("B", "Yeah, I’m trying to build muscle.", "对，我在增肌。"),
    ],
  },
  {
    id: "gym-leg-day",
    group: "gym",
    level: "常用",
    title: "练腿太酸",
    description: "健身场景：练腿太酸。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Why are you walking like that?", "你怎么这样走路？"),
      sceneDialogueLine("B", "Leg day yesterday.", "昨天练腿了。"),
      sceneDialogueLine("A", "Your legs sore?", "腿酸？"),
      sceneDialogueLine("B", "Super sore.", "特别酸。"),
    ],
  },
  {
    id: "dating-first-meet",
    group: "dating",
    level: "常用",
    title: "第一次见面",
    description: "约会聊天场景：第一次见面。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "You look exactly like your pictures.", "你跟照片里一模一样。"),
      sceneDialogueLine("B", "That’s a good thing, right?", "这是好事吧？"),
      sceneDialogueLine("A", "Definitely.", "当然。"),
      sceneDialogueLine("B", "You seem really chill.", "你人看起来很随和。"),
    ],
  },
  {
    id: "dating-flirt",
    group: "dating",
    level: "常用",
    title: "轻松暧昧",
    description: "约会聊天场景：轻松暧昧。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "You look really good today.", "你今天看起来很好看。"),
      sceneDialogueLine("B", "Stop, you’re making me blush.", "别说了，你都让我害羞了。"),
      sceneDialogueLine("A", "I’m serious though.", "我是认真的。"),
      sceneDialogueLine("B", "That’s sweet.", "你真会说话。"),
    ],
  },
  {
    id: "shopping-clothes",
    group: "shopping",
    level: "常用",
    title: "买衣服",
    description: "购物场景：买衣服。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Can I help you find anything?", "需要帮忙找什么吗？"),
      sceneDialogueLine("B", "Do you have this in a medium?", "这个有M码吗？"),
      sceneDialogueLine("A", "Let me check for you.", "我帮你看看。"),
      sceneDialogueLine("B", "Thanks, I appreciate it.", "谢谢，麻烦你了。"),
    ],
  },
  {
    id: "driving-traffic",
    group: "driving",
    level: "常用",
    title: "路上堵车",
    description: "开车场景：路上堵车。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Where are you right now?", "你现在到哪了？"),
      sceneDialogueLine("B", "Still on the highway.", "还在高速上。"),
      sceneDialogueLine("A", "Traffic bad?", "很堵吗？"),
      sceneDialogueLine("B", "Yeah, it’s moving super slow.", "对，车流特别慢。"),
    ],
  },
  {
    id: "travel-boarding",
    group: "travel",
    level: "常用",
    title: "机场登机",
    description: "旅行场景：机场登机。",
    items: [],
    dialogue: [
      sceneDialogueLine("A", "Did you check in already?", "你已经值机了吗？"),
      sceneDialogueLine("B", "Yeah, I just did.", "对，刚办完。"),
      sceneDialogueLine("A", "What gate are you at?", "你在哪个登机口？"),
      sceneDialogueLine("B", "Gate 24.", "24号登机口。"),
    ],
  },
];

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

function loadWordLookupCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(WORD_LOOKUP_CACHE_KEY) || "{}");
    if (!cache || typeof cache !== "object") return {};
    Object.entries(cache).forEach(([word, entry]) => {
      if (!word || !entry || typeof entry.meaning !== "string") return;
      dictionary[word] = [entry.phonetic || "", entry.meaning];
    });
    return cache;
  } catch {
    return {};
  }
}

function saveWordLookupCache(word, entry) {
  const cleanWord = normalizeWord(word);
  if (!cleanWord || !entry?.meaning) return;

  const cache = loadWordLookupCache();
  cache[cleanWord] = {
    phonetic: String(entry.phonetic || "").trim(),
    meaning: String(entry.meaning || "").trim(),
    savedAt: Date.now(),
  };

  const trimmedEntries = Object.entries(cache)
    .sort((a, b) => Number(b[1]?.savedAt || 0) - Number(a[1]?.savedAt || 0))
    .slice(0, 500);
  localStorage.setItem(WORD_LOOKUP_CACHE_KEY, JSON.stringify(Object.fromEntries(trimmedEntries)));
  dictionary[cleanWord] = [cache[cleanWord].phonetic, cache[cleanWord].meaning];
}

function lookupWord(word) {
  const variants = getWordLookupVariants(word);
  for (const variant of variants) {
    if (dictionary[variant]) {
      const [phonetic, meaning] = dictionary[variant];
      return { phonetic, meaning, variant, source: "local" };
    }
  }

  return null;
}

async function lookupWordOnline(word) {
  const cleanWord = normalizeWord(word).replace(/[’‘]/g, "'");
  if (!/^[a-z]+(?:'[a-z]+)?$/i.test(cleanWord)) return null;

  const data = await authApiRequest("/api/word-lookup", {
    method: "POST",
    body: JSON.stringify({ word: cleanWord }),
  });
  const entry = {
    phonetic: String(data.phonetic || "").trim(),
    meaning: String(data.meaning || "").trim(),
  };
  if (!entry.meaning) return null;
  saveWordLookupCache(cleanWord, entry);
  return entry;
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
  document.querySelectorAll("[data-daily-prompt]").forEach((button) => {
    button.textContent = `${language.label}日常句子`;
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

function getVoiceLanguageHint() {
  const code = getVoiceLanguageCode().split("-")[0].toLowerCase();
  return ["en", "es", "ja", "ko"].includes(code) ? code : "";
}

function setVoiceButtonListening(button, isListening) {
  if (!button) return;
  button.classList.toggle("is-listening", isListening);
  button.setAttribute("aria-pressed", String(isListening));
}

function setChatVoiceListening(isListening, status = "正在收听，松开发送") {
  if (!chatComposer) return;
  chatComposer.classList.toggle("is-listening", isListening);
  chatComposer.dataset.voiceStatus = isListening ? status : "";
}

function getRecorderMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];
  return candidates.find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || "";
}

function stopMediaStream(stream) {
  try {
    stream?.getTracks?.().forEach((track) => track.stop());
  } catch {
    // Best-effort cleanup for mobile WebView media streams.
  }
}

async function startAiVoiceRecording(capture) {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return false;

  capture.audioMode = "ai";
  capture.audioChunks = [];
  setChatVoiceListening(true, "正在打开麦克风...");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    if (voiceCapture !== capture || capture.finalHandled) {
      stopMediaStream(stream);
      return true;
    }

    const mimeType = getRecorderMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    capture.audioStream = stream;
    capture.audioRecorder = recorder;
    capture.audioStopPromise = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data?.size) capture.audioChunks.push(event.data);
      };
      recorder.onerror = () => reject(new Error("录音失败"));
      recorder.onstop = () => {
        stopMediaStream(stream);
        const type = recorder.mimeType || mimeType || "audio/webm";
        resolve(new Blob(capture.audioChunks, { type }));
      };
    });

    recorder.start();
    capture.starting = false;
    setChatVoiceListening(true, "正在收听，松开发送");
    if (capture.releaseRequested) stopVoiceCapture();
    return true;
  } catch (error) {
    capture.audioError = error?.message || "麦克风不可用";
    capture.audioMode = "";
    return false;
  }
}

function stopAiVoiceRecording(capture) {
  if (!capture?.audioRecorder) return Promise.resolve(null);
  const recorder = capture.audioRecorder;
  const promise = capture.audioStopPromise || Promise.resolve(null);
  try {
    if (recorder.state !== "inactive") recorder.stop();
  } catch {
    stopMediaStream(capture.audioStream);
  }
  return promise;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",").pop() || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function requestVoiceTranscription(blob) {
  const audioBase64 = await blobToBase64(blob);
  const data = await authApiRequest("/api/transcribe", {
    method: "POST",
    body: JSON.stringify({
      audioBase64,
      mimeType: blob.type || "audio/webm",
      language: getVoiceLanguageHint(),
    }),
  });
  return String(data.text || "").trim();
}

function installVoiceListeners() {
  if (voiceListenersReady) return;
  const nativeSpeech = getNativeSpeechPlugin();
  if (!nativeSpeech?.addListener) return;

  voiceListenersReady = true;
  nativeSpeech.addListener("speechReady", () => {
    if (!voiceCapture) return;
    setVoiceButtonListening(voiceCapture.button, true);
    if (voiceCapture.source === "chat") {
      setChatVoiceListening(true, "正在收听，松开发送");
    } else {
      updateVoicePipStatus("正在收听");
    }
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
    released: false,
    starting: true,
    releaseRequested: false,
    stopTimer: 0,
    webRecognition: null,
  };
  voiceCapture = capture;
  setVoiceButtonListening(capture.button, true);

  if (capture.source === "chat") {
    teacherInput.value = "";
    setChatVoiceListening(true);
    teacherInput.dispatchEvent(new Event("input", { bubbles: true }));
    if (await startAiVoiceRecording(capture)) return;
    handleVoiceError("AI语音识别启动失败，请检查麦克风权限。");
    return;
  } else if (capture.source === "sentence") {
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
      capture.starting = false;
      if (voiceCapture === capture && capture.releaseRequested) stopVoiceCapture();
      return;
    } catch (error) {
      capture.starting = false;
      handleVoiceError(error?.message || "系统语音识别启动失败");
      return;
    }
  }

  capture.starting = false;
  startWebSpeechCapture(capture);
  if (voiceCapture === capture && capture.releaseRequested) stopVoiceCapture();
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

  capture.released = true;
  if (capture.starting) {
    capture.releaseRequested = true;
    if (capture.source === "chat") {
      setChatVoiceListening(true, capture.audioMode === "ai" ? "正在等待麦克风权限..." : "正在等待语音权限...");
    }
    return;
  }

  if (capture.source === "chat" && capture.audioMode === "ai") {
    transcribeAiVoiceRecording(capture);
    return;
  }

  if (capture.source === "chat") {
    setChatVoiceListening(true, capture.transcript ? "正在整理语音..." : "正在识别...");
  }

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
  }, capture.source === "chat" ? 650 : 1300);
}

async function transcribeAiVoiceRecording(capture) {
  if (!capture || capture.finalHandled || capture.transcribing) return;

  capture.released = true;
  capture.transcribing = true;
  clearTimeout(capture.stopTimer);
  setChatVoiceListening(true, "正在用AI识别语音...");

  try {
    const blob = await stopAiVoiceRecording(capture);
    if (voiceCapture !== capture || capture.finalHandled) return;
    if (!blob || blob.size < 800) {
      completeVoiceCapture(capture, "");
      return;
    }

    const transcript = await requestVoiceTranscription(blob);
    if (voiceCapture !== capture || capture.finalHandled) return;
    completeVoiceCapture(capture, transcript);
  } catch (error) {
    if (voiceCapture !== capture || capture.finalHandled) return;
    clearTimeout(capture.stopTimer);
    capture.finalHandled = true;
    setVoiceButtonListening(capture.button, false);
    voiceCapture = null;
    setChatVoiceListening(false);
    teacherInput.placeholder = "AI语音识别失败，再按住麦克风说一次...";
    setTimeout(updateLanguageUi, 1800);
  }
}

function handleVoicePartial(text) {
  const capture = voiceCapture;
  if (!capture || !text.trim()) return;

  capture.transcript = text.trim();
  if (capture.source === "chat") {
    teacherInput.value = capture.transcript;
    setChatVoiceListening(true, capture.transcript);
    teacherInput.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    updateVoicePipStatus("正在收听");
    if (voicePipQuestion) voicePipQuestion.textContent = capture.transcript;
  }
}

function completeVoiceCapture(capture, transcriptText) {
  const transcript = String(transcriptText || capture?.transcript || "").trim();
  if (!capture || capture.finalHandled) return;
  capture.finalHandled = true;
  clearTimeout(capture.stopTimer);
  setVoiceButtonListening(capture.button, false);
  if (capture.audioMode === "ai") {
    stopAiVoiceRecording(capture).catch(() => {});
  }
  voiceCapture = null;

  if (!transcript) {
    if (capture.source === "chat") {
      setChatVoiceListening(false);
      teacherInput.placeholder = "没有听清，再按住麦克风说一次...";
      setTimeout(updateLanguageUi, 1800);
    }
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
    setChatVoiceListening(false);
    teacherInput.value = transcript;
    teacherInput.dispatchEvent(new Event("input", { bubbles: true }));
    sendTeacherMessage(transcript);
    return;
  }

  sendSentenceVoiceQuestion(capture.sentenceText, transcript);
}

function handleVoiceFinal(text) {
  const capture = voiceCapture;
  if (!capture || capture.finalHandled) return;
  completeVoiceCapture(capture, text || capture.transcript || "");
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

  if (capture.source === "chat") {
    setChatVoiceListening(false);
    teacherInput.placeholder = "语音识别失败，再按住麦克风说一次...";
    setTimeout(updateLanguageUi, 1800);
    return;
  }

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
  let started = false;

  button.addEventListener("contextmenu", (event) => event.preventDefault());
  button.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    if (started) return;
    button.setPointerCapture?.(event.pointerId);
    started = true;
    startVoiceCapture({ ...options, button });
  });

  const endPress = () => {
    if (started) stopVoiceCapture();
    started = false;
  };

  button.addEventListener("pointerup", endPress);
  button.addEventListener("pointercancel", endPress);
  button.addEventListener("lostpointercapture", () => {
    if (started) stopVoiceCapture();
    started = false;
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
  voicePipRequestId += 1;
  voicePipReplyInFlight = false;
  sentenceAiChatState = null;
  voicePip.classList.remove("is-open");
  setTimeout(() => {
    voicePip.hidden = true;
  }, 160);
}

function updateVoicePipStatus(status) {
  if (voicePipStatus) voicePipStatus.textContent = status;
}

function setVoicePipChatMode(enabled) {
  if (voicePipForm) voicePipForm.hidden = !enabled;
  if (voicePipMessages) voicePipMessages.hidden = !enabled;
  if (voicePipAnswer) voicePipAnswer.hidden = enabled;
}

function cleanSentenceAiText(text) {
  return renameTeacherText(stripChatMarkdown(text))
    .replace(/(?:^|\n|\s)(?:继续话题|延伸话题|自然延伸|追问|问题)\s*[:：]\s*/gu, "\n\n")
    .replace(/\s+(讲解|句意|重点|用法|回答)([:：])/g, "\n\n$1$2")
    .replace(/\s+(中文|中文意思|英文|英语|西班牙语|日语|韩语)([:：])/g, "\n$1$2")
    .replace(/\s+(\d+[.)、])/g, "\n$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getVoicePipSentenceSuggestions(text) {
  const cleanText = cleanSentenceAiText(text);
  const sentences = extractTargetSentences(cleanText)
    .filter((sentence) => sentence && !isTeacherMetaTargetSentence(sentence, cleanText))
    .filter((sentence) => !isSameTargetSentence(sentence, sentenceAiChatState?.sentenceText || ""))
    .filter((sentence) => isLikelyFullTargetSentence(sentence))
    .filter((sentence, index, items) => items.indexOf(sentence) === index)
    .slice(0, 1);

  return sentences.map((sentence) => ({
    sentence,
    note: inferChineseQuestionNote(cleanText, sentence) || inferSuggestionNote(cleanText, sentence) || inferFallbackChineseMeaning(cleanText),
  }));
}

function removeVoicePipSentencesFromText(text, suggestions) {
  let clean = cleanSentenceAiText(text);
  suggestions.forEach((suggestion) => {
    clean = clean.split(suggestion.sentence).join(" ");
  });

  return clean
    .replace(/(?:英文|目标语|英语|西班牙语|日语|韩语)\s*[：:]\s*/g, "")
    .replace(/(?:中文意思|意思|翻译)\s*[：:]\s*/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderVoicePipSentenceList(container, suggestions) {
  if (!suggestions.length) return;

  const list = document.createElement("div");
  list.className = "voice-pip-sentence-list";
  suggestions.forEach((suggestion) => {
    const item = document.createElement("div");
    item.className = "voice-pip-sentence-item";

    if (suggestion.note) {
      const note = document.createElement("p");
      note.className = "voice-pip-sentence-note";
      note.textContent = suggestion.note;
      item.appendChild(note);
    }

    const row = document.createElement("div");
    row.className = "voice-pip-sentence-row";

    const sentence = document.createElement("div");
    sentence.className = "voice-pip-sentence-text";
    renderSpeakableText(sentence, suggestion.sentence);

    const speakButton = document.createElement("button");
    speakButton.className = "teacher-line-speak";
    speakButton.type = "button";
    speakButton.title = "朗读句子";
    speakButton.setAttribute("aria-label", `朗读：${suggestion.sentence}`);
    speakButton.textContent = "▶";
    speakButton.addEventListener("click", (event) => {
      event.stopPropagation();
      speak(suggestion.sentence, "sentence");
    });

    const addButton = document.createElement("button");
    addButton.className = "teacher-line-add";
    addButton.type = "button";
    addButton.title = "加入句子";
    addButton.setAttribute("aria-label", `加入句子：${suggestion.sentence}`);
    addButton.textContent = "+";
    addButton.addEventListener("click", (event) => {
      event.stopPropagation();
      addTeacherSentence(suggestion, addButton);
    });

    row.append(sentence, speakButton, addButton);
    item.appendChild(row);
    list.appendChild(item);
  });

  container.appendChild(list);
}

function renderVoicePipAssistantContent(container, text, pending = false) {
  const suggestions = pending ? [] : getVoicePipSentenceSuggestions(text);
  const readableText = pending ? cleanSentenceAiText(text) : removeVoicePipSentencesFromText(text, suggestions);
  if (readableText) appendReadableText(container, readableText, "voice-pip-text");
  renderVoicePipSentenceList(container, suggestions);
}

function renderVoicePipMessages() {
  if (!voicePipMessages || !sentenceAiChatState) return;
  voicePipMessages.innerHTML = "";
  sentenceAiChatState.messages.forEach((message) => {
    const row = document.createElement("div");
    row.className = `voice-pip-message is-${message.role}${message.pending ? " is-pending" : ""}`;

    const label = document.createElement("span");
    label.textContent = message.role === "user" ? "你" : "智语导师";

    const content = document.createElement("div");
    content.className = "voice-pip-message-content";
    const messageText = message.text || (message.pending ? "正在回复..." : "");
    if (message.role === "assistant") {
      renderVoicePipAssistantContent(content, messageText, message.pending);
    } else {
      appendReadableText(content, messageText, "voice-pip-text");
    }

    row.append(label, content);
    voicePipMessages.appendChild(row);
  });
  voicePipMessages.scrollTop = voicePipMessages.scrollHeight;
}

function getSentenceAiHistory(excludeMessage = null) {
  if (!sentenceAiChatState) return [];
  return sentenceAiChatState.messages
    .filter((message) => message !== excludeMessage && !message.pending)
    .slice(-8)
    .map((message) => ({ role: message.role === "user" ? "user" : "assistant", text: message.text }));
}

async function streamSentenceAiReply(prompt, pendingMessage, options = {}) {
  const requestId = voicePipRequestId;
  let streamedText = "";
  voicePipReplyInFlight = true;
  if (voicePipSendButton) voicePipSendButton.disabled = true;

  try {
    const data = await requestAiTeacherStream(
      {
        mode: "chat",
        message: prompt,
        messages: getSentenceAiHistory(options.excludeFromHistory),
      },
      {
        onDelta: (_delta, text) => {
          if (requestId !== voicePipRequestId || !text.trim() || !sentenceAiChatState) return;
          streamedText = text;
          pendingMessage.text = cleanSentenceAiText(text);
          renderVoicePipMessages();
        },
      }
    );
    if (requestId !== voicePipRequestId || !sentenceAiChatState) return;
    pendingMessage.text = cleanSentenceAiText(streamedText || data.reply || "这次没有拿到回复，请再试一次。");
    pendingMessage.pending = false;
    updateVoicePipStatus("可以继续聊");
    renderVoicePipMessages();
  } catch (error) {
    if (requestId !== voicePipRequestId || !sentenceAiChatState) return;
    pendingMessage.text = renameTeacherText(error.message || "智语导师暂时连接不上。");
    pendingMessage.pending = false;
    updateVoicePipStatus("回复失败");
    renderVoicePipMessages();
  } finally {
    if (requestId === voicePipRequestId) voicePipReplyInFlight = false;
    if (voicePipSendButton) voicePipSendButton.disabled = false;
  }
}

async function openSentenceAiAnswer(sentenceText, note = "") {
  const language = getLearningLanguageConfig();
  const requestId = voicePipRequestId + 1;
  voicePipRequestId = requestId;
  sentenceAiChatState = {
    sentenceText,
    note,
    messages: [],
  };
  const prompt = [
    `用户正在学习这句${language.label}: ${sentenceText}`,
    note ? `用户保存的中文句意: ${note}` : "",
    "请只做两件事：",
    "1. 用中文讲这句话最重要的重点：意思、使用场景、一个关键词或口语点。控制在3-5句内。",
    `2. 最后只给一条自然聊天问句，先写中文问句，再写同一个问题的${language.label}版本。`,
    `中文问句和${language.label}问句要意思一致；${language.label}问句单独成行，方便 App 添加朗读和收藏按钮。`,
    "不要拆词组，不要列短语，不要写多个英文句子，不要写“继续话题：”“问题：”“追问：”这些标题，不要表格，不要 markdown 星号。",
  ]
    .filter(Boolean)
    .join("\n");

  showVoicePip({
    title: "AI解答",
    status: "AI 正在讲解",
    question: sentenceText,
    answer: "",
  });
  setVoicePipChatMode(true);
  if (voicePipInput) voicePipInput.value = "";

  const pendingMessage = { role: "assistant", text: "正在生成讲解...", pending: true };
  sentenceAiChatState.messages.push(pendingMessage);
  renderVoicePipMessages();
  streamSentenceAiReply(prompt, pendingMessage);
}

async function sendSentenceAiChatMessage() {
  if (!sentenceAiChatState || !voicePipInput) return;
  const text = voicePipInput.value.trim();
  if (!text || voicePipReplyInFlight) return;

  const language = getLearningLanguageConfig();
  const userMessage = { role: "user", text };
  const pendingMessage = { role: "assistant", text: "正在回复...", pending: true };
  sentenceAiChatState.messages.push(userMessage, pendingMessage);
  voicePipInput.value = "";
  updateVoicePipStatus("AI 正在回复");
  renderVoicePipMessages();

  const prompt = [
    `继续围绕这句${language.label}聊天: ${sentenceAiChatState.sentenceText}`,
    sentenceAiChatState.note ? `中文句意: ${sentenceAiChatState.note}` : "",
    `用户刚才说: ${text}`,
    "请不要重新完整讲解原句，除非用户问。",
    "像真实聊天一样接住用户的具体内容，语气自然、高情商，不要敷衍夸奖。",
    `如果给${language.label}问句或说法，先给中文意思，再给同一句${language.label}，且只给一句完整句子。`,
    "不要拆词组，不要列短语。",
    "最后自然地把话题递回给用户，但不要写“问题/追问/继续话题”这些标签。",
  ]
    .filter(Boolean)
    .join("\n");

  streamSentenceAiReply(prompt, pendingMessage, { excludeFromHistory: pendingMessage });
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
    button.className = "primary-button scene-open-button";
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
  target.className = "scene-speakable-text";
  renderSpeakableText(target, getSceneText(item));
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

    const answerButton = document.createElement("button");
    answerButton.className = "ai-button sentence-answer-button";
    answerButton.type = "button";
    answerButton.textContent = "AI解答";
    answerButton.setAttribute("aria-label", `AI解答：${sentence}`);
    answerButton.title = "AI解答";
    answerButton.addEventListener("click", () => openSentenceAiAnswer(sentence, item.note));
    aiTools.appendChild(answerButton);

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
  const lookup = lookupWord(word);
  selectedWord.textContent = word;
  phoneticText.textContent = lookup?.phonetic ? `/${lookup.phonetic}/` : "在线查询中";
  meaningText.textContent = lookup?.meaning || "正在查询中文意思...";
  wordSheet.classList.add("is-open");
  speak(word, "word");

  if (lookup?.meaning) return;

  const queryWord = word;
  lookupWordOnline(word)
    .then((entry) => {
      if (currentWord !== queryWord || !entry) return;
      phoneticText.textContent = entry.phonetic ? `/${entry.phonetic}/` : "音标待查询";
      meaningText.textContent = entry.meaning;
    })
    .catch(() => {
      if (currentWord !== queryWord) return;
      phoneticText.textContent = "音标待查询";
      meaningText.textContent = "这个词暂时没查到。你可以稍后再点一次，或直接问智语导师。";
    });
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

function dailyChatLine(zh, english, spanish, japanese, korean) {
  return { zh, english, spanish, japanese, korean };
}

const DAILY_CHAT_LIBRARY = [
  dailyChatLine(
    "我最近一直想把生活节奏调回来。",
    "I've been trying to get back into a routine lately.",
    "He estado intentando volver a una buena rutina ultimamente.",
    "最近、生活リズムを戻そうとしている。",
    "요즘 다시 생활 리듬을 잡으려고 하고 있어."
  ),
  dailyChatLine(
    "如果你也想轻松一点，我可以配合。",
    "I'm down for something low-key if you are.",
    "Si quieres algo tranquilo, yo tambien me apunto.",
    "君も気楽な感じがいいなら、僕もそれでいいよ。",
    "너도 편한 게 좋으면 나도 좋아."
  ),
  dailyChatLine(
    "听起来像是什么事都比预想更费时间的一天。",
    "That sounds like one of those days where everything takes longer than it should.",
    "Suena como uno de esos dias en los que todo tarda mas de lo normal.",
    "何をしても思ったより時間がかかる日みたいだね。",
    "뭘 해도 예상보다 오래 걸리는 날 같네."
  ),
  dailyChatLine(
    "我最近在睡前少刷手机。",
    "I've been cutting down on scrolling before bed.",
    "Estoy intentando mirar menos el movil antes de dormir.",
    "最近、寝る前にスマホを見る時間を減らしている。",
    "요즘 자기 전에 폰 보는 시간을 줄이고 있어."
  ),
  dailyChatLine(
    "我需要的是休整日，不是更忙的一天。",
    "I need a reset day, not another busy day.",
    "Necesito un dia para resetearme, no otro dia ocupado.",
    "必要なのはリセットする日で、さらに忙しい日じゃない。",
    "나한테 필요한 건 쉬는 날이지, 더 바쁜 날이 아니야."
  ),
  dailyChatLine(
    "我这个月想更认真地存钱。",
    "I'm trying to be better about saving money this month.",
    "Este mes estoy intentando ahorrar mejor.",
    "今月はもっとちゃんとお金を貯めようとしている。",
    "이번 달에는 돈을 좀 더 잘 모아보려고 해."
  ),
  dailyChatLine(
    "我找到一家真的没有被吹过头的小店。",
    "I found a little place that actually lives up to the hype.",
    "Encontre un sitio pequeno que de verdad vale la fama que tiene.",
    "評判どおりに本当に良い小さなお店を見つけた。",
    "입소문만큼 진짜 괜찮은 작은 가게를 찾았어."
  ),
  dailyChatLine(
    "我现在想吃舒服一点的，不想吃太正式的。",
    "I'm in the mood for something comforting, not fancy.",
    "Me apetece algo reconfortante, no algo elegante.",
    "今はおしゃれなものより、ほっとするものが食べたい。",
    "지금은 근사한 것보다 편하게 먹는 음식이 당겨."
  ),
  dailyChatLine(
    "今天早上莫名其妙效率很高。",
    "I had one of those weirdly productive mornings.",
    "Tuve una de esas mananas raramente productivas.",
    "今朝はなぜか妙に効率がよかった。",
    "오늘 아침은 이상하게 생산적이었어."
  ),
  dailyChatLine(
    "我最近想多自己做饭，少点外卖。",
    "I've been trying to cook more instead of ordering in.",
    "Estoy intentando cocinar mas y pedir menos comida a domicilio.",
    "最近はデリバリーより自炊を増やそうとしている。",
    "요즘 배달보다 집에서 요리하려고 하고 있어."
  ),
  dailyChatLine(
    "我最近有点不想去太挤的地方。",
    "I'm kind of over crowded places lately.",
    "Ultimamente me cansan un poco los sitios muy llenos.",
    "最近、人が多すぎる場所はちょっと疲れる。",
    "요즘은 너무 붐비는 곳이 좀 질려."
  ),
  dailyChatLine(
    "我们简单安排一下，别把它搞得太复杂。",
    "Let's do something simple and not make it a whole thing.",
    "Hagamos algo sencillo y no lo compliquemos demasiado.",
    "シンプルにしよう。大ごとにしなくていい。",
    "간단하게 하자. 너무 크게 만들 필요 없어."
  ),
  dailyChatLine(
    "今天有件事把我笑得比它本身还夸张。",
    "I saw something today that made me laugh way harder than it should have.",
    "Hoy vi algo que me hizo reir mucho mas de lo normal.",
    "今日、思った以上に笑ってしまうことがあった。",
    "오늘 뭔가 보고 생각보다 훨씬 크게 웃었어."
  ),
  dailyChatLine(
    "我最近想让周末别排得太满。",
    "I'm trying to keep my weekends a little more open.",
    "Estoy intentando dejar mis fines de semana un poco mas libres.",
    "最近、週末の予定を少し空けておこうとしている。",
    "요즘 주말 일정을 조금 비워두려고 해."
  ),
  dailyChatLine(
    "我现在很适合散个步再喝杯咖啡。",
    "I could use a walk and a coffee.",
    "Me vendria bien dar un paseo y tomar un cafe.",
    "散歩してコーヒーを飲むのが今ちょうどよさそう。",
    "산책하고 커피 한 잔 하면 딱 좋을 것 같아."
  ),
  dailyChatLine(
    "我最近一直单曲循环同一首歌。",
    "I've been listening to the same song on repeat.",
    "He estado escuchando la misma cancion en bucle.",
    "最近、同じ曲をずっとリピートしている。",
    "요즘 같은 노래만 계속 반복해서 듣고 있어."
  ),
  dailyChatLine(
    "那个软件挺有用，但太容易刷着刷着就没时间了。",
    "That app is useful, but it's way too easy to lose time on it.",
    "Esa app es util, pero es demasiado facil perder tiempo en ella.",
    "あのアプリは便利だけど、時間を溶かしやすい。",
    "그 앱은 유용한데 시간이 너무 쉽게 사라져."
  ),
  dailyChatLine(
    "我在练习拒绝别人时不要有负罪感。",
    "I'm trying to get better at saying no without feeling bad.",
    "Estoy intentando aprender a decir que no sin sentirme mal.",
    "罪悪感なしに断れるようになりたい。",
    "미안해하지 않고 거절하는 걸 연습 중이야."
  ),
  dailyChatLine(
    "我得先收拾房间，不然它快变成问题了。",
    "I need to clean my room before it turns into a problem.",
    "Tengo que ordenar mi cuarto antes de que se convierta en un problema.",
    "部屋が大変なことになる前に片付けないと。",
    "방이 문제가 되기 전에 치워야 해."
  ),
  dailyChatLine(
    "我不是困，就是今天脑子已经下班了。",
    "I'm not tired, I'm just mentally done for the day.",
    "No estoy cansado, simplemente mi mente ya termino por hoy.",
    "眠いわけじゃなくて、今日はもう頭が限界なだけ。",
    "졸린 건 아닌데 오늘은 머리가 이미 퇴근했어."
  ),
  dailyChatLine(
    "我想保持稳定，哪怕每天只做一点点。",
    "I'm trying to stay consistent, even if it's just a little every day.",
    "Estoy intentando ser constante, aunque sea un poco cada dia.",
    "毎日少しだけでも続けるようにしている。",
    "매일 조금이라도 꾸준히 하려고 해."
  ),
  dailyChatLine(
    "我突然特别想吃点辣的。",
    "I'm craving something spicy.",
    "Se me antoja algo picante.",
    "急に辛いものが食べたくなった。",
    "갑자기 매운 게 엄청 당겨."
  ),
  dailyChatLine(
    "我在想最近找个时间短途旅行一下。",
    "I'm thinking about taking a short trip soon.",
    "Estoy pensando en hacer un viaje corto pronto.",
    "近いうちに短い旅行をしようかなと思っている。",
    "조만간 짧게 여행을 다녀올까 생각 중이야."
  ),
  dailyChatLine(
    "我喜欢那种加入轻松、走也轻松的安排。",
    "I like plans that feel easy to join and easy to leave.",
    "Me gustan los planes a los que es facil unirse y tambien irse.",
    "参加しやすくて帰りやすい予定が好き。",
    "편하게 합류하고 편하게 빠질 수 있는 약속이 좋아."
  ),
  dailyChatLine(
    "那家店不错，就是排队永远很夸张。",
    "That place is good, but the line is always insane.",
    "Ese sitio es bueno, pero la fila siempre es una locura.",
    "あのお店はいいけど、いつも行列がすごい。",
    "그 가게는 좋은데 줄이 항상 말도 안 되게 길어."
  ),
  dailyChatLine(
    "我最近在努力像个成熟的人一样多喝水。",
    "I've been trying to drink more water like a responsible person.",
    "Estoy intentando beber mas agua como una persona responsable.",
    "最近、ちゃんとした人みたいに水をもっと飲もうとしている。",
    "요즘 책임감 있는 사람처럼 물을 더 마시려고 해."
  ),
  dailyChatLine(
    "我现在处在想把整个房间都换掉的阶段。",
    "I'm in that phase where I want to change my whole room.",
    "Estoy en esa fase en la que quiero cambiar toda mi habitacion.",
    "今、部屋を全部変えたい気分の時期にいる。",
    "지금 방 전체를 바꾸고 싶은 시기야."
  ),
  dailyChatLine(
    "我宁愿轻松待一晚，也不想硬逼自己出门。",
    "I'd rather have a chill night than force myself to go out.",
    "Prefiero una noche tranquila a obligarme a salir.",
    "無理に出かけるより、ゆっくりした夜にしたい。",
    "억지로 나가는 것보다 편하게 보내는 밤이 좋아."
  ),
  dailyChatLine(
    "我需要一个不用一直盯着屏幕的爱好。",
    "I need a hobby that doesn't involve staring at a screen.",
    "Necesito un hobby que no implique mirar una pantalla todo el tiempo.",
    "画面を見続けなくていい趣味が必要だ。",
    "계속 화면만 보는 게 아닌 취미가 필요해."
  ),
  dailyChatLine(
    "我在努力少买网上那些莫名其妙的小东西。",
    "I'm trying to stop buying random stuff online.",
    "Estoy intentando dejar de comprar cosas aleatorias por internet.",
    "ネットでよくわからないものを買うのをやめようとしている。",
    "온라인에서 쓸데없는 걸 사는 걸 줄이려고 해."
  ),
];

function shuffleItems(items) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ item }) => item);
}

function selectDailyChatLines(count = 3) {
  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem(DAILY_CHAT_REPEAT_KEY) || "[]");
  } catch {
    recent = [];
  }
  if (!Array.isArray(recent)) recent = [];

  const recentSet = new Set(recent);
  let pool = DAILY_CHAT_LIBRARY.filter((item) => !recentSet.has(item.english));
  if (pool.length < count) pool = DAILY_CHAT_LIBRARY;

  const selected = shuffleItems(pool).slice(0, count);
  localStorage.setItem(DAILY_CHAT_REPEAT_KEY, JSON.stringify(selected.map((item) => item.english)));
  return selected;
}

function getDailyLineTarget(line) {
  return line[currentLearningLanguage] || line.english;
}

function buildDailySentenceMessage() {
  const language = getLearningLanguageConfig();
  const lines = selectDailyChatLines(3);
  const targetLines = lines.map((line, index) => `${index + 1}. ${getDailyLineTarget(line)}`);
  const meaningLines = lines.map((line, index) => `${index + 1}. ${line.zh}`);

  return [
    `这三句更像朋友真实聊天，主题会轮换，不只聊天气和吃什么。`,
    "英文：",
    ...targetLines,
    "中文意思：",
    ...meaningLines,
    `可以直接选一句用${language.label}接着聊。`,
  ].join("\n");
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

function stripTeacherMetaLines(text) {
  const metaPattern =
    /(?:兴趣爱好|真实聊天的开头|更像真实聊天|日常聊天里|这样问很自然|这种问法|这个问法|这句问法|像朋友在关心|适合作为|可以作为|话题设计|开场问题|开头|比\s*[“"'][^”"']{1,32}[”"']\s*更)/u;

  return String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !metaPattern.test(line))
    .join("\n")
    .trim();
}

function compactTeacherReply(text) {
  const lines = stripTeacherMetaLines(renameFreeChatText(renameTeacherText(text)))
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

function cleanTopicReply(text) {
  const lines = stripTeacherMetaLines(renameFreeChatText(renameTeacherText(text)))
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)、])\s*/, ""))
    .filter(Boolean);
  const clean = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (/^很好[！!。]?$/.test(clean)) return "";
  return clean || compactTeacherReply(text);
}

function buildTeacherRequestMessage(message, mode) {
  if (mode === "topic") {
    const language = getLearningLanguageConfig();
    return [
      `学生消息：${message}`,
      `请继续当前${language.label}口语聊天。`,
      "把它当成真实朋友聊天：如果学生问你问题，先直接回答这个问题；如果学生分享内容，先接住一个具体细节。",
      "不要讲解话题设计，不要评价“这个问法更自然”，不要提到“兴趣爱好/开头/真实聊天”这些幕后判断。",
      "回复控制在2-4句，最后自然问一个具体、好回答的小问题，让学生愿意继续开口。",
      `最后的小问题先用中文问；如果给${language.label}跟读句，只给同一个问题的${language.label}版本，并单独成行。`,
      "不要写“问题/追问/继续话题/英文/中文意思”这些标签，不要拆词组或列短语。",
    ].join("\n");
  }

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

function normalizeTargetSentenceKey(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .trim();
}

function isSameTargetSentence(a, b) {
  const left = normalizeTargetSentenceKey(a);
  const right = normalizeTargetSentenceKey(b);
  return Boolean(left && right && left === right);
}

function isLikelyFullTargetSentence(sentence) {
  const clean = String(sentence || "").trim();
  if (!clean) return false;

  if (currentLearningLanguage === "english" || currentLearningLanguage === "spanish") {
    const words = clean.match(/\p{L}+/gu) || [];
    const bare = clean.replace(/[.!?]+$/g, "").trim();
    if (/[?]$/.test(clean) && words.length >= 3) return true;
    if (words.length < 4) return false;
    if (/^[a-z]/.test(clean)) return false;
    if (/\b(?:a|an|the|to|at|for|from|with|of|in|on|by|and|or|but)$/i.test(bare)) return false;
    return /[.!?]$/.test(clean);
  }

  return clean.length >= 4;
}

function extractTargetSection(text) {
  const match = String(text || "").match(/(?:英文|目标语|西班牙语|日语|韩语)\s*[：:]\s*([\s\S]*?)(?=(?:中文意思|意思|翻译)\s*[：:]|$)/u);
  return match ? match[1].trim() : "";
}

function splitTargetLines(text) {
  return String(text || "")
    .split(/\n+|(?<=[.!?。！？¿؟])\s+|(?=\s+\d+[.)、]\s*)/u)
    .map((item) => item.replace(/^["“”]+|["“”]+$/g, "").trim())
    .map((item) => item.replace(/^(?:[-•]|\d+[.)、])\s*/u, "").trim())
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

function normalizeChineseQuestionNote(text) {
  let clean = String(text || "")
    .replace(/^(?:中文问句|中文问题|中文意思|意思|翻译|问题|追问)\s*[：:]\s*/u, "")
    .trim();
  const colonParts = clean.split(/[：:]/).map((item) => item.trim()).filter(Boolean);
  if (colonParts.length > 1) {
    clean = [...colonParts].reverse().find((item) => /[\u4e00-\u9fa5]/.test(item)) || clean;
  }
  clean = clean.replace(/^[，,。！？；;：:\s]+/, "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (!/[。！？?]$/.test(clean)) clean += /(?:吗|么|什么|哪|怎么|如何|还是|有没有|会不会|能不能|要不要|是不是)/u.test(clean) ? "？" : "。";
  return clean;
}

function inferChineseQuestionNote(text, targetSentence = "") {
  let clean = String(text || "");
  extractTargetSentences(clean).forEach((sentence) => {
    clean = clean.split(sentence).join(" ");
  });
  if (targetSentence) clean = clean.split(targetSentence).join(" ");

  const labeledMatch = clean.match(/(?:中文问句|中文问题|中文意思|意思|翻译)\s*[：:]\s*([^.!?\n。！？]{2,90}[？?。]?)/u);
  if (labeledMatch && /[\u4e00-\u9fa5]/.test(labeledMatch[1])) {
    return normalizeChineseQuestionNote(labeledMatch[1]);
  }

  const parts = clean
    .split(/\n+|(?<=[。！？?])\s*|[；;]/u)
    .map((item) => normalizeChineseQuestionNote(item))
    .filter((item) => /[\u4e00-\u9fa5]/.test(item));
  const question = [...parts].reverse().find((item) => /[？?]$/.test(item));
  if (question) return question;

  return [...parts]
    .reverse()
    .find((item) => /(?:吗|么|什么|哪|怎么|如何|还是|有没有|会不会|能不能|要不要|是不是)/u.test(item)) || "";
}

function removeChineseMeaningFromText(text, meaning) {
  const note = String(meaning || "").trim();
  if (!note) return text;
  const noteCore = note.replace(/[。！？?]+$/u, "").trim();
  return String(text || "")
    .split(/(?<=[。！？?])\s*/u)
    .filter((part) => {
      const clean = part.trim();
      return clean && !clean.includes(note) && !(noteCore && clean.includes(noteCore));
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferFallbackChineseMeaning(...sources) {
  for (const source of sources) {
    let clean = String(source || "").trim();
    if (!clean) continue;
    extractTargetSentences(clean).forEach((sentence) => {
      clean = clean.split(sentence).join(" ");
    });
    const parts = clean
      .split(/\n+|(?<=[。！？?])\s*|[；;]/u)
      .map((item) => normalizeChineseQuestionNote(item))
      .filter((item) => /[\u4e00-\u9fa5]/.test(item) && item.length <= 90);
    const question = [...parts].reverse().find((item) => /[？?]$/.test(item));
    if (question) return question;
    const statement = [...parts].reverse().find(Boolean);
    if (statement) return statement;
  }

  return "这句是上面中文内容的自然表达。";
}

function removeEnglishFromTeacherText(text, englishSentences) {
  let chinese = text;
  englishSentences.forEach((sentence) => {
    chinese = chinese.split(sentence).join(" ");
  });

  return chinese
    .replace(/(?:英文|目标语|西班牙语|日语|韩语)\s*[：:]\s*/g, "")
    .replace(/(?:^|\s)\d+[.)、]\s*/g, " ")
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
  const clean = stripTeacherMetaLines(text)
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

function buildTeacherDisplay(text, mode = "") {
  const cleanText = stripTeacherMetaLines(compactTeacherReply(text));
  const visibleText = removeMeaningSection(cleanText);
  const detectedTargetSentences = extractTargetSentences(visibleText);
  const allEnglishSentences = detectedTargetSentences.filter((sentence) => !isTeacherMetaTargetSentence(sentence, visibleText));
  let englishSentences = allEnglishSentences;
  const isTopicMode = mode === "topic";
  const isTopicStarter = /我们来聊聊|聊聊|话题/.test(visibleText) && englishSentences.some((sentence) => sentence.endsWith("?"));
  if (isTopicMode || isTopicStarter) {
    englishSentences = [englishSentences.find((sentence) => sentence.endsWith("?")) || englishSentences[0]].filter(Boolean);
  }
  const rawChineseText = removeEnglishFromTeacherText(visibleText, detectedTargetSentences);
  const pairedQuestionNote = isTopicMode ? inferChineseQuestionNote(rawChineseText, englishSentences[0] || "") : "";
  const meanings = pairedQuestionNote ? [pairedQuestionNote] : extractChineseMeanings(cleanText, englishSentences.length);
  const chineseDisplaySource = pairedQuestionNote ? removeChineseMeaningFromText(rawChineseText, pairedQuestionNote) : rawChineseText;
  const chineseText = cleanTeacherChineseDisplay(
    isTopicMode || isTopicStarter
      ? simplifyTopicIntro(chineseDisplaySource)
      : simplifyTeacherChinese(chineseDisplaySource, englishSentences.length),
    cleanText
  );

  return {
    cleanText,
    chineseText,
    englishSentences,
    suggestions: englishSentences.map((sentence, index) => ({
      sentence,
      note:
        meanings[index] ||
        inferChineseQuestionNote(cleanText, sentence) ||
        inferSuggestionNote(cleanText, sentence) ||
        inferFallbackChineseMeaning(chineseText, rawChineseText, cleanText),
    })),
  };
}

function stripChatMarkdown(text) {
  return String(text || "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*(?:[-*•]|\d+[.)、])\s+/gm, "");
}

function formatReadableChatText(text) {
  const protectedText = stripChatMarkdown(text)
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([，。！？；：,.!?;:])/g, "$1")
    .trim();

  return protectedText
    .replace(/([。！？；])\s*(?=[\u4e00-\u9fa5])/g, "$1\n\n")
    .replace(/([.!?])\s+(?=[A-Z])/g, "$1\n\n")
    .replace(/\s+(?=(?:首先|其次|另外|然后|最后|重点|建议|比如|简单说|如果|英文|中文意思|追问|可以回答)[：:])/g, "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderSpeakableText(container, text) {
  const value = String(text || "");
  const tokenPattern = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)?/g;
  let index = 0;
  let match = tokenPattern.exec(value);

  while (match) {
    if (match.index > index) {
      container.appendChild(document.createTextNode(value.slice(index, match.index)));
    }

    const token = match[0];
    const button = document.createElement("button");
    button.className = "chat-word-token";
    button.type = "button";
    button.textContent = token;
    button.setAttribute("aria-label", `朗读单词：${token}`);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      speak(token.replace(/’/g, "'"), "word");
    });
    container.appendChild(button);

    index = match.index + token.length;
    match = tokenPattern.exec(value);
  }

  if (index < value.length) {
    container.appendChild(document.createTextNode(value.slice(index)));
  }
}

function appendReadableText(container, text, className = "chat-text") {
  const textEl = document.createElement("p");
  textEl.className = className;
  renderSpeakableText(textEl, formatReadableChatText(text));
  container.appendChild(textEl);
  return textEl;
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
    appendReadableText(bubble, part.pending ? text : cleanFreestyleReply(text), "chat-text teacher-chinese-text");
    return;
  }

  const display = buildTeacherDisplay(text, part.mode);

  if (display.chineseText || !display.englishSentences.length) {
    appendReadableText(bubble, display.chineseText || display.cleanText, "chat-text teacher-chinese-text");
  }

  if (display.englishSentences.length) {
    const englishBlock = document.createElement("div");
    englishBlock.className = "teacher-english-block";
    display.suggestions.forEach((suggestion) => {
      const item = document.createElement("div");
      item.className = "teacher-english-item";

      const meaning = document.createElement("p");
      meaning.className = "teacher-sentence-meaning";
      meaning.textContent = suggestion.note || inferFallbackChineseMeaning(display.chineseText, display.cleanText);

      const row = document.createElement("div");
      row.className = "teacher-english-row";

      const sentenceText = document.createElement("div");
      sentenceText.className = "teacher-english-sentence";
      sentenceText.setAttribute("aria-label", suggestion.sentence);
      renderSpeakableText(sentenceText, suggestion.sentence);

      const speakButton = document.createElement("button");
      speakButton.className = "teacher-line-speak";
      speakButton.type = "button";
      speakButton.title = `朗读${language.label}`;
      speakButton.setAttribute("aria-label", `朗读：${suggestion.sentence}`);
      speakButton.textContent = "▶";
      speakButton.addEventListener("click", (event) => {
        event.stopPropagation();
        speak(suggestion.sentence, "sentence");
      });

      const addButton = document.createElement("button");
      addButton.className = "teacher-line-add";
      addButton.type = "button";
      addButton.title = "加入句子";
      addButton.setAttribute("aria-label", `加入句子：${suggestion.sentence}`);
      addButton.textContent = "+";
      addButton.addEventListener("click", (event) => {
        event.stopPropagation();
        addTeacherSentence(suggestion, addButton);
      });

      row.append(sentenceText, speakButton, addButton);
      item.append(meaning, row);
      englishBlock.appendChild(item);
    });
    bubble.appendChild(englishBlock);
  }
}

function renderUserMessageContent(bubble, part) {
  const language = getLearningLanguageConfig();
  const translation = normalizeTeacherTranslation(part.translation);
  const translationPending = Boolean(part.translationPending && !translation);

  if (!translation && !translationPending) {
    appendReadableText(bubble, part.text || "", "chat-text");
    return;
  }

  const card = document.createElement("div");
  card.className = "user-translation-card";

  const chineseText = document.createElement("div");
  chineseText.className = "user-message-text";
  chineseText.textContent = part.text || "";

  const panel = document.createElement("div");
  panel.className = "user-translation-panel";
  panel.hidden = false;
  card.classList.add("is-open");

  const english = document.createElement("p");
  english.className = "user-translation-english";
  if (translationPending) english.classList.add("is-pending");
  renderSpeakableText(english, translationPending ? `正在生成${language.label}表达...` : translation.sentence);

  if (translationPending) {
    panel.classList.add("is-pending");
    panel.appendChild(english);
    card.append(chineseText, panel);
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

  panel.append(english, speakButton, addButton);
  card.append(chineseText, panel);
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
    const reply =
      mode === "freestyle"
        ? cleanFreestyleReply(data.reply)
        : mode === "topic"
          ? cleanTopicReply(data.reply)
          : compactTeacherReply(data.reply);
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
    [
      `直接开启一个轻松自然的${language.label}日常聊天。`,
      `只发一个生活化问题：先中文问句，再给同一个问题的${language.label}版本，不要解释为什么选这个话题。`,
      "之后学生每次回复，都先像朋友一样接话，再顺着内容问一个具体小问题。",
    ].join("\n"),
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

function startDailySentencePractice() {
  if (teacherSendInFlight) return;

  setTeacherTeachingMode();
  const language = getLearningLanguageConfig();
  teacherMessages.push({ role: "user", text: `${language.label}日常句子` });
  teacherMessages.push({ role: "assistant", text: buildDailySentenceMessage(), mode: "chat" });
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
voicePipForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendSentenceAiChatMessage();
});
voicePipInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    sendSentenceAiChatMessage();
  }
});
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

    if (button.dataset.dailyPrompt === "start") {
      startDailySentencePractice();
      return;
    }

    setTeacherTeachingMode();
    sendTeacherMessage(button.dataset.prompt || "");
  });
});

loadAuthSession();
currentLearningLanguage = normalizeLearningLanguage(localStorage.getItem(LEARNING_LANGUAGE_KEY) || authUser?.learningLanguage || "english");
localStorage.setItem(LEARNING_LANGUAGE_KEY, currentLearningLanguage);
loadWordLookupCache();
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
