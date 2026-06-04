export const teacherScenarioOptions = [
  { id: 'hair-client', label: '理发客户', detail: '咨询、剪发、烫发、造型、预约' },
  { id: 'daily-life', label: '日常生活', detail: '朋友聊天、生活安排、轻松接话' },
  { id: 'restaurant', label: '餐厅点餐', detail: '进店、推荐、点餐、付款、打包' },
  { id: 'coffee-shop', label: '咖啡店', detail: '点咖啡、修改要求、取餐闲聊' },
  { id: 'shopping', label: '购物', detail: '找商品、试穿、尺码、退换' },
  { id: 'gym', label: '健身房', detail: '训练计划、器械、重量、饮食恢复' },
  { id: 'appointment', label: '预约沟通', detail: '约时间、改时间、确认细节' },
  { id: 'social-chat', label: '社交聊天', detail: '认识新朋友、自然寒暄、延续话题' },
  { id: 'travel', label: '旅行出行', detail: '机场、酒店、问路、交通、景点' },
  { id: 'work', label: '工作沟通', detail: '同事沟通、进度、会议、协作' },
  { id: 'renting', label: '租房生活', detail: '看房、房东、维修、租约' },
  { id: 'medical', label: '医疗看病', detail: '症状、挂号、问诊、用药' }
] as const

export type TeacherScenarioId = typeof teacherScenarioOptions[number]['id']

export const teacherDifficultyOptions = [
  { id: 'easy', label: '简单', detail: '常见词、简单句型、直接好懂' },
  { id: 'medium', label: '中级', detail: '自然口语、常见短语、贴近日常' },
  { id: 'advanced', label: '高级', detail: '更地道精准，可有专业细节但不变长' }
] as const

export type TeacherDifficulty = typeof teacherDifficultyOptions[number]['id']

const scenarioIds = new Set<string>(teacherScenarioOptions.map((item) => item.id))
const difficultyIds = new Set<string>(teacherDifficultyOptions.map((item) => item.id))

export function normalizeTeacherScenarioId(value: unknown): TeacherScenarioId {
  const id = String(value || '').trim()
  return scenarioIds.has(id) ? id as TeacherScenarioId : 'daily-life'
}

export function normalizeTeacherDifficulty(value: unknown): TeacherDifficulty {
  const id = String(value || '').trim()
  return difficultyIds.has(id) ? id as TeacherDifficulty : 'medium'
}

export function getTeacherScenarioLabel(id: TeacherScenarioId) {
  return teacherScenarioOptions.find((item) => item.id === id)?.label || '日常生活'
}

export function getTeacherDifficultyLabel(id: TeacherDifficulty) {
  return teacherDifficultyOptions.find((item) => item.id === id)?.label || '中级'
}
