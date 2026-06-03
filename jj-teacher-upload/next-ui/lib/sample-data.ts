// ZhiYu Tutor data shared by the Next.js UI.

export interface SavedSentence {
  id: string
  text: string
  note: string
  category?: string
  learned: boolean
  learnedAt: number | null
  aiExplanation: string
}

export interface TeacherMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  mode?: 'chat' | 'topic' | 'daily-sentences' | 'free-chat'
  pending?: boolean
  translation?: {
    sentence: string
    note: string
  }
  timestamp: number
}

export interface TutorMemoryProfile {
  enabled: boolean
  summary: string
  preferences: string[]
  interests: string[]
  habits: string[]
  learningProfile: string[]
  communicationStyle: string[]
  correctionPatterns: string[]
  personalFacts: string[]
  avoid: string[]
  updatedAt: number
}

export interface VocabItem {
  id: string
  group: string
  word: string
  meaning: string
  example: string
}

export interface Scene {
  id: string
  group: string
  level: string
  title: string
  description: string
  dialogue: {
    speaker: string
    english: string
    zh: string
  }[]
}

export const savedSentences: SavedSentence[] = [
  {
    "id": "1",
    "text": "Let me take a quick look at the menu.",
    "note": "我先快速看一下菜单。",
    "learned": false,
    "learnedAt": null,
    "aiExplanation": "句意是“我先快速看一下菜单”。重点在 Let me...，它表示“让我先……”，语气自然、柔和。take a quick look at 表示“快速看一下”，不是很正式地研究。"
  },
  {
    "id": "2",
    "text": "I'm down for something low-key if you are.",
    "note": "如果你也想轻松一点，我可以配合。",
    "learned": false,
    "learnedAt": null,
    "aiExplanation": ""
  },
  {
    "id": "3",
    "text": "I've been cutting down on scrolling before bed.",
    "note": "我最近在睡前少刷手机。",
    "learned": true,
    "learnedAt": 1716500000000,
    "aiExplanation": ""
  }
]

export const teacherMessages: TeacherMessage[] = []

export const vocabGroups = [
  {
    "id": "greeting",
    "label": "日常打招呼 Greeting"
  },
  {
    "id": "reaction",
    "label": "聊天反应 Reaction"
  },
  {
    "id": "time",
    "label": "时间 Time"
  },
  {
    "id": "food",
    "label": "吃饭 Food"
  },
  {
    "id": "transportation",
    "label": "出门交通 Transportation"
  },
  {
    "id": "shopping",
    "label": "购物 Shopping"
  },
  {
    "id": "work",
    "label": "工作 Appointment / Work"
  },
  {
    "id": "feelings",
    "label": "情绪 Feelings"
  },
  {
    "id": "health",
    "label": "身体 Health"
  },
  {
    "id": "verbs",
    "label": "常用动词 Common Verbs"
  },
  {
    "id": "salon",
    "label": "发型师 Hair Salon"
  },
  {
    "id": "gym",
    "label": "健身 Gym"
  },
  {
    "id": "dating",
    "label": "恋爱聊天 Dating"
  },
  {
    "id": "airport",
    "label": "机场旅行 Airport & Travel"
  }
]

export const vocabItems: VocabItem[] = [
  {
    "id": "v1",
    "group": "greeting",
    "word": "hi",
    "meaning": "嗨",
    "example": "Hi, how are you?"
  },
  {
    "id": "v2",
    "group": "greeting",
    "word": "hello",
    "meaning": "你好",
    "example": "Hello, nice to meet you."
  },
  {
    "id": "v3",
    "group": "greeting",
    "word": "morning",
    "meaning": "早上好",
    "example": "Morning! How's it going?"
  },
  {
    "id": "v4",
    "group": "greeting",
    "word": "bye",
    "meaning": "再见",
    "example": "Bye, see you tomorrow."
  },
  {
    "id": "v5",
    "group": "greeting",
    "word": "later",
    "meaning": "回头见",
    "example": "See you later."
  },
  {
    "id": "v6",
    "group": "greeting",
    "word": "thanks",
    "meaning": "谢谢",
    "example": "Thanks a lot."
  },
  {
    "id": "v7",
    "group": "greeting",
    "word": "sorry",
    "meaning": "不好意思 / 对不起",
    "example": "Sorry, I'm late."
  },
  {
    "id": "v8",
    "group": "reaction",
    "word": "really",
    "meaning": "真的吗",
    "example": "Really? That's crazy."
  },
  {
    "id": "v9",
    "group": "reaction",
    "word": "wow",
    "meaning": "哇",
    "example": "Wow, that looks good."
  },
  {
    "id": "v10",
    "group": "reaction",
    "word": "nice",
    "meaning": "不错",
    "example": "Nice! I like it."
  },
  {
    "id": "v11",
    "group": "reaction",
    "word": "cool",
    "meaning": "酷 / 可以",
    "example": "Cool, sounds good."
  },
  {
    "id": "v12",
    "group": "reaction",
    "word": "sure",
    "meaning": "当然 / 可以",
    "example": "Sure, no problem."
  },
  {
    "id": "v13",
    "group": "reaction",
    "word": "maybe",
    "meaning": "可能吧",
    "example": "Maybe next time."
  },
  {
    "id": "v14",
    "group": "reaction",
    "word": "actually",
    "meaning": "其实",
    "example": "Actually, I'm busy today."
  },
  {
    "id": "v15",
    "group": "reaction",
    "word": "honestly",
    "meaning": "说实话",
    "example": "Honestly, I don't know."
  },
  {
    "id": "v16",
    "group": "time",
    "word": "today",
    "meaning": "今天",
    "example": "I'm busy today."
  },
  {
    "id": "v17",
    "group": "time",
    "word": "tomorrow",
    "meaning": "明天",
    "example": "Are you free tomorrow?"
  },
  {
    "id": "v18",
    "group": "time",
    "word": "yesterday",
    "meaning": "昨天",
    "example": "I saw him yesterday."
  },
  {
    "id": "v19",
    "group": "time",
    "word": "now",
    "meaning": "现在",
    "example": "I'm working now."
  },
  {
    "id": "v20",
    "group": "time",
    "word": "soon",
    "meaning": "很快",
    "example": "I'll be there soon."
  },
  {
    "id": "v21",
    "group": "time",
    "word": "early",
    "meaning": "早",
    "example": "I woke up early."
  },
  {
    "id": "v22",
    "group": "time",
    "word": "late",
    "meaning": "晚 / 迟到",
    "example": "Sorry, I'm late."
  },
  {
    "id": "v23",
    "group": "food",
    "word": "hungry",
    "meaning": "饿",
    "example": "I'm hungry."
  },
  {
    "id": "v24",
    "group": "food",
    "word": "full",
    "meaning": "饱",
    "example": "I'm full."
  },
  {
    "id": "v25",
    "group": "food",
    "word": "breakfast",
    "meaning": "早餐",
    "example": "I had breakfast already."
  },
  {
    "id": "v26",
    "group": "food",
    "word": "lunch",
    "meaning": "午餐",
    "example": "What do you want for lunch?"
  },
  {
    "id": "v27",
    "group": "food",
    "word": "dinner",
    "meaning": "晚餐",
    "example": "Let's get dinner."
  },
  {
    "id": "v28",
    "group": "food",
    "word": "drink",
    "meaning": "喝 / 饮料",
    "example": "Do you want a drink?"
  },
  {
    "id": "v29",
    "group": "food",
    "word": "taste",
    "meaning": "味道",
    "example": "It tastes good."
  },
  {
    "id": "v30",
    "group": "food",
    "word": "spicy",
    "meaning": "辣",
    "example": "Is it spicy?"
  },
  {
    "id": "v31",
    "group": "transportation",
    "word": "drive",
    "meaning": "开车",
    "example": "I'll drive there."
  },
  {
    "id": "v32",
    "group": "transportation",
    "word": "walk",
    "meaning": "走路",
    "example": "It's close. We can walk."
  },
  {
    "id": "v33",
    "group": "transportation",
    "word": "train",
    "meaning": "火车 / 地铁",
    "example": "I'll take the train."
  },
  {
    "id": "v34",
    "group": "transportation",
    "word": "bus",
    "meaning": "公交车",
    "example": "The bus is late."
  },
  {
    "id": "v35",
    "group": "transportation",
    "word": "uber",
    "meaning": "打车",
    "example": "Let's take an Uber."
  },
  {
    "id": "v36",
    "group": "transportation",
    "word": "traffic",
    "meaning": "堵车",
    "example": "There's a lot of traffic."
  },
  {
    "id": "v37",
    "group": "transportation",
    "word": "parking",
    "meaning": "停车",
    "example": "Is there parking here?"
  },
  {
    "id": "v38",
    "group": "transportation",
    "word": "address",
    "meaning": "地址",
    "example": "Send me the address."
  },
  {
    "id": "v39",
    "group": "shopping",
    "word": "price",
    "meaning": "价格",
    "example": "What's the price?"
  },
  {
    "id": "v40",
    "group": "shopping",
    "word": "cheap",
    "meaning": "便宜",
    "example": "That's pretty cheap."
  },
  {
    "id": "v41",
    "group": "shopping",
    "word": "expensive",
    "meaning": "贵",
    "example": "It's too expensive."
  },
  {
    "id": "v42",
    "group": "shopping",
    "word": "discount",
    "meaning": "折扣",
    "example": "Is there a discount?"
  },
  {
    "id": "v43",
    "group": "shopping",
    "word": "size",
    "meaning": "尺码",
    "example": "Do you have my size?"
  },
  {
    "id": "v44",
    "group": "shopping",
    "word": "cash",
    "meaning": "现金",
    "example": "Can I pay cash?"
  },
  {
    "id": "v45",
    "group": "shopping",
    "word": "card",
    "meaning": "卡",
    "example": "Can I use card?"
  },
  {
    "id": "v46",
    "group": "shopping",
    "word": "receipt",
    "meaning": "收据",
    "example": "Can I get a receipt?"
  },
  {
    "id": "v47",
    "group": "work",
    "word": "available",
    "meaning": "有空 / 有位置",
    "example": "I'm available at 3pm."
  },
  {
    "id": "v48",
    "group": "work",
    "word": "busy",
    "meaning": "忙",
    "example": "I'm busy today."
  },
  {
    "id": "v49",
    "group": "work",
    "word": "book",
    "meaning": "预约",
    "example": "Can I book an appointment?"
  },
  {
    "id": "v50",
    "group": "work",
    "word": "appointment",
    "meaning": "预约",
    "example": "I have an appointment at 2."
  },
  {
    "id": "v51",
    "group": "work",
    "word": "cancel",
    "meaning": "取消",
    "example": "Can I cancel my appointment?"
  },
  {
    "id": "v52",
    "group": "work",
    "word": "reschedule",
    "meaning": "改时间",
    "example": "Can we reschedule?"
  },
  {
    "id": "v53",
    "group": "work",
    "word": "confirm",
    "meaning": "确认",
    "example": "Can you confirm the time?"
  },
  {
    "id": "v54",
    "group": "work",
    "word": "walk-in",
    "meaning": "直接进店",
    "example": "Do you accept walk-ins?"
  },
  {
    "id": "v55",
    "group": "work",
    "word": "deposit",
    "meaning": "订金",
    "example": "A deposit is required."
  },
  {
    "id": "v56",
    "group": "feelings",
    "word": "happy",
    "meaning": "开心",
    "example": "I'm happy today."
  },
  {
    "id": "v57",
    "group": "feelings",
    "word": "tired",
    "meaning": "累",
    "example": "I'm so tired."
  },
  {
    "id": "v58",
    "group": "feelings",
    "word": "sleepy",
    "meaning": "困",
    "example": "I feel sleepy."
  },
  {
    "id": "v59",
    "group": "feelings",
    "word": "angry",
    "meaning": "生气",
    "example": "He looks angry."
  },
  {
    "id": "v60",
    "group": "feelings",
    "word": "sad",
    "meaning": "难过",
    "example": "I feel sad."
  },
  {
    "id": "v61",
    "group": "feelings",
    "word": "nervous",
    "meaning": "紧张",
    "example": "I'm nervous."
  },
  {
    "id": "v62",
    "group": "feelings",
    "word": "excited",
    "meaning": "兴奋",
    "example": "I'm excited for tomorrow."
  },
  {
    "id": "v63",
    "group": "feelings",
    "word": "stressed",
    "meaning": "压力大",
    "example": "I'm stressed out."
  },
  {
    "id": "v64",
    "group": "health",
    "word": "hurt",
    "meaning": "疼",
    "example": "My back hurts."
  },
  {
    "id": "v65",
    "group": "health",
    "word": "sick",
    "meaning": "生病",
    "example": "I feel sick."
  },
  {
    "id": "v66",
    "group": "health",
    "word": "headache",
    "meaning": "头疼",
    "example": "I have a headache."
  },
  {
    "id": "v67",
    "group": "health",
    "word": "stomach",
    "meaning": "胃 / 肚子",
    "example": "My stomach hurts."
  },
  {
    "id": "v68",
    "group": "health",
    "word": "sleep",
    "meaning": "睡觉",
    "example": "I need more sleep."
  },
  {
    "id": "v69",
    "group": "health",
    "word": "rest",
    "meaning": "休息",
    "example": "You should rest."
  },
  {
    "id": "v70",
    "group": "health",
    "word": "medicine",
    "meaning": "药",
    "example": "Did you take medicine?"
  },
  {
    "id": "v71",
    "group": "health",
    "word": "doctor",
    "meaning": "医生",
    "example": "You should see a doctor."
  },
  {
    "id": "v72",
    "group": "verbs",
    "word": "go",
    "meaning": "去",
    "example": "Let's go."
  },
  {
    "id": "v73",
    "group": "verbs",
    "word": "come",
    "meaning": "来",
    "example": "Can you come here?"
  },
  {
    "id": "v74",
    "group": "verbs",
    "word": "get",
    "meaning": "得到 / 去拿 / 变得",
    "example": "I'll get it."
  },
  {
    "id": "v75",
    "group": "verbs",
    "word": "make",
    "meaning": "做",
    "example": "I'll make coffee."
  },
  {
    "id": "v76",
    "group": "verbs",
    "word": "take",
    "meaning": "拿 / 带 / 花费",
    "example": "Take your time."
  },
  {
    "id": "v77",
    "group": "verbs",
    "word": "want",
    "meaning": "想要",
    "example": "What do you want?"
  },
  {
    "id": "v78",
    "group": "verbs",
    "word": "need",
    "meaning": "需要",
    "example": "I need help."
  },
  {
    "id": "v79",
    "group": "verbs",
    "word": "know",
    "meaning": "知道",
    "example": "I don't know."
  },
  {
    "id": "v80",
    "group": "verbs",
    "word": "think",
    "meaning": "觉得 / 想",
    "example": "I think so."
  },
  {
    "id": "v81",
    "group": "verbs",
    "word": "feel",
    "meaning": "感觉",
    "example": "I feel better."
  },
  {
    "id": "v82",
    "group": "salon",
    "word": "trim",
    "meaning": "修一下",
    "example": "I just want a trim."
  },
  {
    "id": "v83",
    "group": "salon",
    "word": "fade",
    "meaning": "渐变",
    "example": "Can you do a low fade?"
  },
  {
    "id": "v84",
    "group": "salon",
    "word": "taper",
    "meaning": "渐短",
    "example": "I want a taper on the sides."
  },
  {
    "id": "v85",
    "group": "salon",
    "word": "bangs",
    "meaning": "刘海",
    "example": "Keep the bangs longer."
  },
  {
    "id": "v86",
    "group": "salon",
    "word": "layer",
    "meaning": "层次",
    "example": "Add some layers on top."
  },
  {
    "id": "v87",
    "group": "salon",
    "word": "perm",
    "meaning": "烫发",
    "example": "I'm thinking about getting a perm."
  },
  {
    "id": "v88",
    "group": "salon",
    "word": "volume",
    "meaning": "蓬松感",
    "example": "I want more volume."
  },
  {
    "id": "v89",
    "group": "salon",
    "word": "texture",
    "meaning": "纹理感",
    "example": "Add more texture to the top."
  },
  {
    "id": "v90",
    "group": "salon",
    "word": "thin out",
    "meaning": "打薄",
    "example": "Can you thin it out a little?"
  },
  {
    "id": "v91",
    "group": "salon",
    "word": "blend",
    "meaning": "衔接",
    "example": "Blend the sides naturally."
  },
  {
    "id": "v92",
    "group": "gym",
    "word": "workout",
    "meaning": "训练",
    "example": "I had a good workout today."
  },
  {
    "id": "v93",
    "group": "gym",
    "word": "bulk",
    "meaning": "增肌",
    "example": "I'm trying to bulk up."
  },
  {
    "id": "v94",
    "group": "gym",
    "word": "cut",
    "meaning": "减脂",
    "example": "I'm cutting right now."
  },
  {
    "id": "v95",
    "group": "gym",
    "word": "protein",
    "meaning": "蛋白质",
    "example": "I need more protein."
  },
  {
    "id": "v96",
    "group": "gym",
    "word": "carbs",
    "meaning": "碳水",
    "example": "Carbs give you energy."
  },
  {
    "id": "v97",
    "group": "gym",
    "word": "muscle",
    "meaning": "肌肉",
    "example": "I want to build muscle."
  },
  {
    "id": "v98",
    "group": "gym",
    "word": "sore",
    "meaning": "酸痛",
    "example": "My legs are sore today."
  },
  {
    "id": "v99",
    "group": "gym",
    "word": "rep",
    "meaning": "次数",
    "example": "Do 10 reps."
  },
  {
    "id": "v100",
    "group": "gym",
    "word": "set",
    "meaning": "组",
    "example": "I did 4 sets today."
  },
  {
    "id": "v101",
    "group": "gym",
    "word": "cardio",
    "meaning": "有氧",
    "example": "I hate cardio."
  },
  {
    "id": "v102",
    "group": "dating",
    "word": "cute",
    "meaning": "可爱",
    "example": "You look cute today."
  },
  {
    "id": "v103",
    "group": "dating",
    "word": "miss",
    "meaning": "想念",
    "example": "I miss you already."
  },
  {
    "id": "v104",
    "group": "dating",
    "word": "date",
    "meaning": "约会",
    "example": "Do you want to go on a date?"
  },
  {
    "id": "v105",
    "group": "dating",
    "word": "crush",
    "meaning": "暗恋对象",
    "example": "I have a crush on her."
  },
  {
    "id": "v106",
    "group": "dating",
    "word": "relationship",
    "meaning": "关系",
    "example": "We're in a relationship."
  },
  {
    "id": "v107",
    "group": "dating",
    "word": "text",
    "meaning": "发消息",
    "example": "Text me when you get home."
  },
  {
    "id": "v108",
    "group": "dating",
    "word": "flirt",
    "meaning": "调情",
    "example": "He's flirting with you."
  },
  {
    "id": "v109",
    "group": "dating",
    "word": "awkward",
    "meaning": "尴尬",
    "example": "That was awkward."
  },
  {
    "id": "v110",
    "group": "airport",
    "word": "passport",
    "meaning": "护照",
    "example": "Don't forget your passport."
  },
  {
    "id": "v111",
    "group": "airport",
    "word": "boarding",
    "meaning": "登机",
    "example": "Boarding starts at 8."
  },
  {
    "id": "v112",
    "group": "airport",
    "word": "flight",
    "meaning": "航班",
    "example": "My flight is delayed."
  },
  {
    "id": "v113",
    "group": "airport",
    "word": "luggage",
    "meaning": "行李",
    "example": "Where's my luggage?"
  },
  {
    "id": "v114",
    "group": "airport",
    "word": "customs",
    "meaning": "海关",
    "example": "I'm going through customs."
  },
  {
    "id": "v115",
    "group": "airport",
    "word": "gate",
    "meaning": "登机口",
    "example": "Which gate is it?"
  },
  {
    "id": "v116",
    "group": "airport",
    "word": "carry-on",
    "meaning": "随身行李",
    "example": "This is my carry-on."
  },
  {
    "id": "v117",
    "group": "airport",
    "word": "delay",
    "meaning": "延误",
    "example": "The flight got delayed."
  }
]

export const sceneGroups = [
  {
    "id": "friends",
    "label": "朋友闲聊"
  },
  {
    "id": "appointment",
    "label": "预约"
  },
  {
    "id": "salon",
    "label": "发型店"
  },
  {
    "id": "food",
    "label": "吃饭"
  },
  {
    "id": "gym",
    "label": "健身"
  },
  {
    "id": "dating",
    "label": "约会聊天"
  },
  {
    "id": "shopping",
    "label": "购物"
  },
  {
    "id": "driving",
    "label": "开车"
  },
  {
    "id": "travel",
    "label": "旅行"
  }
]

export const scenes: Scene[] = [
  {
    "id": "friends-weekend",
    "group": "friends",
    "level": "常用",
    "title": "聊周末",
    "description": "朋友闲聊场景：聊周末。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "What are you up to this weekend?",
        "zh": "你这周末准备干嘛？"
      },
      {
        "speaker": "B",
        "english": "I might just stay home and chill.",
        "zh": "我可能就在家放松一下。"
      },
      {
        "speaker": "A",
        "english": "Honestly, that sounds pretty nice.",
        "zh": "说实话，听起来挺不错的。"
      },
      {
        "speaker": "B",
        "english": "Yeah, I’ve been exhausted lately.",
        "zh": "对，我最近真的累坏了。"
      }
    ]
  },
  {
    "id": "friends-work",
    "group": "friends",
    "level": "常用",
    "title": "聊工作",
    "description": "朋友闲聊场景：聊工作。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "How’s work been lately?",
        "zh": "最近工作怎么样？"
      },
      {
        "speaker": "B",
        "english": "Pretty busy, honestly.",
        "zh": "说实话，挺忙的。"
      },
      {
        "speaker": "A",
        "english": "Same here. I barely get any sleep.",
        "zh": "我也是，最近都没什么睡觉。"
      },
      {
        "speaker": "B",
        "english": "Yeah, I feel you.",
        "zh": "对，我懂你。"
      }
    ]
  },
  {
    "id": "friends-late-night",
    "group": "friends",
    "level": "常用",
    "title": "深夜聊天",
    "description": "朋友闲聊场景：深夜聊天。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Why are you still awake?",
        "zh": "你怎么还没睡？"
      },
      {
        "speaker": "B",
        "english": "I can’t fall asleep.",
        "zh": "我睡不着。"
      },
      {
        "speaker": "A",
        "english": "Same. My sleep schedule is messed up.",
        "zh": "我也是，我作息乱了。"
      },
      {
        "speaker": "B",
        "english": "Mine’s been terrible lately.",
        "zh": "我最近作息也很糟糕。"
      }
    ]
  },
  {
    "id": "friends-grab-food",
    "group": "friends",
    "level": "常用",
    "title": "约朋友吃饭",
    "description": "朋友闲聊场景：约朋友吃饭。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "You trying to grab food later?",
        "zh": "晚点要不要一起吃饭？"
      },
      {
        "speaker": "B",
        "english": "I’m down.",
        "zh": "可以啊。"
      },
      {
        "speaker": "A",
        "english": "What are you in the mood for?",
        "zh": "你想吃什么？"
      },
      {
        "speaker": "B",
        "english": "Honestly, anything sounds good.",
        "zh": "说实话，吃什么都行。"
      }
    ]
  },
  {
    "id": "friends-disappear",
    "group": "friends",
    "level": "常用",
    "title": "突然消失",
    "description": "朋友闲聊场景：突然消失。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Bro, where have you been?",
        "zh": "兄弟，你最近跑哪去了？"
      },
      {
        "speaker": "B",
        "english": "I’ve just been busy.",
        "zh": "最近一直在忙。"
      },
      {
        "speaker": "A",
        "english": "You disappeared for like a week.",
        "zh": "你都消失快一周了。"
      },
      {
        "speaker": "B",
        "english": "Yeah, life’s been crazy lately.",
        "zh": "对，最近事情太多了。"
      }
    ]
  },
  {
    "id": "appointment-time",
    "group": "appointment",
    "level": "常用",
    "title": "预约时间",
    "description": "预约场景：预约时间。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Are you free this weekend?",
        "zh": "你这周末有空吗？"
      },
      {
        "speaker": "B",
        "english": "Yeah, Sunday works for me.",
        "zh": "有，周日可以。"
      },
      {
        "speaker": "A",
        "english": "I have 3pm available.",
        "zh": "我下午3点有空。"
      },
      {
        "speaker": "B",
        "english": "Perfect.",
        "zh": "可以。"
      }
    ]
  },
  {
    "id": "appointment-reschedule",
    "group": "appointment",
    "level": "常用",
    "title": "改时间",
    "description": "预约场景：改时间。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Hey, can we reschedule?",
        "zh": "嘿，我们可以改时间吗？"
      },
      {
        "speaker": "B",
        "english": "Yeah, no problem.",
        "zh": "可以，没问题。"
      },
      {
        "speaker": "A",
        "english": "Something came up today.",
        "zh": "我今天突然有点事。"
      },
      {
        "speaker": "B",
        "english": "All good.",
        "zh": "没事。"
      }
    ]
  },
  {
    "id": "appointment-late",
    "group": "appointment",
    "level": "常用",
    "title": "迟到",
    "description": "预约场景：迟到。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Are you almost here?",
        "zh": "你快到了吗？"
      },
      {
        "speaker": "B",
        "english": "I’m running late.",
        "zh": "我要迟到了。"
      },
      {
        "speaker": "A",
        "english": "No worries. Drive safe.",
        "zh": "没事，注意安全。"
      },
      {
        "speaker": "B",
        "english": "I’ll be there in 10.",
        "zh": "我10分钟到。"
      }
    ]
  },
  {
    "id": "salon-first-consult",
    "group": "salon",
    "level": "常用",
    "title": "第一次咨询",
    "description": "发型店场景：第一次咨询。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "What are we doing today?",
        "zh": "今天想怎么剪？"
      },
      {
        "speaker": "B",
        "english": "Just a cleanup, not too short.",
        "zh": "稍微修一下，不要太短。"
      },
      {
        "speaker": "A",
        "english": "Do you usually style your hair?",
        "zh": "你平时会抓头发吗？"
      },
      {
        "speaker": "B",
        "english": "Not really.",
        "zh": "不太会。"
      }
    ]
  },
  {
    "id": "salon-natural-sides",
    "group": "salon",
    "level": "常用",
    "title": "两边不要太短",
    "description": "发型店场景：两边不要太短。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "How short do you want the sides?",
        "zh": "两边想剪多短？"
      },
      {
        "speaker": "B",
        "english": "Not too short.",
        "zh": "不要太短。"
      },
      {
        "speaker": "A",
        "english": "More natural or more clean?",
        "zh": "想自然一点还是干净一点？"
      },
      {
        "speaker": "B",
        "english": "More natural.",
        "zh": "自然一点。"
      }
    ]
  },
  {
    "id": "salon-grow-out",
    "group": "salon",
    "level": "常用",
    "title": "想留长",
    "description": "发型店场景：想留长。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Are you trying to grow it out?",
        "zh": "你是在留长吗？"
      },
      {
        "speaker": "B",
        "english": "Yeah, but it looks awkward right now.",
        "zh": "对，但现在有点尴尬。"
      },
      {
        "speaker": "A",
        "english": "That’s normal.",
        "zh": "这很正常。"
      },
      {
        "speaker": "A",
        "english": "I’ll shape it up for you.",
        "zh": "我帮你修顺一点。"
      }
    ]
  },
  {
    "id": "salon-thick-hair",
    "group": "salon",
    "level": "常用",
    "title": "头发太厚",
    "description": "发型店场景：头发太厚。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Your hair is really thick.",
        "zh": "你的头发挺厚的。"
      },
      {
        "speaker": "B",
        "english": "Yeah, it gets puffy fast.",
        "zh": "对，很容易炸。"
      },
      {
        "speaker": "A",
        "english": "I’ll thin it out a little.",
        "zh": "我帮你稍微打薄一点。"
      },
      {
        "speaker": "B",
        "english": "That would help a lot.",
        "zh": "那会好很多。"
      }
    ]
  },
  {
    "id": "salon-perm-consult",
    "group": "salon",
    "level": "常用",
    "title": "烫发咨询",
    "description": "发型店场景：烫发咨询。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Have you ever gotten a perm before?",
        "zh": "你以前烫过头发吗？"
      },
      {
        "speaker": "B",
        "english": "No, this is my first time.",
        "zh": "没有，这是第一次。"
      },
      {
        "speaker": "A",
        "english": "I’d recommend a soft perm.",
        "zh": "我会推荐自然一点的烫发。"
      },
      {
        "speaker": "B",
        "english": "That’s exactly what I want.",
        "zh": "这就是我想要的。"
      }
    ]
  },
  {
    "id": "food-decide",
    "group": "food",
    "level": "常用",
    "title": "决定吃什么",
    "description": "吃饭场景：决定吃什么。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "What do you want to eat?",
        "zh": "你想吃什么？"
      },
      {
        "speaker": "B",
        "english": "I’m down for anything.",
        "zh": "我吃什么都可以。"
      },
      {
        "speaker": "A",
        "english": "I’m starving.",
        "zh": "我快饿死了。"
      },
      {
        "speaker": "B",
        "english": "Same here.",
        "zh": "我也是。"
      }
    ]
  },
  {
    "id": "food-order",
    "group": "food",
    "level": "常用",
    "title": "餐厅点餐",
    "description": "吃饭场景：餐厅点餐。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Are you ready to order?",
        "zh": "准备好点餐了吗？"
      },
      {
        "speaker": "B",
        "english": "Yeah, I’ll get the burger.",
        "zh": "好，我要汉堡。"
      },
      {
        "speaker": "A",
        "english": "Do you want fries with that?",
        "zh": "要配薯条吗？"
      },
      {
        "speaker": "B",
        "english": "Sure.",
        "zh": "好。"
      }
    ]
  },
  {
    "id": "gym-training",
    "group": "gym",
    "level": "常用",
    "title": "聊训练",
    "description": "健身场景：聊训练。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "What are you training today?",
        "zh": "你今天练什么？"
      },
      {
        "speaker": "B",
        "english": "Chest and shoulders.",
        "zh": "胸和肩。"
      },
      {
        "speaker": "A",
        "english": "Trying to bulk up?",
        "zh": "在增肌？"
      },
      {
        "speaker": "B",
        "english": "Yeah, I’m trying to build muscle.",
        "zh": "对，我在增肌。"
      }
    ]
  },
  {
    "id": "gym-leg-day",
    "group": "gym",
    "level": "常用",
    "title": "练腿太酸",
    "description": "健身场景：练腿太酸。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Why are you walking like that?",
        "zh": "你怎么这样走路？"
      },
      {
        "speaker": "B",
        "english": "Leg day yesterday.",
        "zh": "昨天练腿了。"
      },
      {
        "speaker": "A",
        "english": "Your legs sore?",
        "zh": "腿酸？"
      },
      {
        "speaker": "B",
        "english": "Super sore.",
        "zh": "特别酸。"
      }
    ]
  },
  {
    "id": "dating-first-meet",
    "group": "dating",
    "level": "常用",
    "title": "第一次见面",
    "description": "约会聊天场景：第一次见面。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "You look exactly like your pictures.",
        "zh": "你跟照片里一模一样。"
      },
      {
        "speaker": "B",
        "english": "That’s a good thing, right?",
        "zh": "这是好事吧？"
      },
      {
        "speaker": "A",
        "english": "Definitely.",
        "zh": "当然。"
      },
      {
        "speaker": "B",
        "english": "You seem really chill.",
        "zh": "你人看起来很随和。"
      }
    ]
  },
  {
    "id": "dating-flirt",
    "group": "dating",
    "level": "常用",
    "title": "轻松暧昧",
    "description": "约会聊天场景：轻松暧昧。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "You look really good today.",
        "zh": "你今天看起来很好看。"
      },
      {
        "speaker": "B",
        "english": "Stop, you’re making me blush.",
        "zh": "别说了，你都让我害羞了。"
      },
      {
        "speaker": "A",
        "english": "I’m serious though.",
        "zh": "我是认真的。"
      },
      {
        "speaker": "B",
        "english": "That’s sweet.",
        "zh": "你真会说话。"
      }
    ]
  },
  {
    "id": "shopping-clothes",
    "group": "shopping",
    "level": "常用",
    "title": "买衣服",
    "description": "购物场景：买衣服。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Can I help you find anything?",
        "zh": "需要帮忙找什么吗？"
      },
      {
        "speaker": "B",
        "english": "Do you have this in a medium?",
        "zh": "这个有M码吗？"
      },
      {
        "speaker": "A",
        "english": "Let me check for you.",
        "zh": "我帮你看看。"
      },
      {
        "speaker": "B",
        "english": "Thanks, I appreciate it.",
        "zh": "谢谢，麻烦你了。"
      }
    ]
  },
  {
    "id": "driving-traffic",
    "group": "driving",
    "level": "常用",
    "title": "路上堵车",
    "description": "开车场景：路上堵车。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Where are you right now?",
        "zh": "你现在到哪了？"
      },
      {
        "speaker": "B",
        "english": "Still on the highway.",
        "zh": "还在高速上。"
      },
      {
        "speaker": "A",
        "english": "Traffic bad?",
        "zh": "很堵吗？"
      },
      {
        "speaker": "B",
        "english": "Yeah, it’s moving super slow.",
        "zh": "对，车流特别慢。"
      }
    ]
  },
  {
    "id": "travel-boarding",
    "group": "travel",
    "level": "常用",
    "title": "机场登机",
    "description": "旅行场景：机场登机。",
    "dialogue": [
      {
        "speaker": "A",
        "english": "Did you check in already?",
        "zh": "你已经值机了吗？"
      },
      {
        "speaker": "B",
        "english": "Yeah, I just did.",
        "zh": "对，刚办完。"
      },
      {
        "speaker": "A",
        "english": "What gate are you at?",
        "zh": "你在哪个登机口？"
      },
      {
        "speaker": "B",
        "english": "Gate 24.",
        "zh": "24号登机口。"
      }
    ]
  }
]
