'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus, User, Users, BookOpen, Sparkles, BookText, Layers, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StarryBackground } from '@/components/starry-background'
import { BottomNav } from '@/components/bottom-nav'
import { SentenceCard } from '@/components/sentence-card'
import { ScenesPage } from '@/components/scenes-page'
import { TeacherPage, type TeacherQuickMode } from '@/components/teacher-page'
import { ExamPage } from '@/components/exam-page'
import { FriendsPage } from '@/components/friends-page'
import { AuthSheet, UpdateSheet } from '@/components/auth-sheet'
import {
  savedSentences as initialSentences,
  vocabGroups,
  vocabItems,
  sceneGroups,
  scenes,
  type SavedSentence,
  type TeacherMessage,
  type TutorMemoryProfile
} from '@/lib/sample-data'

type ActiveTab = 'sentences' | 'scenes' | 'teacher'
type SentenceTab = 'learning' | 'learned'

interface AppUser {
  id?: string
  name: string
  email: string
  avatar?: string
}

interface FriendItem {
  id: string
  name: string
  email: string
  avatar?: string
  sentenceCount: number
  lastActive: string
}

interface UpdateInfo {
  versionCode: number
  versionName: string
  apkUrl: string
  notes: string
}

const CURRENT_VERSION_CODE = 61
const CURRENT_VERSION_NAME = 'free61'
const API_BASE = 'https://jj-teacher.onrender.com'
const TARGET_LANGUAGE = 'english'

const SENTENCES_KEY = 'sentence-reader-sentences'
const TEACHER_CHAT_KEY = 'sentence-reader-ai-chat'
const SPEED_KEY = 'sentence-reader-speed'
const VIEW_KEY = 'sentence-reader-view'
const APP_PAGE_KEY = 'sentence-reader-page'
const DRAFT_KEY = 'sentence-reader-draft'
const AUTH_TOKEN_KEY = 'sentence-reader-auth-token'
const AUTH_USER_KEY = 'sentence-reader-auth-user'
const AUTH_AVATAR_KEY = 'sentence-reader-auth-avatar'
const UPDATE_DISMISS_KEY = 'sentence-reader-dismissed-update'
const DAILY_CHAT_REPEAT_KEY = 'sentence-reader-daily-chat-last'
const MEMORY_KEY = 'sentence-reader-memory-profile'

const DAILY_LINES = [
  ['我最近一直想把生活节奏调回来。', "I've been trying to get back into a routine lately."],
  ['如果你也想轻松一点，我可以配合。', "I'm down for something low-key if you are."],
  ['听起来像是什么事都比预想更费时间的一天。', 'That sounds like one of those days where everything takes longer than it should.'],
  ['我最近在睡前少刷手机。', "I've been cutting down on scrolling before bed."],
  ['我需要的是休整日，不是更忙的一天。', 'I need a reset day, not another busy day.'],
  ['我这个月想更认真地存钱。', "I'm trying to be better about saving money this month."],
  ['我找到一家真的没有被吹过头的小店。', 'I found a little place that actually lives up to the hype.'],
  ['我现在想吃舒服一点的，不想吃太正式的。', "I'm in the mood for something comforting, not fancy."],
  ['今天早上莫名其妙效率很高。', 'I had one of those weirdly productive mornings.'],
  ['我最近想多自己做饭，少点外卖。', "I've been trying to cook more instead of ordering in."],
  ['我最近有点不想去太挤的地方。', "I'm kind of over crowded places lately."],
  ['我们简单安排一下，别把它搞得太复杂。', "Let's do something simple and not make it a whole thing."],
  ['今天有件事把我笑得比它本身还夸张。', 'I saw something today that made me laugh way harder than it should have.'],
  ['我最近想让周末别排得太满。', "I'm trying to keep my weekends a little more open."],
  ['我现在很适合散个步再喝杯咖啡。', 'I could use a walk and a coffee.'],
  ['我最近一直单曲循环同一首歌。', "I've been listening to the same song on repeat."],
  ['那个软件挺有用，但太容易刷着刷着就没时间了。', "That app is useful, but it's way too easy to lose time on it."],
  ['我在练习拒绝别人时不要有负罪感。', "I'm trying to get better at saying no without feeling bad."],
  ['我得先收拾房间，不然它快变成问题了。', 'I need to clean my room before it turns into a problem.'],
  ['我不是困，就是今天脑子已经下班了。', "I'm not tired, I'm just mentally done for the day."],
  ['我想保持稳定，哪怕每天只做一点点。', "I'm trying to stay consistent, even if it's just a little every day."],
  ['我突然特别想吃点辣的。', "I'm craving something spicy."],
  ['我在想最近找个时间短途旅行一下。', "I'm thinking about taking a short trip soon."],
  ['我喜欢那种加入轻松、走也轻松的安排。', 'I like plans that feel easy to join and easy to leave.'],
  ['那家店不错，就是排队永远很夸张。', 'That place is good, but the line is always insane.'],
  ['我最近在努力像个成熟的人一样多喝水。', "I've been trying to drink more water like a responsible person."],
  ['我现在处在想把整个房间都换掉的阶段。', 'I’m in that phase where I want to change my whole room.'],
  ['我宁愿轻松待一晚，也不想硬逼自己出门。', "I'd rather have a chill night than force myself to go out."],
  ['我需要一个不用一直盯着屏幕的爱好。', "I need a hobby that doesn't involve staring at a screen."],
  ['我在努力少买网上那些莫名其妙的小东西。', "I'm trying to stop buying random stuff online."]
] as const

function hasStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function languageKey(key: string) {
  return `${key}:${TARGET_LANGUAGE}`
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function readFirstJson<T>(keys: string[], fallback: T): T {
  for (const key of keys) {
    const value = readJson<T | null>(key, null)
    if (value !== null) return value as T
  }
  return fallback
}

function writeJson(key: string, value: unknown) {
  if (!hasStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function makeId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeSentence(item: Partial<SavedSentence> & Record<string, unknown>, index = 0): SavedSentence | null {
  const text = String(item.text || '').trim()
  if (!text) return null
  return {
    id: String(item.id || makeId(`sentence-${index}`)),
    text,
    note: String(item.note || ''),
    learned: Boolean(item.learned),
    learnedAt: typeof item.learnedAt === 'number' ? item.learnedAt : null,
    aiExplanation: String(item.aiExplanation || '')
  }
}

function normalizeMessage(item: Partial<TeacherMessage> & Record<string, unknown>, index = 0): TeacherMessage | null {
  const role = item.role === 'assistant' ? 'assistant' : item.role === 'user' ? 'user' : null
  const text = String(item.text || '').trim()
  if (!role || !text) return null
  const mode = item.mode === 'topic' || item.mode === 'daily-sentences' || item.mode === 'free-chat' || item.mode === 'chat'
    ? item.mode
    : undefined
  const translation = item.translation && typeof item.translation === 'object'
    ? {
        sentence: String((item.translation as { sentence?: unknown }).sentence || ''),
        note: String((item.translation as { note?: unknown }).note || '')
      }
    : undefined
  return {
    id: String(item.id || makeId(`message-${index}`)),
    role,
    text,
    mode,
    translation: translation?.sentence ? translation : undefined,
    timestamp: typeof item.timestamp === 'number' ? item.timestamp : Date.now() + index
  }
}

function defaultMemoryProfile(enabled = true): TutorMemoryProfile {
  return {
    enabled,
    summary: '',
    preferences: [],
    interests: [],
    habits: [],
    learningProfile: [],
    communicationStyle: [],
    correctionPatterns: [],
    personalFacts: [],
    avoid: [],
    updatedAt: 0
  }
}

function normalizeMemoryList(value: unknown, maxItems = 80) {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const items: string[] = []
  for (const item of value) {
    const clean = String(item || '').replace(/\s+/g, ' ').trim().slice(0, 220)
    const key = clean.toLowerCase()
    if (!clean || seen.has(key)) continue
    seen.add(key)
    items.push(clean)
    if (items.length >= maxItems) break
  }
  return items
}

function normalizeMemoryProfile(value: unknown): TutorMemoryProfile {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  return {
    enabled: source.enabled !== false,
    summary: String(source.summary || '').trim().slice(0, 2400),
    preferences: normalizeMemoryList(source.preferences),
    interests: normalizeMemoryList(source.interests),
    habits: normalizeMemoryList(source.habits),
    learningProfile: normalizeMemoryList(source.learningProfile),
    communicationStyle: normalizeMemoryList(source.communicationStyle),
    correctionPatterns: normalizeMemoryList(source.correctionPatterns),
    personalFacts: normalizeMemoryList(source.personalFacts),
    avoid: normalizeMemoryList(source.avoid),
    updatedAt: typeof source.updatedAt === 'number' ? source.updatedAt : 0
  }
}

function memoryHasContent(memory: TutorMemoryProfile) {
  return Boolean(
    memory.summary ||
      memory.preferences.length ||
      memory.interests.length ||
      memory.habits.length ||
      memory.learningProfile.length ||
      memory.communicationStyle.length ||
      memory.correctionPatterns.length ||
      memory.personalFacts.length ||
      memory.avoid.length
  )
}

function splitSentences(text: string) {
  return text
    .split(/\n+|(?<=[.!?。！？])\s+/)
    .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function mergeSentences(local: SavedSentence[], remote: unknown) {
  const remoteList = Array.isArray(remote)
    ? remote.map((item, index) => normalizeSentence(item as Partial<SavedSentence> & Record<string, unknown>, index)).filter(Boolean) as SavedSentence[]
    : []
  const merged = [...local]
  const seen = new Set(local.map((item) => item.text.toLowerCase()))
  for (const item of remoteList) {
    const key = item.text.toLowerCase()
    if (!seen.has(key)) {
      merged.push(item)
      seen.add(key)
    }
  }
  return merged
}

function buildDailySentenceMessage() {
  const recent = readJson<string[]>(DAILY_CHAT_REPEAT_KEY, [])
  const recentSet = new Set(Array.isArray(recent) ? recent : [])
  let pool = DAILY_LINES.filter((line) => !recentSet.has(line[1]))
  if (pool.length < 3) pool = [...DAILY_LINES]
  const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 3)
  writeJson(DAILY_CHAT_REPEAT_KEY, selected.map((line) => line[1]))
  return selected.map((line, index) => `${index + 1}. ${line[0]}\n${line[1]}`).join('\n\n')
}

function cleanTopicReply(reply: string) {
  const metaPattern = /(这种|这个|这类).{0,40}(话题|问题).{0,48}(容易|适合|自然|真实|生活状态|聊出|接话)|话题设计|开头更自然|good opener|topic design|real chat opener/i
  const lines = reply
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !metaPattern.test(line))
  return lines.join('\n').trim()
}

function compactReply(reply: string, mode: string) {
  const clean = mode === 'topic' ? cleanTopicReply(reply) : reply
  return clean
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*```[\s\S]*?```\s*$/g, '')
    .trim()
}

async function apiRequest(path: string, options: RequestInit = {}, token = '') {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string> | undefined)
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(String(data.message || data.error || '服务暂时不可用'))
  }
  return data
}

async function requestAiTeacher(payload: Record<string, unknown>) {
  return apiRequest('/api/ai-teacher', {
    method: 'POST',
    body: JSON.stringify({
      targetLanguage: TARGET_LANGUAGE,
      ...payload
    })
  })
}

async function requestAiMemory(payload: Record<string, unknown>) {
  return apiRequest('/api/ai-memory', {
    method: 'POST',
    body: JSON.stringify({
      targetLanguage: TARGET_LANGUAGE,
      ...payload
    })
  })
}

function serverModeFromQuickMode(mode?: TeacherQuickMode | null) {
  if (mode === 'topic') return 'topic'
  if (mode === 'free') return 'freestyle'
  return 'chat'
}

function messageModeFromServerMode(mode: string): TeacherMessage['mode'] {
  if (mode === 'topic') return 'topic'
  if (mode === 'freestyle') return 'free-chat'
  return 'chat'
}

function buildCloudPayload(sentences: SavedSentence[], messages: TeacherMessage[], memoryProfile: TutorMemoryProfile) {
  const cleanMessages = messages
    .filter((message) => !message.pending)
    .slice(-80)
    .map(({ role, text, mode, translation, timestamp }) => ({ role, text, mode, translation, timestamp }))

  return {
    appVersion: CURRENT_VERSION_NAME,
    savedAt: Date.now(),
    settings: {
      learningLanguage: TARGET_LANGUAGE,
      avatar: hasStorage() ? window.localStorage.getItem(AUTH_AVATAR_KEY) || '' : ''
    },
    memoryProfile,
    learningLanguage: TARGET_LANGUAGE,
    sceneProgress: {},
    languages: {
      english: {
        sentences,
        teacherMessages: cleanMessages,
        savedAt: Date.now()
      }
    },
    sentences,
    teacherMessages: cleanMessages
  }
}

export default function ZhiyuApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sentences')
  const [sentenceTab, setSentenceTab] = useState<SentenceTab>('learning')
  const [showExam, setShowExam] = useState(false)
  const [showFriends, setShowFriends] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const [sentences, setSentences] = useState<SavedSentence[]>(initialSentences)
  const [messages, setMessages] = useState<TeacherMessage[]>([])
  const [memoryProfile, setMemoryProfile] = useState<TutorMemoryProfile>(() => defaultMemoryProfile())
  const [newSentence, setNewSentence] = useState('')
  const [speechRate, setSpeechRate] = useState(1)
  const [teacherMode, setTeacherMode] = useState<TeacherQuickMode | null>(null)
  const [isSending, setIsSending] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [user, setUser] = useState<AppUser | undefined>()
  const [friends, setFriends] = useState<FriendItem[]>([])

  const messagesRef = useRef<TeacherMessage[]>(messages)
  const memoryProfileRef = useRef<TutorMemoryProfile>(memoryProfile)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    memoryProfileRef.current = memoryProfile
  }, [memoryProfile])

  useEffect(() => {
    const storedSentences = readFirstJson<SavedSentence[]>([languageKey(SENTENCES_KEY), SENTENCES_KEY], [])
      .map((item, index) => normalizeSentence(item as Partial<SavedSentence> & Record<string, unknown>, index))
      .filter(Boolean) as SavedSentence[]
    const storedMessages = readFirstJson<TeacherMessage[]>([languageKey(TEACHER_CHAT_KEY), TEACHER_CHAT_KEY], [])
      .map((item, index) => normalizeMessage(item as Partial<TeacherMessage> & Record<string, unknown>, index))
      .filter(Boolean) as TeacherMessage[]
    const storedMemory = normalizeMemoryProfile(readJson<unknown>(MEMORY_KEY, defaultMemoryProfile()))
    const storedUser = readJson<AppUser | null>(AUTH_USER_KEY, null)
    const storedToken = hasStorage() ? window.localStorage.getItem(AUTH_TOKEN_KEY) || '' : ''

    if (storedSentences.length) setSentences(storedSentences)
    if (storedMessages.length) setMessages(storedMessages)
    setMemoryProfile(storedMemory)
    setNewSentence(hasStorage() ? window.localStorage.getItem(DRAFT_KEY) || '' : '')
    setSpeechRate(Number(hasStorage() ? window.localStorage.getItem(SPEED_KEY) || '1' : '1') || 1)
    setSentenceTab(hasStorage() && window.localStorage.getItem(VIEW_KEY) === 'learned' ? 'learned' : 'learning')
    const storedPage = hasStorage() ? window.localStorage.getItem(APP_PAGE_KEY) : ''
    if (storedPage === 'teacher' || storedPage === 'scenes' || storedPage === 'sentences') setActiveTab(storedPage)
    if (storedToken && storedUser) {
      setAuthToken(storedToken)
      setUser(storedUser)
      setIsLoggedIn(true)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeJson(SENTENCES_KEY, sentences)
    writeJson(languageKey(SENTENCES_KEY), sentences)
  }, [hydrated, sentences])

  useEffect(() => {
    if (!hydrated) return
    const cleanMessages = messages.filter((message) => !message.pending).slice(-80)
    writeJson(TEACHER_CHAT_KEY, cleanMessages)
    writeJson(languageKey(TEACHER_CHAT_KEY), cleanMessages)
  }, [hydrated, messages])

  useEffect(() => {
    if (!hydrated) return
    writeJson(MEMORY_KEY, memoryProfile)
  }, [hydrated, memoryProfile])

  useEffect(() => {
    if (!hydrated || !hasStorage()) return
    window.localStorage.setItem(DRAFT_KEY, newSentence)
  }, [hydrated, newSentence])

  useEffect(() => {
    if (!hydrated || !hasStorage()) return
    window.localStorage.setItem(SPEED_KEY, String(speechRate))
  }, [hydrated, speechRate])

  useEffect(() => {
    if (!hydrated || !hasStorage()) return
    window.localStorage.setItem(VIEW_KEY, sentenceTab)
  }, [hydrated, sentenceTab])

  useEffect(() => {
    if (!hydrated || !hasStorage()) return
    window.localStorage.setItem(APP_PAGE_KEY, activeTab)
  }, [hydrated, activeTab])

  const loadFriends = useCallback(async (token = authToken) => {
    if (!token) return
    try {
      const data = await apiRequest('/api/users', { method: 'GET' }, token)
      const users = Array.isArray(data.users) ? data.users : []
      setFriends(users.map((item: Record<string, unknown>) => ({
        id: String(item.id || item.email || makeId('friend')),
        name: String(item.name || item.email || '用户'),
        email: String(item.email || ''),
        avatar: String(item.avatar || ''),
        sentenceCount: Number(item.sentenceCount || item.sentencesCount || 0),
        lastActive: item.updatedAt ? '最近同步过' : '已注册'
      })))
    } catch {
      setFriends([])
    }
  }, [authToken])

  const pullCloudData = useCallback(async (token = authToken) => {
    if (!token) return
    try {
      const data = await apiRequest('/api/user-data', { method: 'GET' }, token)
      const remoteData = data.data || {}
      const remoteEnglish = remoteData.languages?.english || {}
      setSentences((current) => mergeSentences(current, remoteEnglish.sentences || remoteData.sentences))
      const hasRemoteMemory = remoteData.memoryProfile && typeof remoteData.memoryProfile === 'object'
      const remoteMemory = normalizeMemoryProfile(remoteData.memoryProfile)
      if (hasRemoteMemory && remoteMemory.updatedAt >= memoryProfileRef.current.updatedAt) {
        setMemoryProfile(remoteMemory)
      }
      const remoteMessages = Array.isArray(remoteEnglish.teacherMessages)
        ? remoteEnglish.teacherMessages
        : Array.isArray(remoteData.teacherMessages)
          ? remoteData.teacherMessages
          : []
      if (remoteMessages.length > messagesRef.current.filter((item) => !item.pending).length) {
        const normalized = remoteMessages
          .map((item: Record<string, unknown>, index: number) => normalizeMessage(item, index))
          .filter(Boolean) as TeacherMessage[]
        setMessages(normalized)
      }
    } catch {
      // Local learning data still works when cloud sync is unavailable.
    }
  }, [authToken])

  useEffect(() => {
    if (!hydrated || !authToken) return
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      apiRequest('/api/user-data', {
        method: 'POST',
        body: JSON.stringify({ data: buildCloudPayload(sentences, messages, memoryProfile) })
      }, authToken).catch(() => {})
    }, 900)
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [hydrated, authToken, sentences, messages, memoryProfile])

  useEffect(() => {
    if (!hydrated) return
    if (authToken) {
      loadFriends(authToken)
      pullCloudData(authToken)
    }
  }, [hydrated, authToken, loadFriends, pullCloudData])

  useEffect(() => {
    if (!hydrated) return
    const controller = new AbortController()
    fetch(`${API_BASE}/version.json?t=${Date.now()}`, { signal: controller.signal, cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        const versionCode = Number(data.versionCode || 0)
        const dismissed = hasStorage() ? window.localStorage.getItem(UPDATE_DISMISS_KEY) : ''
        if (versionCode > CURRENT_VERSION_CODE && dismissed !== String(versionCode)) {
          setUpdateInfo({
            versionCode,
            versionName: String(data.versionName || `free${versionCode}`),
            apkUrl: String(data.apkUrl || ''),
            notes: String(data.notes || '新版本已经准备好。')
          })
          setShowUpdate(true)
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [hydrated])

  const filteredSentences = useMemo(() => {
    return sentences.filter((sentence) => sentenceTab === 'learning' ? !sentence.learned : sentence.learned)
  }, [sentences, sentenceTab])

  const handleAddSentence = useCallback((text?: string, note?: string) => {
    const additions = text ? [text.trim()] : splitSentences(newSentence)
    if (!additions.length) return

    const newItems = additions.map((sentenceText) => ({
      id: makeId('sentence'),
      text: sentenceText,
      note: note || '',
      learned: false,
      learnedAt: null,
      aiExplanation: ''
    }))

    setSentences((current) => [...newItems, ...current])
    setNewSentence('')
  }, [newSentence])

  const handleDeleteSentence = useCallback((id: string) => {
    setSentences((current) => current.filter((sentence) => sentence.id !== id))
  }, [])

  const handleToggleLearned = useCallback((id: string) => {
    setSentences((current) => current.map((sentence) =>
      sentence.id === id
        ? { ...sentence, learned: !sentence.learned, learnedAt: !sentence.learned ? Date.now() : null }
        : sentence
    ))
  }, [])

  const handleUpdateSentenceNote = useCallback((id: string, note: string) => {
    setSentences((current) => current.map((sentence) =>
      sentence.id === id
        ? { ...sentence, note }
        : sentence
    ))
  }, [])

  const handleAiExplain = useCallback(async (id: string) => {
    const sentence = sentences.find((item) => item.id === id)
    if (!sentence || sentence.aiExplanation) return

    try {
      const data = await requestAiTeacher({ mode: 'explain', sentence: sentence.text })
      const explanation = String(data.reply || '').trim()
      setSentences((current) => current.map((item) =>
        item.id === id
          ? { ...item, aiExplanation: explanation || '这次没有拿到解答，请稍后再试。' }
          : item
      ))
    } catch {
      setSentences((current) => current.map((item) =>
        item.id === id
          ? { ...item, aiExplanation: '这次没有拿到解答，请稍后再试。' }
          : item
      ))
    }
  }, [sentences])

  const updateMemoryFromExchange = useCallback(async (
    userMessage: string,
    assistantReply: string,
    mode: TeacherMessage['mode']
  ) => {
    const currentMemory = memoryProfileRef.current
    if (!currentMemory.enabled || !userMessage.trim()) return

    try {
      const data = await requestAiMemory({
        memoryProfile: currentMemory,
        userMessage,
        assistantReply,
        mode
      })
      const nextMemory = normalizeMemoryProfile(data.memoryProfile)
      setMemoryProfile(nextMemory)
    } catch {
      // Memory is helpful, but chat should never depend on it.
    }
  }, [])

  const handleToggleMemory = useCallback((enabled: boolean) => {
    setMemoryProfile((current) => ({
      ...current,
      enabled,
      updatedAt: Date.now()
    }))
  }, [])

  const handleClearMemory = useCallback(() => {
    setMemoryProfile({
      ...defaultMemoryProfile(true),
      updatedAt: Date.now()
    })
  }, [])

  const sendTeacherMessage = useCallback(async (text: string, quickMode?: TeacherQuickMode | null) => {
    const cleanText = text.trim()
    if (!cleanText || isSending) return

    const serverMode = serverModeFromQuickMode(quickMode)
    const displayMode = messageModeFromServerMode(serverMode)
    const now = Date.now()
    const userMessage: TeacherMessage = {
      id: makeId('user-message'),
      role: 'user',
      text: cleanText,
      mode: displayMode,
      timestamp: now
    }
    const pendingMessage: TeacherMessage = {
      id: makeId('assistant-pending'),
      role: 'assistant',
      text: serverMode === 'freestyle' ? '闲聊 AI 正在回复...' : '导师正在打字...',
      mode: displayMode,
      pending: true,
      timestamp: now + 1
    }
    const history = messagesRef.current
      .filter((message) => !message.pending)
      .slice(-10)
      .map(({ role, text }) => ({ role, text }))

    setIsSending(true)
    setMessages((current) => [...current, userMessage, pendingMessage])

    try {
      const data = await requestAiTeacher({
        mode: serverMode,
        message: cleanText,
        messages: history,
        memoryProfile: memoryProfileRef.current
      })
      const reply = compactReply(String(data.reply || ''), serverMode)
      setMessages((current) => current
        .filter((message) => message.id !== pendingMessage.id)
        .concat({
          id: makeId('assistant-message'),
          role: 'assistant',
          text: reply || '刚才连接有点卡，你接着说，我继续陪你聊。',
          mode: displayMode,
          timestamp: Date.now()
        }))
      updateMemoryFromExchange(cleanText, reply, displayMode)
    } catch (error) {
      setMessages((current) => current
        .filter((message) => message.id !== pendingMessage.id)
        .concat({
          id: makeId('assistant-error'),
          role: 'assistant',
          text: error instanceof Error ? error.message : '智语导师暂时连接不上。',
          mode: displayMode,
          timestamp: Date.now()
        }))
    } finally {
      setIsSending(false)
    }
  }, [isSending, updateMemoryFromExchange])

  const startTopicPractice = useCallback(async () => {
    if (isSending) return
    setTeacherMode('topic')
    setActiveTab('teacher')
    setShowExam(false)
    setShowFriends(false)

    const pendingMessage: TeacherMessage = {
      id: makeId('topic-pending'),
      role: 'assistant',
      text: '导师正在想一个轻松话题...',
      mode: 'topic',
      pending: true,
      timestamp: Date.now()
    }

    setIsSending(true)
    setMessages((current) => [...current, pendingMessage])
    try {
      const data = await requestAiTeacher({
        mode: 'topic',
        message: '直接开启一个轻松自然的英语日常聊天。只发一个生活化问题：先中文问句，再给同一个问题的英文版本，不要解释为什么选这个话题。',
        messages: messagesRef.current.filter((message) => !message.pending).slice(-6).map(({ role, text }) => ({ role, text })),
        memoryProfile: memoryProfileRef.current
      })
      const reply = cleanTopicReply(String(data.reply || '')) || '你最近反复听或看的一个东西是什么？\nWhat’s something you’ve been listening to or watching a lot recently?'
      setMessages((current) => current
        .filter((message) => message.id !== pendingMessage.id)
        .concat({
          id: makeId('topic-message'),
          role: 'assistant',
          text: reply,
          mode: 'topic',
          timestamp: Date.now()
        }))
    } catch {
      setMessages((current) => current
        .filter((message) => message.id !== pendingMessage.id)
        .concat({
          id: makeId('topic-fallback'),
          role: 'assistant',
          text: '你最近反复听或看的一个东西是什么？\nWhat’s something you’ve been listening to or watching a lot recently?',
          mode: 'topic',
          timestamp: Date.now()
        }))
    } finally {
      setIsSending(false)
    }
  }, [isSending])

  const handleQuickAction = useCallback((action: TeacherQuickMode) => {
    if (action === 'topic') {
      startTopicPractice()
      return
    }
    setTeacherMode(action)
    setActiveTab('teacher')
    setShowExam(false)
    setShowFriends(false)

    if (action === 'daily') {
      setMessages((current) => [...current, {
        id: makeId('daily-message'),
        role: 'assistant',
        text: buildDailySentenceMessage(),
        mode: 'daily-sentences',
        timestamp: Date.now()
      }])
      return
    }

    setMessages((current) => [...current, {
      id: makeId('free-message'),
      role: 'assistant',
      text: '好，进入闲聊模式。你可以直接说今天发生了什么，我会像朋友一样接着聊。',
      mode: 'free-chat',
      timestamp: Date.now()
    }])
  }, [startTopicPractice])

  const handleLogin = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) throw new Error('账号和密码都要填。')
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    const nextUser = data.user as AppUser
    const token = String(data.token || '')
    if (!token || !nextUser) throw new Error('登录失败，请稍后再试。')
    setAuthToken(token)
    setUser(nextUser)
    setIsLoggedIn(true)
    writeJson(AUTH_USER_KEY, nextUser)
    if (hasStorage()) window.localStorage.setItem(AUTH_TOKEN_KEY, token)
    setShowAuth(false)
    await pullCloudData(token)
    await loadFriends(token)
  }, [loadFriends, pullCloudData])

  const handleRegister = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) throw new Error('昵称、邮箱和密码都要填。')
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
    const nextUser = data.user as AppUser
    const token = String(data.token || '')
    if (!token || !nextUser) throw new Error('注册失败，请稍后再试。')
    setAuthToken(token)
    setUser(nextUser)
    setIsLoggedIn(true)
    writeJson(AUTH_USER_KEY, nextUser)
    if (hasStorage()) window.localStorage.setItem(AUTH_TOKEN_KEY, token)
    setShowAuth(false)
    await loadFriends(token)
  }, [loadFriends])

  const handleLogout = useCallback(() => {
    const token = authToken
    setAuthToken('')
    setUser(undefined)
    setIsLoggedIn(false)
    setFriends([])
    if (hasStorage()) {
      window.localStorage.removeItem(AUTH_TOKEN_KEY)
      window.localStorage.removeItem(AUTH_USER_KEY)
    }
    if (token) {
      apiRequest('/api/auth/logout', { method: 'POST' }, token).catch(() => {})
    }
  }, [authToken])

  const getPageTitle = () => {
    if (showExam) return { title: '句子复习', eyebrow: 'Review', icon: Sparkles }
    if (showFriends) return { title: '好友', eyebrow: 'Community', icon: Users }
    switch (activeTab) {
      case 'sentences': return { title: '句读', eyebrow: 'Sentence Reader', icon: BookText }
      case 'scenes': return { title: '单词/场景', eyebrow: 'Words & Scenes', icon: Layers }
      case 'teacher': return { title: '智语导师', eyebrow: 'AI Tutor', icon: MessageCircle }
    }
  }

  const pageInfo = getPageTitle()
  const PageIcon = pageInfo.icon

  return (
    <div className="min-h-screen bg-[#030308] relative overflow-hidden isolate">
      <StarryBackground />
      <div className="fixed inset-0 z-[1] pointer-events-none bg-[#030308]/45" aria-hidden="true" />

      <main className={cn(
        "relative z-10 w-full max-w-[520px] mx-auto",
        activeTab === 'teacher' && !showExam && !showFriends
          ? "h-dvh flex flex-col"
          : "min-h-dvh pb-24"
      )}>
        <header className={cn(
          "sticky top-0 z-40 px-5 py-4 safe-area-pt",
          activeTab === 'teacher' && !showExam && !showFriends && "relative flex-shrink-0"
        )}>
          <div className="absolute inset-0 glass-nav" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-2xl glass-button flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.70_0.15_280_/_0.15)] to-transparent" />
                <PageIcon className="w-5 h-5 text-[oklch(0.80_0.15_280)] relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.2em] uppercase mb-0.5">
                  {pageInfo.eyebrow}
                </p>
                <h1 id="pageTitle" className="text-xl font-semibold text-white/95 tracking-wide">
                  {pageInfo.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="accountButton"
                onClick={() => setShowAuth(true)}
                className="group relative w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/50 hover:text-white/90 transition-premium overflow-hidden"
                aria-label="账号"
              >
                <div className="inner-glow" />
                <User className="w-[18px] h-[18px] relative z-10" />
              </button>
              <button
                id="friendsNav"
                onClick={() => {
                  setShowFriends(!showFriends)
                  setShowExam(false)
                  if (!showFriends) loadFriends()
                }}
                className={cn(
                  "group relative w-10 h-10 rounded-2xl flex items-center justify-center transition-premium overflow-hidden",
                  showFriends ? "glass-button-primary" : "glass-button text-white/50 hover:text-white/90"
                )}
                aria-label="好友"
              >
                <div className="inner-glow" />
                <Users className="w-[18px] h-[18px] relative z-10" />
              </button>
            </div>
          </div>
        </header>

        {showExam ? (
          <ExamPage
            sentences={sentences}
            onBack={() => setShowExam(false)}
            onComplete={() => setShowExam(false)}
          />
        ) : showFriends ? (
          <FriendsPage friends={friends} onRefresh={() => loadFriends()} />
        ) : activeTab === 'sentences' ? (
          <section id="sentencesPage" className="px-5 py-5 flex-1 animate-fade-in">
            <div className="relative glass-card rounded-3xl p-5 mb-5 overflow-hidden">
              <div className="inner-glow rounded-3xl" />
              <div className="top-highlight" />

              <div className="relative glass-tabs flex gap-1 mb-5">
                {[
                  { id: 'learning' as const, label: '学习中' },
                  { id: 'learned' as const, label: '已学会' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={`${tab.id}Tab`}
                    onClick={() => setSentenceTab(tab.id)}
                    role="tab"
                    aria-selected={sentenceTab === tab.id}
                    className={cn(
                      "flex-1 glass-tab relative overflow-hidden",
                      sentenceTab === tab.id && "glass-tab-active"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center justify-between">
                <p id="sentenceCount" className="text-sm text-white/45 font-medium">
                  {filteredSentences.length} 句
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/35 font-medium">语速</span>
                  <input
                    id="speedSlider"
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={speechRate}
                    onChange={(event) => setSpeechRate(parseFloat(event.target.value))}
                    className="w-20 h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-[oklch(0.70_0.15_280)]
                      [&::-webkit-slider-thumb]:shadow-[0_0_10px_oklch(0.70_0.15_280_/_0.5)]
                      [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-white/20"
                  />
                  <span id="speedValue" className="text-xs font-semibold text-white/60 w-10 tabular-nums">
                    {speechRate.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            {sentenceTab === 'learning' && filteredSentences.length > 0 && (
              <button
                id="reviewButton"
                onClick={() => setShowExam(true)}
                className="w-full glass-card-accent flex items-center justify-between p-5 mb-5 rounded-3xl group transition-premium overflow-hidden"
              >
                <div className="inner-glow rounded-3xl" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[oklch(0.70_0.15_280_/_0.2)] border border-[oklch(0.70_0.15_280_/_0.3)] flex items-center justify-center group-hover:scale-110 transition-premium">
                    <BookOpen className="w-5 h-5 text-[oklch(0.80_0.15_280)]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold uppercase tracking-[0.15em] mb-0.5">Review</p>
                    <p className="text-[15px] font-semibold text-white/95">开始默写复习</p>
                  </div>
                </div>
                <span className="relative text-xs text-white/45 font-medium">
                  {filteredSentences.filter((sentence) => sentence.note).length} 句可复习
                </span>
              </button>
            )}

            <div className="relative glass-card rounded-3xl mb-5 overflow-hidden">
              <div className="inner-glow rounded-3xl" />
              <textarea
                id="sentenceInput"
                value={newSentence}
                onChange={(event) => setNewSentence(event.target.value)}
                placeholder="输入或粘贴要添加的英文句子..."
                className="relative w-full min-h-[110px] bg-transparent border-0 outline-none p-5 text-[15px] text-white/90 placeholder:text-[oklch(0.70_0.15_280_/_0.7)] resize-none leading-relaxed"
              />
              <div className="relative flex items-center justify-end border-t border-white/[0.06] p-4">
                <button
                  id="addButton"
                  onClick={() => handleAddSentence()}
                  disabled={!newSentence.trim()}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-premium",
                    newSentence.trim() ? "glass-button-primary" : "glass-button text-white/35"
                  )}
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
            </div>

            <div id="sentenceList" className="space-y-4">
              {filteredSentences.length > 0 ? (
                filteredSentences.map((sentence, index) => (
                  <div
                    key={sentence.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SentenceCard
                      text={sentence.text}
                      note={sentence.note}
                      learned={sentence.learned}
                      aiExplanation={sentence.aiExplanation}
                      speechRate={speechRate}
                      onDelete={() => handleDeleteSentence(sentence.id)}
                      onUpdateNote={(note) => handleUpdateSentenceNote(sentence.id, note)}
                      onToggleLearned={() => handleToggleLearned(sentence.id)}
                      onAiExplain={() => handleAiExplain(sentence.id)}
                    />
                  </div>
                ))
              ) : (
                <div id="emptyState" className="text-center py-20 animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl glass-card mx-auto mb-6 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-white/90 mb-2">
                    {sentenceTab === 'learning' ? '添加句子后就能直接听' : '还没有学会的句子'}
                  </h2>
                  <p className="text-sm text-white/40 leading-relaxed max-w-[260px] mx-auto">
                    {sentenceTab === 'learning'
                      ? '整句点右侧按钮，单词直接点英文。'
                      : '学会的句子会显示在这里。'}
                  </p>
                </div>
              )}
            </div>
          </section>
        ) : activeTab === 'scenes' ? (
          <ScenesPage
            vocabGroups={vocabGroups}
            vocabItems={vocabItems}
            sceneGroups={sceneGroups}
            scenes={scenes}
            onAddSentence={handleAddSentence}
          />
        ) : (
          <TeacherPage
            messages={messages}
            activeMode={teacherMode}
            isSending={isSending}
            memoryProfile={memoryProfile}
            onSendMessage={sendTeacherMessage}
            onQuickAction={handleQuickAction}
            onAddSentence={handleAddSentence}
            onToggleMemory={handleToggleMemory}
            onClearMemory={handleClearMemory}
          />
        )}
      </main>

      {!showExam && !showFriends && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setShowExam(false)
            setShowFriends(false)
          }}
        />
      )}

      <AuthSheet
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />

      <UpdateSheet
        isOpen={showUpdate}
        versionName={updateInfo?.versionName || CURRENT_VERSION_NAME}
        notes={updateInfo?.notes || '新版本已经准备好。'}
        onLater={() => {
          if (updateInfo && hasStorage()) window.localStorage.setItem(UPDATE_DISMISS_KEY, String(updateInfo.versionCode))
          setShowUpdate(false)
        }}
        onUpdate={() => {
          if (updateInfo?.apkUrl) window.open(updateInfo.apkUrl, '_blank', 'noopener,noreferrer')
          setShowUpdate(false)
        }}
      />
    </div>
  )
}
