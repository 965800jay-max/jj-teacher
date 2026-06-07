'use client'

const API_BASE = 'https://jj-teacher.onrender.com'
const DEFAULT_VOICE_LANGUAGE = 'en-US'
const AUTH_TOKEN_KEY = 'sentence-reader-auth-token'

type NativeAudioPlugin = {
  play?: (options: { url: string; rate?: number }) => Promise<void>
  stop?: () => Promise<void>
}

declare global {
  interface Window {
    Capacitor?: {
      Plugins?: {
        NativeAudio?: NativeAudioPlugin
      }
    }
  }
}

let currentAudio: HTMLAudioElement | null = null
let speechSessionId = 0
let nativeAudioAvailable = true
const audioCache = new Map<string, string>()

function getStoredAuthToken() {
  return typeof window === 'undefined' ? '' : window.localStorage.getItem(AUTH_TOKEN_KEY) || ''
}

function getNativeAudio() {
  return typeof window === 'undefined' ? null : window.Capacitor?.Plugins?.NativeAudio || null
}

function buildGoogleTtsUrl(text: string) {
  const params = new URLSearchParams({
    ie: 'UTF-8',
    client: 'tw-ob',
    tl: 'en',
    q: text,
    ttsspeed: '1'
  })
  return `https://translate.google.com/translate_tts?${params.toString()}`
}

function splitSpeechChunks(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return []
  if (clean.length <= 180) return [clean]

  const parts = clean.match(/[^.!?]+[.!?]?/g) || [clean]
  const chunks: string[] = []
  let current = ''

  parts.forEach((part) => {
    const next = `${current} ${part}`.trim()
    if (next.length <= 180) {
      current = next
      return
    }
    if (current) chunks.push(current)
    current = part.trim()
  })

  if (current) chunks.push(current)
  return chunks
}

async function stopCurrentAudio() {
  const nativeAudio = getNativeAudio()
  nativeAudio?.stop?.().catch(() => {})
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
  window.speechSynthesis?.cancel?.()
}

async function fetchSpeechAudioUrl(text: string, mode: 'sentence' | 'word') {
  const cacheKey = `${mode}:${text}`
  const cached = audioCache.get(cacheKey)
  if (cached) return cached

  try {
    const token = getStoredAuthToken()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    const response = await fetch(`${API_BASE}/api/speech`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text,
        mode,
        language: 'english',
        voiceLanguage: DEFAULT_VOICE_LANGUAGE
      })
    })
    if (!response.ok) throw new Error('Speech request failed')
    const contentType = response.headers.get('Content-Type') || ''
    if (!contentType.includes('audio')) throw new Error('Speech response was not audio')
    const blob = await response.blob()
    if (!blob.size) throw new Error('Empty speech audio')
    const url = URL.createObjectURL(blob)
    audioCache.set(cacheKey, url)
    return url
  } catch {
    return buildGoogleTtsUrl(text)
  }
}

async function playAudioUrl(url: string, rate: number) {
  const nativeAudio = getNativeAudio()
  if (nativeAudioAvailable && nativeAudio?.play && /^https?:\/\//.test(url)) {
    try {
      await nativeAudio.play({ url, rate })
      return
    } catch {
      nativeAudioAvailable = false
    }
  }

  currentAudio = new Audio(url)
  currentAudio.playbackRate = Math.min(1.25, Math.max(0.65, rate))
  const pitchAudio = currentAudio as HTMLAudioElement & {
    preservesPitch?: boolean
    mozPreservesPitch?: boolean
    webkitPreservesPitch?: boolean
  }
  pitchAudio.preservesPitch = true
  pitchAudio.mozPreservesPitch = true
  pitchAudio.webkitPreservesPitch = true
  await currentAudio.play()
}

function speakWithSystemVoice(text: string, rate: number) {
  return new Promise<void>((resolve, reject) => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      reject(new Error('System speech unavailable'))
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = DEFAULT_VOICE_LANGUAGE
    utterance.rate = Math.min(1.15, Math.max(0.72, rate))
    utterance.onend = () => resolve()
    utterance.onerror = () => reject(new Error('System speech failed'))
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  })
}

export async function speakEnglish(
  text: string,
  options: { mode?: 'sentence' | 'word'; rate?: number } = {}
) {
  if (typeof window === 'undefined') return
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return

  const mode = options.mode || 'sentence'
  const rate = options.rate || 1
  const sessionId = ++speechSessionId
  await stopCurrentAudio()

  const chunks = splitSpeechChunks(clean)
  for (const chunk of chunks) {
    if (sessionId !== speechSessionId) return
    const nativeAudio = getNativeAudio()
    if (nativeAudioAvailable && nativeAudio?.play) {
      try {
        await playAudioUrl(buildGoogleTtsUrl(chunk), rate)
        continue
      } catch {
        nativeAudioAvailable = false
      }
    }

    try {
      await playAudioUrl(await fetchSpeechAudioUrl(chunk, mode), rate)
    } catch {
      await speakWithSystemVoice(chunk, rate).catch(() => {})
    }
  }
}
