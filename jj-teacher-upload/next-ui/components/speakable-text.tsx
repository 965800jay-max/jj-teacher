'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Volume2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'
import {
  ADD_WORD_EXAMPLE_EVENT,
  addVocabBookItem,
  cacheWord,
  getCachedWord,
  hasVocabBookItem,
  type WordLookup
} from '@/lib/vocab-book'

interface SpeakableTextProps {
  text: string
  rate?: number
  className?: string
  wordClassName?: string
  punctuationClassName?: string
  onDoubleTap?: () => void
}

const TOKEN_PATTERN = /[A-Za-z]+(?:['’][A-Za-z]+)?|\d+(?:[.,]\d+)?|[^\w\s]+|\s+/g
const API_BASE = 'https://jj-teacher.onrender.com'
const AUTH_TOKEN_KEY = 'sentence-reader-auth-token'

function getStoredAuthToken() {
  return typeof window === 'undefined' ? '' : window.localStorage.getItem(AUTH_TOKEN_KEY) || ''
}

function getTokens(text: string) {
  return text.match(TOKEN_PATTERN) || [text]
}

function cleanToken(token: string) {
  return token.replace(/[“”"()[\]{}.,!?;:，。！？；：]/g, '').trim()
}

export function SpeakableText({
  text,
  rate = 1,
  className,
  wordClassName,
  punctuationClassName,
  onDoubleTap
}: SpeakableTextProps) {
  const [activeWord, setActiveWord] = useState('')
  const [lookup, setLookup] = useState<WordLookup | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isExampleAdded, setIsExampleAdded] = useState(false)
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTapAtRef = useRef(0)

  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!activeWord) return
    const cached = getCachedWord(activeWord)
    setLookup(cached)
    setIsSaved(hasVocabBookItem(activeWord))
    setIsExampleAdded(false)
    setError('')

    if (cached?.exampleZh) return

    let cancelled = false
    setIsLoading(true)
    const token = getStoredAuthToken()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    fetch(`${API_BASE}/api/word-lookup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ word: activeWord })
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return
        if (!ok) throw new Error(String(data.message || data.error || '查询失败'))
        const nextLookup: WordLookup = {
          word: String(data.word || activeWord).trim().toLowerCase(),
          phonetic: String(data.phonetic || '').trim(),
          meaning: String(data.meaning || '').trim(),
          example: String(data.example || '').trim(),
          exampleZh: String(data.exampleZh || '').trim()
        }
        cacheWord(nextLookup)
        setLookup(nextLookup)
      })
      .catch(() => {
        if (!cancelled) setError('释义获取失败，请重试。')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeWord])

  const closeLookup = () => {
    setActiveWord('')
    setLookup(null)
    setError('')
    setIsLoading(false)
  }

  const getExampleText = (item: WordLookup) => item.example || `I want to practice the word ${item.word}.`
  const getExampleZh = (item: WordLookup) => item.exampleZh || `我想练习 ${item.word} 这个词。`

  const addExampleToSentences = (item: WordLookup) => {
    const english = getExampleText(item)
    const chinese = getExampleZh(item)
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent(ADD_WORD_EXAMPLE_EVENT, {
      detail: { english, chinese }
    }))
    setIsExampleAdded(true)
  }

  const handleWordTap = (word: string) => {
    if (!onDoubleTap) {
      speakEnglish(word, { mode: 'word', rate })
      setActiveWord(word.toLowerCase())
      return
    }

    const now = Date.now()
    if (now - lastTapAtRef.current < 360) {
      lastTapAtRef.current = 0
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current)
        singleTapTimerRef.current = null
      }
      onDoubleTap()
      return
    }

    lastTapAtRef.current = now
    if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current)
    singleTapTimerRef.current = setTimeout(() => {
      speakEnglish(word, { mode: 'word', rate })
      setActiveWord(word.toLowerCase())
      singleTapTimerRef.current = null
    }, 230)
  }

  return (
    <>
      <span className={cn('inline', className)}>
        {getTokens(text).map((token, index) => {
          if (/^\s+$/.test(token)) return <span key={index}> </span>

          const clean = cleanToken(token)
          const isWord = /^[A-Za-z]+(?:['’][A-Za-z]+)?$/.test(clean)
          if (!isWord) {
            return (
              <span key={index} className={cn('text-white/45', punctuationClassName)}>
                {token}
              </span>
            )
          }

          return (
            <button
              key={index}
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                const word = clean.replace(/’/g, "'")
                handleWordTap(word)
              }}
              className={cn(
                'inline rounded-lg px-1 -mx-1 text-left transition-premium hover:bg-[oklch(0.70_0.15_280_/_0.1)] hover:text-[oklch(0.80_0.15_280)]',
                wordClassName
              )}
            >
              {token}
            </button>
          )
        })}
      </span>

      {activeWord && typeof document !== 'undefined' ? createPortal((
        <div className="fixed inset-0 z-[140] flex items-end justify-center bg-black/55 backdrop-blur-sm px-4 pb-4 pt-16 animate-fade-in">
          <button className="absolute inset-0 cursor-default" aria-label="关闭单词释义" onClick={closeLookup} />
          <div className="relative w-full max-w-[520px] glass-sheet rounded-[2rem] p-5 animate-scale-in">
            <div className="top-highlight" />
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.18em] uppercase mb-1">
                  Word
                </p>
                <h2 className="text-2xl font-semibold text-white/95">{lookup?.word || activeWord}</h2>
                {lookup?.phonetic && <p className="mt-1 text-sm text-white/45">/{lookup.phonetic}/</p>}
              </div>
              <button
                type="button"
                onClick={closeLookup}
                className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/55 hover:text-white transition-premium"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {lookup ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.14em] uppercase mb-2">
                    中文意思
                  </p>
                  <p className="text-[15px] text-white/80 leading-relaxed">{lookup.meaning || '暂无释义'}</p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[11px] text-white/35 font-semibold tracking-[0.14em] uppercase">Example</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => speakEnglish(getExampleText(lookup), { mode: 'sentence', rate })}
                        className="w-8 h-8 rounded-xl glass-button flex items-center justify-center text-white/60 hover:text-white transition-premium"
                        aria-label="朗读例句"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => addExampleToSentences(lookup)}
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center transition-premium",
                          isExampleAdded ? "glass-button text-white/40" : "glass-button-primary"
                        )}
                        aria-label="添加例句到句读"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[15px] text-white/82 leading-relaxed">{getExampleText(lookup)}</p>
                  <p className="mt-2 text-sm text-white/45 leading-relaxed">{getExampleZh(lookup)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => speakEnglish(lookup.word, { mode: 'word', rate })}
                    className="h-12 rounded-2xl glass-button flex items-center justify-center gap-2 text-sm font-semibold text-white/80 transition-premium"
                  >
                    <Volume2 className="w-4 h-4" />
                    朗读
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addVocabBookItem(lookup)
                      setIsSaved(true)
                    }}
                    className={cn(
                      "h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-premium",
                      isSaved ? "glass-button text-white/45" : "glass-button-primary"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    {isSaved ? '已加入' : '加入生词本'}
                  </button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex items-center gap-3 text-sm text-white/45 py-8">
                <div className="w-5 h-5 border-2 border-white/20 border-t-[oklch(0.70_0.15_280)] rounded-full animate-spin" />
                <span>正在获取释义...</span>
              </div>
            ) : (
              <div className="py-8">
                <p className="text-sm text-white/55">{error || '暂无释义。'}</p>
              </div>
            )}
          </div>
        </div>
      ), document.body) : null}
    </>
  )
}
