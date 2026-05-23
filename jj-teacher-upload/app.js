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
const sceneGroupTabs = document.querySelector("#sceneGroupTabs");
const sceneList = document.querySelector("#sceneList");
const sceneDetail = document.querySelector("#sceneDetail");
const sceneBackButton = document.querySelector("#sceneBackButton");

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
const APP_BUILD_TAG = "free29";
const APP_VERSION_CODE = 29;
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
let currentSceneGroup = "friends";
let activeSceneId = "";
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

function getSceneById(sceneId) {
  return SCENE_LIBRARY.find((scene) => scene.id === sceneId) || null;
}

function getSceneLearningItems(scene) {
  if (!scene) return [];
  const sourceItems = [...scene.items, ...scene.dialogue];
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

function renderScenes() {
  if (!sceneGroupTabs || !sceneList || !sceneDetail) return;

  const progress = loadSceneProgress();
  const activeScene = getSceneById(activeSceneId);
  sceneBackButton.hidden = !activeScene;
  sceneGroupTabs.hidden = Boolean(activeScene);
  sceneList.hidden = Boolean(activeScene);
  sceneDetail.hidden = !activeScene;

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
    meta.textContent = `${scene.items.length} 个核心句 · ${scene.dialogue.length} 句对话`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "primary-button";
    button.textContent = progress.completed.includes(scene.id) ? "继续学习" : "打开场景";
    button.addEventListener("click", () => {
      activeSceneId = scene.id;
      renderScenes();
    });

    card.append(header, description, meta, button);
    sceneList.appendChild(card);
  });
}

function appendSceneLine(container, item, options = {}) {
  const row = document.createElement("div");
  row.className = options.dialogue ? "scene-dialogue-line" : "scene-line";

  const textWrap = document.createElement("div");
  if (options.dialogue) {
    const speaker = document.createElement("span");
    speaker.className = "scene-speaker";
    speaker.textContent = item.speaker || "";
    textWrap.appendChild(speaker);
  }

  const target = document.createElement("strong");
  target.textContent = getSceneText(item);
  const note = document.createElement("span");
  note.textContent = item.zh || "";
  textWrap.append(target, note);

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
  row.append(textWrap, actions);
  container.appendChild(row);
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
    addSceneToLearning(scene.id);
    setPage("exam");
  });

  actionRow.append(addAllButton, practiceButton);

  const coreTitle = document.createElement("h3");
  coreTitle.textContent = "核心句";
  const coreList = document.createElement("div");
  coreList.className = "scene-lines";
  scene.items.forEach((item) => appendSceneLine(coreList, item));

  const dialogueTitle = document.createElement("h3");
  dialogueTitle.textContent = "朋友对话";
  const dialogueList = document.createElement("div");
  dialogueList.className = "scene-dialogue";
  scene.dialogue.forEach((line) => appendSceneLine(dialogueList, line, { dialogue: true }));

  sceneDetail.append(header, actionRow, coreTitle, coreList, dialogueTitle, dialogueList);
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
  currentPage = page === "teacher" || page === "exam" || page === "scenes" || page === "friends" ? page : "sentences";
  const isTeacher = currentPage === "teacher";
  const isExam = currentPage === "exam";
  const isScenes = currentPage === "scenes";
  const isFriends = currentPage === "friends";

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
        ? "Daily Scenes"
        : isFriends
          ? "Community"
          : "Sentence Reader";
  pageTitle.textContent = isTeacher ? (teacherFreeMode ? "闲聊模式" : "智语导师") : isExam ? "复习" : isScenes ? "场景" : isFriends ? "好友" : "句读";
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
reviewButton?.addEventListener("click", () => setPage("exam"));
speedSlider.addEventListener("input", updateSpeedLabel);
sentencesNav.addEventListener("click", () => setPage("sentences"));
scenesNav.addEventListener("click", () => setPage("scenes"));
teacherNav.addEventListener("click", () => setPage("teacher"));
friendsNav.addEventListener("click", () => setPage("friends"));
sceneBackButton?.addEventListener("click", () => {
  activeSceneId = "";
  renderScenes();
});
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
if (authToken) setTimeout(pullCloudDataAndMerge, 700);
setTimeout(checkForAppUpdate, 900);
