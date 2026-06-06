'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus, User, Users, BookOpen, Sparkles, BookText, MessageCircle, Search, X, WandSparkles, Volume2, Trash2, Languages, MessagesSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'
import { StarryBackground } from '@/components/starry-background'
import { BottomNav } from '@/components/bottom-nav'
import { SentenceCard } from '@/components/sentence-card'
import { ScenesPage, type SavedDialogueRecord } from '@/components/scenes-page'
import { TeacherPage, type TeacherQuickMode } from '@/components/teacher-page'
import { LanguageAssistantPage, type AssistantMode, type LanguageAssistantResult } from '@/components/language-assistant-page'
import { ExamPage, type ExamSourceItem } from '@/components/exam-page'
import { FriendsPage } from '@/components/friends-page'
import { AuthSheet, UpdateSheet } from '@/components/auth-sheet'
import {
  getTeacherScenarioLabel,
  normalizeTeacherDifficulty,
  normalizeTeacherScenarioId,
  type TeacherDifficulty,
  type TeacherScenarioId
} from '@/lib/teacher-scenarios'
import {
  savedSentences as initialSentences,
  type SavedSentence,
  type TeacherMessage,
  type TutorMemoryProfile
} from '@/lib/sample-data'
import { ADD_WORD_EXAMPLE_EVENT, getVocabBook, removeVocabBookItem, VOCAB_BOOK_EVENT, type VocabBookItem } from '@/lib/vocab-book'

type ActiveTab = 'sentences' | 'scenes' | 'assistant' | 'teacher'
type HomeView = 'learning' | 'learned' | 'vocab'
type AddMode = 'manual' | 'ai'

interface LanguageAssistantState {
  mode: AssistantMode
  inputValue: string
  results: LanguageAssistantResult[]
}

interface SelectDialogueState {
  sceneId: TeacherScenarioId
  difficulty: TeacherDifficulty
  stage: string
  replyOptions: string[]
  replyOptionMeanings: string[]
}

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

const CURRENT_VERSION_CODE = 94
const CURRENT_VERSION_NAME = 'free94'
const API_BASE = 'https://jj-teacher.onrender.com'
const TARGET_LANGUAGE = 'english'

const SENTENCES_KEY = 'sentence-reader-sentences'
const TEACHER_CHAT_KEY = 'sentence-reader-ai-chat'
const SPEED_KEY = 'sentence-reader-speed'
const VIEW_KEY = 'sentence-reader-view'
const APP_PAGE_KEY = 'sentence-reader-page'
const AUTH_TOKEN_KEY = 'sentence-reader-auth-token'
const AUTH_USER_KEY = 'sentence-reader-auth-user'
const AUTH_AVATAR_KEY = 'sentence-reader-auth-avatar'
const UPDATE_DISMISS_KEY = 'sentence-reader-dismissed-update'
const DAILY_CHAT_REPEAT_KEY = 'sentence-reader-daily-chat-last'
const MEMORY_KEY = 'sentence-reader-memory-profile'
const LANGUAGE_ASSISTANT_STATE_KEY = 'sentence-reader-language-assistant-state'
const SELECT_DIALOGUE_STATE_KEY = 'sentence-reader-select-dialogue-state'
const SAVED_SELECT_DIALOGUES_KEY = 'sentence-reader-select-dialogue-records'
const CURRENT_SELECT_DIALOGUE_RECORD_ID_KEY = 'sentence-reader-current-select-dialogue-record-id'
const SELECT_DIALOGUE_START = 'START_SELECT_DIALOGUE'
const TEACHER_TRANSLATION_CACHE_KEY = 'sentence-reader-teacher-translation-cache'
const ASSISTANT_MODE_IDS: AssistantMode[] = ['translate', 'localize', 'hair', 'reply', 'explain', 'pronunciation']
const DEFAULT_LANGUAGE_ASSISTANT_STATE: LanguageAssistantState = {
  mode: 'translate',
  inputValue: '',
  results: []
}
const DEFAULT_SELECT_DIALOGUE_STATE: SelectDialogueState = {
  sceneId: 'daily-life',
  difficulty: 'medium',
  stage: '',
  replyOptions: [],
  replyOptionMeanings: []
}

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

const CATEGORY_ALL = '全部'
const BASE_CATEGORIES = ['理发', '客户沟通', '日常', '健身', '约会', '其他'] as const

function normalizeCategoryName(category?: string) {
  const clean = String(category || '').replace(/\s+/g, '').trim()
  if (!clean) return '其他'
  const lower = clean.toLowerCase()
  if (/理发|发型|剪发|染发|烫发|hair|salon|barber/.test(lower)) return '理发'
  if (/客户|客人|预约|沟通|client|customer|appointment|consultation/.test(lower)) return '客户沟通'
  if (/健身|训练|肌肉|有氧|gym|workout|fitness/.test(lower)) return '健身'
  if (/约会|情侣|暧昧|dating|date|crush|flirt|relationship/.test(lower)) return '约会'
  if (/日常|聊天|朋友|生活|daily|casual|friend/.test(lower)) return '日常'
  if (BASE_CATEGORIES.includes(clean as typeof BASE_CATEGORIES[number])) return clean
  return /^[\u4e00-\u9fff]{2,6}$/.test(clean) ? clean : '其他'
}

function inferSentenceCategory(text = '', note = '') {
  const value = `${text} ${note}`.toLowerCase()
  if (/(hair|salon|barber|trim|fade|taper|bangs|layer|perm|color|理发|发型|剪发|染发|烫发)/.test(value)) return '理发'
  if (/(client|customer|appointment|consultation|book|schedule|reschedule|deposit|客户|客人|预约|咨询|沟通)/.test(value)) return '客户沟通'
  if (/(gym|workout|fitness|protein|muscle|cardio|sore|rep|set|健身|训练|肌肉|有氧)/.test(value)) return '健身'
  if (/(date|dating|crush|flirt|relationship|cute|miss you|约会|情侣|暧昧|喜欢你|想你)/.test(value)) return '约会'
  if (/(coffee|food|weekend|friend|hang out|plan|daily|casual|吃饭|周末|朋友|日常|聊天|生活)/.test(value)) return '日常'
  return '其他'
}

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
    category: normalizeCategoryName(String(item.category || '') || inferSentenceCategory(text, String(item.note || ''))),
    learned: Boolean(item.learned),
    learnedAt: typeof item.learnedAt === 'number' ? item.learnedAt : null,
    aiExplanation: String(item.aiExplanation || '')
  }
}

function normalizeMessage(item: Partial<TeacherMessage> & Record<string, unknown>, index = 0): TeacherMessage | null {
  const role = item.role === 'assistant' ? 'assistant' : item.role === 'user' ? 'user' : null
  const text = String(item.text || '').trim()
  if (!role || !text) return null
  const mode = item.mode === 'topic' || item.mode === 'daily-sentences' || item.mode === 'free-chat' || item.mode === 'chat' || item.mode === 'select-dialogue'
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

function mergeSavedDialogueRecords(local: SavedDialogueRecord[], remote: unknown) {
  const remoteRecords = normalizeSavedDialogueRecords(remote)
  if (!remoteRecords.length) return local

  const byId = new Map(local.map((record) => [record.id, record]))
  for (const record of remoteRecords) {
    const existing = byId.get(record.id)
    if (!existing || record.updatedAt > existing.updatedAt || record.messageCount > existing.messageCount) {
      byId.set(record.id, record)
    }
  }

  return Array.from(byId.values()).sort((a, b) => b.updatedAt - a.updatedAt)
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

function normalizeDisplayReply(reply: string) {
  return reply
    .replace(/\r\n/g, '\n')
    .replace(/\s*(英文|English)\s*[:：]\s*/gi, '\n\n英文：\n')
    .replace(/\s*(中文意思|中文|Chinese meaning|Meaning)\s*[:：]\s*/gi, '\n中文意思：\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function compactReply(reply: string, mode: string) {
  const clean = mode === 'topic' ? cleanTopicReply(reply) : reply
  const displayClean = mode === 'topic' || mode === 'freestyle' ? clean : normalizeDisplayReply(clean)
  return displayClean
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
  if (mode === 'topic' || mode === 'hair' || mode === 'client') return 'topic'
  if (mode === 'free') return 'freestyle'
  if (mode === 'select') return 'select-dialogue'
  return 'chat'
}

function messageModeFromServerMode(mode: string): TeacherMessage['mode'] {
  if (mode === 'topic') return 'topic'
  if (mode === 'freestyle') return 'free-chat'
  if (mode === 'select-dialogue') return 'select-dialogue'
  return 'chat'
}

function normalizeSelectableReplyOption(value: unknown) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(?:简单版|自然版|进阶版|简单|中级|高级|easy|simple|natural|intermediate|advanced)\s*[:：-]\s*/iu, '')
    .trim()
}

function comparableSentence(value: string) {
  return value
    .toLowerCase()
    .replace(/^(?:user|learner|student|you)\s*[:：-]\s*/i, '')
    .replace(/[“”"']/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripSelectedReplyEcho(aiMessage: string, selectedReply = '') {
  const cleanMessage = aiMessage.trim()
  const cleanReply = selectedReply.trim()
  if (!cleanMessage || !cleanReply) return cleanMessage

  const replyKey = comparableSentence(cleanReply)
  if (!replyKey) return cleanMessage

  const parts = cleanMessage
    .split(/\s*(?:【NEXT_MESSAGE】|\n{1,}|\r{1,})\s*/u)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length > 1 && comparableSentence(parts[0]) === replyKey) {
    return parts.slice(1).join('\n').trim()
  }

  const firstSentenceMatch = cleanMessage.match(/^(.+?[.!?])(?:\s+|$)(.*)$/s)
  if (firstSentenceMatch && comparableSentence(firstSentenceMatch[1]) === replyKey) {
    return firstSentenceMatch[2].trim()
  }

  return cleanMessage
}

function normalizeSelectDialogueTurn(data: Record<string, unknown>, selectedReply = '') {
  const aiMessage = stripSelectedReplyEcho(String(data.aiMessage || data.reply || '').trim(), selectedReply)
  const stage = String(data.stage || data.currentStage || data.nextStage || '').replace(/\s+/g, ' ').trim().slice(0, 80)
  const rawOptions = Array.isArray(data.replyOptions) ? data.replyOptions : []
  const rawMeanings = Array.isArray(data.replyOptionMeanings) ? data.replyOptionMeanings : []
  const seen = new Set<string>()
  const replyOptions: string[] = []
  const replyOptionMeanings: string[] = []

  rawOptions.forEach((item, index) => {
    const option = normalizeSelectableReplyOption(item)
    const key = option.toLowerCase()
    if (!option || seen.has(key) || /[\u4e00-\u9fff]/.test(option)) return
    seen.add(key)
    replyOptions.push(option.slice(0, 150))
    replyOptionMeanings.push(String(rawMeanings[index] || '').trim().slice(0, 180))
  })

  if (!aiMessage || replyOptions.length < 2) {
    throw new Error('生成失败，请重试')
  }

  return {
    aiMessage: aiMessage.slice(0, 500),
    stage,
    replyOptions: replyOptions.slice(0, 3),
    replyOptionMeanings: replyOptionMeanings.slice(0, 3)
  }
}

function normalizeLanguageAssistantResults(data: Record<string, unknown>): LanguageAssistantResult[] {
  const rawResults = Array.isArray(data.results) ? data.results : []
  const results = rawResults
    .map((item, index) => {
      const source = item && typeof item === 'object' ? item as Record<string, unknown> : {}
      const alternatives = Array.isArray(source.alternatives)
        ? source.alternatives
            .map((alternative) => {
              const alt = alternative && typeof alternative === 'object' ? alternative as Record<string, unknown> : {}
              return {
                english: String(alt.english || '').replace(/\s+/g, ' ').trim().slice(0, 240),
                chinese: String(alt.chinese || '').replace(/\s+/g, ' ').trim().slice(0, 240)
              }
            })
            .filter((alternative) => alternative.english)
            .slice(0, 4)
        : []

      return {
        id: String(source.id || makeId(`assistant-result-${index}`)),
        title: String(source.title || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        english: String(source.english || '').replace(/\s+/g, ' ').trim().slice(0, 500),
        chinese: String(source.chinese || '').replace(/\s+/g, ' ').trim().slice(0, 500),
        phonetic: String(source.phonetic || '').replace(/^\/|\/$/g, '').trim().slice(0, 100),
        scene: String(source.scene || '').replace(/\s+/g, ' ').trim().slice(0, 300),
        keyPoints: Array.isArray(source.keyPoints)
          ? source.keyPoints.map((point) => String(point || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 8)
          : [],
        alternatives
      }
    })
    .filter((item) => item.english || item.chinese || item.scene || item.keyPoints?.length || item.alternatives?.length)

  return results.slice(0, 5)
}

function normalizeAssistantModeValue(value: unknown): AssistantMode {
  return ASSISTANT_MODE_IDS.includes(value as AssistantMode) ? value as AssistantMode : 'translate'
}

function normalizeLanguageAssistantState(value: unknown): LanguageAssistantState {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const rawResults = Array.isArray(source.results) ? source.results : []
  return {
    mode: normalizeAssistantModeValue(source.mode),
    inputValue: String(source.inputValue || '').slice(0, 4000),
    results: normalizeLanguageAssistantResults({ results: rawResults })
  }
}

function normalizeSelectDialogueState(value: unknown): SelectDialogueState {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const replyOptions = Array.isArray(source.replyOptions)
    ? source.replyOptions
        .map((item) => String(item || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, 3)
    : []
  const replyOptionMeanings = Array.isArray(source.replyOptionMeanings)
    ? source.replyOptionMeanings
        .map((item) => String(item || '').replace(/\s+/g, ' ').trim())
        .slice(0, 3)
    : []

  return {
    sceneId: normalizeTeacherScenarioId(source.sceneId),
    difficulty: normalizeTeacherDifficulty(source.difficulty),
    stage: String(source.stage || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    replyOptions,
    replyOptionMeanings
  }
}

function normalizeSavedDialogueMessage(value: unknown, index = 0): SavedDialogueRecord['messages'][number] | null {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const english = String(source.english || source.text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 800)
  if (!english) return null

  const roleValue = String(source.role || '').trim()
  const role = roleValue === 'user' ? 'user' : 'ai'

  return {
    id: String(source.id || makeId(`saved-dialogue-message-${index}`)),
    role,
    english,
    chinese: String(source.chinese || source.meaning || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300),
    createdAt: typeof source.createdAt === 'number'
      ? source.createdAt
      : typeof source.timestamp === 'number'
        ? source.timestamp
        : Date.now() + index
  }
}

function normalizeSavedDialogueRecord(value: unknown, index = 0): SavedDialogueRecord | null {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const messages = Array.isArray(source.messages)
    ? source.messages
        .map((message, messageIndex) => normalizeSavedDialogueMessage(message, messageIndex))
        .filter(Boolean) as SavedDialogueRecord['messages']
    : []

  if (!messages.length) return null

  const scenario = normalizeTeacherScenarioId(source.scenario)
  const difficulty = normalizeTeacherDifficulty(source.difficulty)
  const replyOptions = Array.isArray(source.replyOptions)
    ? source.replyOptions
        .map((item) => {
          if (typeof item === 'string') {
            return { english: item.replace(/\s+/g, ' ').trim().slice(0, 180), chinese: '' }
          }
          const option = item && typeof item === 'object' ? item as Record<string, unknown> : {}
          return {
            english: String(option.english || option.text || '')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 180),
            chinese: String(option.chinese || option.meaning || '')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 180)
          }
        })
        .filter((option) => option.english)
        .slice(0, 3)
    : []
  const createdAt = typeof source.createdAt === 'number' ? source.createdAt : messages[0]?.createdAt || Date.now() + index
  const updatedAt = typeof source.updatedAt === 'number' ? source.updatedAt : messages[messages.length - 1]?.createdAt || createdAt
  const memory = source.memory && typeof source.memory === 'object' ? normalizeMemoryProfile(source.memory) : null

  return {
    id: String(source.id || makeId(`saved-dialogue-${index}`)),
    title: String(source.title || getTeacherScenarioLabel(scenario)),
    scenario,
    difficulty,
    messages,
    replyOptions,
    conversationStage: String(source.conversationStage || source.stage || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80),
    memory,
    createdAt,
    updatedAt,
    lastMessagePreview: String(source.lastMessagePreview || messages[messages.length - 1]?.english || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160),
    messageCount: messages.length
  }
}

function normalizeSavedDialogueRecords(value: unknown): SavedDialogueRecord[] {
  if (!Array.isArray(value)) return []
  return value
    .map((record, index) => normalizeSavedDialogueRecord(record, index))
    .filter((record): record is SavedDialogueRecord => Boolean(record))
    .sort((a, b) => b.updatedAt - a.updatedAt) as SavedDialogueRecord[]
}

function buildSavedDialogueRecord({
  id,
  existing,
  sourceMessages,
  sceneId,
  difficulty,
  stage,
  replyOptions,
  replyOptionMeanings,
  memoryProfile,
  messageMeanings = {}
}: {
  id: string
  existing?: SavedDialogueRecord
  sourceMessages: TeacherMessage[]
  sceneId: TeacherScenarioId
  difficulty: TeacherDifficulty
  stage: string
  replyOptions: string[]
  replyOptionMeanings: string[]
  memoryProfile: TutorMemoryProfile
  messageMeanings?: Record<string, string>
}): SavedDialogueRecord | null {
  const existingMeanings = new Map(existing?.messages.map((message) => [message.id, message.chinese]) || [])
  const messages = sourceMessages
    .filter((message) => !message.pending && message.mode === 'select-dialogue' && message.text.trim())
    .map((message) => ({
      id: message.id,
      role: message.role === 'assistant' ? 'ai' as const : 'user' as const,
      english: message.text.replace(/\s+/g, ' ').trim().slice(0, 800),
      chinese: String(messageMeanings[message.id] || message.translation?.note || existingMeanings.get(message.id) || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 300),
      createdAt: message.timestamp || Date.now()
    }))
    .filter((message) => message.english)

  if (!messages.length) return null

  const updatedAt = Date.now()
  const cleanOptions = replyOptions
    .map((option, index) => ({
      english: option.replace(/\s+/g, ' ').trim().slice(0, 180),
      chinese: String(replyOptionMeanings[index] || '').replace(/\s+/g, ' ').trim().slice(0, 180)
    }))
    .filter((option) => option.english)
    .slice(0, 3)

  return {
    id,
    title: getTeacherScenarioLabel(sceneId),
    scenario: sceneId,
    difficulty,
    messages,
    replyOptions: cleanOptions,
    conversationStage: stage.replace(/\s+/g, ' ').trim().slice(0, 80),
    memory: normalizeMemoryProfile(memoryProfile),
    createdAt: existing?.createdAt || messages[0]?.createdAt || updatedAt,
    updatedAt,
    lastMessagePreview: messages[messages.length - 1]?.english.replace(/\s+/g, ' ').trim().slice(0, 160) || '',
    messageCount: messages.length
  }
}

function buildCloudPayload(
  sentences: SavedSentence[],
  messages: TeacherMessage[],
  memoryProfile: TutorMemoryProfile,
  savedDialogues: SavedDialogueRecord[]
) {
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
        savedDialogues,
        savedAt: Date.now()
      }
    },
    sentences,
    teacherMessages: cleanMessages,
    savedDialogues
  }
}

export default function ZhiyuApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sentences')
  const [homeView, setHomeView] = useState<HomeView>('learning')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(CATEGORY_ALL)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [addMode, setAddMode] = useState<AddMode>('manual')
  const [manualEnglish, setManualEnglish] = useState('')
  const [manualChinese, setManualChinese] = useState('')
  const [aiChinese, setAiChinese] = useState('')
  const [generatedSentence, setGeneratedSentence] = useState<{ english: string; chinese: string; category: string } | null>(null)
  const [isGeneratingSentence, setIsGeneratingSentence] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [showExam, setShowExam] = useState(false)
  const [examItems, setExamItems] = useState<ExamSourceItem[]>([])
  const [examTitle, setExamTitle] = useState('关键词填空考试')
  const [showFriends, setShowFriends] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const [sentences, setSentences] = useState<SavedSentence[]>(initialSentences)
  const [vocabBook, setVocabBook] = useState<VocabBookItem[]>([])
  const [messages, setMessages] = useState<TeacherMessage[]>([])
  const [memoryProfile, setMemoryProfile] = useState<TutorMemoryProfile>(() => defaultMemoryProfile())
  const [speechRate, setSpeechRate] = useState(1)
  const [teacherMode, setTeacherMode] = useState<TeacherQuickMode | null>(null)
  const [languageAssistantState, setLanguageAssistantState] = useState<LanguageAssistantState>(DEFAULT_LANGUAGE_ASSISTANT_STATE)
  const [isSending, setIsSending] = useState(false)
  const [selectReplyOptions, setSelectReplyOptions] = useState<string[]>([])
  const [selectReplyMeanings, setSelectReplyMeanings] = useState<string[]>([])
  const [selectReplyError, setSelectReplyError] = useState('')
  const [isSelectReplyLoading, setIsSelectReplyLoading] = useState(false)
  const [selectSceneId, setSelectSceneId] = useState<TeacherScenarioId>(DEFAULT_SELECT_DIALOGUE_STATE.sceneId)
  const [selectDifficulty, setSelectDifficulty] = useState<TeacherDifficulty>(DEFAULT_SELECT_DIALOGUE_STATE.difficulty)
  const [selectDialogueStage, setSelectDialogueStage] = useState(DEFAULT_SELECT_DIALOGUE_STATE.stage)
  const [savedDialogues, setSavedDialogues] = useState<SavedDialogueRecord[]>([])
  const [currentSelectRecordId, setCurrentSelectRecordId] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [user, setUser] = useState<AppUser | undefined>()
  const [friends, setFriends] = useState<FriendItem[]>([])

  const messagesRef = useRef<TeacherMessage[]>(messages)
  const memoryProfileRef = useRef<TutorMemoryProfile>(memoryProfile)
  const currentSelectRecordIdRef = useRef(currentSelectRecordId)
  const selectDialogueRequestLockRef = useRef(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectRetryRef = useRef<{
    message: string
    appendUser: boolean
    sceneId: TeacherScenarioId
    difficulty: TeacherDifficulty
    stage: string
  } | null>(null)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    memoryProfileRef.current = memoryProfile
  }, [memoryProfile])

  useEffect(() => {
    currentSelectRecordIdRef.current = currentSelectRecordId
  }, [currentSelectRecordId])

  useEffect(() => {
    const storedSentences = readFirstJson<SavedSentence[]>([languageKey(SENTENCES_KEY), SENTENCES_KEY], [])
      .map((item, index) => normalizeSentence(item as Partial<SavedSentence> & Record<string, unknown>, index))
      .filter(Boolean) as SavedSentence[]
    const storedMessages = readFirstJson<TeacherMessage[]>([languageKey(TEACHER_CHAT_KEY), TEACHER_CHAT_KEY], [])
      .map((item, index) => normalizeMessage(item as Partial<TeacherMessage> & Record<string, unknown>, index))
      .filter(Boolean) as TeacherMessage[]
    const storedMemory = normalizeMemoryProfile(readJson<unknown>(MEMORY_KEY, defaultMemoryProfile()))
    const storedAssistantState = normalizeLanguageAssistantState(readJson<unknown>(LANGUAGE_ASSISTANT_STATE_KEY, DEFAULT_LANGUAGE_ASSISTANT_STATE))
    const storedSelectState = normalizeSelectDialogueState(readJson<unknown>(SELECT_DIALOGUE_STATE_KEY, DEFAULT_SELECT_DIALOGUE_STATE))
    const storedSavedDialogues = normalizeSavedDialogueRecords(readFirstJson<unknown[]>([
      languageKey(SAVED_SELECT_DIALOGUES_KEY),
      SAVED_SELECT_DIALOGUES_KEY
    ], []))
    const storedCurrentRecordId = hasStorage() ? window.localStorage.getItem(CURRENT_SELECT_DIALOGUE_RECORD_ID_KEY) || '' : ''
    const storedUser = readJson<AppUser | null>(AUTH_USER_KEY, null)
    const storedToken = hasStorage() ? window.localStorage.getItem(AUTH_TOKEN_KEY) || '' : ''

    if (storedSentences.length) setSentences(storedSentences)
    if (storedMessages.length) setMessages(storedMessages)
    setVocabBook(getVocabBook())
    setMemoryProfile(storedMemory)
    setLanguageAssistantState(storedAssistantState)
    setSavedDialogues(storedSavedDialogues)
    if (storedCurrentRecordId && storedSavedDialogues.some((record) => record.id === storedCurrentRecordId)) {
      setCurrentSelectRecordId(storedCurrentRecordId)
    }
    setSelectSceneId(storedSelectState.sceneId)
    setSelectDifficulty(storedSelectState.difficulty)
    setSelectDialogueStage(storedSelectState.stage)
    setSelectReplyOptions(storedSelectState.replyOptions)
    setSelectReplyMeanings(storedSelectState.replyOptionMeanings)
    if (storedSelectState.replyOptions.length || storedMessages.some((message) => message.mode === 'select-dialogue')) {
      setTeacherMode('select')
    }
    setSpeechRate(Number(hasStorage() ? window.localStorage.getItem(SPEED_KEY) || '1' : '1') || 1)
    const storedView = hasStorage() ? window.localStorage.getItem(VIEW_KEY) : ''
    setHomeView(storedView === 'learned' || storedView === 'vocab' ? storedView : 'learning')
    const storedPage = hasStorage() ? window.localStorage.getItem(APP_PAGE_KEY) : ''
    if (storedPage === 'teacher' || storedPage === 'assistant' || storedPage === 'scenes' || storedPage === 'sentences') setActiveTab(storedPage)
    if (storedToken && storedUser) {
      setAuthToken(storedToken)
      setUser(storedUser)
      setIsLoggedIn(true)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const handleVocabBookChange = () => setVocabBook(getVocabBook())
    window.addEventListener(VOCAB_BOOK_EVENT, handleVocabBookChange)
    return () => window.removeEventListener(VOCAB_BOOK_EVENT, handleVocabBookChange)
  }, [hydrated])

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
    if (!hydrated) return
    writeJson(LANGUAGE_ASSISTANT_STATE_KEY, languageAssistantState)
  }, [hydrated, languageAssistantState])

  useEffect(() => {
    if (!hydrated) return
    writeJson(SAVED_SELECT_DIALOGUES_KEY, savedDialogues)
    writeJson(languageKey(SAVED_SELECT_DIALOGUES_KEY), savedDialogues)
  }, [hydrated, savedDialogues])

  useEffect(() => {
    if (!hydrated || !hasStorage()) return
    if (currentSelectRecordId) {
      window.localStorage.setItem(CURRENT_SELECT_DIALOGUE_RECORD_ID_KEY, currentSelectRecordId)
    } else {
      window.localStorage.removeItem(CURRENT_SELECT_DIALOGUE_RECORD_ID_KEY)
    }
  }, [hydrated, currentSelectRecordId])

  useEffect(() => {
    if (!hydrated) return
    writeJson(SELECT_DIALOGUE_STATE_KEY, {
      sceneId: selectSceneId,
      difficulty: selectDifficulty,
      stage: selectDialogueStage,
      replyOptions: selectReplyOptions,
      replyOptionMeanings: selectReplyMeanings
    })
  }, [hydrated, selectSceneId, selectDifficulty, selectDialogueStage, selectReplyOptions, selectReplyMeanings])

  useEffect(() => {
    if (!hydrated || !hasStorage()) return
    window.localStorage.setItem(SPEED_KEY, String(speechRate))
  }, [hydrated, speechRate])

  useEffect(() => {
    if (!hydrated || !hasStorage()) return
    window.localStorage.setItem(VIEW_KEY, homeView)
  }, [hydrated, homeView])

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
      const remoteSavedDialogues = Array.isArray(remoteEnglish.savedDialogues)
        ? remoteEnglish.savedDialogues
        : Array.isArray(remoteData.savedDialogues)
          ? remoteData.savedDialogues
          : []
      if (remoteSavedDialogues.length) {
        setSavedDialogues((current) => mergeSavedDialogueRecords(current, remoteSavedDialogues))
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
        body: JSON.stringify({ data: buildCloudPayload(sentences, messages, memoryProfile, savedDialogues) })
      }, authToken).catch(() => {})
    }, 900)
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [hydrated, authToken, sentences, messages, memoryProfile, savedDialogues])

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

  const learningCount = useMemo(() => sentences.filter((sentence) => !sentence.learned).length, [sentences])
  const learnedCount = useMemo(() => sentences.filter((sentence) => sentence.learned).length, [sentences])

  const categories = useMemo(() => {
    const seen = new Set<string>()
    const list = [CATEGORY_ALL]
    seen.add(CATEGORY_ALL)
    for (const sentence of sentences) {
      if (homeView === 'learning' && sentence.learned) continue
      if (homeView === 'learned' && !sentence.learned) continue
      const category = normalizeCategoryName(sentence.category || inferSentenceCategory(sentence.text, sentence.note))
      if (!seen.has(category)) {
        seen.add(category)
        list.push(category)
      }
    }
    return list
  }, [sentences, homeView])

  useEffect(() => {
    if (!categories.includes(categoryFilter)) setCategoryFilter(CATEGORY_ALL)
  }, [categories, categoryFilter])

  const filteredSentences = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return sentences.filter((sentence) => {
      if (homeView === 'learning' && sentence.learned) return false
      if (homeView === 'learned' && !sentence.learned) return false

      const category = normalizeCategoryName(sentence.category || inferSentenceCategory(sentence.text, sentence.note))
      if (categoryFilter !== CATEGORY_ALL && category !== categoryFilter) return false
      if (!query) return true

      return [sentence.text, sentence.note, category]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [sentences, homeView, categoryFilter, searchQuery])

  const startSentenceExam = useCallback(() => {
    const items = filteredSentences
      .filter((sentence) => sentence.text.trim())
      .map((sentence): ExamSourceItem => ({
        id: sentence.id,
        text: sentence.text,
        note: sentence.note || ''
      }))

    setExamItems(items)
    setExamTitle('句读关键词填空')
    setShowFriends(false)
    setShowExam(true)
  }, [filteredSentences])

  const startSavedDialogueExam = useCallback((record: SavedDialogueRecord) => {
    const items = record.messages
      .filter((message) => message.english.trim())
      .map((message): ExamSourceItem => ({
        id: `${record.id}-${message.id}`,
        text: message.english,
        note: message.chinese || ''
      }))

    setExamItems(items)
    setExamTitle('聊天记录关键词填空')
    setShowFriends(false)
    setShowExam(true)
  }, [])

  const filteredVocabBook = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return vocabBook
    return vocabBook.filter((item) => [item.word, item.phonetic, item.meaning, item.example, item.exampleZh].join(' ').toLowerCase().includes(query))
  }, [vocabBook, searchQuery])

  const canSaveSelectDialogue = useMemo(
    () => messages.some((message) => message.mode === 'select-dialogue' && !message.pending && message.text.trim()),
    [messages]
  )

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage(message)
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 1800)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const upsertSavedSelectDialogue = useCallback(({
    id,
    sourceMessages = messagesRef.current,
    sceneId = selectSceneId,
    difficulty = selectDifficulty,
    stage = selectDialogueStage,
    replyOptions = selectReplyOptions,
    replyOptionMeanings = selectReplyMeanings,
    memory = memoryProfileRef.current,
    messageMeanings,
    notify = false
  }: {
    id?: string
    sourceMessages?: TeacherMessage[]
    sceneId?: TeacherScenarioId
    difficulty?: TeacherDifficulty
    stage?: string
    replyOptions?: string[]
    replyOptionMeanings?: string[]
    memory?: TutorMemoryProfile
    messageMeanings?: Record<string, string>
    notify?: boolean
  } = {}) => {
    const recordId = id || currentSelectRecordIdRef.current || makeId('select-record')
    const hasRecordableMessages = sourceMessages.some((message) =>
      !message.pending && message.mode === 'select-dialogue' && message.text.trim()
    )

    if (!hasRecordableMessages) {
      if (notify) showToast('当前没有可保存的点选对话')
      return ''
    }

    setSavedDialogues((current) => {
      const existing = current.find((record) => record.id === recordId)
      const record = buildSavedDialogueRecord({
        id: recordId,
        existing,
        sourceMessages,
        sceneId,
        difficulty,
        stage,
        replyOptions,
        replyOptionMeanings,
        memoryProfile: memory,
        messageMeanings
      })
      if (!record) return current
      return [record, ...current.filter((item) => item.id !== recordId)]
        .sort((a, b) => b.updatedAt - a.updatedAt)
    })

    currentSelectRecordIdRef.current = recordId
    setCurrentSelectRecordId(recordId)
    if (notify) showToast('已保存到聊天记录')
    return recordId
  }, [selectDialogueStage, selectDifficulty, selectReplyMeanings, selectReplyOptions, selectSceneId, showToast])

  const saveCurrentSelectDialogue = useCallback(() => {
    upsertSavedSelectDialogue({ notify: true })
  }, [upsertSavedSelectDialogue])

  const deleteSavedDialogue = useCallback((id: string) => {
    setSavedDialogues((current) => current.filter((record) => record.id !== id))
    if (currentSelectRecordIdRef.current === id) {
      currentSelectRecordIdRef.current = ''
      setCurrentSelectRecordId('')
    }
  }, [])

  const continueSavedDialogue = useCallback((record: SavedDialogueRecord) => {
    const restoredMessages = record.messages.map((message): TeacherMessage => ({
      id: message.id,
      role: message.role === 'user' ? 'user' : 'assistant',
      text: message.english,
      mode: 'select-dialogue',
      timestamp: message.createdAt || Date.now()
    }))

    setMessages(restoredMessages)
    messagesRef.current = restoredMessages
    setSelectSceneId(record.scenario)
    setSelectDifficulty(record.difficulty)
    setSelectDialogueStage(record.conversationStage)
    setSelectReplyOptions(record.replyOptions.map((option) => option.english))
    setSelectReplyMeanings(record.replyOptions.map((option) => option.chinese))
    if (record.memory) setMemoryProfile(normalizeMemoryProfile(record.memory))
    currentSelectRecordIdRef.current = record.id
    setCurrentSelectRecordId(record.id)
    setTeacherMode('select')
    setActiveTab('teacher')
    setShowExam(false)
    setShowFriends(false)
    setSelectReplyError('')
    setIsSelectReplyLoading(false)
    selectRetryRef.current = null
  }, [])

  const handleAddSentence = useCallback((text?: string, note?: string, category?: string) => {
    const additions = text ? [text.trim()] : []
    if (!additions.length) return

    const newItems = additions.map((sentenceText) => ({
      id: makeId('sentence'),
      text: sentenceText,
      note: note || '',
      category: normalizeCategoryName(category || inferSentenceCategory(sentenceText, note || '')),
      learned: false,
      learnedAt: null,
      aiExplanation: ''
    }))

    setSentences((current) => [...newItems, ...current])
    setHomeView('learning')
  }, [])

  useEffect(() => {
    const handleAddWordExample = (event: Event) => {
      const detail = (event as CustomEvent<{ english?: unknown; chinese?: unknown }>).detail || {}
      const english = String(detail.english || '').trim()
      const chinese = String(detail.chinese || '').trim()
      if (!english) return
      handleAddSentence(english, chinese)
    }
    window.addEventListener(ADD_WORD_EXAMPLE_EVENT, handleAddWordExample)
    return () => window.removeEventListener(ADD_WORD_EXAMPLE_EVENT, handleAddWordExample)
  }, [handleAddSentence])

  const resetAddSheet = useCallback(() => {
    setManualEnglish('')
    setManualChinese('')
    setAiChinese('')
    setGeneratedSentence(null)
    setGenerationError('')
    setIsGeneratingSentence(false)
  }, [])

  const closeAddSheet = useCallback(() => {
    setShowAddSheet(false)
    resetAddSheet()
  }, [resetAddSheet])

  const handleManualAdd = useCallback(() => {
    const english = manualEnglish.trim()
    const chinese = manualChinese.trim()
    if (!english || !chinese) return
    handleAddSentence(english, chinese)
    closeAddSheet()
  }, [closeAddSheet, handleAddSentence, manualChinese, manualEnglish])

  const handleGenerateSentence = useCallback(async () => {
    const chinese = aiChinese.trim()
    if (!chinese || isGeneratingSentence) return

    setIsGeneratingSentence(true)
    setGenerationError('')
    setGeneratedSentence(null)
    try {
      const data = await requestAiTeacher({
        mode: 'generate-sentence',
        chinese,
        message: chinese
      })
      const english = String(data.english || '').trim()
      const finalChinese = String(data.chinese || chinese).trim()
      const category = normalizeCategoryName(String(data.category || '') || inferSentenceCategory(english, finalChinese))
      if (!english) throw new Error('empty')
      setGeneratedSentence({ english, chinese: finalChinese, category })
    } catch {
      setGenerationError('生成失败，请重试。')
    } finally {
      setIsGeneratingSentence(false)
    }
  }, [aiChinese, isGeneratingSentence])

  const handleAddGeneratedSentence = useCallback(() => {
    if (!generatedSentence) return
    handleAddSentence(generatedSentence.english, generatedSentence.chinese, generatedSentence.category)
    closeAddSheet()
  }, [closeAddSheet, generatedSentence, handleAddSentence])

  const translateTeacherText = useCallback(async (text: string) => {
    const cleanText = text.replace(/\s+/g, ' ').trim()
    if (!cleanText) return ''

    const cache = readJson<Record<string, string>>(TEACHER_TRANSLATION_CACHE_KEY, {})
    if (cache[cleanText]) return cache[cleanText]

    const shouldTranslateToEnglish = /[\u4e00-\u9fff]/.test(cleanText)
    const data = await requestAiTeacher({
      mode: 'chat',
      message: shouldTranslateToEnglish
        ? `请把下面中文转换成自然、口语化、美国本地人常用的英文表达。只输出英文句子，不要解释，不要加标签：${cleanText}`
        : `请把下面英文翻译成简洁自然的中文意思。只输出中文，不要解释，不要加标签：${cleanText}`,
      messages: []
    })
    const translated = String(data.reply || data.english || data.chinese || '')
      .replace(/^\s*(英文|英语|English|中文意思|中文|Meaning|Chinese)\s*[:：]\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 180)
    const meaning = translated || (shouldTranslateToEnglish ? '英文表达待补充' : '中文意思待补充')

    writeJson(TEACHER_TRANSLATION_CACHE_KEY, {
      ...cache,
      [cleanText]: meaning
    })
    return meaning
  }, [])

  const runLanguageAssistant = useCallback(async (mode: AssistantMode, text: string) => {
    const cleanText = text.trim()
    if (!cleanText) return []

    const data = await requestAiTeacher({
      mode: 'language-assistant',
      assistantMode: mode,
      message: cleanText
    })
    return normalizeLanguageAssistantResults(data as Record<string, unknown>)
  }, [])

  const updateLanguageAssistantState = useCallback((patch: Partial<LanguageAssistantState>) => {
    setLanguageAssistantState((current) => ({ ...current, ...patch }))
  }, [])

  const resetLanguageAssistantState = useCallback(() => {
    setLanguageAssistantState((current) => ({
      ...current,
      inputValue: '',
      results: []
    }))
  }, [])

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

  const handleUpdateSentenceText = useCallback((id: string, text: string) => {
    const cleanText = text.replace(/\s+/g, ' ').trim()
    if (!cleanText) return
    setSentences((current) => current.map((sentence) =>
      sentence.id === id
        ? {
            ...sentence,
            text: cleanText,
            category: normalizeCategoryName(inferSentenceCategory(cleanText, sentence.note)),
            aiExplanation: cleanText === sentence.text ? sentence.aiExplanation : ''
          }
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

  const clearSelectDialogueState = useCallback(() => {
    setSelectReplyOptions([])
    setSelectReplyMeanings([])
    setSelectReplyError('')
    setIsSelectReplyLoading(false)
    setSelectDialogueStage('')
    selectRetryRef.current = null
  }, [])

  const startSelectDialogue = useCallback(async (
    sceneId: TeacherScenarioId = selectSceneId,
    options: { reset?: boolean } = {}
  ) => {
    if (selectDialogueRequestLockRef.current || isSending || isSelectReplyLoading) return
    selectDialogueRequestLockRef.current = true
    const nextSceneId = normalizeTeacherScenarioId(sceneId)
    const shouldReset = options.reset !== false
    const recordId = shouldReset
      ? makeId('select-record')
      : currentSelectRecordIdRef.current || makeId('select-record')

    currentSelectRecordIdRef.current = recordId
    setCurrentSelectRecordId(recordId)
    setSelectSceneId(nextSceneId)
    setTeacherMode('select')
    setActiveTab('teacher')
    setShowExam(false)
    setShowFriends(false)
    setSelectReplyError('')
    setSelectReplyOptions([])
    setSelectReplyMeanings([])
    setSelectDialogueStage('')
    setIsSelectReplyLoading(true)
    setIsSending(true)
    selectRetryRef.current = {
      message: SELECT_DIALOGUE_START,
      appendUser: false,
      sceneId: nextSceneId,
      difficulty: selectDifficulty,
      stage: ''
    }

    const pendingMessage: TeacherMessage = {
      id: makeId('select-pending'),
      role: 'assistant',
      text: '点选对话正在开始...',
      mode: 'select-dialogue',
      pending: true,
      timestamp: Date.now()
    }

    const history = shouldReset ? [] : messagesRef.current
      .filter((message) => !message.pending)
      .slice(-10)
      .map(({ role, text }) => ({ role, text }))

    setMessages((current) => shouldReset ? [pendingMessage] : [...current, pendingMessage])

    try {
      const data = await requestAiTeacher({
        mode: 'select-dialogue',
        message: SELECT_DIALOGUE_START,
        messages: history,
        selectScene: nextSceneId,
        selectDifficulty,
        selectStage: '',
        memoryProfile: memoryProfileRef.current
      })
      const turn = normalizeSelectDialogueTurn(data as Record<string, unknown>)
      const assistantMessage: TeacherMessage = {
        id: makeId('select-message'),
        role: 'assistant',
        text: turn.aiMessage,
        mode: 'select-dialogue',
        timestamp: Date.now()
      }
      setMessages((current) => current
        .filter((message) => message.id !== pendingMessage.id)
        .concat(assistantMessage))
      setSelectDialogueStage(turn.stage)
      setSelectReplyOptions(turn.replyOptions)
      setSelectReplyMeanings(turn.replyOptionMeanings)
      setSelectReplyError('')
    } catch {
      setMessages((current) => current.filter((message) => message.id !== pendingMessage.id))
      setSelectReplyError('生成失败，请重试')
    } finally {
      selectDialogueRequestLockRef.current = false
      setIsSending(false)
      setIsSelectReplyLoading(false)
    }
  }, [isSending, isSelectReplyLoading, selectDifficulty, selectSceneId])

  const sendSelectDialogueReply = useCallback(async (text: string, options: {
    appendUser?: boolean
    sceneId?: TeacherScenarioId
    difficulty?: TeacherDifficulty
    stage?: string
  } = {}) => {
    const cleanText = text.trim()
    if (!cleanText || selectDialogueRequestLockRef.current || isSending || isSelectReplyLoading) return
    selectDialogueRequestLockRef.current = true

    const appendUser = options.appendUser !== false
    const requestSceneId = normalizeTeacherScenarioId(options.sceneId || selectSceneId)
    const requestDifficulty = normalizeTeacherDifficulty(options.difficulty || selectDifficulty)
    const currentStage = typeof options.stage === 'string' ? options.stage : selectDialogueStage
    const recordId = currentSelectRecordIdRef.current || makeId('select-record')
    const selectedOptionIndex = selectReplyOptions.findIndex((option) => option === cleanText)
    const selectedOptionMeaning = selectedOptionIndex >= 0 ? selectReplyMeanings[selectedOptionIndex] || '' : ''
    const now = Date.now()
    const userMessage: TeacherMessage = {
      id: makeId('select-user-message'),
      role: 'user',
      text: cleanText,
      mode: 'select-dialogue',
      translation: selectedOptionMeaning ? { sentence: cleanText, note: selectedOptionMeaning } : undefined,
      timestamp: now
    }
    const pendingMessage: TeacherMessage = {
      id: makeId('select-assistant-pending'),
      role: 'assistant',
      text: 'AI 正在继续对话...',
      mode: 'select-dialogue',
      pending: true,
      timestamp: now + 1
    }
    const history = messagesRef.current
      .filter((message) => !message.pending)
      .slice(-10)
      .map(({ role, text }) => ({ role, text }))
    setSelectSceneId(requestSceneId)
    setSelectDifficulty(requestDifficulty)
    currentSelectRecordIdRef.current = recordId
    setCurrentSelectRecordId(recordId)
    setTeacherMode('select')
    setActiveTab('teacher')
    setShowExam(false)
    setShowFriends(false)
    setSelectReplyError('')
    setIsSelectReplyLoading(true)
    setIsSending(true)
    setSelectReplyOptions([])
    setSelectReplyMeanings([])
    selectRetryRef.current = {
      message: cleanText,
      appendUser: false,
      sceneId: requestSceneId,
      difficulty: requestDifficulty,
      stage: currentStage
    }
    setMessages((current) => appendUser
      ? [...current, userMessage, pendingMessage]
      : [...current, pendingMessage])

    try {
      const data = await requestAiTeacher({
        mode: 'select-dialogue',
        message: cleanText,
        messages: history,
        selectScene: requestSceneId,
        selectDifficulty: requestDifficulty,
        selectStage: currentStage,
        memoryProfile: memoryProfileRef.current
      })
      const turn = normalizeSelectDialogueTurn(data as Record<string, unknown>, cleanText)
      const assistantMessage: TeacherMessage = {
        id: makeId('select-assistant-message'),
        role: 'assistant',
        text: turn.aiMessage,
        mode: 'select-dialogue',
        timestamp: Date.now()
      }
      setMessages((current) => current
        .filter((message) => message.id !== pendingMessage.id)
        .concat(assistantMessage))
      setSelectDialogueStage(turn.stage || currentStage)
      setSelectReplyOptions(turn.replyOptions)
      setSelectReplyMeanings(turn.replyOptionMeanings)
      setSelectReplyError('')
      updateMemoryFromExchange(cleanText, turn.aiMessage, 'select-dialogue')
    } catch {
      setMessages((current) => current.filter((message) => message.id !== pendingMessage.id))
      setSelectReplyError('生成失败，请重试')
    } finally {
      selectDialogueRequestLockRef.current = false
      setIsSending(false)
      setIsSelectReplyLoading(false)
    }
  }, [isSending, isSelectReplyLoading, selectDialogueStage, selectDifficulty, selectReplyMeanings, selectReplyOptions, selectSceneId, updateMemoryFromExchange])

  const retrySelectDialogue = useCallback(() => {
    const retry = selectRetryRef.current
    if (!retry || retry.message === SELECT_DIALOGUE_START) {
      startSelectDialogue(retry?.sceneId || selectSceneId, { reset: false })
      return
    }
    sendSelectDialogueReply(retry.message, {
      appendUser: retry.appendUser,
      sceneId: retry.sceneId,
      difficulty: retry.difficulty,
      stage: retry.stage
    })
  }, [selectSceneId, sendSelectDialogueReply, startSelectDialogue])

  const sendTeacherMessage = useCallback(async (text: string, quickMode?: TeacherQuickMode | null) => {
    const cleanText = text.trim()
    if (!cleanText || isSending) return

    if (quickMode === 'select') {
      sendSelectDialogueReply(cleanText)
      return
    }

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
  }, [isSending, sendSelectDialogueReply, updateMemoryFromExchange])

  const startTopicPractice = useCallback(async (
    topicPrompt = '直接开启一个轻松自然的英语日常聊天。只发一个生活化问题：先中文问句，再给同一个问题的英文版本，不要解释为什么选这个话题。',
    fallback = '你最近反复听或看的一个东西是什么？\nWhat’s something you’ve been listening to or watching a lot recently?',
    nextMode: TeacherQuickMode = 'topic'
  ) => {
    if (isSending) return
    setTeacherMode(nextMode)
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
        message: topicPrompt,
        messages: messagesRef.current.filter((message) => !message.pending).slice(-6).map(({ role, text }) => ({ role, text })),
        memoryProfile: memoryProfileRef.current
      })
      const reply = cleanTopicReply(String(data.reply || '')) || fallback
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
          text: fallback,
          mode: 'topic',
          timestamp: Date.now()
        }))
    } finally {
      setIsSending(false)
    }
  }, [isSending])

  const handleQuickAction = useCallback((action: TeacherQuickMode) => {
    if (action === 'topic') {
      clearSelectDialogueState()
      startTopicPractice()
      return
    }
    if (action === 'hair') {
      clearSelectDialogueState()
      startTopicPractice(
        '开启一个理发师和客人之间的轻松英文聊天话题。只发一个自然问题：先中文问句，再给同一个问题的英文版本，不要解释。',
        '你平时剪头发更喜欢固定风格，还是会偶尔换一下？\nDo you usually stick with the same haircut, or do you like changing it up sometimes?',
        'hair'
      )
      return
    }
    if (action === 'client') {
      clearSelectDialogueState()
      startTopicPractice(
        '开启一个理发师和客人沟通相关的轻松英文聊天话题。只发一个自然问题：先中文问句，再给同一个问题的英文版本，不要解释。',
        '你和客人沟通发型时，最常需要确认哪一点？\nWhat do you usually need to confirm first when talking to a client about their haircut?',
        'client'
      )
      return
    }
    if (action === 'select') {
      startSelectDialogue()
      return
    }
    clearSelectDialogueState()
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
  }, [clearSelectDialogueState, startSelectDialogue, startTopicPractice])

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
    if (showExam) return { title: examTitle, eyebrow: 'Keyword Test', icon: Sparkles }
    if (showFriends) return { title: '好友', eyebrow: 'Community', icon: Users }
    switch (activeTab) {
      case 'sentences': return { title: '句读', eyebrow: 'Sentence Reader', icon: BookText }
      case 'scenes': return { title: '聊天记录', eyebrow: 'SAVED CHATS', icon: MessagesSquare }
      case 'assistant': return { title: '语言助手', eyebrow: 'Language Assistant', icon: Languages }
      case 'teacher': return { title: '智语导师', eyebrow: 'AI Tutor', icon: MessageCircle }
    }
  }

  const pageInfo = getPageTitle()
  const PageIcon = pageInfo.icon

  return (
    <div className="zhiyu-app-min bg-[#030308] relative overflow-hidden isolate">
      <StarryBackground />
      <div className="fixed inset-0 z-[1] pointer-events-none bg-[#030308]/45" aria-hidden="true" />

      <main className={cn(
        "relative z-10 w-full max-w-[520px] mx-auto",
        (activeTab === 'teacher' || activeTab === 'assistant') && !showExam && !showFriends
          ? "zhiyu-app-shell flex flex-col"
          : "zhiyu-app-min pb-24"
      )}>
        <header className={cn(
          "sticky top-0 z-40 safe-area-pt",
          (activeTab === 'teacher' || activeTab === 'assistant') && !showExam && !showFriends
            ? "relative flex-shrink-0 px-4 py-3"
            : "px-5 py-4"
        )}>
          <div className="absolute inset-0 glass-nav" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className={cn(
                "relative rounded-2xl glass-button flex items-center justify-center overflow-hidden group",
                (activeTab === 'teacher' || activeTab === 'assistant') && !showExam && !showFriends ? "w-10 h-10" : "w-11 h-11"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.70_0.15_280_/_0.15)] to-transparent" />
                <PageIcon className="w-5 h-5 text-[oklch(0.80_0.15_280)] relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.2em] uppercase mb-0.5">
                  {pageInfo.eyebrow}
                </p>
                <h1 id="pageTitle" className={cn(
                  "font-semibold text-white/95 tracking-wide",
                  (activeTab === 'teacher' || activeTab === 'assistant') && !showExam && !showFriends ? "text-lg" : "text-xl"
                )}>
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
            sentences={examItems}
            title={examTitle}
            onBack={() => setShowExam(false)}
            onComplete={() => setShowExam(false)}
            onTranslateText={translateTeacherText}
          />
        ) : showFriends ? (
          <FriendsPage friends={friends} onRefresh={() => loadFriends()} />
        ) : activeTab === 'sentences' ? (
          <section id="sentencesPage" className="px-4 py-3 flex-1 animate-fade-in">
            <div className="space-y-3 mb-4">
              <div className="relative glass-tabs flex gap-1 h-10 p-1">
                {[
                  { id: 'learning' as const, label: '学习中', count: learningCount },
                  { id: 'learned' as const, label: '已学会', count: learnedCount },
                  { id: 'vocab' as const, label: '生词本', count: vocabBook.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={`${tab.id}Tab`}
                    onClick={() => setHomeView(tab.id)}
                    role="tab"
                    aria-selected={homeView === tab.id}
                    className={cn(
                      "flex-1 h-8 rounded-2xl text-xs font-semibold whitespace-nowrap transition-premium",
                      homeView === tab.id
                        ? "glass-tab-active text-white"
                        : "text-white/45 hover:text-white/80"
                    )}
                  >
                    {tab.label} <span className="text-[11px] opacity-70">{tab.count}</span>
                  </button>
                ))}
              </div>

              <label className="relative block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <input
                  id="sentenceSearch"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={homeView === 'vocab' ? '搜索单词、释义、例句...' : '搜索英文、中文意思或单词...'}
                  className="w-full h-10 rounded-2xl glass-card bg-transparent border-0 outline-none pl-10 pr-4 text-sm text-white/90 placeholder:text-white/32"
                />
              </label>

              {homeView !== 'vocab' && (
                <div className="flex items-center gap-3">
                  <button
                    id="reviewButton"
                    onClick={startSentenceExam}
                    disabled={filteredSentences.length === 0}
                    className={cn(
                      "h-10 px-4 rounded-2xl text-sm font-semibold transition-premium flex items-center gap-2",
                      filteredSentences.length > 0 ? "glass-button-primary" : "glass-button text-white/30"
                    )}
                  >
                    ✍️ 默写复习
                  </button>
                  <div className="min-w-0 flex-1 flex items-center justify-end gap-2">
                    <span className="text-[11px] text-white/35 font-medium">语速</span>
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
                    <span id="speedValue" className="text-[11px] font-semibold text-white/55 w-9 tabular-nums">
                      {speechRate.toFixed(2)}x
                    </span>
                  </div>
                </div>
              )}

              {homeView !== 'vocab' && (
                <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide">
                  <div className="flex gap-2 min-w-max">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setCategoryFilter(category)}
                        className={cn(
                          "h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-premium border",
                          categoryFilter === category
                            ? "bg-[oklch(0.70_0.15_280_/_0.22)] border-[oklch(0.70_0.15_280_/_0.45)] text-white shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.18)]"
                            : "bg-white/[0.04] border-white/[0.07] text-white/45 hover:text-white/75"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {homeView === 'vocab' ? (
              <div id="vocabBookList" className="space-y-3">
                {filteredVocabBook.length > 0 ? (
                  filteredVocabBook.map((item, index) => (
                    <div
                      key={item.word}
                      className="relative glass-card rounded-3xl p-5 overflow-hidden animate-slide-up"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <div className="inner-glow rounded-3xl" />
                      <div className="top-highlight" />
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="text-xl font-semibold text-white/95">{item.word}</h2>
                          {item.phonetic && <p className="mt-1 text-sm text-white/40">/{item.phonetic}/</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => speakEnglish(item.word, { mode: 'word', rate: speechRate })}
                            className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/60 hover:text-white transition-premium"
                            aria-label="朗读单词"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeVocabBookItem(item.word)}
                            className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/45 hover:text-[oklch(0.70_0.22_25)] transition-premium"
                            aria-label="移出生词本"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="relative mt-4 space-y-3">
                        <p className="text-[15px] text-white/76 leading-relaxed">{item.meaning}</p>
                        {item.example && (
                          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-3">
                            <p className="text-sm text-white/72 leading-relaxed">{item.example}</p>
                            {item.exampleZh && <p className="mt-2 text-xs text-white/42 leading-relaxed">{item.exampleZh}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div id="emptyVocabState" className="text-center py-20 animate-fade-in">
                    <div className="w-20 h-20 rounded-3xl glass-card mx-auto mb-6 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white/30" />
                    </div>
                    <h2 className="text-xl font-semibold text-white/90 mb-2">生词本还是空的</h2>
                    <p className="text-sm text-white/40 leading-relaxed max-w-[260px] mx-auto">
                      点击任意英文单词后，可以把它加入这里。
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div id="sentenceList" className="space-y-4">
                {filteredSentences.length > 0 ? (
                  filteredSentences.map((sentence, index) => (
                    <div
                      key={sentence.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <SentenceCard
                        text={sentence.text}
                        note={sentence.note}
                        learned={sentence.learned}
                        aiExplanation={sentence.aiExplanation}
                        speechRate={speechRate}
                        onDelete={() => handleDeleteSentence(sentence.id)}
                        onUpdateText={(text) => handleUpdateSentenceText(sentence.id, text)}
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
                      {homeView === 'learning' ? '添加句子后就能直接听' : '还没有学会的句子'}
                    </h2>
                    <p className="text-sm text-white/40 leading-relaxed max-w-[260px] mx-auto">
                      {searchQuery || categoryFilter !== CATEGORY_ALL
                        ? '当前筛选下没有内容。'
                        : homeView === 'learning'
                          ? '整句点右侧按钮，单词直接点英文。'
                          : '学会的句子会显示在这里。'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {homeView !== 'vocab' && (
              <button
                id="floatingAddButton"
                type="button"
                onClick={() => {
                  resetAddSheet()
                  setShowAddSheet(true)
                }}
                className="fixed right-5 bottom-[calc(5.6rem+env(safe-area-inset-bottom))] z-50 w-14 h-14 rounded-3xl glass-button-primary flex items-center justify-center shadow-[0_0_28px_oklch(0.70_0.15_280_/_0.35)] transition-premium active:scale-95"
                aria-label="添加句子"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </section>
        ) : activeTab === 'scenes' ? (
          <ScenesPage
            records={savedDialogues}
            onDeleteRecord={deleteSavedDialogue}
            onContinueRecord={continueSavedDialogue}
            onStartExam={startSavedDialogueExam}
            onAddSentence={handleAddSentence}
            onTranslateText={translateTeacherText}
          />
        ) : activeTab === 'assistant' ? (
          <LanguageAssistantPage
            mode={languageAssistantState.mode}
            inputValue={languageAssistantState.inputValue}
            results={languageAssistantState.results}
            onModeChange={(mode) => updateLanguageAssistantState({ mode })}
            onInputChange={(inputValue) => updateLanguageAssistantState({ inputValue })}
            onResultsChange={(results) => updateLanguageAssistantState({ results })}
            onReset={resetLanguageAssistantState}
            onRunAssistant={runLanguageAssistant}
            onAddSentence={(english, chinese) => handleAddSentence(english, chinese)}
          />
        ) : (
          <TeacherPage
            messages={messages}
            activeMode={teacherMode}
            isSending={isSending}
            memoryProfile={memoryProfile}
            replyOptions={selectReplyOptions}
            replyOptionMeanings={selectReplyMeanings}
            isReplyOptionsLoading={isSelectReplyLoading}
            replyOptionsError={selectReplyError}
            selectSceneId={selectSceneId}
            selectDifficulty={selectDifficulty}
            selectStage={selectDialogueStage}
            canSaveSelectDialogue={canSaveSelectDialogue}
            onSendMessage={sendTeacherMessage}
            onQuickAction={handleQuickAction}
            onStartSelectDialogue={startSelectDialogue}
            onSaveSelectDialogue={saveCurrentSelectDialogue}
            onDifficultyChange={setSelectDifficulty}
            onSelectReplyOption={sendSelectDialogueReply}
            onRetryReplyOptions={retrySelectDialogue}
            onAddSentence={handleAddSentence}
            onTranslateText={translateTeacherText}
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

      {toastMessage && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.4rem+env(safe-area-inset-bottom))] z-[160] flex justify-center px-4">
          <div className="rounded-2xl border border-[oklch(0.70_0.15_280_/_0.24)] bg-black/82 px-4 py-2 text-sm font-semibold text-white/88 shadow-[0_12px_36px_rgba(0,0,0,0.38)] backdrop-blur-xl animate-scale-in">
            {toastMessage}
          </div>
        </div>
      )}

      {showAddSheet && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/65 backdrop-blur-md px-4 pb-4 pt-16 animate-fade-in">
          <button className="absolute inset-0 cursor-default" aria-label="关闭添加句子" onClick={closeAddSheet} />
          <div className="relative w-full max-w-[520px] max-h-[86dvh] overflow-y-auto glass-sheet rounded-[2rem] p-5 animate-scale-in">
            <div className="top-highlight" />
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.18em] uppercase mb-1">
                  Add Sentence
                </p>
                <h2 className="text-xl font-semibold text-white/95">添加句子</h2>
              </div>
              <button
                type="button"
                onClick={closeAddSheet}
                className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/55 hover:text-white transition-premium"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="glass-tabs flex gap-1 h-10 p-1 mb-5">
              {[
                { id: 'manual' as const, label: '手动添加' },
                { id: 'ai' as const, label: '中文生成英文' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setAddMode(mode.id)
                    setGenerationError('')
                  }}
                  className={cn(
                    "flex-1 h-8 rounded-2xl text-sm font-semibold transition-premium",
                    addMode === mode.id ? "glass-tab-active text-white" : "text-white/45 hover:text-white/80"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {addMode === 'manual' ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[11px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.14em] uppercase">英文句子</span>
                  <textarea
                    value={manualEnglish}
                    onChange={(event) => setManualEnglish(event.target.value)}
                    placeholder="输入自然英文句子..."
                    rows={3}
                    className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-[15px] text-white/90 placeholder:text-[oklch(0.70_0.15_280_/_0.55)] outline-none resize-none leading-relaxed"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.14em] uppercase">中文意思</span>
                  <textarea
                    value={manualChinese}
                    onChange={(event) => setManualChinese(event.target.value)}
                    placeholder="输入中文意思..."
                    rows={2}
                    className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-[15px] text-white/90 placeholder:text-[oklch(0.70_0.15_280_/_0.55)] outline-none resize-none leading-relaxed"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleManualAdd}
                  disabled={!manualEnglish.trim() || !manualChinese.trim()}
                  className={cn(
                    "w-full h-12 rounded-2xl text-sm font-semibold transition-premium",
                    manualEnglish.trim() && manualChinese.trim() ? "glass-button-primary" : "glass-button text-white/35"
                  )}
                >
                  添加到学习中
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[11px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.14em] uppercase">中文意思</span>
                  <textarea
                    value={aiChinese}
                    onChange={(event) => {
                      setAiChinese(event.target.value)
                      setGeneratedSentence(null)
                      setGenerationError('')
                    }}
                    placeholder="例如：我先帮你看一下发型适合怎么修..."
                    rows={3}
                    className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-[15px] text-white/90 placeholder:text-[oklch(0.70_0.15_280_/_0.55)] outline-none resize-none leading-relaxed"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleGenerateSentence}
                  disabled={!aiChinese.trim() || isGeneratingSentence}
                  className={cn(
                    "w-full h-12 rounded-2xl text-sm font-semibold transition-premium flex items-center justify-center gap-2",
                    aiChinese.trim() && !isGeneratingSentence ? "glass-button-primary" : "glass-button text-white/35"
                  )}
                >
                  <WandSparkles className="w-4 h-4" />
                  {isGeneratingSentence ? '正在生成...' : generatedSentence ? '重新生成' : '生成英语'}
                </button>

                {generationError && (
                  <p className="rounded-2xl border border-[oklch(0.62_0.22_25_/_0.25)] bg-[oklch(0.62_0.22_25_/_0.08)] px-4 py-3 text-sm text-[oklch(0.72_0.20_25)]">
                    {generationError}
                  </p>
                )}

                {generatedSentence && (
                  <div className="rounded-3xl border border-white/[0.07] bg-white/[0.04] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full border border-[oklch(0.70_0.15_280_/_0.35)] bg-[oklch(0.70_0.15_280_/_0.12)] px-3 py-1 text-xs font-semibold text-[oklch(0.82_0.15_280)]">
                        {generatedSentence.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakEnglish(generatedSentence.english, { mode: 'sentence', rate: speechRate })}
                        className="w-9 h-9 rounded-2xl glass-button flex items-center justify-center text-white/60"
                        aria-label="朗读生成句子"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[16px] font-semibold text-white/92 leading-relaxed">{generatedSentence.english}</p>
                    <p className="mt-3 text-sm text-white/50 leading-relaxed">{generatedSentence.chinese}</p>
                    <button
                      type="button"
                      onClick={handleAddGeneratedSentence}
                      className="mt-4 w-full h-12 rounded-2xl glass-button-primary text-sm font-semibold transition-premium"
                    >
                      添加到学习中
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
