import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Capacitor } from '@capacitor/core'
import { QueueStrategy, TextToSpeech } from '@capacitor-community/text-to-speech'
import {
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  BookOpen,
  BookText,
  Brain,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  ClipboardList,
  Eye,
  Flame,
  Headphones,
  Home,
  LibraryBig,
  LogOut,
  Loader2,
  MessageSquareText,
  Mic2,
  NotebookTabs,
  Play,
  Plus,
  RotateCcw,
  Search,
  SendHorizontal,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import courseCatalog from './data/course-catalog.json'

const progressKey = 'julebu-web-redesign-progress'
const savedItemsKey = 'julebu-web-redesign-items'
const sessionKey = 'julebu-web-redesign-session'
const speechSettingsKey = 'julebu-web-redesign-speech-settings'
const autoReadRepeatKey = 'julebu-web-redesign-auto-read-repeat'
const phoneticVisibleKey = 'julebu-web-redesign-phonetic-visible'
const pendingServerStateKey = 'julebu-web-redesign-pending-server-state'
const globalStatsKey = '__julebuGlobalStats'
const serverApiBaseUrl = (import.meta.env.VITE_JULEBU_API_BASE || '').replace(/\/$/, '')
const typingSoundUrl = `${import.meta.env.BASE_URL}audio/typing-sounds/default.mp3`
const correctSoundUrl = `${import.meta.env.BASE_URL}audio/game-sounds/correct.mp3`
const errorSoundUrl = `${import.meta.env.BASE_URL}audio/game-sounds/error.mp3`
const speechVoiceWaitMs = 1200
const questionReadDelayMs = 80
const repeatReadGapMs = 520
const correctReadDelayMs = 460
let speechRunId = 0
let voicesReadyPromise = null
let nativeVoicesPromise = null
let audioContext = null
let audioUnlocked = false
let audioUnlockPromise = null
const retainedUtterances = new Set()
const soundCache = new Map()
const soundBufferCache = new Map()
const soundDecodePromises = new Map()
const instantToneKinds = new Set(['typing', 'correct', 'error', 'tap'])
const aiTutorSessions = new Map()
let serverStateQueuedPayload = null
let serverStateSaveInFlight = false
let serverStateSaveTimer = 0
let serverStateSaveWaiters = []
const defaultSpeechSettings = { rate: 0.92, voiceGender: 'female' }
const autoReadRepeatModes = [2, 1, 0]
const serverSaveRetryDelays = [350, 900, 1800, 3500, 6500, 10000]
const serverSaveRetryLaterDelayMs = 15000
const serverSaveRequestTimeoutMs = 10000
const courseStudyCheckpointMs = 15000
const maxCourseStudyGapSeconds = 20
const voiceNamePatterns = {
  female: /female|woman|girl|ava|samantha|jenny|aria|victoria|karen|susan|zira|allison|joanna|kendra|kimberly|salli|ivy|emma|amy|olivia|sonia|libby|natasha|nicky|moira|fiona|tessa|veena|serena|ava.*neural|jenny.*neural|aria.*neural/i,
  male: /male|man|boy|alex|daniel|fred|tom|matthew|david|mark|guy|davis|andrew|brian|aaron|ryan|george|arthur|oliver|thomas|roger|eddy|reed|ralph|albert|junior|jacob|justin|kevin|christopher|eric|william|michael|james|john|paul|richard|nathan|liam|noah|jack|henry|charles|guy.*neural|davis.*neural|andrew.*neural/i,
}
const preferredVoicePatterns = {
  female: [
    /en-us-avamultilingualneural|ava/i,
    /jenny|aria|samantha/i,
    /victoria|allison|karen|joanna|kendra|salli|emma|amy|olivia/i,
    /zira|susan|serena|moira|fiona/i,
  ],
  male: [
    /guy|davis|andrew|brian/i,
    /alex|daniel|matthew|david|mark/i,
    /george|arthur|oliver|thomas|ryan/i,
    /fred|tom|aaron/i,
  ],
}
const highQualityVoicePattern = /google|microsoft|apple|siri|neural|natural|enhanced|premium|wavenet|studio|multilingual/i
const noveltyVoicePattern = /compact|novelty|whisper|bells|boing|bubbles|cellos|hysterical|pipe|trinoids|zarvox|bad news|good news|organ|superstar|deranged|junior/i
let currentSpeechSettings = loadSpeechSettings()
let currentAutoReadRepeat = loadAutoReadRepeat()
let currentPhoneticVisible = loadPhoneticVisible()
let activeSpeechAudio = null
const preloadedSpeechUrls = new Set()

class AccessRequiredError extends Error {}

function getStoredSession() {
  try {
    return localStorage.getItem(sessionKey) || ''
  } catch {
    return ''
  }
}

function setStoredSession(value) {
  localStorage.setItem(sessionKey, value)
}

function clearStoredSession() {
  localStorage.removeItem(sessionKey)
}

function normalizeSpeechSettings(value) {
  const rate = Math.min(1.35, Math.max(0.65, Number(value?.rate) || defaultSpeechSettings.rate))
  const voiceGender = value?.voiceGender === 'male' ? 'male' : 'female'
  return { rate, voiceGender }
}

function loadSpeechSettings() {
  try {
    if (typeof localStorage === 'undefined') return { ...defaultSpeechSettings }
    return normalizeSpeechSettings(JSON.parse(localStorage.getItem(speechSettingsKey) || 'null'))
  } catch {
    return { ...defaultSpeechSettings }
  }
}

function saveSpeechSettings(value) {
  currentSpeechSettings = normalizeSpeechSettings(value)
  try {
    localStorage.setItem(speechSettingsKey, JSON.stringify(currentSpeechSettings))
  } catch {
    return currentSpeechSettings
  }
  return currentSpeechSettings
}

function normalizeAutoReadRepeat(value) {
  const repeat = Number(value)
  return autoReadRepeatModes.includes(repeat) ? repeat : 2
}

function loadAutoReadRepeat() {
  try {
    if (typeof localStorage === 'undefined') return 2
    return normalizeAutoReadRepeat(localStorage.getItem(autoReadRepeatKey))
  } catch {
    return 2
  }
}

function saveAutoReadRepeat(value) {
  currentAutoReadRepeat = normalizeAutoReadRepeat(value)
  try {
    localStorage.setItem(autoReadRepeatKey, String(currentAutoReadRepeat))
  } catch {
    return currentAutoReadRepeat
  }
  return currentAutoReadRepeat
}

function nextAutoReadRepeat(value) {
  const index = autoReadRepeatModes.indexOf(normalizeAutoReadRepeat(value))
  return autoReadRepeatModes[(index + 1) % autoReadRepeatModes.length]
}

function loadPhoneticVisible() {
  try {
    if (typeof localStorage === 'undefined') return true
    return localStorage.getItem(phoneticVisibleKey) !== 'false'
  } catch {
    return true
  }
}

function savePhoneticVisible(value) {
  currentPhoneticVisible = value !== false
  try {
    localStorage.setItem(phoneticVisibleKey, String(currentPhoneticVisible))
  } catch {
    return currentPhoneticVisible
  }
  return currentPhoneticVisible
}

function authHeaders(token = getStoredSession()) {
  return token ? { 'X-Julebu-Session': token } : {}
}

function serverUrl(path) {
  if (/^https?:\/\//i.test(path)) return path
  if (!serverApiBaseUrl) return path
  const normalizedPath = path.startsWith('./') ? path.slice(1) : path
  return `${serverApiBaseUrl}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`
}

function cloudTtsUrl(text, speechSettings = currentSpeechSettings) {
  const normalizedText = String(text || '').replace(/\s+/g, ' ').trim()
  if (!normalizedText) return ''
  const settings = normalizeSpeechSettings(speechSettings)
  const params = new URLSearchParams({
    text: normalizedText,
    voiceGender: settings.voiceGender,
    rate: String(settings.rate),
  })
  return serverUrl(`/api/tts?${params.toString()}`)
}

function preloadCloudTts(texts, speechSettings = currentSpeechSettings, limit = 10) {
  const uniqueUrls = [...new Set(
    texts
      .map((text) => cloudTtsUrl(text, speechSettings))
      .filter(Boolean),
  )]
    .filter((url) => !preloadedSpeechUrls.has(url))
    .slice(0, limit)

  if (!uniqueUrls.length) return
  uniqueUrls.forEach((url) => preloadedSpeechUrls.add(url))

  ;(async () => {
    for (let index = 0; index < uniqueUrls.length; index += 3) {
      const batch = uniqueUrls.slice(index, index + 3)
      await Promise.allSettled(batch.map((url) => fetch(url, { cache: 'force-cache' })))
    }
  })()
}

async function apiFetch(url, options = {}, code) {
  const { timeoutMs, ...fetchOptions } = options
  const headers = {
    ...(fetchOptions.headers || {}),
    ...authHeaders(code),
  }
  const targetUrl = serverUrl(url)
  const response = timeoutMs
    ? await fetchWithTimeout(targetUrl, { ...fetchOptions, headers }, timeoutMs)
    : await fetch(targetUrl, { ...fetchOptions, headers })
  if (response.status === 401) throw new AccessRequiredError('请先登录')
  return response
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function fetchWithTimeout(url, options = {}, timeoutMs = serverSaveRequestTimeoutMs) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    window.clearTimeout(timer)
  }
}

async function askAiTutor(payload) {
  const response = await apiFetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data?.error || 'AI 暂时无法回答')
  return data
}

function normalizeProgress(value) {
  if (!value || typeof value !== 'object') return {}
  return value
}

function createEmptySavedItems() {
  return {
    mastered: [],
    vocab: [],
    removedItems: { mastered: {}, vocab: {} },
    forgottenWords: [],
    forgottenPhrases: [],
  }
}

function normalizeForgottenItem(item, fallbackKind) {
  if (!item || typeof item !== 'object') return null
  const english = item.english || item.word || item.phrase
  if (!english) return null
  const missCount = Math.max(0, Number(item.missCount) || 0)
  const attemptCount = Math.max(missCount, Number(item.attemptCount) || missCount)
  return {
    ...item,
    id: item.id || `${fallbackKind}:${normalizeAnswer(english).replace(/\s+/g, '-')}`,
    kind: item.kind || fallbackKind,
    english,
    chinese: item.chinese || '',
    soundmark: item.soundmark || '',
    lessonTitle: item.lessonTitle || '',
    missCount,
    attemptCount,
    wrongCount: Math.max(0, Number(item.wrongCount) || 0),
    revealCount: Math.max(0, Number(item.revealCount) || 0),
    lastMissedAt: item.lastMissedAt || null,
    updatedAt: item.updatedAt || item.lastMissedAt || item.addedAt || null,
  }
}

function normalizeForgottenItems(items, fallbackKind) {
  if (!Array.isArray(items)) return []
  return sortForgottenItems(items.map((item) => normalizeForgottenItem(item, fallbackKind)).filter(Boolean))
}

function archiveTimestamp(value) {
  const timestamp = Date.parse(String(value || ''))
  return Number.isFinite(timestamp) ? timestamp : 0
}

function archiveItemTimestamp(item) {
  return archiveTimestamp(item?.updatedAt || item?.addedAt)
}

function normalizeArchiveItems(items) {
  if (!Array.isArray(items)) return []
  const byId = new Map()
  for (const item of items) {
    if (!item?.id) continue
    const existing = byId.get(item.id)
    if (!existing || archiveItemTimestamp(item) >= archiveItemTimestamp(existing)) {
      byId.set(item.id, { ...existing, ...item })
    }
  }
  return [...byId.values()]
}

function normalizeArchiveRemovals(value) {
  if (!value || typeof value !== 'object') return {}
  return Object.fromEntries(
    Object.entries(value).filter(([id, removedAt]) => id && archiveTimestamp(removedAt) > 0),
  )
}

function normalizeRemovedArchiveItems(value) {
  return {
    mastered: normalizeArchiveRemovals(value?.mastered),
    vocab: normalizeArchiveRemovals(value?.vocab),
  }
}

function filterRemovedArchiveItems(items, removals) {
  return normalizeArchiveItems(items).filter((item) => {
    const removedAt = removals?.[item.id]
    return !removedAt || archiveItemTimestamp(item) > archiveTimestamp(removedAt)
  })
}

function normalizeSavedItems(value) {
  if (!value || typeof value !== 'object') return createEmptySavedItems()
  const removedItems = normalizeRemovedArchiveItems(value.removedItems)
  return {
    mastered: filterRemovedArchiveItems(value.mastered, removedItems.mastered),
    vocab: filterRemovedArchiveItems(value.vocab, removedItems.vocab),
    removedItems,
    forgottenWords: normalizeForgottenItems(value.forgottenWords, 'word'),
    forgottenPhrases: normalizeForgottenItems(value.forgottenPhrases, 'phrase'),
  }
}

function maxProgressNumber(...values) {
  return Math.max(0, ...values.map((value) => Number(value) || 0))
}

function latestProgressDate(...values) {
  return values
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null
}

function mergeGlobalProgressStats(current = {}, incoming = {}) {
  const answerCount = maxProgressNumber(current.answerCount, incoming.answerCount)
  const correctCount = Math.min(answerCount, maxProgressNumber(current.correctCount, incoming.correctCount))
  return {
    ...current,
    ...incoming,
    answerCount,
    correctCount,
    studyDates: [...new Set([...(current.studyDates || []), ...(incoming.studyDates || [])])],
    lastAnsweredAt: latestProgressDate(current.lastAnsweredAt, incoming.lastAnsweredAt),
  }
}

function mergeLessonProgressState(current = {}, incoming = {}) {
  const lessonIds = new Set([...Object.keys(current || {}), ...Object.keys(incoming || {})])
  return Object.fromEntries(
    [...lessonIds].map((lessonId) => {
      const currentLesson = current?.[lessonId] || {}
      const incomingLesson = incoming?.[lessonId] || {}
      return [
        lessonId,
        {
          ...currentLesson,
          ...incomingLesson,
          statementIndex: maxProgressNumber(currentLesson.statementIndex, incomingLesson.statementIndex),
          completedStatements: maxProgressNumber(currentLesson.completedStatements, incomingLesson.completedStatements),
        },
      ]
    }),
  )
}

function mergeCourseProgressState(current = {}, incoming = {}) {
  const completed = maxProgressNumber(current.completed, incoming.completed)
  const currentBestLesson = maxProgressNumber(current.completed, current.completedStatements)
  const incomingBestLesson = maxProgressNumber(incoming.completed, incoming.completedStatements)
  return {
    ...current,
    ...incoming,
    completed,
    minutes: maxProgressNumber(current.minutes, incoming.minutes),
    studySeconds: maxProgressNumber(current.studySeconds, incoming.studySeconds),
    currentLesson: incomingBestLesson >= currentBestLesson ? incoming.currentLesson || current.currentLesson : current.currentLesson || incoming.currentLesson,
    lessonProgress: mergeLessonProgressState(current.lessonProgress || {}, incoming.lessonProgress || {}),
  }
}

function mergeProgressState(currentValue = {}, incomingValue = {}) {
  const current = normalizeProgress(currentValue)
  const incoming = normalizeProgress(incomingValue)
  const keys = new Set([...Object.keys(current), ...Object.keys(incoming)])
  return Object.fromEntries(
    [...keys].map((key) => {
      if (key === globalStatsKey) return [key, mergeGlobalProgressStats(current[key], incoming[key])]
      const currentItem = current[key]
      const incomingItem = incoming[key]
      if (currentItem && incomingItem && typeof currentItem === 'object' && typeof incomingItem === 'object') {
        return [key, mergeCourseProgressState(currentItem, incomingItem)]
      }
      return [key, incomingItem || currentItem]
    }),
  )
}

function mergeArchiveRemovals(current = {}, incoming = {}) {
  const merged = { ...normalizeArchiveRemovals(current) }
  for (const [id, removedAt] of Object.entries(normalizeArchiveRemovals(incoming))) {
    if (!merged[id] || archiveTimestamp(removedAt) >= archiveTimestamp(merged[id])) {
      merged[id] = removedAt
    }
  }
  return merged
}

function mergeRemovedArchiveItems(current = {}, incoming = {}) {
  return {
    mastered: mergeArchiveRemovals(current.mastered, incoming.mastered),
    vocab: mergeArchiveRemovals(current.vocab, incoming.vocab),
  }
}

function mergeForgottenItemsState(current = [], incoming = []) {
  const map = new Map()
  for (const item of [...normalizeForgottenItems(current, 'word'), ...normalizeForgottenItems(incoming, 'word')]) {
    if (!item?.id) continue
    const existing = map.get(item.id) || {}
    map.set(item.id, {
      ...existing,
      ...item,
      missCount: maxProgressNumber(existing.missCount, item.missCount),
      attemptCount: maxProgressNumber(existing.attemptCount, item.attemptCount),
      wrongCount: maxProgressNumber(existing.wrongCount, item.wrongCount),
      revealCount: maxProgressNumber(existing.revealCount, item.revealCount),
      lastMissedAt: latestProgressDate(existing.lastMissedAt, item.lastMissedAt),
      updatedAt: latestProgressDate(existing.updatedAt, item.updatedAt),
    })
  }
  return sortForgottenItems([...map.values()])
}

function mergeSavedItemsState(currentValue, incomingValue) {
  const current = normalizeSavedItems(currentValue)
  const incoming = normalizeSavedItems(incomingValue)
  const removedItems = mergeRemovedArchiveItems(current.removedItems, incoming.removedItems)
  return {
    mastered: filterRemovedArchiveItems([...current.mastered, ...incoming.mastered], removedItems.mastered),
    vocab: filterRemovedArchiveItems([...current.vocab, ...incoming.vocab], removedItems.vocab),
    removedItems,
    forgottenWords: mergeForgottenItemsState(current.forgottenWords, incoming.forgottenWords),
    forgottenPhrases: mergeForgottenItemsState(current.forgottenPhrases, incoming.forgottenPhrases),
  }
}

async function loadServerState(code) {
  const response = await apiFetch('/api/state', { cache: 'no-store' }, code)
  if (!response.ok) throw new Error('服务器进度读取失败')
  const data = await response.json()
  return {
    progress: normalizeProgress(data.progress),
    savedItems: normalizeSavedItems(data.savedItems),
  }
}

function makeServerStatePayload(progress, savedItems) {
  return {
    progress: normalizeProgress(progress),
    savedItems: normalizeSavedItems(savedItems),
  }
}

function mergeServerStatePayload(current, incoming) {
  if (!current) return incoming
  if (!incoming) return current
  return {
    progress: mergeProgressState(current.progress, incoming.progress),
    savedItems: mergeSavedItemsState(current.savedItems, incoming.savedItems),
  }
}

function pendingServerStateStorageKey(token = getStoredSession()) {
  return `${pendingServerStateKey}:${token || 'anonymous'}`
}

function readPendingServerState(token = getStoredSession()) {
  try {
    const raw = localStorage.getItem(pendingServerStateStorageKey(token))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return makeServerStatePayload(parsed.progress, parsed.savedItems)
  } catch {
    return null
  }
}

function persistPendingServerState(payload, token = getStoredSession()) {
  try {
    localStorage.setItem(pendingServerStateStorageKey(token), JSON.stringify(payload))
  } catch {
    // The server queue still keeps the latest state in memory while the app is open.
  }
}

function clearPendingServerState(token = getStoredSession()) {
  try {
    localStorage.removeItem(pendingServerStateStorageKey(token))
  } catch {
    // Ignore storage cleanup errors.
  }
}

function mergeServerStateWithPending(serverState, token = getStoredSession()) {
  const pendingState = readPendingServerState(token)
  if (!pendingState) {
    return {
      progress: normalizeProgress(serverState.progress),
      savedItems: normalizeSavedItems(serverState.savedItems),
      hadPending: false,
    }
  }
  return {
    progress: mergeProgressState(serverState.progress, pendingState.progress),
    savedItems: mergeSavedItemsState(serverState.savedItems, pendingState.savedItems),
    hadPending: true,
  }
}

async function sendServerStatePayload(payload) {
  const response = await apiFetch('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
    timeoutMs: serverSaveRequestTimeoutMs,
  })
  if (!response.ok) throw new Error('服务器保存失败')
  return response.json().catch(() => ({}))
}

async function sendServerStatePayloadWithRetry(payload) {
  let lastError = null
  for (let attempt = 0; attempt <= serverSaveRetryDelays.length; attempt += 1) {
    try {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        throw new Error('网络离线')
      }
      return await sendServerStatePayload(payload)
    } catch (error) {
      lastError = error
      if (error instanceof AccessRequiredError || attempt >= serverSaveRetryDelays.length) break
      const jitter = Math.round(Math.random() * 180)
      await wait(serverSaveRetryDelays[attempt] + jitter)
    }
  }
  throw lastError || new Error('服务器保存失败')
}

function settleServerStateWaiters(type, value) {
  const waiters = serverStateSaveWaiters
  serverStateSaveWaiters = []
  waiters.forEach((waiter) => waiter[type](value))
}

function emitServerSyncStatus(status) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('julebu-server-sync', { detail: { status } }))
}

function scheduleServerStateFlush(delayMs = 0) {
  if (typeof window === 'undefined') return
  window.clearTimeout(serverStateSaveTimer)
  serverStateSaveTimer = window.setTimeout(() => {
    flushServerStateQueue()
  }, delayMs)
}

async function flushServerStateQueue() {
  if (serverStateSaveInFlight) return
  const token = getStoredSession()
  serverStateQueuedPayload = mergeServerStatePayload(readPendingServerState(token), serverStateQueuedPayload)
  if (!serverStateQueuedPayload) return

  serverStateSaveInFlight = true
  let continueImmediately = false
  const savingPayload = serverStateQueuedPayload
  const savingPayloadText = JSON.stringify(savingPayload)
  try {
    await sendServerStatePayloadWithRetry(savingPayload)
    const latestText = serverStateQueuedPayload ? JSON.stringify(serverStateQueuedPayload) : ''
    if (latestText === savingPayloadText) {
      serverStateQueuedPayload = null
      clearPendingServerState(token)
      emitServerSyncStatus('saved')
      settleServerStateWaiters('resolve')
    } else {
      persistPendingServerState(serverStateQueuedPayload, token)
      continueImmediately = true
    }
  } catch (error) {
    persistPendingServerState(serverStateQueuedPayload, token)
    emitServerSyncStatus('retrying')
    settleServerStateWaiters('reject', error)
    scheduleServerStateFlush(serverSaveRetryLaterDelayMs)
  } finally {
    serverStateSaveInFlight = false
  }

  if (serverStateQueuedPayload && continueImmediately) {
    scheduleServerStateFlush(0)
  }
}

function saveServerState(progress, savedItems) {
  const payload = makeServerStatePayload(progress, savedItems)
  const token = getStoredSession()
  serverStateQueuedPayload = mergeServerStatePayload(serverStateQueuedPayload, payload)
  persistPendingServerState(serverStateQueuedPayload, token)
  const promise = new Promise((resolve, reject) => {
    serverStateSaveWaiters.push({ resolve, reject })
  })
  scheduleServerStateFlush(0)
  return promise
}

function wakeServerStateSaveQueue() {
  if (serverStateQueuedPayload || readPendingServerState()) {
    scheduleServerStateFlush(0)
  }
}

function saveServerStateNow(progress, savedItems) {
  const payload = makeServerStatePayload(progress, savedItems)
  persistPendingServerState(payload)
  return apiFetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      keepalive: true,
    })
}

function hasSavedItems(value) {
  return Boolean(value?.mastered?.length || value?.vocab?.length || value?.forgottenWords?.length || value?.forgottenPhrases?.length)
}

function getLesson(course, lessonNumber) {
  return course.lessonData?.[Math.max(0, lessonNumber - 1)] || null
}

function getLessonTitle(course, lessonNumber) {
  const lesson = getLesson(course, lessonNumber)
  const summary = course.lessonSummaries?.[Math.max(0, lessonNumber - 1)]
  const title = lesson?.title || summary?.title
  const count = lesson?.statementCount || lesson?.statements?.length || summary?.statementCount
  return title ? `${title}${count ? ` - ${count} 题` : ''}` : `第${lessonNumber}课`
}

function getContinueLesson(course) {
  return Math.min(Math.max((course.completed || 0) + 1, 1), course.lessons || 1)
}

function getPracticeStatement(practice) {
  const lesson = getLesson(practice.course, practice.lesson)
  const statements = lesson?.statements || []
  const index = Math.min(Math.max(practice.statementIndex || 0, 0), Math.max(statements.length - 1, 0))
  return {
    lesson,
    statements,
    statement: statements[index] || null,
    index,
  }
}

function sanitizeAnswerInput(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
}

function normalizeAnswer(value) {
  return sanitizeAnswerInput(value)
    .trim()
    .toLowerCase()
    .replace(/[‘’`´]/g, "'")
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[.,!?;:"“”。，！？；：]/g, '')
    .replace(/\s+/g, ' ')
}

function answerTokens(value) {
  const normalized = normalizeAnswer(value)
  return normalized ? normalized.split(' ').filter(Boolean) : []
}

function isAnswerCorrect(answerValue, expectedValue) {
  const typedTokens = answerTokens(answerValue)
  const expectedTokens = answerTokens(expectedValue)
  return typedTokens.length > 0
    && typedTokens.length === expectedTokens.length
    && typedTokens.every((token, index) => token === expectedTokens[index])
}

function getPracticeStageFit(promptText, answerText, soundmark) {
  const promptLength = Array.from(String(promptText || '').replace(/\s+/g, '')).length
  const answerWords = answerTokens(answerText)
  const wordCount = answerWords.length
  const answerLength = answerWords.reduce((total, word) => total + word.length, 0)
  const soundmarkLength = String(soundmark || '').replace(/\s+/g, '').length

  if (wordCount >= 21 || promptLength >= 35 || answerLength >= 100 || soundmarkLength >= 150) return 'micro'
  if (wordCount >= 16 || promptLength >= 26 || answerLength >= 72 || soundmarkLength >= 108) return 'ultra'
  if (wordCount >= 11 || promptLength >= 18 || answerLength >= 48 || soundmarkLength >= 72) return 'dense'
  if (wordCount >= 7 || promptLength >= 11 || answerLength >= 28 || soundmarkLength >= 40) return 'compact'
  return 'normal'
}

function audioTextFromRequest(url) {
  try {
    const parsed = new URL(url)
    if (!parsed.pathname.includes('/api/audio')) return ''
    return parsed.searchParams.get('text') || ''
  } catch {
    return ''
  }
}

function isDirectAudioUrl(url, contentType = '') {
  return /\.mp3(?:$|\?)/i.test(url || '') || /audio\/mpeg/i.test(contentType || '')
}

function buildAudioUrlLookup(audioRequests = []) {
  const pendingTexts = []
  const lookup = new Map()

  for (const request of audioRequests) {
    const url = request?.url || ''
    const requestedText = audioTextFromRequest(url)
    if (requestedText) {
      pendingTexts.push(requestedText)
      continue
    }
    if (!isDirectAudioUrl(url, request?.contentType)) continue
    const text = pendingTexts.shift()
    const key = normalizeAnswer(text || '')
    if (key && !lookup.has(key)) lookup.set(key, url)
  }

  return lookup
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getGlobalStats(progress) {
  const stats = progress?.[globalStatsKey]
  const answerCount = Math.max(0, Number(stats?.answerCount) || 0)
  const correctCount = Math.min(answerCount, Math.max(0, Number(stats?.correctCount) || 0))
  const studyDates = Array.isArray(stats?.studyDates)
    ? [...new Set(stats.studyDates.filter((item) => typeof item === 'string' && item.trim()))].sort()
    : []
  return {
    answerCount,
    correctCount,
    studyDates,
  }
}

function getStudyDayCount(stats) {
  return stats.studyDates.length || (stats.answerCount > 0 ? 1 : 0)
}

function getCourseStudySeconds(course) {
  return Math.max(0, Math.floor(Number(course?.studySeconds) || 0))
}

function formatStudyDuration(seconds) {
  const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0))
  if (!totalSeconds) return '0m'

  const totalMinutes = Math.floor(totalSeconds / 60)
  if (!totalMinutes) return '<1m'

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (!hours) return `${minutes}m`
  return minutes ? `${hours}小时${minutes}分` : `${hours}小时`
}

function addCourseStudyTime(progress, courseId, seconds, timestamp = new Date()) {
  const addedSeconds = Math.max(0, Math.floor(Number(seconds) || 0))
  if (!courseId || !addedSeconds) return progress

  const existing = progress[courseId] || {}
  const stats = getGlobalStats(progress)
  return {
    ...progress,
    [globalStatsKey]: {
      ...(progress[globalStatsKey] || {}),
      studyDates: [...new Set([...stats.studyDates, getLocalDateKey(timestamp)])],
      lastStudiedAt: timestamp.toISOString(),
    },
    [courseId]: {
      ...existing,
      studySeconds: getCourseStudySeconds(existing) + addedSeconds,
    },
  }
}

function formatElapsedTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return [hours, minutes, remainingSeconds].map((part) => String(part).padStart(2, '0')).join(':')
}

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext
  if (!AudioContextConstructor) return null
  if (!audioContext) {
    try {
      audioContext = new AudioContextConstructor({ latencyHint: 'interactive' })
    } catch {
      audioContext = new AudioContextConstructor()
    }
  }
  return audioContext
}

function preloadSound(url) {
  if (typeof Audio === 'undefined' || soundCache.has(url)) return soundCache.get(url)
  const audio = new Audio(url)
  audio.preload = 'auto'
  audio.playsInline = true
  soundCache.set(url, audio)
  audio.load()
  return audio
}

function playTone(kind = 'tap', volume = 1) {
  const context = getAudioContext()
  if (!context) return
  context.resume?.().catch(() => {})

  const now = context.currentTime + 0.001
  const duration = kind === 'typing' ? 0.028 : kind === 'error' ? 0.13 : kind === 'correct' ? 0.105 : 0.045
  const peak = Math.max(0.01, (kind === 'typing' ? 0.045 : kind === 'error' ? 0.09 : 0.08) * volume)
  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  gain.connect(context.destination)

  const oscillator = context.createOscillator()
  oscillator.type = kind === 'error' ? 'sawtooth' : kind === 'typing' ? 'triangle' : 'sine'
  oscillator.frequency.setValueAtTime(
    kind === 'correct' ? 760 : kind === 'error' ? 190 : kind === 'typing' ? 1250 : 920,
    now,
  )
  if (kind === 'correct') oscillator.frequency.exponentialRampToValueAtTime(1080, now + 0.07)
  if (kind === 'typing') oscillator.frequency.exponentialRampToValueAtTime(980, now + 0.022)
  oscillator.connect(gain)
  oscillator.start(now)
  oscillator.stop(now + duration + 0.01)
}

function primeLowLatencyAudio() {
  const context = getAudioContext()
  if (!context) return
  context.resume?.().catch(() => {})
  try {
    const buffer = context.createBuffer(1, 1, context.sampleRate)
    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.start(0)
  } catch {
    // Silent priming is best-effort only.
  }
}

function preloadSoundBuffer(url) {
  const context = getAudioContext()
  if (!url || !context || typeof fetch === 'undefined') return null
  if (soundBufferCache.has(url)) return Promise.resolve(soundBufferCache.get(url))
  if (soundDecodePromises.has(url)) return soundDecodePromises.get(url)

  const promise = fetch(url, { cache: 'force-cache' })
    .then((response) => {
      if (!response.ok) throw new Error('Sound preload failed')
      return response.arrayBuffer()
    })
    .then((buffer) => context.decodeAudioData(buffer))
    .then((decoded) => {
      soundBufferCache.set(url, decoded)
      return decoded
    })
    .catch(() => null)

  soundDecodePromises.set(url, promise)
  return promise
}

function playBufferedSound(url, volume = 1) {
  const context = getAudioContext()
  const buffer = soundBufferCache.get(url)
  if (!context || !buffer) return false
  context.resume?.().catch(() => {})
  const source = context.createBufferSource()
  const gain = context.createGain()
  gain.gain.setValueAtTime(Math.max(0.01, volume), context.currentTime)
  source.buffer = buffer
  source.connect(gain)
  gain.connect(context.destination)
  source.start(context.currentTime + 0.001)
  return true
}

function unlockSpeechSynthesis() {
  const synth = getSpeechSynthesis()
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return
  try {
    const utterance = new SpeechSynthesisUtterance(' ')
    utterance.lang = 'en-US'
    utterance.volume = 0
    utterance.rate = 1
    const cleanup = () => retainedUtterances.delete(utterance)
    utterance.onend = cleanup
    utterance.onerror = cleanup
    retainedUtterances.add(utterance)
    synth.speak(utterance)
    synth.resume?.()
  } catch {
    // Some mobile browsers expose speechSynthesis but still reject silent priming.
  }
}

function unlockAudio() {
  if (audioUnlocked) return Promise.resolve()
  if (audioUnlockPromise) return audioUnlockPromise

  preloadSound(typingSoundUrl)
  preloadSound(correctSoundUrl)
  preloadSound(errorSoundUrl)
  primeLowLatencyAudio()
  preloadSoundBuffer(correctSoundUrl)
  preloadSoundBuffer(errorSoundUrl)
  warmSpeechVoices()
  unlockSpeechSynthesis()

  audioUnlockPromise = Promise.resolve()
    .then(() => getAudioContext()?.resume?.())
    .then(() => {
      audioUnlocked = true
    })
    .catch(() => {
      audioUnlocked = true
    })

  return audioUnlockPromise
}

function playOneShot(url, volume = 1, fallback = 'tap') {
  unlockAudio()
  if (instantToneKinds.has(fallback)) {
    playTone(fallback, volume)
    preloadSoundBuffer(url)
    return
  }
  if (playBufferedSound(url, volume)) return
  playTone(fallback, volume)
  preloadSoundBuffer(url)
  if (getAudioContext()) return

  const baseAudio = preloadSound(url)
  if (!baseAudio) {
    return
  }

  const audio = baseAudio.paused ? baseAudio : baseAudio.cloneNode(true)
  audio.volume = volume
  audio.currentTime = 0
  audio.play().catch(() => {
    playTone(fallback, volume)
  })
}

function getSpeechSynthesis() {
  return typeof window === 'undefined' ? null : window.speechSynthesis
}

function isNativeApp() {
  return Boolean(Capacitor.isNativePlatform?.())
}

function delayMs(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function waitForEnglishVoice(timeoutMs = speechVoiceWaitMs) {
  const synth = getSpeechSynthesis()
  if (!synth?.getVoices) return Promise.resolve([])

  const existingVoices = synth.getVoices()
  if (existingVoices.length) return Promise.resolve(existingVoices)
  if (voicesReadyPromise) return voicesReadyPromise

  voicesReadyPromise = new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      synth.removeEventListener?.('voiceschanged', finish)
      resolve(synth.getVoices?.() || [])
    }

    synth.addEventListener?.('voiceschanged', finish)
    window.setTimeout(finish, timeoutMs)
    synth.getVoices()
  }).finally(() => {
    voicesReadyPromise = null
  })

  return voicesReadyPromise
}

function warmSpeechVoices() {
  waitForEnglishVoice().catch(() => {})
}

function stopCurrentSpeechPlayback() {
  getSpeechSynthesis()?.cancel?.()
  if (isNativeApp()) TextToSpeech.stop().catch(() => {})
  if (activeSpeechAudio) {
    activeSpeechAudio.pause()
    activeSpeechAudio.currentTime = 0
    activeSpeechAudio.removeAttribute?.('src')
    activeSpeechAudio.src = ''
    activeSpeechAudio.load?.()
    activeSpeechAudio = null
  }
}

function stopSpeech() {
  speechRunId += 1
  stopCurrentSpeechPlayback()
}

function speechPitchForGender(voiceGender) {
  return voiceGender === 'male' ? 0.96 : 1.02
}

function voiceDescriptor(voice) {
  return `${voice?.name || ''} ${voice?.voiceURI || ''} ${voice?.lang || ''}`.toLowerCase()
}

function voiceGenderMatch(voice, voiceGender) {
  const descriptor = voiceDescriptor(voice)
  return voiceNamePatterns[voiceGender]?.test(descriptor)
}

function languageScore(voice) {
  const lang = voice?.lang || ''
  if (/^en-US/i.test(lang)) return 30
  if (/^en-GB/i.test(lang)) return 24
  if (/^en/i.test(lang)) return 18
  return 0
}

function serviceScore(voice) {
  const descriptor = voiceDescriptor(voice)
  let score = voice?.localService ? 5 : 0
  if (highQualityVoicePattern.test(descriptor)) score += 16
  if (/local|premium|enhanced|neural|natural/i.test(descriptor)) score += 8
  if (noveltyVoicePattern.test(descriptor)) score -= 80
  return score
}

function preferredVoiceScore(voice, voiceGender) {
  const descriptor = voiceDescriptor(voice)
  const patterns = preferredVoicePatterns[voiceGender] || []
  const index = patterns.findIndex((pattern) => pattern.test(descriptor))
  return index >= 0 ? 70 - index * 12 : 0
}

function selectEnglishVoice(voices, voiceGender) {
  const withIndex = voices.map((voice, index) => ({ voice, index }))
  const englishVoices = withIndex.filter(({ voice }) => /^en/i.test(voice.lang || ''))
  const candidates = englishVoices.length ? englishVoices : withIndex
  const oppositeGender = voiceGender === 'male' ? 'female' : 'male'
  const rankVoice = (item) => {
    const targetMatch = voiceGenderMatch(item.voice, voiceGender)
    const oppositeMatch = voiceGenderMatch(item.voice, oppositeGender)
    return {
      ...item,
      targetMatch,
      oppositeMatch,
      score:
        preferredVoiceScore(item.voice, voiceGender) +
        (targetMatch ? 90 : 0) -
        (oppositeMatch ? 110 : 0) +
        languageScore(item.voice) +
        serviceScore(item.voice),
    }
  }
  const ranked = candidates.map(rankVoice).sort((a, b) => b.score - a.score)
  return ranked.find((item) => item.targetMatch) || ranked.find((item) => !item.oppositeMatch) || ranked[0] || null
}

function pickEnglishVoice(voiceGender) {
  const voices = getSpeechSynthesis()?.getVoices?.() || []
  return selectEnglishVoice(voices, voiceGender)?.voice || null
}

async function pickNativeEnglishVoiceIndex(voiceGender) {
  if (!isNativeApp() || !TextToSpeech.getSupportedVoices) return undefined
  try {
    nativeVoicesPromise ||= TextToSpeech.getSupportedVoices()
    const result = await nativeVoicesPromise
    return selectEnglishVoice(result?.voices || [], voiceGender)?.index
  } catch {
    return undefined
  }
}

function playSingleSpeechAudio(audioUrl, { rate = 1, volume = 1 }, currentRun) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl)
    audio.preload = 'auto'
    audio.playsInline = true
    audio.volume = volume
    audio.playbackRate = Math.min(1.35, Math.max(0.65, rate))
    activeSpeechAudio = audio

    const cleanup = () => {
      audio.onended = null
      audio.onerror = null
      if (activeSpeechAudio === audio) activeSpeechAudio = null
    }

    audio.onended = () => {
      cleanup()
      resolve()
    }
    audio.onerror = () => {
      cleanup()
      reject(new Error('Audio failed'))
    }

    if (currentRun !== speechRunId) {
      cleanup()
      resolve()
      return
    }

    audio.play().catch((error) => {
      cleanup()
      reject(error)
    })
  })
}

async function playSpeechAudioSequence(audioUrl, { repeat, gap, delay, rate, volume }, currentRun) {
  if (delay > 0) await delayMs(delay)
  for (let index = 0; index < repeat; index += 1) {
    if (currentRun !== speechRunId) return
    await playSingleSpeechAudio(audioUrl, { rate, volume }, currentRun)
    if (index < repeat - 1 && gap > 0) await delayMs(gap)
  }
}

function speakWithDeviceVoice(text, speechSettings, options, currentRun, repeat, gap, delay, pitch) {
  if (isNativeApp()) {
    ;(async () => {
      if (delay > 0) await delayMs(delay)
      const voice = await pickNativeEnglishVoiceIndex(speechSettings.voiceGender)
      for (let index = 0; index < repeat; index += 1) {
        if (currentRun !== speechRunId) return
        try {
          await TextToSpeech.speak({
            text,
            lang: 'en-US',
            rate: speechSettings.rate,
            pitch,
            volume: options.volume ?? 1,
            ...(Number.isInteger(voice) ? { voice } : {}),
            queueStrategy: QueueStrategy.Flush,
          })
        } catch {
          return
        }
        if (index < repeat - 1 && gap > 0) await delayMs(gap)
      }
    })()
    return
  }

  const synth = getSpeechSynthesis()
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return
  synth.resume?.()
  waitForEnglishVoice(250).catch(() => {})

  if (currentRun !== speechRunId) return
  let remaining = repeat

  const speakNext = () => {
    if (currentRun !== speechRunId || remaining <= 0) return
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = pickEnglishVoice(speechSettings.voiceGender)
    utterance.lang = voice?.lang || 'en-US'
    utterance.rate = speechSettings.rate
    utterance.pitch = pitch
    utterance.volume = options.volume ?? 1
    if (voice) utterance.voice = voice
    remaining -= 1
    retainedUtterances.add(utterance)

    const queueNext = () => {
      retainedUtterances.delete(utterance)
      if (currentRun !== speechRunId || remaining <= 0) return
      window.setTimeout(speakNext, gap)
    }

    utterance.onend = queueNext
    utterance.onerror = queueNext
    synth.speak(utterance)
    synth.resume?.()
  }

  if (delay > 0) {
    window.setTimeout(speakNext, delay)
  } else {
    speakNext()
  }
}

function speakText(text, options = {}) {
  unlockAudio()
  if (!text) return
  const speechSettings = normalizeSpeechSettings({ ...currentSpeechSettings, ...options })
  const repeat = Math.max(1, options.repeat || 1)
  const gap = Math.max(0, options.gap ?? repeatReadGapMs)
  const delay = Math.max(0, options.delay || 0)
  const pitch = options.pitch ?? speechPitchForGender(speechSettings.voiceGender)
  const currentRun = speechRunId + 1
  speechRunId = currentRun
  stopCurrentSpeechPlayback()

  const primaryAudioUrl = options.audioUrl || cloudTtsUrl(text, speechSettings)

  if (primaryAudioUrl) {
    playSpeechAudioSequence(primaryAudioUrl, {
      repeat,
      gap,
      delay,
      rate: speechSettings.rate,
      volume: options.volume ?? 1,
    }, currentRun).catch(() => {
      if (currentRun !== speechRunId) return
      if (options.fallbackAudioUrl) {
        playSpeechAudioSequence(options.fallbackAudioUrl, {
          repeat,
          gap,
          delay: 0,
          rate: speechSettings.rate,
          volume: options.volume ?? 1,
        }, currentRun).catch(() => {
          if (currentRun !== speechRunId) return
          speakWithDeviceVoice(text, speechSettings, options, currentRun, repeat, gap, 0, pitch)
        })
        return
      }
      speakWithDeviceVoice(text, speechSettings, options, currentRun, repeat, gap, 0, pitch)
    })
    return
  }

  speakWithDeviceVoice(text, speechSettings, options, currentRun, repeat, gap, delay, pitch)
}

function playStatementAudio(statement, repeat = 1, options = {}) {
  if (!statement?.english) return
  speakText(statement.english, { repeat, fallbackAudioUrl: statement.audioUrl, ...options })
}

function playAutoStatementAudio(statement, options = {}) {
  if (!statement?.english || currentAutoReadRepeat <= 0) {
    stopSpeech()
    return
  }
  playStatementAudio(statement, currentAutoReadRepeat, options)
}

function playTypingSound() {
  unlockAudio()
  playTone('typing', 0.85)
}

function archiveItemFromStatement(statement, lesson) {
  if (!statement) return null
  const savedAt = new Date().toISOString()
  return {
    id: statement.id,
    english: statement.english,
    chinese: statement.chinese,
    soundmark: statement.soundmark || '',
    lessonTitle: lesson?.title || '',
    addedAt: savedAt,
    updatedAt: savedAt,
  }
}

function forgettingRate(item) {
  const missCount = Math.max(0, Number(item?.missCount) || 0)
  const attemptCount = Math.max(missCount, Number(item?.attemptCount) || missCount || 1)
  return Math.round((missCount / attemptCount) * 100)
}

function sortForgottenItems(items = []) {
  return [...items].sort((a, b) => {
    const rateDiff = forgettingRate(b) - forgettingRate(a)
    if (rateDiff) return rateDiff
    const missDiff = (Number(b?.missCount) || 0) - (Number(a?.missCount) || 0)
    if (missDiff) return missDiff
    return Date.parse(b?.lastMissedAt || b?.updatedAt || 0) - Date.parse(a?.lastMissedAt || a?.updatedAt || 0)
  })
}

function makeForgottenPhraseItem(statement, lesson) {
  if (!statement?.english) return null
  return {
    id: `phrase:${statement.id}`,
    kind: 'phrase',
    english: statement.english,
    chinese: statement.chinese,
    soundmark: statement.soundmark || '',
    lessonTitle: lesson?.title || '',
  }
}

function getIncorrectWordIndexes(statement, answerText) {
  const expectedWords = tokenizeEnglish(statement?.english || '')
  const typedWords = tokenizeEnglish(answerText || '')
  const indexes = new Set()

  expectedWords.forEach((word, index) => {
    const typed = typedWords[index] || ''
    if (!typed || normalizeAnswer(typed) !== normalizeAnswer(word)) indexes.add(index)
  })

  if (typedWords.length > expectedWords.length && expectedWords.length) {
    indexes.add(expectedWords.length - 1)
  }

  return indexes
}

function makeForgottenWordItems(statement, lesson, options = {}) {
  const { answerText = '', includeAll = false } = options
  const wrongIndexes = includeAll ? null : getIncorrectWordIndexes(statement, answerText)
  const seen = new Set()

  return buildWordBreakdown(statement, lesson)
    .filter((_, index) => includeAll || wrongIndexes.has(index))
    .map((item) => {
      const normalized = normalizeWord(item.word)
      if (!normalized || seen.has(normalized)) return null
      seen.add(normalized)
      return {
        id: `word:${normalized}`,
        kind: 'word',
        english: item.word,
        chinese: item.chinese || '',
        soundmark: item.soundmark || '',
        lessonTitle: lesson?.title || '',
        pos: item.pos,
      }
    })
    .filter(Boolean)
}

function mergeForgottenList(list, incomingItems, reason, failed) {
  const now = new Date().toISOString()
  const merged = new Map((list || []).map((item) => [item.id, item]))

  incomingItems.filter(Boolean).forEach((incoming) => {
    const existing = merged.get(incoming.id)
    if (!existing && !failed) return
    const base = existing || {}
    const missCount = Math.max(0, Number(base.missCount) || 0) + (failed ? 1 : 0)
    const attemptCount = Math.max(0, Number(base.attemptCount) || 0) + 1
    merged.set(incoming.id, {
      ...base,
      ...incoming,
      addedAt: base.addedAt || now,
      missCount,
      attemptCount: Math.max(attemptCount, missCount),
      wrongCount: Math.max(0, Number(base.wrongCount) || 0) + (failed && reason === 'wrong' ? 1 : 0),
      revealCount: Math.max(0, Number(base.revealCount) || 0) + (failed && reason === 'reveal' ? 1 : 0),
      lastMissedAt: failed ? now : base.lastMissedAt || null,
      updatedAt: now,
    })
  })

  return sortForgottenItems([...merged.values()])
}

const wordFallbacks = {
  i: { chinese: '我', pos: '代词' },
  me: { chinese: '我', pos: '代词' },
  you: { chinese: '你', pos: '代词' },
  he: { chinese: '他', pos: '代词' },
  she: { chinese: '她', pos: '代词' },
  it: { chinese: '它', pos: '代词' },
  we: { chinese: '我们', pos: '代词' },
  they: { chinese: '他们', pos: '代词' },
  am: { chinese: '是', pos: '助动词' },
  is: { chinese: '是', pos: '助动词' },
  are: { chinese: '是', pos: '助动词' },
  was: { chinese: '是', pos: '助动词' },
  were: { chinese: '是', pos: '助动词' },
  do: { chinese: '做', pos: '动词' },
  does: { chinese: '做', pos: '助动词' },
  did: { chinese: '做了', pos: '助动词' },
  have: { chinese: '有', pos: '动词' },
  has: { chinese: '有', pos: '动词' },
  like: { chinese: '喜欢', pos: '动词' },
  want: { chinese: '想要', pos: '动词' },
  need: { chinese: '需要', pos: '动词' },
  go: { chinese: '去', pos: '动词' },
  come: { chinese: '来', pos: '动词' },
  eat: { chinese: '吃', pos: '动词' },
  food: { chinese: '食物', pos: '名词' },
  the: { chinese: '这个', pos: '冠词' },
  a: { chinese: '一个', pos: '冠词' },
  an: { chinese: '一个', pos: '冠词' },
  to: { chinese: '去', pos: '介词' },
  for: { chinese: '为了', pos: '介词' },
  in: { chinese: '在里面', pos: '介词' },
  on: { chinese: '在上面', pos: '介词' },
  here: { chinese: '这里', pos: '副词' },
  very: { chinese: '非常', pos: '副词' },
  important: { chinese: '重要的', pos: '形容词' },
  impossible: { chinese: '不可能的', pos: '形容词' },
  possible: { chinese: '可能的', pos: '形容词' },
}

function cleanChinese(value) {
  return (value || '').split(/[；;，,（(]/)[0].trim()
}

function normalizeWord(value) {
  return (value || '').toLowerCase().replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '')
}

function tokenizeEnglish(value) {
  return value?.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []
}

function splitSoundmarks(value) {
  return value?.match(/\/[^/]+\/\s*/g)?.map((item) => item.trim()) || []
}

function classifyWord(word) {
  const normalized = normalizeWord(word)
  if (wordFallbacks[normalized]?.pos) return wordFallbacks[normalized].pos
  if (['my', 'your', 'his', 'her', 'our', 'their', 'this', 'that', 'these', 'those'].includes(normalized)) return '代词'
  if (['can', 'could', 'will', 'would', 'should', 'must', 'may', 'might'].includes(normalized)) return '助动词'
  if (['the', 'a', 'an'].includes(normalized)) return '冠词'
  if (['to', 'for', 'of', 'with', 'from', 'at', 'by', 'about', 'into', 'over', 'under'].includes(normalized)) return '介词'
  if (normalized.endsWith('ly')) return '副词'
  if (normalized.endsWith('ful') || normalized.endsWith('able') || normalized.endsWith('ible') || normalized.endsWith('al') || normalized.endsWith('ive')) return '形容词'
  if (normalized.endsWith('ing') || normalized.endsWith('ed')) return '动词'
  return '名词'
}

function wordTone(pos) {
  return {
    代词: 'pronoun',
    助动词: 'auxiliary',
    动词: 'verb',
    形容词: 'adjective',
    名词: 'noun',
    冠词: 'article',
    介词: 'preposition',
    副词: 'adverb',
  }[pos] || 'noun'
}

function buildSingleWordLookup(lesson) {
  const lookup = new Map()
  for (const item of lesson?.statements || []) {
    const words = tokenizeEnglish(item.english)
    if (words.length === 1) {
      lookup.set(normalizeWord(words[0]), item)
    }
  }
  return lookup
}

function buildWordBreakdown(statement, lesson) {
  const words = tokenizeEnglish(statement?.english || '')
  const soundmarks = splitSoundmarks(statement?.soundmark || '')
  const lookup = buildSingleWordLookup(lesson)
  return words.map((word, index) => {
    const normalized = normalizeWord(word)
    const matched = lookup.get(normalized)
    const fallback = wordFallbacks[normalized] || {}
    const pos = classifyWord(word)
    return {
      word,
      soundmark: soundmarks[index] || matched?.soundmark?.trim() || '',
      chinese: cleanChinese(matched?.chinese) || fallback.chinese || '',
      audioUrl: matched?.audioUrl || lesson?.audioByText?.[normalizeAnswer(word)] || '',
      pos,
      tone: wordTone(pos),
    }
  })
}

function buildAiStatementPayload(statement, lesson) {
  if (!statement) return null
  return {
    id: statement.id || '',
    english: statement.english || '',
    chinese: statement.chinese || '',
    soundmark: statement.soundmark || '',
    words: buildWordBreakdown(statement, lesson).map((item) => ({
      word: item.word,
      soundmark: item.soundmark,
      pos: item.pos,
      chinese: item.chinese,
    })),
  }
}

const baseCourses = courseCatalog

const modes = [
  {
    id: 'translate',
    title: '中译英',
    desc: '看到中文提示，尝试用英文表达。练习运用所学词汇和语法。',
    icon: MessageSquareText,
    recommended: true,
  },
  {
    id: 'dictation',
    title: '听写',
    desc: '听音频，写出你听到的英文单词，训练听力，掌握单词拼写。',
    icon: Headphones,
  },
  {
    id: 'listening',
    title: '听力',
    desc: '通过盲听、慢听、字幕三个阶段，逐步听懂完整句子。',
    icon: Volume2,
  },
  {
    id: 'speaking',
    title: '口语评测',
    desc: '看到中文提示，尝试用英文说出来，评测发音、语调、流利度。',
    icon: Mic2,
  },
  {
    id: 'reading',
    title: '阅读',
    desc: '全文阅读、单句精读、点词查义',
    icon: BookOpen,
  },
]

const practicePrompts = {
  translate: {
    prompt: '我最近一直想把生活节奏调回来。',
    answer: "I've been trying to get back into a routine lately.",
    hint: 'get back into a routine',
    choices: ['I want to fix my life rhythm.', "I've been trying to get back into a routine lately.", 'I recently want to return my speed.'],
  },
  dictation: {
    prompt: 'Listen and type the missing phrase: I could use ____ and a coffee.',
    answer: 'a walk',
    hint: '两个词，表示散步',
    choices: ['a walk', 'a rest', 'a seat'],
  },
  listening: {
    prompt: 'A friend says: “I’m kind of over crowded places lately.”',
    answer: "Same. Let's do something low-key.",
    hint: '回应对方想轻松一点',
    choices: ["Same. Let's do something low-key.", 'You must go to a club.', 'Crowded places are always required.'],
  },
  speaking: {
    prompt: "Read aloud: I'd rather have a chill night than force myself to go out.",
    answer: "I'd rather have a chill night than force myself to go out.",
    hint: '注意 rather / than 的节奏',
    choices: ['Start recording', 'Play sample', 'Mark as practiced'],
  },
  reading: {
    prompt: "Break down: That sounds like one of those days where everything takes longer than it should.",
    answer: 'one of those days / where everything takes longer than it should',
    hint: '先找到主句，再找 where 引导的说明',
    choices: ['That sounds like...', 'one of those days...', 'where everything takes longer...'],
  },
}

const navSections = [
  {
    label: '学习',
    items: [
      { id: 'dashboard', label: '主页', icon: Home },
      { id: 'courses', label: '我的课程包', icon: LibraryBig },
      { id: 'analytics', label: '成长分析', icon: BarChart3 },
    ],
  },
  {
    label: '档案',
    items: [
      { id: 'mastered', label: '掌握列表', icon: Check },
      { id: 'review', label: '复习本', icon: ClipboardList },
      { id: 'notes', label: '笔记', icon: NotebookTabs },
      { id: 'vocab', label: '生词本', icon: BookText },
    ],
  },
]

const heatmap = [0, 2, 1, 3, 0, 4, 2, 3, 1, 0, 4, 4, 2, 1, 0, 3, 2, 4, 1, 3, 0, 2, 3, 4, 2, 1, 0, 3]

function clearLocalLearningState() {
  try {
    localStorage.removeItem(progressKey)
    localStorage.removeItem(savedItemsKey)
  } catch {
    // Ignore storage cleanup errors.
  }
}

function isNightStudyTime(date = new Date()) {
  const hour = date.getHours()
  return hour >= 18 || hour < 7
}

function normalizeCoursePack(course, pack) {
  const lessons = [...(pack.courses || [])]
    .sort((a, b) => a.order - b.order)
    .map((lesson) => {
      const audioLookup = buildAudioUrlLookup(lesson.audioRequests || [])
      const audioByText = Object.fromEntries(audioLookup)
      return {
        ...lesson,
        audioByText,
        statements: [...(lesson.statements || [])]
          .sort((a, b) => a.order - b.order)
          .map((statement) => ({
            ...statement,
            audioUrl: audioLookup.get(normalizeAnswer(statement.english || '')) || statement.audioUrl || '',
          })),
        sentences: lesson.sentences || [],
      }
    })
  const statementTotal = lessons.reduce((sum, lesson) => sum + lesson.statements.length, 0)

  return {
    lessonData: lessons,
    lessons: lessons.length || course.lessons,
    statementTotal,
    subtitle: `${lessons.length || course.lessons} 节课 · ${statementTotal.toLocaleString('zh-CN')} 条练习`,
  }
}

async function loadCoursePack(course) {
  if (course.lessonData?.length) return course
  const response = await fetch(`${import.meta.env.BASE_URL}${course.dataPath}`, {
    cache: 'force-cache',
    headers: authHeaders(),
  })
  if (!response.ok) throw new Error('课程包加载失败')
  const pack = await response.json()
  return { ...course, ...normalizeCoursePack(course, pack) }
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [savedProgress, setSavedProgress] = useState({})
  const [savedItems, setSavedItems] = useState(createEmptySavedItems)
  const [selectedCourseId, setSelectedCourseId] = useState(baseCourses[0]?.id || '')
  const [loadedCourses, setLoadedCourses] = useState({})
  const [loadingCourseId, setLoadingCourseId] = useState(null)
  const [modePicker, setModePicker] = useState(null)
  const [practice, setPractice] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [answerCountPulse, setAnswerCountPulse] = useState(0)
  const [query, setQuery] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isNightStudy, setIsNightStudy] = useState(() => isNightStudyTime())
  const [storageReady, setStorageReady] = useState(false)
  const [usesServerStorage, setUsesServerStorage] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [syncError, setSyncError] = useState('')
  const [userPanelOpen, setUserPanelOpen] = useState(false)
  const savedProgressRef = useRef(savedProgress)
  const savedItemsRef = useRef(savedItems)
  const courseStudyClockRef = useRef(null)

  useEffect(() => {
    warmSpeechVoices()
  }, [])

  useEffect(() => {
    function handleAudioGesture() {
      unlockAudio()
    }

    window.addEventListener('pointerdown', handleAudioGesture, { capture: true, passive: true })
    window.addEventListener('touchstart', handleAudioGesture, { capture: true, passive: true })
    window.addEventListener('keydown', handleAudioGesture, { capture: true })
    return () => {
      window.removeEventListener('pointerdown', handleAudioGesture, { capture: true })
      window.removeEventListener('touchstart', handleAudioGesture, { capture: true })
      window.removeEventListener('keydown', handleAudioGesture, { capture: true })
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadState() {
      try {
        const sessionResponse = await fetch(serverUrl('/api/session'), {
          cache: 'no-store',
          headers: authHeaders(),
        })
        if (cancelled) return
        if (!sessionResponse.ok) throw new Error('登录状态读取失败')
        const session = await sessionResponse.json()
        if (!session.user) {
          clearStoredSession()
          setCurrentUser(null)
          setAuthError('')
          return
        }

        setCurrentUser(session.user)
        setAuthError('')
        const serverState = mergeServerStateWithPending(await loadServerState())
        if (cancelled) return
        clearLocalLearningState()
        savedProgressRef.current = serverState.progress
        savedItemsRef.current = serverState.savedItems
        setSavedProgress(serverState.progress)
        setSavedItems(serverState.savedItems)
        setUsesServerStorage(true)
        setSyncError('')
        if (serverState.hadPending) {
          saveServerState(serverState.progress, serverState.savedItems)
            .then(() => setSyncError(''))
            .catch(() => setSyncError('网络不稳，正在自动重试保存'))
        }
      } catch {
        if (cancelled) return
        clearStoredSession()
        setCurrentUser(null)
        setUsesServerStorage(false)
        setAuthError('无法连接服务器，请稍后再试')
      } finally {
        if (!cancelled) {
          setStorageReady(true)
          setAuthReady(true)
        }
      }
    }

    loadState()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setIsNightStudy(isNightStudyTime()), 60 * 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('night-study-root', isNightStudy)
    document.body.classList.toggle('night-study-root', isNightStudy)
    return () => {
      document.documentElement.classList.remove('night-study-root')
      document.body.classList.remove('night-study-root')
    }
  }, [isNightStudy])

  useEffect(() => {
    savedProgressRef.current = savedProgress
  }, [savedProgress])

  useEffect(() => {
    savedItemsRef.current = savedItems
  }, [savedItems])

  useEffect(() => {
    if (!storageReady || !currentUser) return
    if (usesServerStorage) {
      saveServerState(savedProgress, savedItems)
        .then(() => setSyncError(''))
        .catch(() => setSyncError('网络不稳，正在自动重试保存'))
    }
  }, [currentUser, savedProgress, savedItems, storageReady, usesServerStorage])

  useEffect(() => {
    function handleSyncStatus(event) {
      if (event.detail?.status === 'saved') setSyncError('')
      if (event.detail?.status === 'retrying') setSyncError('网络不稳，正在自动重试保存')
    }

    function retryPendingSave() {
      wakeServerStateSaveQueue()
    }

    window.addEventListener('julebu-server-sync', handleSyncStatus)
    window.addEventListener('online', retryPendingSave)
    document.addEventListener('visibilitychange', retryPendingSave)
    return () => {
      window.removeEventListener('julebu-server-sync', handleSyncStatus)
      window.removeEventListener('online', retryPendingSave)
      document.removeEventListener('visibilitychange', retryPendingSave)
    }
  }, [])

  useEffect(() => {
    if (!storageReady || !currentUser || !usesServerStorage) return undefined

    function flushBeforePause() {
      const latestProgress = savedProgressRef.current
      const latestItems = savedItemsRef.current
      saveServerState(latestProgress, latestItems).catch(() => {})
      saveServerStateNow(latestProgress, latestItems).catch(() => {})
    }

    function handleVisibilityFlush() {
      if (document.visibilityState === 'hidden') flushBeforePause()
    }

    window.addEventListener('pagehide', flushBeforePause)
    document.addEventListener('visibilitychange', handleVisibilityFlush)
    return () => {
      window.removeEventListener('pagehide', flushBeforePause)
      document.removeEventListener('visibilitychange', handleVisibilityFlush)
    }
  }, [currentUser, storageReady, usesServerStorage])

  const courses = useMemo(
    () =>
      baseCourses.map((course) => {
        const loaded = loadedCourses[course.id]
        const hydrated = loaded ? { ...course, ...loaded } : course
        const saved = savedProgress[course.id]
        return saved ? { ...hydrated, ...saved, lessonData: hydrated.lessonData, lessonSummaries: hydrated.lessonSummaries } : hydrated
      }),
    [loadedCourses, savedProgress],
  )

  const selectedCourse = courses.find((course) => course.id === selectedCourseId) || courses[0]
  const currentMode = practice ? modes.find((mode) => mode.id === practice.modeId) : null
  const isStudyView = activeView === 'practice' || activeView === 'reading'
  const globalStats = getGlobalStats(savedProgress)

  useEffect(() => {
    const courseId = practice?.course?.id || ''
    const shouldTrack = Boolean(courseId && isStudyView)

    function clearClock() {
      courseStudyClockRef.current = null
    }

    function recordActiveTime(flushNow = false) {
      const clock = courseStudyClockRef.current
      if (!clock?.courseId || !clock.startedAt) return

      const now = Date.now()
      const elapsedSeconds = Math.min(maxCourseStudyGapSeconds, Math.floor((now - clock.startedAt) / 1000))
      clock.startedAt = now
      if (!elapsedSeconds) return

      let nextProgress = savedProgressRef.current
      const updateProgress = (current) => {
        nextProgress = addCourseStudyTime(current, clock.courseId, elapsedSeconds, new Date(now))
        savedProgressRef.current = nextProgress
        return nextProgress
      }

      if (flushNow) flushSync(() => setSavedProgress(updateProgress))
      else setSavedProgress(updateProgress)

      if (flushNow && storageReady && currentUser && usesServerStorage) {
        saveServerState(nextProgress, savedItemsRef.current).catch(() => {})
        saveServerStateNow(nextProgress, savedItemsRef.current).catch(() => {})
      }
    }

    function startTracking() {
      if (!shouldTrack || document.visibilityState !== 'visible') {
        clearClock()
        return
      }

      const clock = courseStudyClockRef.current
      if (clock?.courseId && clock.courseId !== courseId) {
        recordActiveTime()
        clearClock()
      }

      if (!courseStudyClockRef.current) {
        courseStudyClockRef.current = { courseId, startedAt: Date.now() }
      }
    }

    function pauseTracking() {
      recordActiveTime(true)
      clearClock()
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') pauseTracking()
      else startTracking()
    }

    startTracking()
    const checkpointTimer = shouldTrack
      ? window.setInterval(() => {
          if (document.visibilityState === 'visible') recordActiveTime()
        }, courseStudyCheckpointMs)
      : 0

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', pauseTracking, { capture: true })
    return () => {
      if (checkpointTimer) window.clearInterval(checkpointTimer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', pauseTracking, { capture: true })
      recordActiveTime()
      clearClock()
    }
  }, [currentUser, isStudyView, practice?.course?.id, storageReady, usesServerStorage])

  const normalizedSavedItems = useMemo(() => normalizeSavedItems(savedItems), [savedItems])
  const currentPracticeStatementId = practice ? getPracticeStatement(practice).statement?.id || '' : ''
  const isCurrentPracticeMastered = Boolean(
    currentPracticeStatementId && normalizedSavedItems.mastered.some((item) => item.id === currentPracticeStatementId),
  )
  const isCurrentPracticeVocab = Boolean(
    currentPracticeStatementId && normalizedSavedItems.vocab.some((item) => item.id === currentPracticeStatementId),
  )
  const forgottenReviewItems = useMemo(() => {
    return sortForgottenItems([...normalizedSavedItems.forgottenWords, ...normalizedSavedItems.forgottenPhrases])
  }, [normalizedSavedItems])

  function navigate(view) {
    setActiveView(view)
    setMobileNavOpen(false)
    setPractice(null)
  }

  function openCourse(courseId) {
    setSelectedCourseId(courseId)
    setActiveView('course-detail')
    setMobileNavOpen(false)
  }

  async function openPracticePicker(courseId, lesson = 1) {
    unlockAudio()
    const course = courses.find((item) => item.id === courseId) || selectedCourse
    setSelectedCourseId(course.id)
    setFeedback(null)
    setAnswer('')
    setLoadingCourseId(course.id)
    try {
      const loadedCourse = await loadCoursePack(course)
      setLoadedCourses((current) => ({
        ...current,
        [course.id]: {
          lessonData: loadedCourse.lessonData,
          lessons: loadedCourse.lessons,
          statementTotal: loadedCourse.statementTotal,
          subtitle: loadedCourse.subtitle,
        },
      }))
      setModePicker({ course: loadedCourse, lesson })
    } catch {
      setFeedback({
        status: 'close',
        title: '课程加载失败',
        body: '请稍后再试',
      })
    } finally {
      setLoadingCourseId(null)
    }
  }

  function beginPractice(modeId) {
    unlockAudio()
    const target = modePicker || { course: selectedCourse, lesson: getContinueLesson(selectedCourse) }
    const lesson = getLesson(target.course, target.lesson)
    const lessonProgress = savedProgress[target.course.id]?.lessonProgress?.[lesson?.id] || {}
    const totalStatements = getLessonStatementCount(lesson)
    const completedStatements = Number(lessonProgress.completedStatements) || 0
    const lessonCompleted = totalStatements
      ? completedStatements >= totalStatements || target.lesson <= (savedProgress[target.course.id]?.completed || target.course.completed || 0)
      : target.lesson <= (savedProgress[target.course.id]?.completed || target.course.completed || 0)
    const startIndex = lessonCompleted ? 0 : lessonProgress.statementIndex || 0
    setPractice({
      course: target.course,
      lesson: target.lesson,
      modeId,
      statementIndex: startIndex,
    })
    setActiveView(modeId === 'reading' ? 'reading' : 'practice')
    setModePicker(null)
    setFeedback(null)
    setAnswer('')
  }

  function submitPractice(submittedAnswer = answer) {
    if (!practice) return
    if (feedback?.status === 'good' || feedback?.status === 'answer') {
      movePractice(1)
      return
    }

    const { lesson, statement, index, statements } = getPracticeStatement(practice)
    const prompt = statement
      ? {
          prompt: statement.chinese,
          answer: statement.english,
          hint: statement.soundmark || '',
        }
      : practicePrompts[practice.modeId]
    const answerToCheck = typeof submittedAnswer === 'string' ? submittedAnswer : answer
    if (answerToCheck !== answer) setAnswer(answerToCheck)
    const isCorrect = isAnswerCorrect(answerToCheck, prompt.answer)
    playOneShot(isCorrect ? correctSoundUrl : errorSoundUrl, 1, isCorrect ? 'correct' : 'error')
    if (isCorrect && statement) {
      playAutoStatementAudio(statement, { delay: correctReadDelayMs, gap: repeatReadGapMs })
    }
    if (statement) {
      recordForgottenItems(statement, lesson, isCorrect ? 'correct' : 'wrong', !isCorrect, answerToCheck)
    }
    setAnswerCountPulse((value) => value + 1)

    setFeedback({
      status: isCorrect ? 'good' : 'close',
      title: isCorrect ? '正确' : '再试一次',
      body: isCorrect
        ? prompt.answer
        : '答案还没有通过',
    })

    setSavedProgress((current) => {
      const currentGlobalStats = getGlobalStats(current)
      const nextStudyDates = [...new Set([...currentGlobalStats.studyDates, getLocalDateKey()])]
      const existing = current[practice.course.id] || {}
      const lessonProgress = existing.lessonProgress || {}
      const nextIndex = isCorrect ? Math.min(index + 1, Math.max(statements.length - 1, 0)) : index
      const lessonDone = isCorrect && index >= statements.length - 1
      const nextCompleted = lessonDone
        ? Math.min(practice.course.lessons, Math.max(existing.completed || 0, practice.lesson))
        : existing.completed || practice.course.completed || 0
      const nextLessonNumber = Math.min(nextCompleted + 1, practice.course.lessons)
      const nextProgress = {
        ...current,
        [globalStatsKey]: {
          ...(current[globalStatsKey] || {}),
          answerCount: currentGlobalStats.answerCount + 1,
          correctCount: currentGlobalStats.correctCount + (isCorrect ? 1 : 0),
          studyDates: nextStudyDates,
          lastAnsweredAt: new Date().toISOString(),
        },
        [practice.course.id]: {
          ...existing,
          completed: nextCompleted,
          currentLesson: getLessonTitle(practice.course, nextLessonNumber),
          lessonProgress: lesson?.id
            ? {
                ...lessonProgress,
                [lesson.id]: {
                  statementIndex: nextIndex,
                  completedStatements: Math.max(lessonProgress[lesson.id]?.completedStatements || 0, isCorrect ? index + 1 : index),
                },
              }
            : lessonProgress,
        },
      }
      savedProgressRef.current = nextProgress
      return nextProgress
    })

  }

  function movePractice(delta) {
    stopSpeech()
    setPractice((current) => {
      if (!current) return current
      const data = getPracticeStatement(current)
      const nextIndex = Math.min(Math.max(data.index + delta, 0), Math.max(data.statements.length - 1, 0))
      return { ...current, statementIndex: nextIndex }
    })
    setAnswer('')
    setFeedback(null)
  }

  function showPracticeAnswer() {
    if (!practice) return
    const { lesson, statement } = getPracticeStatement(practice)
    const prompt = statement ? statement.english : practicePrompts[practice.modeId]?.answer
    if (statement) {
      recordForgottenItems(statement, lesson, 'reveal', true)
    }
    setAnswer(prompt || '')
    setFeedback({
      status: 'answer',
      title: '答案',
      body: prompt || '',
    })
  }

  function recordForgottenItems(statement, lesson, reason, failed, answerText = '') {
    setSavedItems((current) => {
      const normalized = normalizeSavedItems(current)
      const includeAllWords = reason === 'reveal' || !failed
      return {
        ...normalized,
        forgottenWords: mergeForgottenList(
          normalized.forgottenWords,
          makeForgottenWordItems(statement, lesson, { answerText, includeAll: includeAllWords }),
          reason,
          failed,
        ),
        forgottenPhrases: mergeForgottenList(
          normalized.forgottenPhrases,
          [makeForgottenPhraseItem(statement, lesson)],
          reason,
          failed,
        ),
      }
    })
  }

  function retryPractice() {
    setAnswer('')
    setFeedback(null)
  }

  function togglePracticeItem(type) {
    if (!practice) return
    const { lesson, statement } = getPracticeStatement(practice)
    const item = archiveItemFromStatement(statement, lesson)
    if (!item) return
    const isSaved = normalizedSavedItems[type]?.some((existing) => existing.id === item.id)
    const removedAt = new Date().toISOString()

    setSavedItems((current) => {
      const normalized = normalizeSavedItems(current)
      const list = normalized[type] || []
      const alreadySaved = list.some((existing) => existing.id === item.id)
      const removedItems = {
        ...normalized.removedItems,
        [type]: { ...normalized.removedItems[type] },
      }

      if (alreadySaved) {
        removedItems[type][item.id] = removedAt
        return {
          ...normalized,
          [type]: list.filter((existing) => existing.id !== item.id),
          removedItems,
        }
      }

      return {
        ...normalized,
        [type]: [item, ...list.filter((existing) => existing.id !== item.id)],
        removedItems,
      }
    })

    setFeedback({
      status: isSaved ? 'removed' : 'saved',
      title: isSaved
        ? type === 'mastered' ? '已取消掌握' : '已从生词本移除'
        : type === 'mastered' ? '已加入掌握列表' : '已加入生词本',
      body: item.english,
    })
  }

  function resetDemoProgress() {
    savedProgressRef.current = {}
    savedItemsRef.current = createEmptySavedItems()
    setSavedProgress({})
    setSavedItems(savedItemsRef.current)
    setFeedback(null)
    setAnswer('')
  }

  async function finishLoginSession({ token, user }) {
    setStoredSession(token)
    setCurrentUser(user)
    setAuthError('')
    setActiveView('dashboard')
    setPractice(null)
    setModePicker(null)
    setUserPanelOpen(false)

    const serverState = mergeServerStateWithPending(await loadServerState(token), token)
    clearLocalLearningState()
    savedProgressRef.current = serverState.progress
    savedItemsRef.current = serverState.savedItems
    setSavedProgress(serverState.progress)
    setSavedItems(serverState.savedItems)
    setUsesServerStorage(true)
    setStorageReady(true)
    setSyncError('')
    if (serverState.hadPending) {
      saveServerState(serverState.progress, serverState.savedItems)
        .then(() => setSyncError(''))
        .catch(() => setSyncError('网络不稳，正在自动重试保存'))
    }
  }

  async function authenticateUser({ username, password, mode }) {
    const trimmedUsername = username.trim()
    if (!trimmedUsername || !password) {
      setAuthError('请输入用户名和密码')
      return
    }
    if (trimmedUsername.length < 2 || password.length < 4) {
      setAuthError('用户名至少 2 位，密码至少 4 位')
      return
    }

    try {
      const response = await fetch(serverUrl(mode === 'register' ? '/api/register' : '/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password }),
      })
      if (response.status === 401) {
        setAuthError('用户名或密码不正确')
        return
      }
      if (response.status === 409) {
        setAuthError('这个用户名已被使用')
        return
      }
      if (!response.ok) throw new Error('登录失败')
      await finishLoginSession(await response.json())
    } catch {
      setAuthError('服务器连接失败，请稍后再试')
    }
  }

  async function logoutUser() {
    const token = getStoredSession()
    if (token) {
      fetch(serverUrl('/api/logout'), {
        method: 'POST',
        headers: authHeaders(token),
        keepalive: true,
      }).catch(() => {})
    }
    clearStoredSession()
    stopSpeech()
    setCurrentUser(null)
    setPractice(null)
    setModePicker(null)
    setFeedback(null)
    setAnswer('')
    setUserPanelOpen(false)
    setActiveView('dashboard')
  }

  return (
    <div className={`app-shell ${isStudyView ? 'study-mode' : ''} ${isNightStudy ? 'night-study' : ''}`}>
      {!authReady || !currentUser ? (
        <AuthGateView
          loading={!authReady}
          error={authError}
          onSubmit={authenticateUser}
        />
      ) : (
        <>
      {!isStudyView && (
        <Sidebar
          activeView={activeView}
          mobileNavOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onNavigate={navigate}
        />
      )}

      <div className="workspace">
        {!isStudyView && (
          <Topbar
            query={query}
            setQuery={setQuery}
            onMenu={() => setMobileNavOpen(true)}
            onReset={resetDemoProgress}
            user={currentUser}
            studyDays={getStudyDayCount(globalStats)}
            onUser={() => setUserPanelOpen(true)}
          />
        )}

        <main className="content-frame">
          {activeView === 'dashboard' && (
            <Dashboard
              courses={courses}
              loadingCourseId={loadingCourseId}
              onOpenCourse={openCourse}
              onPractice={openPracticePicker}
              onNavigate={navigate}
              savedItems={savedItems}
              savedProgress={savedProgress}
            />
          )}
          {activeView === 'courses' && (
            <CoursesView
              courses={courses}
              query={query}
              loadingCourseId={loadingCourseId}
              onOpenCourse={openCourse}
              onPractice={openPracticePicker}
            />
          )}
          {activeView === 'course-detail' && (
            <CourseDetail course={selectedCourse} loadingCourseId={loadingCourseId} onBack={() => navigate('courses')} onPractice={openPracticePicker} />
          )}
          {activeView === 'analytics' && <AnalyticsView courses={courses} savedItems={savedItems} savedProgress={savedProgress} />}
          {activeView === 'mastered' && <ArchiveView type="mastered" items={savedItems.mastered} />}
          {activeView === 'review' && <ArchiveView type="review" items={forgottenReviewItems} />}
          {activeView === 'vocab' && <ArchiveView type="vocab" items={savedItems.vocab} />}
          {activeView === 'notes' && <ArchiveView type="notes" items={[]} />}
          {activeView === 'practice' && practice && (
            <PracticeView
              practice={practice}
              mode={currentMode}
              prompt={practicePrompts[practice.modeId]}
              practiceData={getPracticeStatement(practice)}
              answer={answer}
              setAnswer={setAnswer}
              feedback={feedback}
              onSubmit={submitPractice}
              onNext={() => movePractice(1)}
              onPrevious={() => movePractice(-1)}
              onShowAnswer={showPracticeAnswer}
              onRetry={retryPractice}
              onMaster={() => togglePracticeItem('mastered')}
              onVocab={() => togglePracticeItem('vocab')}
              isMastered={isCurrentPracticeMastered}
              isVocab={isCurrentPracticeVocab}
              onExitHome={() => {
                setActiveView('dashboard')
                setPractice(null)
              }}
              onExitCourses={() => {
                setActiveView('courses')
                setPractice(null)
              }}
              answerCount={globalStats.answerCount}
              answerCountPulse={answerCountPulse}
            />
          )}
          {activeView === 'reading' && practice && (
            <ReadingView
              practice={practice}
              onExit={() => {
                setActiveView('course-detail')
                setPractice(null)
              }}
              onPractice={() => setModePicker({ course: practice.course, lesson: practice.lesson })}
            />
          )}
        </main>
      </div>

      {modePicker && (
        <ModePicker
          course={modePicker.course}
          lesson={modePicker.lesson}
          onClose={() => setModePicker(null)}
          onBegin={beginPractice}
        />
      )}
      {userPanelOpen && currentUser && (
        <UserProfileDialog
          user={currentUser}
          storageLabel={usesServerStorage ? '服务器保存' : '未连接服务器'}
          onClose={() => setUserPanelOpen(false)}
          onLogout={logoutUser}
        />
      )}
      {syncError && <div className="sync-error-toast">{syncError}</div>}
        </>
      )}
    </div>
  )
}

function AuthGateView({ loading, error, onSubmit }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isRegister = mode === 'register'

  return (
    <main className="auth-gate">
      <section className="auth-panel">
        <div className="brand-mark">
          <User size={22} />
        </div>
        <h1>{isRegister ? '创建句乐部账号' : '登录句乐部'}</h1>
        <p>登录后才能进入课程、练习和保存学习进度。</p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit({ username, password, mode })
          }}
        >
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="用户名"
            autoComplete="username"
            autoFocus
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="密码"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? '连接中' : isRegister ? '创建账号' : '登录'}
          </button>
        </form>
        {error && <span>{error}</span>}
        <button className="text-button auth-switch" type="button" onClick={() => setMode(isRegister ? 'login' : 'register')}>
          {isRegister ? '已有账号，去登录' : '没有账号，创建一个'}
        </button>
      </section>
    </main>
  )
}

function Sidebar({ activeView, mobileNavOpen, onClose, onNavigate }) {
  return (
    <>
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark">
            <Sparkles size={20} />
          </div>
          <div>
            <strong>句乐部 Web</strong>
            <span>English Studio</span>
          </div>
        </div>

        <nav className="nav-stack" aria-label="主导航">
          {navSections.map((section) => (
            <div className="nav-section" key={section.label}>
              <p>{section.label}</p>
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  activeView === item.id || (activeView === 'course-detail' && item.id === 'courses') || (activeView === 'practice' && item.id === 'courses')
                return (
                  <button className={isActive ? 'active' : ''} key={item.id} type="button" onClick={() => onNavigate(item.id)}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-status">
          <ShieldCheck size={18} />
          <div>
            <strong>账号学习版</strong>
            <span>进度保存到服务器</span>
          </div>
        </div>
      </aside>
      {mobileNavOpen && <button className="nav-scrim" aria-label="关闭导航" type="button" onClick={onClose} />}
    </>
  )
}

function Topbar({ query, setQuery, onMenu, user, studyDays, onUser }) {
  const userInitial = (user?.displayName || user?.username || 'U').trim().slice(0, 1).toUpperCase()

  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" type="button" onClick={onMenu} aria-label="打开导航">
        <BookOpen size={20} />
      </button>
      <div className="search-box">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索课程、笔记、生词" />
      </div>
      <div className="topbar-actions">
        <div className="streak-pill">
          <Flame size={16} />
          <span>学习 {studyDays} 天</span>
        </div>
        <button className="icon-button" type="button" aria-label="通知">
          <Bell size={18} />
        </button>
        <button className="icon-button" type="button" aria-label="设置">
          <Settings size={18} />
        </button>
        <button className="avatar" type="button" onClick={onUser} aria-label="用户信息">
          {userInitial}
        </button>
      </div>
    </header>
  )
}

function UserProfileDialog({ user, storageLabel, onClose, onLogout }) {
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="user-profile-title">
      <section className="user-profile-dialog">
        <div className="modal-heading">
          <h2 id="user-profile-title">用户信息</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>
        <div className="profile-avatar">
          {(user.displayName || user.username || 'U').trim().slice(0, 1).toUpperCase()}
        </div>
        <div className="profile-lines">
          <div>
            <span>用户名</span>
            <strong>{user.username}</strong>
          </div>
          <div>
            <span>数据位置</span>
            <strong>{storageLabel}</strong>
          </div>
          <div>
            <span>最近登录</span>
            <strong>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('zh-CN') : '暂无'}</strong>
          </div>
        </div>
        <button className="ghost-button logout-button" type="button" onClick={onLogout}>
          <LogOut size={18} />
          退出登录
        </button>
      </section>
    </div>
  )
}

function Dashboard({ courses, loadingCourseId, onPractice, onNavigate, savedItems, savedProgress }) {
  const primaryCourse = courses[0]
  const completion = Math.round((primaryCourse.completed / primaryCourse.lessons) * 100)
  const isPrimaryLoading = loadingCourseId === primaryCourse.id
  const normalizedItems = normalizeSavedItems(savedItems)
  const stats = getGlobalStats(savedProgress)
  const forgottenWords = sortForgottenItems(normalizedItems.forgottenWords)
  const forgottenPhrases = sortForgottenItems(normalizedItems.forgottenPhrases)
  const masteredCount = normalizedItems.mastered.length
  const studyDays = getStudyDayCount(stats)
  const accuracy = stats.answerCount ? Math.round((stats.correctCount / stats.answerCount) * 100) : 0
  const topWordRate = forgottenWords.length ? `${forgettingRate(forgottenWords[0])}%` : '暂无'
  const topPhraseRate = forgottenPhrases.length ? `${forgettingRate(forgottenPhrases[0])}%` : '暂无'

  return (
    <div className="dashboard-grid page-enter">
      <section className="panel continue-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">今日学习</p>
            <h1>继续把英语变成能开口的句子</h1>
          </div>
          <button className="primary-button" type="button" onClick={() => onPractice(primaryCourse.id, getContinueLesson(primaryCourse))} disabled={isPrimaryLoading}>
            <CirclePlay size={18} />
            {isPrimaryLoading ? '加载中' : '开始学习'}
          </button>
        </div>

        <div className="continue-body">
          <CourseCover course={primaryCourse} size="large" />
          <div className="continue-copy">
            <h2>{primaryCourse.title}</h2>
            <p>{primaryCourse.currentLesson}</p>
            <div className="progress-track">
              <span style={{ width: `${completion}%` }} />
            </div>
            <div className="metric-row">
              <span>{primaryCourse.completed}/{primaryCourse.lessons} 课</span>
              <span>{completion}% 完成</span>
              <span>学习 {formatStudyDuration(getCourseStudySeconds(primaryCourse))}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel stats-panel">
        <div className="section-heading compact">
          <h2>战绩</h2>
          <CalendarDays size={18} />
        </div>
        <div className="status-grid">
          <StatTile label="学习天数" value={`${studyDays} 天`} tone="teal" />
          <StatTile label="掌握句子" value={masteredCount.toLocaleString('zh-CN')} tone="blue" />
          <StatTile label="准确率" value={`${accuracy}%`} tone="gold" />
        </div>
      </section>

      <section className="panel review-panel">
        <div className="section-heading compact">
          <h2>最容易忘</h2>
          <Brain size={18} />
        </div>
        <QueueRow title="最容易忘的单词" count={forgottenWords.length} tag={topWordRate} onClick={() => onNavigate('review')} />
        <QueueRow title="最容易忘的短语" count={forgottenPhrases.length} tag={topPhraseRate} onClick={() => onNavigate('review')} />
      </section>
    </div>
  )
}

function CoursesView({ courses, query, loadingCourseId, onOpenCourse, onPractice }) {
  const filteredCourses = courses.filter((course) => `${course.title}${course.subtitle}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="page-stack page-enter">
      <PageTitle eyebrow="我的课程包" title="全部课程包" meta={`${filteredCourses.length} 个课程包`} />
      <div className="course-grid">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            actionLabel={loadingCourseId === course.id ? '加载中' : '开始学习'}
            onOpen={() => onOpenCourse(course.id)}
            onAction={() => onPractice(course.id, getContinueLesson(course))}
          />
        ))}
      </div>
    </div>
  )
}

function CourseDetail({ course, loadingCourseId, onBack, onPractice }) {
  const completion = Math.round((course.completed / course.lessons) * 100)
  const isLoading = loadingCourseId === course.id

  return (
    <div className="page-stack page-enter">
      <div className="detail-toolbar">
        <button className="ghost-button" type="button" onClick={onBack}>
          <ChevronLeft size={18} />
          返回
        </button>
      </div>

      <section className="panel course-hero">
        <CourseCover course={course} size="hero" />
        <div>
          <p className="eyebrow">{course.tag} · {course.level}</p>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="progress-track">
            <span style={{ width: `${completion}%` }} />
          </div>
          <div className="metric-row">
            <span>{course.completed}/{course.lessons} 课</span>
            <span>{completion}% 完成</span>
            <span>学习 {formatStudyDuration(getCourseStudySeconds(course))}</span>
            <span>最近学习：不到 1 分钟前</span>
          </div>
        </div>
        <button className="primary-button hero-action" type="button" onClick={() => onPractice(course.id, getContinueLesson(course))} disabled={isLoading}>
          <Play size={18} />
          {isLoading ? '加载中' : '开始学习'}
        </button>
      </section>

      <LessonList course={course} onPractice={onPractice} />
    </div>
  )
}

function LessonList({ course, onPractice }) {
  const fallbackLessons = Array.from({ length: course.lessons }, (_, index) => ({
    title: `第${index + 1}课`,
    statementCount: 0,
  }))
  const lessons = course.lessonData?.length ? course.lessonData : course.lessonSummaries?.length ? course.lessonSummaries : fallbackLessons
  return (
    <section className="panel lesson-panel">
      <div className="lesson-list">
        {lessons.map((lesson, index) => {
          const lessonNumber = index + 1
          const totalStatements = getLessonStatementCount(lesson)
          const progressLabel = getLessonProgressLabel(course, lesson, lessonNumber, totalStatements)
          return (
            <button
              className={`lesson-row ${progressLabel !== '未学习' ? 'started' : ''}`}
              key={lesson.id || lessonNumber}
              type="button"
              onClick={() => onPractice(course.id, lessonNumber)}
            >
              <span className="lesson-index">第{lessonNumber}课</span>
              <div>
                <strong>{lesson.title || `第${lessonNumber}课`}</strong>
                <small>{totalStatements ? `${totalStatements} 题` : '0 题'}</small>
              </div>
              <em>{progressLabel}</em>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function getLessonStatementCount(lesson) {
  return lesson?.statementCount || lesson?.statements?.length || lesson?.sentences?.length || 0
}

function getLessonProgressLabel(course, lesson, lessonNumber, totalStatements) {
  const progress = lesson?.id ? course.lessonProgress?.[lesson.id] : null
  const completedStatements = progress?.completedStatements || (lessonNumber <= (course.completed || 0) ? totalStatements : 0)
  if (!completedStatements) return '未学习'
  if (!totalStatements) return lessonNumber <= (course.completed || 0) ? '100%' : '未学习'
  return `${Math.min(100, Math.round((completedStatements / totalStatements) * 100))}%`
}

function getCourseLessons(course) {
  if (course.lessonData?.length) return course.lessonData
  if (course.lessonSummaries?.length) return course.lessonSummaries
  return Array.from({ length: course.lessons || 0 }, (_, index) => ({ title: `第${index + 1}课`, statementCount: 0 }))
}

function getCourseStatementTotal(course) {
  if (course.statementTotal) return course.statementTotal
  return getCourseLessons(course).reduce((sum, lesson) => sum + getLessonStatementCount(lesson), 0)
}

function getCourseCompletedStatements(course) {
  const progress = course.lessonProgress || {}
  return getCourseLessons(course).reduce((sum, lesson, index) => {
    const total = getLessonStatementCount(lesson)
    const record = lesson.id ? progress[lesson.id] : null
    if (record) return sum + Math.min(total || record.completedStatements || 0, record.completedStatements || 0)
    return sum + (index + 1 <= (course.completed || 0) ? total : 0)
  }, 0)
}

function getCourseProgressPercent(course) {
  const totalStatements = getCourseStatementTotal(course)
  if (totalStatements) return Math.min(100, Math.round((getCourseCompletedStatements(course) / totalStatements) * 100))
  return Math.min(100, Math.round(((course.completed || 0) / Math.max(course.lessons || 1, 1)) * 100))
}

function hasCourseProgress(course) {
  const lessonProgress = Object.values(course.lessonProgress || {})
  return Boolean(getCourseStudySeconds(course) > 0 || (course.completed || 0) > 0 || lessonProgress.some((item) => (item.completedStatements || 0) > 0 || (item.statementIndex || 0) > 0))
}

function sumForgottenAttempts(items) {
  return items.reduce(
    (stats, item) => ({
      misses: stats.misses + (Number(item.missCount) || 0),
      attempts: stats.attempts + (Number(item.attemptCount) || 0),
    }),
    { misses: 0, attempts: 0 },
  )
}

function AnalyticsView({ courses, savedItems, savedProgress }) {
  const normalizedItems = normalizeSavedItems(savedItems)
  const forgottenItems = [...normalizedItems.forgottenWords, ...normalizedItems.forgottenPhrases]
  const forgottenStats = sumForgottenAttempts(forgottenItems)
  const studiedCourses = courses.filter(hasCourseProgress)
  const totalLessons = courses.reduce((sum, course) => sum + (course.completed || 0), 0)
  const totalStudySeconds = courses.reduce((sum, course) => sum + getCourseStudySeconds(course), 0)
  const totalStatements = courses.reduce((sum, course) => sum + getCourseStatementTotal(course), 0)
  const completedStatements = courses.reduce((sum, course) => sum + getCourseCompletedStatements(course), 0)
  const activeDays = getStudyDayCount(getGlobalStats(savedProgress))
  const averageStudySeconds = activeDays ? Math.round(totalStudySeconds / activeDays) : 0
  const statementProgress = totalStatements ? Math.round((completedStatements / totalStatements) * 100) : 0
  const courseProgressRows = [...courses]
    .map((course) => ({
      id: course.id,
      title: course.title,
      currentLesson: course.currentLesson,
      studySeconds: getCourseStudySeconds(course),
      completed: course.completed || 0,
      lessons: course.lessons || 0,
      percent: getCourseProgressPercent(course),
      completedStatements: getCourseCompletedStatements(course),
      totalStatements: getCourseStatementTotal(course),
      active: hasCourseProgress(course),
    }))
    .sort((a, b) => Number(b.active) - Number(a.active) || b.percent - a.percent || b.studySeconds - a.studySeconds)

  return (
    <div className="page-stack page-enter">
      <PageTitle eyebrow="成长分析" title="真实学习统计" meta="基于已保存的学习记录" />

      <section className="panel">
        <div className="section-heading compact">
          <h2>学习投入</h2>
          <BarChart3 size={18} />
        </div>
        <div className="status-grid four">
          <StatTile label="有记录天数" value={`${activeDays} 天`} tone="teal" />
          <StatTile label="学习总时长" value={formatStudyDuration(totalStudySeconds)} tone="coral" />
          <StatTile label="平均每日时长" value={formatStudyDuration(averageStudySeconds)} tone="blue" />
          <StatTile label="学过课程包" value={`${studiedCourses.length}`} tone="gold" />
        </div>
      </section>

      <div className="analytics-grid">
        <section className="panel">
          <div className="section-heading compact">
            <h2>学习内容</h2>
            <BookText size={18} />
          </div>
          <div className="analysis-summary">
            <div>
              <span>句子学习进度</span>
              <strong>{completedStatements.toLocaleString('zh-CN')}</strong>
              <small>共 {totalStatements.toLocaleString('zh-CN')} 题 · 完成 {statementProgress}%</small>
            </div>
            <div>
              <span>课程学习总览</span>
              <strong>{totalLessons}</strong>
              <small>已完成课节 · 共 {courses.length} 个课程包</small>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading compact">
            <h2>复习记录</h2>
            <Brain size={18} />
          </div>
          <div className="analysis-summary">
            <div>
              <span>掌握句子</span>
              <strong>{normalizedItems.mastered.length}</strong>
              <small>来自练习中手动标记</small>
            </div>
            <div>
              <span>最容易忘</span>
              <strong>{forgottenItems.length}</strong>
              <small>错误 {forgottenStats.misses} 次 · 记录 {forgottenStats.attempts} 次</small>
            </div>
            <div>
              <span>生词本</span>
              <strong>{normalizedItems.vocab.length}</strong>
              <small>练习中加入的生词</small>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="section-heading compact">
          <h2>课程进度</h2>
          <BookOpen size={18} />
        </div>
        <div className="real-progress-list">
          {courseProgressRows.map((course) => (
            <div className="real-progress-row" key={course.id}>
              <div>
                <strong>{course.title}</strong>
                <small>
                  {course.active ? `${course.completed}/${course.lessons} 课 · ${course.completedStatements.toLocaleString('zh-CN')}/${course.totalStatements.toLocaleString('zh-CN')} 题 · ${formatStudyDuration(course.studySeconds)}` : '未学习'}
                </small>
              </div>
              <em>{course.active ? `${course.percent}%` : '未学习'}</em>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ArchiveView({ type, items = [] }) {
  if (type === 'review') {
    return (
      <div className="page-stack page-enter">
        <ArchiveHeader title="最容易忘" count={`共 ${items.length} 条`} actions={[]} />
        {items.length ? <ArchiveList items={items} type="review" /> : <EmptyArchive icon={ClipboardList} title="暂无复习内容" body="答错或点击显示答案后，会自动记录到这里" />}
      </div>
    )
  }

  if (type === 'vocab') {
    return (
      <div className="page-stack page-enter">
        <ArchiveHeader title="生词本" count={`共 ${items.length} 个生词`} actions={['筛选', '导出', '选择', '开始练习']} />
        {items.length ? <ArchiveList items={items} type="vocab" /> : <EmptyArchive icon={BookOpen} title="还没有收藏生词" body="在练习中遇到不认识的词时，点击它就可以加入生词本" />}
      </div>
    )
  }

  if (type === 'notes') {
    return (
      <div className="page-stack page-enter">
        <ArchiveHeader title="笔记" count="" actions={[]} />
        <div className="tab-row">
          <button className="selected" type="button">全部笔记</button>
          <button type="button">按课程包</button>
        </div>
        <section className="panel empty-archive">
          <NotebookTabs size={46} />
          <h2>还没有笔记</h2>
          <p>练习时答完题可以记录你的学习心得</p>
        </section>
      </div>
    )
  }

  return (
    <div className="page-stack page-enter">
      <ArchiveHeader title="掌握列表" count={`总数 ${items.length}`} actions={['全部删除', '批量选择']} />
      {items.length ? <ArchiveList items={items} type="mastered" /> : <EmptyArchive icon={Check} title="还没有掌握内容" body="练习时点击掌握即可加入" />}
    </div>
  )
}

function ArchiveList({ items, type }) {
  return (
    <section className={`panel ${type === 'review' ? 'review-list' : 'mastered-list'}`}>
      {items.map((item) => (
        <div className={type === 'review' ? 'review-item' : 'mastered-item'} key={`${type}-${item.id}`}>
          <div>
            <strong>{item.english}</strong>
            <span>{item.chinese}</span>
            <small>
              {type === 'review' ? (item.kind === 'word' ? '单词' : '短语') : item.lessonTitle || '星荣零基础学英语'}
              {type === 'review' && ` · 错误 ${item.missCount || 0}/${item.attemptCount || 0}`}
              {type !== 'review' && ` · ${item.soundmark || '无音标'}`}
              {type === 'review' && item.lessonTitle ? ` · ${item.lessonTitle}` : ''}
            </small>
          </div>
          {type === 'review' && <em>{forgettingRate(item)}%</em>}
          <button className="icon-button" type="button" aria-label="播放发音" onClick={() => speakText(item.english)}>
            <Volume2 size={17} />
          </button>
        </div>
      ))}
    </section>
  )
}

function EmptyArchive({ icon: Icon, title, body }) {
  return (
    <section className="panel empty-archive">
      <Icon size={46} />
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  )
}

function ArchiveHeader({ title, count, actions }) {
  return (
    <div className="archive-header">
      <div>
        <h1>{title}</h1>
        {count && <span>{count}</span>}
      </div>
      <div className="toolbar-actions">
        {actions.map((action) => (
          <button className={action === '今日推荐' || action === '开始练习' ? 'primary-button' : 'ghost-button'} key={action} type="button">
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}

function TrashIcon() {
  return <Trash2 size={17} />
}

function PracticeView({
  practice,
  mode,
  prompt,
  practiceData,
  answer,
  setAnswer,
  feedback,
  onSubmit,
  onNext,
  onPrevious,
  onShowAnswer,
  onRetry,
  onMaster,
  onVocab,
  isMastered,
  isVocab,
  onExitHome,
  onExitCourses,
  answerCount,
  answerCountPulse,
}) {
  const [showExit, setShowExit] = useState(false)
  const [speechPanelOpen, setSpeechPanelOpen] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [speechSettings, setSpeechSettings] = useState(() => currentSpeechSettings)
  const [autoReadRepeat, setAutoReadRepeat] = useState(() => currentAutoReadRepeat)
  const [phoneticVisible, setPhoneticVisible] = useState(() => currentPhoneticVisible)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [answerCountAnimating, setAnswerCountAnimating] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const isListening = practice.modeId === 'listening'
  const isSpeaking = practice.modeId === 'speaking'
  const isDictation = practice.modeId === 'dictation'
  const { lesson, statements, statement, index } = practiceData || {}
  const total = statements?.length || 1
  const progress = Math.round(((index || 0) + 1) / total * 100)
  const hasAnswerShown = feedback?.status === 'good' || feedback?.status === 'answer'
  const actualPrompt = statement
    ? {
        prompt: statement.chinese,
        answer: statement.english,
        hint: statement.soundmark || '',
      }
    : prompt
  const showPromptText = !hasAnswerShown && !isDictation
  const showSoundmarkLine = phoneticVisible && !hasAnswerShown && !isDictation && actualPrompt?.hint
  const stageFit = getPracticeStageFit(actualPrompt?.prompt, actualPrompt?.answer, phoneticVisible ? actualPrompt?.hint : '')
  const ReadIcon = autoReadRepeat > 0 ? Volume2 : VolumeX
  const readLabel = autoReadRepeat > 0 ? String(autoReadRepeat) : '静'

  function updateSpeechSettings(nextSettings) {
    setSpeechSettings((current) => saveSpeechSettings({ ...current, ...nextSettings }))
  }

  function toggleAutoReadRepeat() {
    setAutoReadRepeat((current) => {
      const next = saveAutoReadRepeat(nextAutoReadRepeat(current))
      if (next <= 0) stopSpeech()
      return next
    })
  }

  function togglePhoneticVisible() {
    setPhoneticVisible((current) => savePhoneticVisible(!current))
  }

  useEffect(() => {
    let elapsedSeconds = 0
    let startedAt = 0
    let isVisible = document.visibilityState === 'visible'

    setElapsedSeconds(0)

    function recordElapsedTime() {
      if (!isVisible || !startedAt) return
      const now = Date.now()
      const addedSeconds = Math.min(maxCourseStudyGapSeconds, Math.floor((now - startedAt) / 1000))
      startedAt = now
      if (!addedSeconds) return
      elapsedSeconds += addedSeconds
      setElapsedSeconds(elapsedSeconds)
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        recordElapsedTime()
        isVisible = false
        startedAt = 0
        return
      }

      isVisible = true
      startedAt = Date.now()
    }

    if (isVisible) startedAt = Date.now()
    const timer = window.setInterval(recordElapsedTime, 1000)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      recordElapsedTime()
    }
  }, [practice.course.id, practice.lesson, practice.modeId])

  useEffect(() => {
    if (!answerCountPulse) return undefined
    setAnswerCountAnimating(false)
    const frame = window.requestAnimationFrame(() => setAnswerCountAnimating(true))
    const timer = window.setTimeout(() => setAnswerCountAnimating(false), 560)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [answerCountPulse])

  useEffect(() => {
    if (!statements?.length) return
    const startIndex = Math.max(0, index || 0)
    const upcomingTexts = statements
      .slice(startIndex, startIndex + 11)
      .map((item) => item.english)
      .filter(Boolean)
    preloadCloudTts(upcomingTexts, speechSettings, 11)
  }, [statements, index, speechSettings.rate, speechSettings.voiceGender])

  useEffect(() => {
    if (!statement) return
    playAutoStatementAudio(statement, { delay: questionReadDelayMs, gap: repeatReadGapMs })
  }, [statement?.id])

  useEffect(() => () => stopSpeech(), [])

  useEffect(() => {
    let frame = 0
    let stableHeight = Math.max(window.innerHeight || 0, window.visualViewport?.height || 0)

    function updateKeyboardState() {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const viewportHeight = window.visualViewport?.height || window.innerHeight || stableHeight
        stableHeight = Math.max(stableHeight, viewportHeight, window.innerHeight || 0)
        document.documentElement.style.setProperty('--julebu-stable-vh', `${stableHeight / 100}px`)

        const activeElement = document.activeElement
        const answerFocused = activeElement?.classList?.contains('game-answer-input') || activeElement?.classList?.contains('answer-slot-input')
        const shrink = Math.max(0, stableHeight - viewportHeight)
        const isOpen = Boolean(answerFocused && (shrink > 120 || viewportHeight < 620))
        setKeyboardOpen(isOpen)
      })
    }

    updateKeyboardState()
    window.addEventListener('resize', updateKeyboardState)
    window.addEventListener('focusin', updateKeyboardState)
    window.addEventListener('focusout', updateKeyboardState)
    window.visualViewport?.addEventListener('resize', updateKeyboardState)
    window.visualViewport?.addEventListener('scroll', updateKeyboardState)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateKeyboardState)
      window.removeEventListener('focusin', updateKeyboardState)
      window.removeEventListener('focusout', updateKeyboardState)
      window.visualViewport?.removeEventListener('resize', updateKeyboardState)
      window.visualViewport?.removeEventListener('scroll', updateKeyboardState)
      document.documentElement.style.removeProperty('--julebu-stable-vh')
    }
  }, [])

  useEffect(() => {
    function handleShortcut(event) {
      if (event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const targetTag = event.target?.tagName?.toLowerCase()
        if (['input', 'textarea', 'select'].includes(targetTag) || event.target?.isContentEditable) return
        const activeTag = document.activeElement?.tagName?.toLowerCase()
        if (hasAnswerShown || !['input', 'textarea', 'select', 'button'].includes(activeTag)) {
          event.preventDefault()
          onSubmit()
          return
        }
      }
      if (event.ctrlKey && event.key === "'") {
        event.preventDefault()
        playStatementAudio(statement)
      }
      if (event.ctrlKey && event.key === ';') {
        event.preventDefault()
        if (hasAnswerShown) {
          onRetry()
        } else {
          onShowAnswer()
        }
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'm') {
        event.preventDefault()
        onMaster()
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'n') {
        event.preventDefault()
        onVocab()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [hasAnswerShown, onMaster, onRetry, onShowAnswer, onSubmit, onVocab, statement])

  return (
    <div className={`game-page page-enter ${keyboardOpen ? 'keyboard-open' : ''}`}>
      <header className="game-topbar">
        <button className="icon-button" type="button" onClick={() => setShowExit(true)} aria-label="退出">
          <ChevronLeft size={20} />
        </button>
        <strong>{lesson?.title || `第${practice.lesson}课`}（{(index || 0) + 1}/{total}）</strong>
        <div className="game-tools">
          <button className="icon-button ai-tool-button" type="button" aria-label="AI 学习助手" onClick={() => setAiPanelOpen(true)}>
            <Sparkles size={18} />
          </button>
          <button className="icon-button" type="button" aria-label="朗读设置" onClick={() => setSpeechPanelOpen(true)}>
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="game-progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="game-stats">
        <span>{formatElapsedTime(elapsedSeconds)}</span>
        <div className="answer-count-box" aria-label="累计答题次数">
          <span className="answer-count-label">累计答题</span>
          <strong className={`answer-count ${answerCountAnimating ? 'bump' : ''}`}>
            {Number(answerCount || 0).toLocaleString('zh-CN')}
          </strong>
        </div>
        <div className="audio-pill">
          <button
            className={`audio-pill-button ${autoReadRepeat <= 0 ? 'muted' : ''}`}
            type="button"
            aria-label={autoReadRepeat > 0 ? `自动朗读${autoReadRepeat}次` : '自动朗读静音'}
            title={autoReadRepeat > 0 ? `自动朗读${autoReadRepeat}次` : '自动朗读静音'}
            onClick={toggleAutoReadRepeat}
          >
            <ReadIcon size={16} />
          </button>
          <span className={`audio-mode-label ${autoReadRepeat <= 0 ? 'muted' : ''}`}>{readLabel}</span>
          <button
            className={`audio-pill-button ${phoneticVisible ? '' : 'phonetic-hidden'}`}
            type="button"
            aria-label={phoneticVisible ? '隐藏音标' : '显示音标'}
            title={phoneticVisible ? '隐藏音标' : '显示音标'}
            aria-pressed={!phoneticVisible}
            onClick={togglePhoneticVisible}
          >
            <MessageSquareText size={16} />
          </button>
        </div>
      </div>

      <section className={`game-stage stage-${stageFit}`}>
        {isListening ? (
          <ListeningStage prompt={{ ...actualPrompt, prompt: actualPrompt.answer }} />
        ) : isSpeaking ? (
          <SpeakingStage prompt={actualPrompt} />
        ) : (
          <>
            {showPromptText && <h1>{actualPrompt.prompt}</h1>}
            {showSoundmarkLine && <p className="soundmark-line">{actualPrompt.hint}</p>}
            {hasAnswerShown && statement ? (
              <AnswerBreakdown statement={statement} lesson={lesson} showPhonetic={phoneticVisible} />
            ) : (
              <AnswerEntry
                answer={answer}
                expected={actualPrompt.answer}
                placeholder={isDictation ? '输入听到的英文' : '输入英文表达'}
                clearSlotOnSelect={feedback?.status === 'close'}
                showWrongSlots={feedback?.status === 'close'}
                onAnswerChange={setAnswer}
                onSubmit={onSubmit}
              />
            )}
          </>
        )}

        {feedback && !hasAnswerShown && (
          <div className={`feedback ${feedback.status}`}>
            <Check size={18} />
            <div>
              <strong>{feedback.title}</strong>
              <p>{feedback.body}</p>
            </div>
          </div>
        )}
      </section>

      <footer className="game-shortcuts">
        <button className="shortcut-button" type="button" onClick={() => playStatementAudio(statement)}>
          <Volume2 size={18} />
          <span>发音</span>
        </button>
        <button
          className={`shortcut-button ${isMastered ? 'saved' : ''}`}
          type="button"
          aria-pressed={isMastered}
          aria-label={isMastered ? '已掌握，再次点击取消掌握' : '加入掌握列表'}
          title={isMastered ? '再次点击取消掌握' : '加入掌握列表'}
          onClick={onMaster}
        >
          <BadgeCheck size={18} />
          <span>掌握</span>
        </button>
        <button
          className={`shortcut-button ${isVocab ? 'saved' : ''}`}
          type="button"
          aria-pressed={isVocab}
          aria-label={isVocab ? '已加入生词本，再次点击移除' : '加入生词本'}
          title={isVocab ? '再次点击移出生词本' : '加入生词本'}
          onClick={onVocab}
        >
          <Star size={18} />
          <span>生词</span>
        </button>
        <button className="shortcut-button primary" type="button" onClick={onSubmit}>
          {hasAnswerShown ? <ChevronRight size={18} /> : <Check size={18} />}
          <span>{hasAnswerShown ? '下一题' : '提交'}</span>
        </button>
        <button className="shortcut-button accent" type="button" onClick={hasAnswerShown ? onRetry : onShowAnswer}>
          {hasAnswerShown ? <RotateCcw size={18} /> : <Eye size={18} />}
          <span>{hasAnswerShown ? '再来' : '答案'}</span>
        </button>
        <button className="shortcut-button" type="button" onClick={onPrevious} disabled={(index || 0) <= 0}>
          <ChevronLeft size={18} />
          <span>上一题</span>
        </button>
        <button className="shortcut-button" type="button" onClick={onNext} disabled={(index || 0) >= total - 1}>
          <ChevronRight size={18} />
          <span>下一题</span>
        </button>
      </footer>

      {speechPanelOpen && (
        <SpeechSettingsDialog
          settings={speechSettings}
          onChange={updateSpeechSettings}
          onClose={() => setSpeechPanelOpen(false)}
          onPreview={(previewSettings) => speakText(statement?.english || 'I like learning English.', { repeat: 1, ...(previewSettings || {}) })}
        />
      )}
      {aiPanelOpen && (
        <AiTutorDialog
          statement={statement}
          lesson={lesson}
          modeTitle={mode?.title || ''}
          onClose={() => setAiPanelOpen(false)}
        />
      )}
      {showExit && <ExitGameDialog onClose={() => setShowExit(false)} onExitHome={onExitHome} onExitCourses={onExitCourses} />}
    </div>
  )
}

function splitWords(value) {
  if (!value) return []
  return sanitizeAnswerInput(value).trim().split(/\s+/).filter(Boolean)
}

function answerPartsFromAnswer(value, slotCount = 0) {
  if (!value && slotCount <= 0) return []
  const sanitized = sanitizeAnswerInput(value)
  const parts = sanitized.split(' ')
  if (slotCount > 0) {
    while (parts.length < slotCount) parts.push('')
    return parts.slice(0, slotCount)
  }
  return parts
}

function typedWordsFromAnswer(value, slotCount = 0) {
  return answerPartsFromAnswer(value, slotCount)
}

function joinAnswerParts(parts) {
  return parts.join(' ')
}

function AnswerEntry({ answer, expected, placeholder, clearSlotOnSelect = false, showWrongSlots = false, onAnswerChange, onSubmit }) {
  const inputRefs = useRef([])
  const latestAnswerRef = useRef(answer)
  const [activeSlot, setActiveSlot] = useState(null)
  const [composingSlot, setComposingSlot] = useState(null)
  const expectedWords = splitWords(expected)
  const expectedTokens = answerTokens(expected)
  const slots = expectedWords.length ? expectedWords : ['']
  const typedWords = typedWordsFromAnswer(answer, slots.length)
  latestAnswerRef.current = answer

  const incorrectSlotIndexes = new Set()
  if (showWrongSlots) {
    slots.forEach((word, index) => {
      const expectedToken = expectedTokens[index] || normalizeAnswer(word)
      const typedToken = answerTokens(typedWords[index])[0] || ''
      if (typedToken !== expectedToken) incorrectSlotIndexes.add(index)
    })
  }

  function focusSlot(index, selectText = false) {
    const input = inputRefs.current[index]
    if (!input) return
    input.focus()
    window.requestAnimationFrame(() => {
      if (selectText) {
        input.select()
      } else {
        const caret = input.value.length
        input.setSelectionRange(caret, caret)
      }
    })
  }

  function selectSlot(index) {
    const input = inputRefs.current[index]
    if (!input) return
    const parts = answerPartsFromAnswer(latestAnswerRef.current, slots.length)
    const shouldClear = clearSlotOnSelect && Boolean(parts[index])
    setActiveSlot(index)
    if (shouldClear) {
      parts[index] = ''
      input.value = ''
      const nextAnswer = joinAnswerParts(parts)
      latestAnswerRef.current = nextAnswer
      onAnswerChange(nextAnswer)
      focusSlot(index)
      return
    }
    focusSlot(index, Boolean(parts[index]))
  }

  function commitParts(parts, nextActiveSlot = activeSlot, focusNext = false, selectNext = false) {
    const nextAnswer = joinAnswerParts(parts)
    if (nextAnswer !== answer) playTypingSound()
    latestAnswerRef.current = nextAnswer
    setActiveSlot(nextActiveSlot)
    onAnswerChange(nextAnswer)
    if (focusNext && Number.isInteger(nextActiveSlot)) {
      focusSlot(nextActiveSlot, selectNext)
    }
  }

  function handleSlotInput(index, rawValue, options = {}) {
    const allowAutoAdvance = options.allowAutoAdvance === true || (options.allowAutoAdvance !== false && composingSlot !== index)
    const parts = answerPartsFromAnswer(latestAnswerRef.current, slots.length)
    const normalizedRaw = sanitizeAnswerInput(rawValue).replace(/[^\S ]+/g, ' ')
    const rawTokens = normalizedRaw.trim().split(/\s+/).filter(Boolean)

    if (rawTokens.length > 1) {
      rawTokens.forEach((token, tokenIndex) => {
        if (index + tokenIndex < parts.length) parts[index + tokenIndex] = token
      })
      const nextIndex = Math.min(index + rawTokens.length, parts.length - 1)
      commitParts(parts, nextIndex, true, Boolean(parts[nextIndex]))
      return
    }

    const cleanValue = normalizedRaw.replace(/\s+/g, '')
    parts[index] = cleanValue

    const expectedToken = expectedTokens[index] || ''
    const nextIndex = index + 1
    const canMoveNext = allowAutoAdvance && expectedToken && nextIndex < parts.length && !parts[nextIndex]

    if (canMoveNext && answerTokens(cleanValue)[0]?.length >= expectedToken.length) {
      if (cleanValue.length > expectedToken.length) {
        parts[index] = cleanValue.slice(0, expectedToken.length)
        parts[nextIndex] = cleanValue.slice(expectedToken.length)
        commitParts(parts, nextIndex, true, Boolean(parts[nextIndex]))
        return
      }

      commitParts(parts, nextIndex, true, false)
      return
    }

    commitParts(parts, index)
  }

  function getLiveAnswerParts() {
    const parts = answerPartsFromAnswer(latestAnswerRef.current, slots.length)
    const focusedIndex = inputRefs.current.findIndex((input) => input === document.activeElement)

    if (focusedIndex >= 0) {
      parts[focusedIndex] = sanitizeAnswerInput(inputRefs.current[focusedIndex]?.value || '')
        .replace(/\s+/g, '')
    }

    return parts
  }

  function submitCurrentAnswer(parts = getLiveAnswerParts()) {
    const nextAnswer = joinAnswerParts(parts)
    latestAnswerRef.current = nextAnswer
    if (nextAnswer !== answer) onAnswerChange(nextAnswer)
    onSubmit(nextAnswer)
  }

  function focusNextEmptySlot(parts, currentIndex) {
    const nextIndex = parts.findIndex((value, index) => index > currentIndex && !answerTokens(value).length)
    const firstEmptyIndex = nextIndex >= 0
      ? nextIndex
      : parts.findIndex((value) => !answerTokens(value).length)

    if (firstEmptyIndex >= 0) {
      setActiveSlot(firstEmptyIndex)
      focusSlot(firstEmptyIndex, Boolean(parts[firstEmptyIndex]))
    }
  }

  return (
    <div className="answer-entry" role="presentation">
      <div className="answer-slots">
        {slots.map((word, index) => {
          const typed = typedWords[index] || ''
          return (
            <label
              className={`answer-slot ${activeSlot === index ? 'active' : ''} ${incorrectSlotIndexes.has(index) ? 'incorrect' : ''}`}
              style={{ '--answer-slot-width': `${Math.max(3, Math.min(Math.max(word.length, typed.length) + 1, 18))}ch` }}
              key={`${word}-${index}`}
              aria-label={`修改第 ${index + 1} 格`}
            >
              <span>{typed}</span>
              <input
                ref={(node) => {
                  inputRefs.current[index] = node
                }}
                className="answer-slot-input"
                value={typed}
                onFocus={() => setActiveSlot(index)}
                onClick={() => selectSlot(index)}
                onChange={(event) => handleSlotInput(index, event.target.value)}
                onCompositionStart={() => setComposingSlot(index)}
                onCompositionEnd={(event) => {
                  setComposingSlot(null)
                  handleSlotInput(index, event.currentTarget.value, { allowAutoAdvance: true })
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    if (event.nativeEvent?.isComposing || composingSlot === index) return
                    event.preventDefault()
                    event.stopPropagation()
                    const liveParts = getLiveAnswerParts()
                    if (liveParts.every((value) => answerTokens(value).length > 0)) {
                      submitCurrentAnswer(liveParts)
                    } else {
                      focusNextEmptySlot(liveParts, index)
                    }
                    return
                  }
                  if (event.key === ' ') {
                    event.preventDefault()
                    const nextIndex = Math.min(index + 1, slots.length - 1)
                    if (nextIndex !== index) {
                      setActiveSlot(nextIndex)
                      focusSlot(nextIndex, Boolean(typedWords[nextIndex]))
                    }
                  }
                }}
                aria-label={`修改第 ${index + 1} 格`}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                autoFocus={index === 0}
                enterKeyHint={typedWords.every((value) => answerTokens(value).length > 0) ? 'done' : 'next'}
                spellCheck="false"
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}

function AnswerBreakdown({ statement, lesson, showPhonetic = true }) {
  const words = buildWordBreakdown(statement, lesson)
  const wordCount = words.length
  const fitClass = wordCount >= 10 ? 'dense' : wordCount >= 7 ? 'compact' : ''

  return (
    <div className={`answer-breakdown ${fitClass}`} style={{ '--answer-word-count': wordCount }}>
      <div className="word-block-row">
        {words.map((item, index) => (
          <button className={`word-block ${item.tone}`} type="button" key={`${item.word}-${index}`} onClick={() => speakText(item.word, { fallbackAudioUrl: item.audioUrl })}>
            {showPhonetic && item.soundmark && <span className="word-soundmark">{item.soundmark}</span>}
            <strong>{item.word}</strong>
            <em>{item.pos}</em>
            {item.chinese && <small>{item.chinese}</small>}
          </button>
        ))}
      </div>
      <p className="answer-chinese">{statement.chinese}</p>
    </div>
  )
}

function ListeningStage({ prompt }) {
  return (
    <div className="listening-stage">
      <h1>{prompt.prompt}</h1>
      <div className="stage-steps">
        <span className="active">盲听</span>
        <span>慢听</span>
        <span>字幕</span>
      </div>
      <div className="player-bar">
        <button className="primary-button" type="button">
          <Volume2 size={18} />
          播放
        </button>
        <button className="ghost-button" type="button">0.8x</button>
        <button className="ghost-button" type="button">显示字幕</button>
      </div>
    </div>
  )
}

function SpeakingStage({ prompt }) {
  return (
    <div className="speaking-stage">
      <h1>{prompt.prompt}</h1>
      <button className="record-button" type="button">
        <Mic2 size={34} />
        开始录音
      </button>
      <div className="score-grid">
        <StatTile label="发音" value="--" tone="teal" />
        <StatTile label="语调" value="--" tone="coral" />
        <StatTile label="流利度" value="--" tone="blue" />
      </div>
    </div>
  )
}

const initialAiTutorQuestion = '用最简单的话回答：这句话一般什么场景使用？再给1个例句。只要两行。'

function AiTutorDialog({ statement, lesson, modeTitle, onClose }) {
  const statementPayload = useMemo(() => buildAiStatementPayload(statement, lesson), [statement, lesson])
  const statementKey = statementPayload?.id || statementPayload?.english || ''
  const cachedSession = aiTutorSessions.get(statementKey) || {}
  const [messages, setMessages] = useState(() => cachedSession.messages || [])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(() => cachedSession.error || '')
  const chatListRef = useRef(null)

  useEffect(() => {
    const list = chatListRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [messages, loading, error])

  useEffect(() => {
    if (!statementKey) return
    const cached = aiTutorSessions.get(statementKey) || {}
    setMessages(cached.messages || [])
    setError(cached.error || '')
    setInput('')
  }, [statementKey])

  useEffect(() => {
    if (!statementKey) return
    aiTutorSessions.set(statementKey, {
      ...(aiTutorSessions.get(statementKey) || {}),
      messages,
      error,
    })
  }, [statementKey, messages, error])

  useEffect(() => {
    const cached = aiTutorSessions.get(statementKey)
    if (!statementPayload?.english || !statementKey || cached?.booted || cached?.messages?.length) return undefined
    let cancelled = false
    aiTutorSessions.set(statementKey, { ...(cached || {}), booted: true, messages: cached?.messages || [], error: '' })
    setInput('')
    setError('')
    setLoading(true)

    askAiTutor({
      question: initialAiTutorQuestion,
      statement: statementPayload,
      lesson: { title: lesson?.title || '' },
      mode: modeTitle,
      history: [],
    })
      .then((data) => {
        if (cancelled) return
        const nextMessages = [{ role: 'assistant', content: data.answer, model: data.model, initial: true }]
        aiTutorSessions.set(statementKey, { booted: true, messages: nextMessages, error: '' })
        setMessages(nextMessages)
      })
      .catch((requestError) => {
        if (cancelled) return
        const nextError = requestError.message || 'AI 暂时无法回答'
        aiTutorSessions.set(statementKey, { booted: false, messages: [], error: nextError })
        setError(nextError)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lesson?.title, modeTitle, statementKey, statementPayload])

  async function sendQuestion(event) {
    event?.preventDefault()
    const question = input.trim()
    if (!question || loading || !statementPayload?.english) return
    const history = messages.map(({ role, content }) => ({ role, content }))
    const userMessage = { role: 'user', content: question }
    setMessages((current) => {
      const nextMessages = [...current, userMessage]
      aiTutorSessions.set(statementKey, { ...(aiTutorSessions.get(statementKey) || {}), booted: true, messages: nextMessages, error: '' })
      return nextMessages
    })
    setInput('')
    setError('')
    setLoading(true)

    try {
      const data = await askAiTutor({
        question,
        statement: statementPayload,
        lesson: { title: lesson?.title || '' },
        mode: modeTitle,
        history,
      })
      setMessages((current) => {
        const nextMessages = [...current, { role: 'assistant', content: data.answer, model: data.model }]
        aiTutorSessions.set(statementKey, { ...(aiTutorSessions.get(statementKey) || {}), booted: true, messages: nextMessages, error: '' })
        return nextMessages
      })
    } catch (requestError) {
      const nextError = requestError.message || 'AI 暂时无法回答'
      aiTutorSessions.set(statementKey, { ...(aiTutorSessions.get(statementKey) || {}), booted: true, messages: [...messages, userMessage], error: nextError })
      setError(nextError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-layer ai-chat-layer" role="dialog" aria-modal="true" aria-labelledby="ai-tutor-title">
      <section className="ai-chat-dialog">
        <div className="modal-heading inline">
          <div className="ai-title-row">
            <span>
              <Bot size={18} />
            </span>
            <h2 id="ai-tutor-title">AI 学习助手</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>

        <div className="ai-current-sentence">
          <span>学习当前句子</span>
          <strong>{statementPayload?.english || '当前没有句子'}</strong>
          {statementPayload?.chinese && <p>{statementPayload.chinese}</p>}
          {statementPayload?.soundmark && <small>{statementPayload.soundmark}</small>}
        </div>

        <div className="ai-chat-list" ref={chatListRef}>
          {!messages.length && loading && (
            <div className="ai-message assistant">
              <p>正在生成场景和例句...</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div className={`ai-message ${message.role}`} key={`${message.role}-${index}-${message.content.slice(0, 16)}`}>
              <p>{message.content}</p>
            </div>
          ))}
          {messages.length > 0 && loading && (
            <div className="ai-message assistant">
              <p>正在回复...</p>
            </div>
          )}
          {error && <div className="ai-error">{error}</div>}
        </div>

        <form className="ai-chat-form" onSubmit={sendQuestion}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendQuestion(event)
              }
            }}
            placeholder="继续提问当前句子..."
            rows={2}
          />
          <button className="ai-send-button" type="submit" disabled={!input.trim() || loading || !statementPayload?.english} aria-label="发送">
            {loading ? <Loader2 className="spin" size={18} /> : <SendHorizontal size={18} />}
          </button>
        </form>
      </section>
    </div>
  )
}

function SpeechSettingsDialog({ settings, onChange, onPreview, onClose }) {
  const speedLabel = `${Number(settings.rate).toFixed(2)}x`

  function changeSettings(nextSettings, preview = false) {
    const updated = { ...settings, ...nextSettings }
    onChange(updated)
    if (preview) {
      window.setTimeout(() => onPreview(updated), 80)
    }
  }

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="speech-settings-title">
      <section className="speech-settings-dialog">
        <div className="modal-heading inline">
          <h2 id="speech-settings-title">朗读设置</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>

        <label className="speech-setting-group">
          <span>朗读速度</span>
          <strong>{speedLabel}</strong>
          <input
            type="range"
            min="0.65"
            max="1.35"
            step="0.05"
            value={settings.rate}
            onChange={(event) => changeSettings({ rate: Number(event.target.value) })}
          />
        </label>

        <div className="speech-setting-group">
          <span>声音选择</span>
          <div className="speech-toggle" role="group" aria-label="声音选择">
            <button
              className={settings.voiceGender === 'female' ? 'selected' : ''}
              type="button"
              onClick={() => changeSettings({ voiceGender: 'female' }, true)}
            >
              女声
            </button>
            <button
              className={settings.voiceGender === 'male' ? 'selected' : ''}
              type="button"
              onClick={() => changeSettings({ voiceGender: 'male' }, true)}
            >
              男声
            </button>
          </div>
        </div>

        <button className="ghost-button preview-voice-button" type="button" onClick={() => onPreview(settings)}>
          <Volume2 size={18} />
          试听
        </button>
      </section>
    </div>
  )
}

function ExitGameDialog({ onClose, onExitHome, onExitCourses }) {
  return (
    <div className="modal-layer" role="dialog" aria-modal="true">
      <section className="exit-dialog">
        <div className="modal-heading">
          <h2>退出游戏</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>
        <p>休息是为了更好的学习，期待你的归来！</p>
        <button className="ghost-button" type="button" onClick={onExitHome}>
          返回首页
          <ChevronRight size={18} />
        </button>
        <button className="ghost-button" type="button" onClick={onExitCourses}>
          返回课程列表
          <ChevronRight size={18} />
        </button>
        <button className="primary-button" type="button" onClick={onClose}>
          开始学习
          <Play size={18} />
        </button>
      </section>
    </div>
  )
}

function ReadingView({ practice, onExit, onPractice }) {
  const [displayOpen, setDisplayOpen] = useState(true)
  const [focusSentence, setFocusSentence] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const { lesson } = getPracticeStatement(practice)
  const lines = lesson?.sentences?.length
    ? lesson.sentences.map((sentence) => sentence.content)
    : lesson?.statements?.map((statement) => statement.english) || []

  useEffect(() => {
    setCurrentLine(0)
  }, [lesson?.id])

  function playCurrentLine() {
    const text = lines[currentLine]
    if (text) speakText(text)
  }

  function moveLine(delta) {
    setCurrentLine((value) => Math.min(Math.max(value + delta, 0), Math.max(lines.length - 1, 0)))
  }

  return (
    <div className="reader-page page-enter">
      <header className="reader-topbar">
        <button className="icon-button" type="button" onClick={onExit} aria-label="退出">
          <ChevronLeft size={20} />
        </button>
        <strong>{lesson?.title || `第${practice.lesson}课`}（{Math.min(currentLine + 1, lines.length || 1)}/{lines.length || 1}）</strong>
        <div className="reader-controls">
          <button className="icon-button" type="button" aria-label="上一句" disabled={currentLine <= 0} onClick={() => moveLine(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button className="primary-round" type="button" aria-label="朗读当前句" onClick={playCurrentLine}>
            <Play size={20} />
          </button>
          <button className="icon-button" type="button" aria-label="下一句" disabled={currentLine >= lines.length - 1} onClick={() => moveLine(1)}>
            <ChevronRight size={18} />
          </button>
          <button className="ghost-button" type="button">朗读设置</button>
          <button className="ghost-button" type="button" onClick={() => setDisplayOpen((value) => !value)}>
            显示
          </button>
          <button className={`ghost-button ${focusSentence ? 'selected-soft' : ''}`} type="button" onClick={() => setFocusSentence((value) => !value)}>
            单句聚焦
          </button>
          <button className="icon-button" type="button" aria-label="阅读设置">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main className="reader-body">
        {displayOpen && (
          <div className="display-popover">
            <strong>想读得更轻松?</strong>
            <p>点「显示」，随时按需开启这些辅助：</p>
            <div>
              {['中文', '音标', '词性', '释义', '句子成分'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <button className="primary-button" type="button" onClick={() => setDisplayOpen(false)}>
              知道了
            </button>
          </div>
        )}
        <article className={`reader-lines ${focusSentence ? 'focused' : ''}`}>
          {lines.map((line, index) => (
            <button
              className={index === currentLine ? 'current' : ''}
              key={`${line}-${index}`}
              type="button"
              onClick={() => {
                setCurrentLine(index)
                speakText(line)
              }}
            >
              {line}
            </button>
          ))}
          {!lines.length && <p className="empty-reader-line">这节课没有返回阅读内容</p>}
        </article>
        <button className="primary-button reader-practice" type="button" onClick={onPractice}>
          开始练习
        </button>
        <button className="ai-helper reader-ai" type="button">
          <Sparkles size={18} />
          AI 学习助手
        </button>
      </main>
    </div>
  )
}

function ModePicker({ course, lesson, onClose, onBegin }) {
  const [selectedMode, setSelectedMode] = useState('translate')
  const selected = modes.find((mode) => mode.id === selectedMode)
  const Icon = selected.icon

  return (
    <div className="modal-layer mode-layer" role="dialog" aria-modal="true" aria-labelledby="mode-title">
      <section className="mode-modal">
        <div className="mode-list">
          <div className="modal-heading">
            <h2 id="mode-title">选择模式</h2>
            <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
              <X size={18} />
            </button>
          </div>
          {modes.map((mode) => {
            const ModeIcon = mode.icon
            return (
              <button
                className={selectedMode === mode.id ? 'selected' : ''}
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
              >
                <ModeIcon size={20} />
                <span>{mode.title}</span>
                {mode.recommended && <small>推荐</small>}
              </button>
            )
          })}
        </div>

        <div className="mode-detail">
          <div className="mode-intro">
            <div className="mode-intro-icon">
              <Icon size={34} />
            </div>
            <p className="eyebrow">模式介绍</p>
            <h1>{selected.title}</h1>
            <p>{selected.desc}</p>
          </div>
          <button className="primary-button mode-start-button" type="button" onClick={() => onBegin(selectedMode)}>
            开始学习
            <Play size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}

function PageTitle({ eyebrow, title, meta }) {
  return (
    <div className="page-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <span>{meta}</span>
    </div>
  )
}

function CourseCard({ course, actionLabel, onOpen, onAction }) {
  const completion = Math.round((course.completed / course.lessons) * 100)
  return (
    <article className="course-card">
      <button className="course-open" type="button" onClick={onOpen} aria-label={`打开${course.title}`} />
      <CourseCover course={course} />
      <div className="course-content">
        <div className="tag-row">
          <span>{course.tag}</span>
          <span>{course.level}</span>
        </div>
        <h2>{course.title}</h2>
        <p>{course.subtitle}</p>
        <div className="progress-track">
          <span style={{ width: `${completion}%` }} />
        </div>
        <div className="course-footer">
          <small>{course.completed}/{course.lessons} 课</small>
          <button className="secondary-button" type="button" onClick={onAction}>
            {actionLabel}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

function CourseRow({ course, onOpen }) {
  const completion = Math.round((course.completed / course.lessons) * 100)
  return (
    <button className="course-row" type="button" onClick={onOpen}>
      <CourseCover course={course} size="small" />
      <div>
        <strong>{course.title}</strong>
        <span>{course.currentLesson}</span>
      </div>
      <small>{completion}%</small>
    </button>
  )
}

function CourseCover({ course, size = 'normal' }) {
  return (
    <div className={`course-cover ${course.accent} ${size}`}>
      {course.coverImage && <img src={course.coverImage} alt="" loading="lazy" />}
      <div className="cover-stripe" />
      <strong>{course.cover}</strong>
      <span>{course.level}</span>
    </div>
  )
}

function StatTile({ label, value, tone }) {
  return (
    <div className={`stat-tile ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function TaskRow({ title, reward, done }) {
  return (
    <div className="task-row">
      <span className={done ? 'done-mark' : ''}>{done ? <Check size={16} /> : <Plus size={16} />}</span>
      <strong>{title}</strong>
      <small>{reward}</small>
    </div>
  )
}

function QueueRow({ title, count, tag, onClick }) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component className="queue-row" type={onClick ? 'button' : undefined} onClick={onClick}>
      <strong>{title}</strong>
      <span>{count}</span>
      <small>{tag}</small>
    </Component>
  )
}

export default App
