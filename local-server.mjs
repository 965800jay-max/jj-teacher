import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { access, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { EdgeTTS, Constants as EdgeTTSConstants } from '@andresaya/edge-tts'

const rootDir = dirname(fileURLToPath(import.meta.url))
const distDir = join(rootDir, 'dist')
const dataDir = join(rootDir, 'local-data')
const stateFile = join(dataDir, 'learning-state.json')
const usersFile = join(dataDir, 'users.json')
const legacyAccountFile = join(dataDir, 'user-account.json')
const ttsCacheDir = join(dataDir, 'tts-cache')
const openaiKeyFile = join(dataDir, 'openai-api-key.txt')
const globalStatsKey = '__julebuGlobalStats'
const port = Number(process.env.PORT || process.env.LOCAL_PORT || process.argv[2] || 5188)
const host = process.env.HOST || '127.0.0.1'
const openaiApiKey = readOpenAiApiKey()
const openaiModel = process.env.OPENAI_MODEL || 'gpt-5.6-sol'
const openaiFallbackModel = process.env.OPENAI_FALLBACK_MODEL || 'gpt-5.5'
const openaiReasoningEffort = process.env.OPENAI_REASONING_EFFORT || 'high'
const maxBodyBytes = 30 * 1024 * 1024
let stateWriteChain = Promise.resolve()
const ttsInFlight = new Map()

const defaultSavedItems = {
  mastered: [],
  vocab: [],
  forgottenWords: [],
  forgottenPhrases: [],
}

const defaultState = {
  progress: {},
  savedItems: defaultSavedItems,
  updatedAt: null,
}

function readOpenAiApiKey() {
  const envKey = String(process.env.OPENAI_API_KEY || '').trim()
  if (envKey) return envKey
  try {
    return readFileSync(openaiKeyFile, 'utf8').trim()
  } catch {
    return ''
  }
}

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Julebu-Session',
  }
}

function normalizeSavedItems(value) {
  if (!value || typeof value !== 'object') return defaultSavedItems
  return {
    mastered: Array.isArray(value.mastered) ? value.mastered : [],
    vocab: Array.isArray(value.vocab) ? value.vocab : [],
    forgottenWords: Array.isArray(value.forgottenWords) ? value.forgottenWords : [],
    forgottenPhrases: Array.isArray(value.forgottenPhrases) ? value.forgottenPhrases : [],
  }
}

function normalizeState(value) {
  if (!value || typeof value !== 'object') return { ...defaultState }
  return {
    progress: value.progress && typeof value.progress === 'object' ? value.progress : {},
    savedItems: normalizeSavedItems(value.savedItems),
    updatedAt: value.updatedAt || null,
  }
}

function maxNumber(...values) {
  return Math.max(0, ...values.map((value) => Number(value) || 0))
}

function latestDate(...values) {
  return values
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null
}

function mergeGlobalStats(current = {}, incoming = {}) {
  const answerCount = maxNumber(current.answerCount, incoming.answerCount)
  const correctCount = Math.min(answerCount, maxNumber(current.correctCount, incoming.correctCount))
  return {
    ...current,
    ...incoming,
    answerCount,
    correctCount,
    studyDates: [...new Set([...(current.studyDates || []), ...(incoming.studyDates || [])])],
    lastAnsweredAt: latestDate(current.lastAnsweredAt, incoming.lastAnsweredAt),
  }
}

function mergeLessonProgress(current = {}, incoming = {}) {
  const lessonIds = new Set([...Object.keys(current), ...Object.keys(incoming)])
  return Object.fromEntries(
    [...lessonIds].map((lessonId) => {
      const currentLesson = current[lessonId] || {}
      const incomingLesson = incoming[lessonId] || {}
      return [
        lessonId,
        {
          ...currentLesson,
          ...incomingLesson,
          statementIndex: maxNumber(currentLesson.statementIndex, incomingLesson.statementIndex),
          completedStatements: maxNumber(currentLesson.completedStatements, incomingLesson.completedStatements),
        },
      ]
    }),
  )
}

function mergeCourseProgress(current = {}, incoming = {}) {
  const incomingIsNewer = (Number(incoming.completed) || 0) >= (Number(current.completed) || 0)
  return {
    ...current,
    ...incoming,
    completed: maxNumber(current.completed, incoming.completed),
    minutes: maxNumber(current.minutes, incoming.minutes),
    currentLesson: incomingIsNewer ? incoming.currentLesson || current.currentLesson : current.currentLesson || incoming.currentLesson,
    lessonProgress: mergeLessonProgress(current.lessonProgress || {}, incoming.lessonProgress || {}),
  }
}

function mergeProgress(current = {}, incoming = {}) {
  const merged = { ...current, ...incoming }
  const keys = new Set([...Object.keys(current), ...Object.keys(incoming)])
  for (const key of keys) {
    if (key === globalStatsKey) {
      merged[key] = mergeGlobalStats(current[key], incoming[key])
      continue
    }
    const currentValue = current[key]
    const incomingValue = incoming[key]
    if (
      currentValue &&
      incomingValue &&
      typeof currentValue === 'object' &&
      typeof incomingValue === 'object'
    ) {
      merged[key] = mergeCourseProgress(currentValue, incomingValue)
    }
  }
  return merged
}

function mergeListById(current = [], incoming = []) {
  const map = new Map()
  for (const item of [...current, ...incoming]) {
    if (!item?.id) continue
    map.set(item.id, { ...(map.get(item.id) || {}), ...item })
  }
  return [...map.values()]
}

function mergeForgottenList(current = [], incoming = []) {
  const map = new Map()
  for (const item of [...current, ...incoming]) {
    if (!item?.id) continue
    const existing = map.get(item.id) || {}
    map.set(item.id, {
      ...existing,
      ...item,
      missCount: maxNumber(existing.missCount, item.missCount),
      attemptCount: maxNumber(existing.attemptCount, item.attemptCount),
      wrongCount: maxNumber(existing.wrongCount, item.wrongCount),
      revealCount: maxNumber(existing.revealCount, item.revealCount),
      lastMissedAt: latestDate(existing.lastMissedAt, item.lastMissedAt),
      updatedAt: latestDate(existing.updatedAt, item.updatedAt),
    })
  }
  return [...map.values()].sort((a, b) => {
    const rateA = (Number(a.missCount) || 0) / Math.max(Number(a.attemptCount) || 1, 1)
    const rateB = (Number(b.missCount) || 0) / Math.max(Number(b.attemptCount) || 1, 1)
    return rateB - rateA || new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  })
}

function mergeSavedItems(currentValue, incomingValue) {
  const current = normalizeSavedItems(currentValue)
  const incoming = normalizeSavedItems(incomingValue)
  return {
    mastered: mergeListById(current.mastered, incoming.mastered),
    vocab: mergeListById(current.vocab, incoming.vocab),
    forgottenWords: mergeForgottenList(current.forgottenWords, incoming.forgottenWords),
    forgottenPhrases: mergeForgottenList(current.forgottenPhrases, incoming.forgottenPhrases),
  }
}

function mergeState(currentValue, incomingValue, updatedAt) {
  const current = normalizeState(currentValue)
  const incoming = normalizeState(incomingValue)
  return {
    progress: mergeProgress(current.progress, incoming.progress),
    savedItems: mergeSavedItems(current.savedItems, incoming.savedItems),
    updatedAt: latestDate(current.updatedAt, incoming.updatedAt, updatedAt),
  }
}

function enqueueStateWrite(work) {
  const next = stateWriteChain.then(work, work)
  stateWriteChain = next.catch(() => {})
  return next
}

function normalizeUsername(value) {
  return String(value || '').trim()
}

function usernameKey(value) {
  return normalizeUsername(value).toLowerCase()
}

function userIdForUsername(username) {
  return createHash('sha256').update(`julebu:user:${usernameKey(username)}`).digest('hex').slice(0, 24)
}

function publicUser(user) {
  if (!user) return null
  return {
    username: user.username,
    displayName: user.displayName || user.username,
    createdAt: user.createdAt || null,
    lastLoginAt: user.lastLoginAt || null,
  }
}

function makePasswordHash(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  const [salt, key] = String(storedHash || '').split(':')
  if (!salt || !key) return false
  const hashed = scryptSync(String(password), salt, 64)
  const stored = Buffer.from(key, 'hex')
  return stored.length === hashed.length && timingSafeEqual(stored, hashed)
}

function makeSessionToken(user) {
  const secret = user.sessionSecret || ''
  if (!secret) return ''
  return createHash('sha256').update(`${user.id}:${user.username}:${secret}`).digest('hex')
}

function readSessionToken(request) {
  return String(request.headers['x-julebu-session'] || '')
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object' || !user.username || !user.passwordHash) return null
  const username = normalizeUsername(user.username)
  return {
    ...user,
    id: user.id || userIdForUsername(username),
    username,
    usernameKey: user.usernameKey || usernameKey(username),
    displayName: user.displayName || username,
    sessionSecret: user.sessionSecret || randomBytes(32).toString('hex'),
    createdAt: user.createdAt || new Date().toISOString(),
    lastLoginAt: user.lastLoginAt || null,
  }
}

function normalizeUserStore(value) {
  const users = Array.isArray(value?.users) ? value.users.map(normalizeUser).filter(Boolean) : []
  return { users }
}

async function readLegacyAccount() {
  try {
    return normalizeUser(JSON.parse(await readFile(legacyAccountFile, 'utf8')))
  } catch {
    return null
  }
}

async function readUserStore() {
  try {
    return normalizeUserStore(JSON.parse(await readFile(usersFile, 'utf8')))
  } catch {
    const legacyAccount = await readLegacyAccount()
    const store = legacyAccount ? { users: [legacyAccount] } : { users: [] }
    if (legacyAccount) await writeUserStore(store)
    return store
  }
}

async function writeUserStore(store) {
  await mkdir(dataDir, { recursive: true })
  const normalized = normalizeUserStore(store)
  const tempFile = `${usersFile}.tmp`
  await writeFile(tempFile, JSON.stringify(normalized, null, 2), 'utf8')
  await rename(tempFile, usersFile)
  return normalized
}

function findUserByUsername(store, username) {
  const key = usernameKey(username)
  return store.users.find((user) => user.usernameKey === key) || null
}

async function authenticatedUser(request) {
  const token = readSessionToken(request)
  if (!token) return null
  const store = await readUserStore()
  return store.users.find((user) => makeSessionToken(user) === token) || null
}

async function ensureStateFile() {
  await mkdir(dataDir, { recursive: true })
  try {
    await access(stateFile, constants.F_OK)
  } catch {
    await writeFile(stateFile, JSON.stringify({ users: {}, updatedAt: null }, null, 2), 'utf8')
  }
}

function normalizeStateStore(value) {
  if (value?.users && typeof value.users === 'object') {
    return {
      users: Object.fromEntries(
        Object.entries(value.users).map(([userId, state]) => [userId, normalizeState(state)]),
      ),
      updatedAt: value.updatedAt || null,
    }
  }
  return {
    users: {},
    legacyState: normalizeState(value),
    updatedAt: value?.updatedAt || null,
  }
}

async function readStateStore() {
  await ensureStateFile()
  try {
    return normalizeStateStore(JSON.parse(await readFile(stateFile, 'utf8')))
  } catch {
    return { users: {}, updatedAt: null }
  }
}

async function writeStateStore(store) {
  await mkdir(dataDir, { recursive: true })
  const state = {
    users: store.users || {},
    updatedAt: store.updatedAt || new Date().toISOString(),
  }
  const tempFile = `${stateFile}.tmp`
  await writeFile(tempFile, JSON.stringify(state, null, 2), 'utf8')
  await rename(tempFile, stateFile)
  return state
}

function stateHasContent(state) {
  return Boolean(
    Object.keys(state.progress || {}).length ||
    state.savedItems?.mastered?.length ||
    state.savedItems?.vocab?.length ||
    state.savedItems?.forgottenWords?.length ||
    state.savedItems?.forgottenPhrases?.length
  )
}

async function migrateLegacyStateToUser(user) {
  const store = await readStateStore()
  if (Object.keys(store.users || {}).length || !store.legacyState || !stateHasContent(store.legacyState)) return
  await writeStateStore({
    users: {
      [user.id]: normalizeState({ ...store.legacyState, updatedAt: new Date().toISOString() }),
    },
    updatedAt: new Date().toISOString(),
  })
}

async function readUserState(user) {
  const store = await readStateStore()
  return normalizeState(store.users?.[user.id])
}

async function writeUserState(user, value) {
  const store = await readStateStore()
  const now = new Date().toISOString()
  const state = mergeState(store.users?.[user.id], { ...value, updatedAt: now }, now)
  await writeStateStore({
    users: {
      ...(store.users || {}),
      [user.id]: state,
    },
    updatedAt: now,
  })
  return state
}

function sendJson(response, statusCode, value) {
  response.writeHead(statusCode, {
    ...corsHeaders(),
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(value))
}

function sendText(response, statusCode, value) {
  response.writeHead(statusCode, {
    ...corsHeaders(),
    'Content-Type': 'text/plain; charset=utf-8',
  })
  response.end(value)
}

function sendLoginRequired(response) {
  sendJson(response, 401, { error: 'Login required' })
}

function normalizeAiText(value, limit = 2000) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit)
}

function normalizeAiStatement(value = {}) {
  const words = Array.isArray(value.words)
    ? value.words
        .slice(0, 32)
        .map((word) => ({
          word: normalizeAiText(word.word, 80),
          soundmark: normalizeAiText(word.soundmark, 80),
          pos: normalizeAiText(word.pos, 80),
          chinese: normalizeAiText(word.chinese, 120),
        }))
        .filter((word) => word.word)
    : []

  return {
    id: normalizeAiText(value.id, 120),
    english: normalizeAiText(value.english, 1200),
    chinese: normalizeAiText(value.chinese, 1200),
    soundmark: normalizeAiText(value.soundmark, 400),
    words,
  }
}

function normalizeAiHistory(value) {
  if (!Array.isArray(value)) return []
  return value
    .slice(-8)
    .map((message) => ({
      role: message?.role === 'assistant' ? 'assistant' : 'user',
      content: normalizeAiText(message?.content, 1200),
    }))
    .filter((message) => message.content)
}

function buildAiTutorPrompt(payload) {
  const statement = normalizeAiStatement(payload.statement)
  const lessonTitle = normalizeAiText(payload.lesson?.title || payload.lessonTitle, 180)
  const modeTitle = normalizeAiText(payload.mode || payload.modeTitle, 80)
  const history = normalizeAiHistory(payload.history)
  const question = normalizeAiText(payload.question, 1200)
  const wordLines = statement.words
    .map((word) => `${word.word}${word.soundmark ? ` ${word.soundmark}` : ''}${word.pos ? ` · ${word.pos}` : ''}${word.chinese ? ` · ${word.chinese}` : ''}`)
    .join('\n')
  const historyText = history
    .map((message) => `${message.role === 'assistant' ? 'AI' : '用户'}: ${message.content}`)
    .join('\n')

  return {
    question,
    instructions: [
      '你是句乐部的英语学习助教，只围绕用户当前正在学习的句子答疑。',
      '默认用简体中文回答，除非用户要求英文。',
      '回答必须非常简单，一眼能看懂。',
      '自动分析当前句子时，只回答两行：场景：... 例句：...',
      '用户继续提问时，也只回答最关键内容，通常不超过3行。',
      '不要主动展开语法、词性、结构分析，除非用户明确问为什么或语法。',
      '不要编造课程外不存在的信息；如果问题和当前句子无关，也要先回到当前句子的学习目标。',
      '不要使用 Markdown 格式，不要加粗、不要表格、不要项目符号。',
    ].join('\n'),
    input: [
      '当前学习内容：',
      lessonTitle ? `课程/课时：${lessonTitle}` : '',
      modeTitle ? `练习模式：${modeTitle}` : '',
      statement.english ? `英文句子：${statement.english}` : '',
      statement.chinese ? `中文提示：${statement.chinese}` : '',
      statement.soundmark ? `音标：${statement.soundmark}` : '',
      wordLines ? `单词拆解：\n${wordLines}` : '',
      historyText ? `最近对话：\n${historyText}` : '',
      `用户问题：${question}`,
    ].filter(Boolean).join('\n\n'),
  }
}

function extractOpenAiText(value) {
  if (typeof value?.output_text === 'string') return value.output_text.trim()
  const chunks = []
  for (const item of value?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') chunks.push(content.text)
      if (typeof content?.summary === 'string') chunks.push(content.summary)
    }
  }
  return chunks.join('\n').trim()
}

function shouldRetryWithFallback(statusCode, data) {
  const message = String(data?.error?.message || '').toLowerCase()
  const code = String(data?.error?.code || '').toLowerCase()
  return (
    openaiFallbackModel &&
    openaiFallbackModel !== openaiModel &&
    (statusCode === 404 || statusCode === 400 || code.includes('model')) &&
    (message.includes('model') || message.includes('preview') || message.includes('available'))
  )
}

async function requestOpenAiResponse({ model, prompt, signal }) {
  const aiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      instructions: prompt.instructions,
      input: prompt.input,
      reasoning: { effort: openaiReasoningEffort },
      max_output_tokens: 900,
      store: false,
    }),
    signal,
  })
  const data = await aiResponse.json().catch(() => ({}))
  return { aiResponse, data, model }
}

async function handleAiChatApi(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  const user = await authenticatedUser(request)
  if (!user) {
    sendLoginRequired(response)
    return
  }

  if (!openaiApiKey) {
    sendJson(response, 503, { error: 'AI 服务未配置，请在服务器设置 OPENAI_API_KEY 后再使用。' })
    return
  }

  try {
    const body = await readRequestBody(request)
    const payload = body ? JSON.parse(body) : {}
    const prompt = buildAiTutorPrompt(payload)
    if (!prompt.question) {
      sendJson(response, 400, { error: '请输入问题' })
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45000)
    let result = await requestOpenAiResponse({ model: openaiModel, prompt, signal: controller.signal })
    if (!result.aiResponse.ok && shouldRetryWithFallback(result.aiResponse.status, result.data)) {
      result = await requestOpenAiResponse({ model: openaiFallbackModel, prompt, signal: controller.signal })
    }
    clearTimeout(timer)
    const { aiResponse, data, model } = result
    if (!aiResponse.ok) {
      sendJson(response, 502, { error: data?.error?.message || 'AI 服务暂时不可用' })
      return
    }

    const answer = extractOpenAiText(data)
    sendJson(response, 200, {
      answer: answer || '这句我暂时没有生成出有效解答，请再问一次。',
      model,
    })
  } catch (error) {
    sendJson(response, error?.name === 'AbortError' ? 504 : 400, {
      error: error?.name === 'AbortError' ? 'AI 回答超时，请稍后再试' : 'AI 请求内容无效',
    })
  }
}

function normalizeTtsText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 600)
}

function normalizeTtsGender(value) {
  return value === 'male' ? 'male' : 'female'
}

function ttsVoiceForGender(voiceGender) {
  return normalizeTtsGender(voiceGender) === 'male' ? 'en-US-AndrewNeural' : 'en-US-AvaNeural'
}

function normalizeTtsRate(value) {
  const rate = Number(value)
  if (!Number.isFinite(rate)) return 0.92
  return Math.min(1.25, Math.max(0.72, rate))
}

function ttsRatePercent(rate) {
  return Math.round((normalizeTtsRate(rate) - 1) * 100)
}

function ttsCacheKey({ text, voiceGender, rate }) {
  return createHash('sha256')
    .update(JSON.stringify({
      version: 2,
      text,
      voice: ttsVoiceForGender(voiceGender),
      rate: ttsRatePercent(rate),
      format: 'audio-24khz-96kbitrate-mono-mp3',
    }))
    .digest('hex')
}

async function generateTtsBuffer({ text, voiceGender, rate }) {
  const tts = new EdgeTTS()
  await tts.synthesize(text, ttsVoiceForGender(voiceGender), {
    rate: ttsRatePercent(rate),
    pitch: 0,
    volume: 100,
    outputFormat: EdgeTTSConstants.OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
  })
  return tts.toBuffer()
}

async function cachedTtsBuffer(options) {
  await mkdir(ttsCacheDir, { recursive: true })
  const cacheKey = ttsCacheKey(options)
  const cacheFile = join(ttsCacheDir, `${cacheKey}.mp3`)
  try {
    return await readFile(cacheFile)
  } catch {
    // Generate below.
  }

  if (!ttsInFlight.has(cacheKey)) {
    ttsInFlight.set(cacheKey, (async () => {
      const buffer = await generateTtsBuffer(options)
      const tempFile = `${cacheFile}.${process.pid}.tmp`
      await writeFile(tempFile, buffer)
      await rename(tempFile, cacheFile)
      return buffer
    })().finally(() => {
      ttsInFlight.delete(cacheKey)
    }))
  }

  return ttsInFlight.get(cacheKey)
}

async function handleTtsApi(request, response, url) {
  if (request.method !== 'GET') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  const text = normalizeTtsText(url.searchParams.get('text'))
  if (!text) {
    sendJson(response, 400, { error: 'Missing text' })
    return
  }

  try {
    const buffer = await cachedTtsBuffer({
      text,
      voiceGender: normalizeTtsGender(url.searchParams.get('voiceGender')),
      rate: normalizeTtsRate(url.searchParams.get('rate')),
    })
    response.writeHead(200, {
      ...corsHeaders(),
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=604800',
    })
    response.end(buffer)
  } catch {
    sendJson(response, 503, { error: 'TTS unavailable' })
  }
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > maxBodyBytes) {
        reject(new Error('Request body is too large'))
        request.destroy()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    request.on('error', reject)
  })
}

async function handleStateApi(request, response) {
  const user = await authenticatedUser(request)
  if (!user) {
    sendLoginRequired(response)
    return
  }

  if (request.method === 'GET') {
    sendJson(response, 200, await readUserState(user))
    return
  }

  if (request.method === 'PUT') {
    let payload = {}
    try {
      const body = await readRequestBody(request)
      payload = body ? JSON.parse(body) : {}
    } catch {
      sendJson(response, 400, { error: 'Invalid state payload' })
      return
    }

    try {
      sendJson(response, 200, await enqueueStateWrite(() => writeUserState(user, payload)))
    } catch {
      sendJson(response, 500, { error: 'State save failed' })
    }
    return
  }

  sendJson(response, 405, { error: 'Method not allowed' })
}

async function handleSessionApi(request, response) {
  if (request.method !== 'GET') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  const store = await readUserStore()
  const user = await authenticatedUser(request)
  sendJson(response, 200, {
    hasUsers: store.users.length > 0,
    user: publicUser(user),
  })
}

async function handleRegisterApi(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  try {
    const body = await readRequestBody(request)
    const payload = body ? JSON.parse(body) : {}
    const username = normalizeUsername(payload.username)
    const password = String(payload.password || '')
    if (username.length < 2 || password.length < 4) {
      sendJson(response, 400, { error: 'Invalid account payload' })
      return
    }

    const store = await readUserStore()
    if (findUserByUsername(store, username)) {
      sendJson(response, 409, { error: 'Username already exists' })
      return
    }

    const now = new Date().toISOString()
    const user = normalizeUser({
      id: randomBytes(12).toString('hex'),
      username,
      usernameKey: usernameKey(username),
      displayName: username,
      passwordHash: makePasswordHash(password),
      sessionSecret: randomBytes(32).toString('hex'),
      createdAt: now,
      lastLoginAt: now,
    })
    const nextStore = await writeUserStore({ users: [...store.users, user] })
    const savedUser = findUserByUsername(nextStore, username)
    await migrateLegacyStateToUser(savedUser)
    sendJson(response, 200, {
      token: makeSessionToken(savedUser),
      user: publicUser(savedUser),
    })
  } catch {
    sendJson(response, 400, { error: 'Invalid account payload' })
  }
}

async function handleLoginApi(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  try {
    const body = await readRequestBody(request)
    const payload = body ? JSON.parse(body) : {}
    const store = await readUserStore()
    const user = findUserByUsername(store, payload.username)
    if (!user || !verifyPassword(String(payload.password || ''), user.passwordHash)) {
      sendJson(response, 401, { error: 'Invalid username or password' })
      return
    }

    const nextUser = {
      ...user,
      lastLoginAt: new Date().toISOString(),
    }
    const nextStore = await writeUserStore({
      users: store.users.map((item) => (item.id === user.id ? nextUser : item)),
    })
    const savedUser = nextStore.users.find((item) => item.id === user.id)
    sendJson(response, 200, {
      token: makeSessionToken(savedUser),
      user: publicUser(savedUser),
    })
  } catch {
    sendJson(response, 400, { error: 'Invalid login payload' })
  }
}

async function handleLogoutApi(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  const user = await authenticatedUser(request)
  if (user) {
    const store = await readUserStore()
    await writeUserStore({
      users: store.users.map((item) =>
        item.id === user.id ? { ...item, sessionSecret: randomBytes(32).toString('hex') } : item,
      ),
    })
  }
  sendJson(response, 200, { ok: true })
}

function safeStaticPath(pathname) {
  const decodedPath = decodeURIComponent(pathname)
  const relativePath = (decodedPath === '/' ? 'index.html' : decodedPath).replace(/^\/+/, '')
  const filePath = normalize(join(distDir, relativePath))
  if (filePath !== distDir && !filePath.startsWith(`${distDir}${sep}`)) return null
  return filePath
}

async function serveFile(response, filePath) {
  const data = await readFile(filePath)
  const isDownload = filePath.includes(`${sep}downloads${sep}`)
  response.writeHead(200, {
    ...corsHeaders(),
    'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
    'Cache-Control':
      filePath.endsWith('index.html') || filePath.endsWith('download.html') || isDownload
        ? 'no-store'
        : 'public, max-age=31536000, immutable',
  })
  response.end(data)
}

async function handleStatic(request, response, pathname) {
  let filePath = safeStaticPath(pathname)
  if (!filePath) {
    sendText(response, 403, 'Forbidden')
    return
  }

  try {
    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) filePath = join(filePath, 'index.html')
    await serveFile(response, filePath)
  } catch {
    if (pathname.startsWith('/assets/') || pathname.startsWith('/data/')) {
      sendText(response, 404, 'Not found')
      return
    }
    await serveFile(response, join(distDir, 'index.html'))
  }
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, corsHeaders())
      response.end()
      return
    }

    const url = new URL(request.url || '/', `http://${host}:${port}`)
    if (url.pathname === '/api/state') {
      await handleStateApi(request, response)
      return
    }
    if (url.pathname === '/api/session') {
      await handleSessionApi(request, response)
      return
    }
    if (url.pathname === '/api/register') {
      await handleRegisterApi(request, response)
      return
    }
    if (url.pathname === '/api/login') {
      await handleLoginApi(request, response)
      return
    }
    if (url.pathname === '/api/logout') {
      await handleLogoutApi(request, response)
      return
    }
    if (url.pathname === '/healthz') {
      sendJson(response, 200, { ok: true })
      return
    }
    if (url.pathname === '/api/tts') {
      await handleTtsApi(request, response, url)
      return
    }
    if (url.pathname === '/api/ai-chat') {
      await handleAiChatApi(request, response)
      return
    }
    await handleStatic(request, response, url.pathname)
  } catch {
    sendText(response, 500, 'Server error')
  }
})

server.listen(port, host, () => {
  console.log(`Julebu server: http://${host}:${port}/`)
  console.log(`Users file: ${usersFile}`)
  console.log(`Learning data file: ${stateFile}`)
  console.log('Login required: true')
})
