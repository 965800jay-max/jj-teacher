'use client'

import { useState } from 'react'
import { Play, Plus, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'
import { SpeakableText } from '@/components/speakable-text'
import type { TeacherMessage } from '@/lib/sample-data'

interface ChatMessageProps {
  message: TeacherMessage
  onSpeak?: (text: string) => void
  onAddSentence?: (text: string, note: string) => void
}

type ChatContentItem = { type: 'text' | 'english'; text: string; zh?: string }
type LabeledPair = { en: string; zh: string }
type ParsedContent =
  | { type: 'simple'; text: string }
  | { type: 'daily-sentences'; pairs: LabeledPair[] }
  | { type: 'chat'; content: ChatContentItem[] }
  | { type: 'structured'; intro: string[]; pairs: LabeledPair[]; outro: string[] }

function cleanFieldText(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/^\s*(?:[-•*]|\d+[.)、])\s*/, '')
    .trim()
}

function splitNumberedValues(value: string) {
  const withBreaks = value.replace(/\s+(?=\d+[.)、]\s*)/g, '\n')
  const parts = withBreaks
    .split(/\n+/)
    .map(cleanFieldText)
    .filter(Boolean)

  return parts.length ? parts : [cleanFieldText(value)].filter(Boolean)
}

function splitParagraphs(value: string) {
  return value
    .split(/\n+/)
    .map(cleanFieldText)
    .filter(Boolean)
}

function pushLabeledPairs(pairs: LabeledPair[], englishValue: string, zhValue = '') {
  const englishParts = splitNumberedValues(englishValue)
  const zhParts = splitNumberedValues(zhValue)
  const count = Math.max(englishParts.length, zhParts.length)

  for (let index = 0; index < count; index += 1) {
    const en = englishParts[index] || (count === 1 ? englishParts[0] : '')
    if (!en) continue
    pairs.push({
      en,
      zh: zhParts[index] || ''
    })
  }
}

function parseLabeledSections(text: string) {
  const labelPattern = /(英文|英语|English|中文意思|中文|Chinese meaning|Meaning)\s*[:：]/gi
  const matches = Array.from(text.matchAll(labelPattern))
  if (!matches.length) return null

  const intro = splitParagraphs(text.slice(0, matches[0].index || 0))
  const outro: string[] = []
  const pairs: LabeledPair[] = []
  let currentEnglish = ''

  matches.forEach((match, index) => {
    const label = String(match[1] || '')
    const start = (match.index || 0) + match[0].length
    const end = matches[index + 1]?.index ?? text.length
    const value = text.slice(start, end).trim()
    const isEnglish = /^(英文|英语|English)$/i.test(label)

    if (isEnglish) {
      if (currentEnglish) pushLabeledPairs(pairs, currentEnglish)
      currentEnglish = value
      return
    }

    if (currentEnglish) {
      pushLabeledPairs(pairs, currentEnglish, value)
      currentEnglish = ''
    } else {
      outro.push(...splitParagraphs(value))
    }
  })

  if (currentEnglish) pushLabeledPairs(pairs, currentEnglish)
  if (!pairs.length) return null

  return { intro, pairs, outro }
}

export function ChatMessage({ message, onSpeak, onAddSentence }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [playingId, setPlayingId] = useState<string | null>(null)

  const handleSpeak = (text: string, id: string) => {
    setPlayingId(id)
    setTimeout(() => setPlayingId(null), 300)
    speakEnglish(text, { mode: 'sentence', rate: 0.9 })
    onSpeak?.(text)
  }

  // 解析消息内容
  const parseContent = (): ParsedContent => {
    if (message.pending) {
      return { type: 'simple', text: message.text }
    }

    const structured = parseLabeledSections(message.text)
    if (structured && message.mode !== 'daily-sentences') {
      return { type: 'structured', ...structured }
    }

    if (message.mode === 'daily-sentences') {
      const lines = message.text.split('\n').filter(Boolean)
      const pairs: { zh: string; en: string }[] = []
      const englishStart = lines.findIndex((line) => /^英文[:：]?$/i.test(line.trim()))
      const meaningStart = lines.findIndex((line) => /^中文意思[:：]?$/i.test(line.trim()))

      if (englishStart !== -1 && meaningStart !== -1 && meaningStart > englishStart) {
        const englishLines = lines
          .slice(englishStart + 1, meaningStart)
          .map((line) => line.trim().replace(/^\d+[.)、]\s*/, ''))
          .filter(Boolean)
        const meaningLines = lines
          .slice(meaningStart + 1)
          .map((line) => line.trim().replace(/^\d+[.)、]\s*/, ''))
          .filter(Boolean)

        englishLines.forEach((en, index) => {
          pairs.push({ zh: meaningLines[index] || '中文意思待补充', en })
        })
      }
      
      if (!pairs.length) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          const zhMatch = line.match(/^\d+[.)、]\s*(.+)/)
          if (zhMatch && /[\u4e00-\u9fa5]/.test(zhMatch[1])) {
            const nextLine = lines[i + 1]?.trim()
            if (nextLine) {
              pairs.push({ zh: zhMatch[1], en: nextLine.replace(/^\d+[.)、]\s*/, '') })
              i++
            }
          }
        }
      }
      
      return { type: 'daily-sentences', pairs }
    }

    if (message.mode === 'chat' || message.mode === 'topic' || message.mode === 'free-chat' || message.mode === 'select-dialogue') {
      const lines = message.text.split('\n')
      const content: { type: 'text' | 'english'; text: string; zh?: string }[] = []
      
      lines.forEach((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return
        
        const isEnglish = /^[A-Z].*[.?!]$/.test(trimmed) && !/[\u4e00-\u9fa5]/.test(trimmed)
        
        if (isEnglish) {
          let zh = ''
          if (i > 0) {
            const prevLine = lines[i - 1].trim()
            if (/[\u4e00-\u9fa5]/.test(prevLine) && prevLine.endsWith('？')) {
              zh = prevLine
            }
          }
          content.push({ type: 'english', text: trimmed, zh })
        } else {
          content.push({ type: 'text', text: trimmed })
        }
      })
      
      return { type: 'chat', content }
    }

    return { type: 'simple', text: message.text }
  }

  const parsed = parseContent()

  if (isUser) {
    return (
      <div className="flex justify-end mb-5 animate-slide-up">
        <div className="max-w-[85%]">
          {/* 用户消息气泡 - 带紫色光晕 */}
          <div className="relative rounded-3xl rounded-br-lg overflow-hidden bg-[oklch(0.70_0.15_280_/_0.15)] backdrop-blur-xl border border-[oklch(0.70_0.15_280_/_0.25)] px-5 py-4 shadow-[0_0_30px_oklch(0.70_0.15_280_/_0.1)]">
            <div className="inner-glow rounded-3xl" />
            <p className="relative text-[15px] text-white/95 leading-relaxed">{message.text}</p>
          </div>
          
          {message.translation && (
            <div className="mt-3 relative glass-card rounded-2xl px-5 py-4 overflow-hidden">
              <div className="inner-glow rounded-2xl" />
              <p className="relative text-xs text-white/45 mb-2 font-medium">{message.translation.note}</p>
              <div className="relative flex items-center gap-3">
                <p className="flex-1 text-[15px] font-semibold text-white/95 leading-relaxed">
                  <SpeakableText text={message.translation.sentence} rate={0.9} />
                </p>
                <button
                  onClick={() => handleSpeak(message.translation!.sentence, `user-${message.timestamp}`)}
                  className={cn(
                    "flex-shrink-0 w-9 h-9 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-white transition-premium",
                    playingId === `user-${message.timestamp}` && "scale-90 brightness-125"
                  )}
                >
                  <Play className={cn(
                    "w-4 h-4 ml-0.5 transition-transform duration-300",
                    playingId === `user-${message.timestamp}` && "scale-125"
                  )} />
                </button>
                <button
                  onClick={() => onAddSentence?.(message.translation!.sentence, message.translation!.note)}
                  className="flex-shrink-0 w-9 h-9 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-[oklch(0.80_0.15_280)] transition-premium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex mb-5 animate-slide-up">
      <div className="max-w-[90%]">
        <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold mb-2.5 ml-1 tracking-[0.15em] uppercase">智语导师</p>
        
        {parsed.type === 'daily-sentences' && (
          <div className="space-y-3">
            {parsed.pairs.map((pair, i) => (
              <div key={i} className="relative glass-card rounded-2xl px-5 py-4 overflow-hidden">
                <div className="inner-glow rounded-2xl" />
                <p className="relative text-sm text-white/50 mb-2">{pair.zh}</p>
                <div className="relative flex items-center gap-3">
                  <p className="flex-1 text-[15px] font-semibold text-white/95 leading-relaxed">
                    <SpeakableText text={pair.en} rate={0.9} />
                  </p>
                  <button
                    onClick={() => handleSpeak(pair.en, `daily-${i}`)}
                    className={cn(
                      "flex-shrink-0 w-9 h-9 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-white transition-premium",
                      playingId === `daily-${i}` && "scale-90 brightness-125"
                    )}
                  >
                    <Play className={cn(
                      "w-4 h-4 ml-0.5 transition-transform duration-300",
                      playingId === `daily-${i}` && "scale-125"
                    )} />
                  </button>
                  <button
                    onClick={() => onAddSentence?.(pair.en, pair.zh)}
                    className="flex-shrink-0 w-9 h-9 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-[oklch(0.80_0.15_280)] transition-premium"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {parsed.type === 'chat' && (
          <div className="relative glass-card rounded-3xl rounded-bl-lg px-5 py-4 space-y-4 overflow-hidden">
            <div className="inner-glow rounded-3xl" />
            {parsed.content.map((item, i) => (
              <div key={i} className="relative">
                {item.type === 'text' ? (
                  <p className="text-[15px] text-white/70 leading-relaxed">{item.text}</p>
                ) : (
                  <div className="bg-white/[0.04] rounded-xl px-4 py-3 mt-3 border border-white/[0.06]">
                    {item.zh && (
                      <p className="text-xs text-white/45 mb-2">{item.zh}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <p className="flex-1 text-sm font-semibold text-white/95 leading-relaxed">
                        <SpeakableText text={item.text} rate={0.9} />
                      </p>
                      <button
                        onClick={() => handleSpeak(item.text, `chat-${i}`)}
                        className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-lg glass-button text-white/60 flex items-center justify-center hover:text-white transition-premium",
                          playingId === `chat-${i}` && "scale-90 brightness-125"
                        )}
                      >
                        <Play className={cn(
                          "w-3.5 h-3.5 ml-0.5 transition-transform duration-300",
                          playingId === `chat-${i}` && "scale-125"
                        )} />
                      </button>
                      <button
                        onClick={() => onAddSentence?.(item.text, item.zh || '')}
                        className="flex-shrink-0 w-8 h-8 rounded-lg glass-button text-white/60 flex items-center justify-center hover:text-[oklch(0.80_0.15_280)] transition-premium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {parsed.type === 'structured' && (
          <div className="relative glass-card rounded-3xl rounded-bl-lg px-5 py-4 overflow-hidden">
            <div className="inner-glow rounded-3xl" />
            <div className="relative space-y-4">
              {parsed.intro.map((paragraph, i) => (
                <p key={`intro-${i}`} className="text-[15px] text-white/72 leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="space-y-3">
                {parsed.pairs.map((pair, i) => (
                  <div key={i} className="rounded-2xl border border-[oklch(0.70_0.15_280_/_0.14)] bg-[oklch(0.70_0.15_280_/_0.055)] px-4 py-3">
                    <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.16em] uppercase mb-2">
                      English
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <p className="flex-1 text-[15px] font-semibold text-white/95 leading-relaxed">
                        <SpeakableText text={pair.en} rate={0.9} />
                      </p>
                      <button
                        onClick={() => handleSpeak(pair.en, `structured-${i}`)}
                        className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-white transition-premium",
                          playingId === `structured-${i}` && "scale-90 brightness-125"
                        )}
                      >
                        <Play className={cn(
                          "w-3.5 h-3.5 ml-0.5 transition-transform duration-300",
                          playingId === `structured-${i}` && "scale-125"
                        )} />
                      </button>
                      <button
                        onClick={() => onAddSentence?.(pair.en, pair.zh)}
                        className="flex-shrink-0 w-8 h-8 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-[oklch(0.80_0.15_280)] transition-premium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {pair.zh && (
                      <>
                        <p className="text-[10px] text-white/35 font-semibold tracking-[0.16em] uppercase mb-1">
                          中文意思
                        </p>
                        <p className="text-sm text-white/58 leading-relaxed">{pair.zh}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {parsed.outro.map((paragraph, i) => (
                <p key={`outro-${i}`} className="text-[15px] text-white/72 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {parsed.type === 'simple' && (
          <div className="relative glass-card rounded-3xl rounded-bl-lg px-5 py-4 overflow-hidden">
            <div className="inner-glow rounded-3xl" />
            <p className="relative text-[15px] text-white/70 leading-relaxed whitespace-pre-wrap">{parsed.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// 翻译失败状态
export function TranslationFailedMessage({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex mb-5 animate-slide-up">
      <div className="max-w-[90%]">
        <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold mb-2.5 ml-1 tracking-[0.15em] uppercase">智语导师</p>
        <div className="relative rounded-3xl rounded-bl-lg overflow-hidden bg-[oklch(0.62_0.22_25_/_0.1)] backdrop-blur-xl border border-[oklch(0.62_0.22_25_/_0.2)] px-5 py-4">
          <p className="text-sm text-[oklch(0.70_0.22_25)] font-medium mb-2">翻译没有成功</p>
          <p className="text-xs text-white/45 mb-4 leading-relaxed">这次没有拿到英文表达，请重试或换一句更短的中文。</p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 text-sm font-semibold text-[oklch(0.80_0.15_280)] hover:text-[oklch(0.85_0.15_280)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>点击重试</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// 中文意思待补充状态
export function MissingChineseMeaning({ englishText, onAdd }: { englishText: string; onAdd?: () => void }) {
  return (
    <div className="relative glass-card-accent rounded-2xl px-5 py-4 overflow-hidden">
      <div className="inner-glow rounded-2xl" />
      <p className="relative text-xs text-[oklch(0.70_0.15_280_/_0.8)] font-medium mb-2">中文意思待补充</p>
      <div className="relative flex items-center gap-3">
        <p className="flex-1 text-[15px] font-semibold text-white/95 leading-relaxed">
          <SpeakableText text={englishText} />
        </p>
        <button
          onClick={onAdd}
          className="text-xs text-[oklch(0.80_0.15_280)] hover:text-[oklch(0.85_0.15_280)] font-semibold transition-colors"
        >
          添加中文
        </button>
      </div>
    </div>
  )
}
