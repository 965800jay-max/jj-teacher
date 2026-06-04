'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'
import { SpeakableText } from '@/components/speakable-text'
import type { TeacherMessage } from '@/lib/sample-data'

interface ChatMessageProps {
  message: TeacherMessage
  compactAfter?: boolean
  onSpeak?: (text: string) => void
  onAddSentence?: (text: string, note: string) => void
  onTranslateText?: (text: string) => Promise<string>
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

function hasChinese(text: string) {
  return /[\u4e00-\u9fff]/.test(text)
}

function isEnglishLike(text: string) {
  return /[A-Za-z]/.test(text) && !hasChinese(text)
}

function extractEnglishLines(text: string) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const englishLines = lines.filter((line) => isEnglishLike(line))
  return englishLines.length ? englishLines.join('\n') : text.trim()
}

function extractChineseLines(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => hasChinese(line))
    .join('\n')
}

export function ChatMessage({ message, compactAfter = false, onSpeak, onAddSentence, onTranslateText }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [expandedMeaningKey, setExpandedMeaningKey] = useState<string | null>(null)
  const [meaningCache, setMeaningCache] = useState<Record<string, string>>({})
  const [loadingMeaningKey, setLoadingMeaningKey] = useState<string | null>(null)
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null)
  const messageGapClass = compactAfter ? 'mb-1.5' : 'mb-3'

  const handleSpeak = (text: string, id: string) => {
    setPlayingId(id)
    setTimeout(() => setPlayingId(null), 300)
    speakEnglish(text, { mode: 'sentence', rate: 0.9 })
    onSpeak?.(text)
  }

  const handleToggleMeaning = async (key: string, text: string, knownMeaning = '') => {
    setOpenMenuKey(null)
    if (expandedMeaningKey === key) {
      setExpandedMeaningKey(null)
      return
    }

    setExpandedMeaningKey(key)
    if (knownMeaning || meaningCache[key] || !onTranslateText) return

    setLoadingMeaningKey(key)
    try {
      const translated = await onTranslateText(text)
      setMeaningCache((current) => ({
        ...current,
        [key]: translated || '中文意思待补充'
      }))
    } catch {
      setMeaningCache((current) => ({
        ...current,
        [key]: '中文意思待补充'
      }))
    } finally {
      setLoadingMeaningKey(null)
    }
  }

  const renderBubbleMenu = (text: string, note: string, key: string) => {
    const isMeaningOpen = expandedMeaningKey === key
    const meaning = note || meaningCache[key] || ''
    return (
      <div className="absolute bottom-2 right-2 z-20">
        <button
          type="button"
          onClick={() => setOpenMenuKey((current) => current === key ? null : key)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.055] bg-white/[0.025] text-[18px] leading-none text-white/35 transition-premium hover:border-[oklch(0.70_0.15_280_/_0.22)] hover:text-white/70",
            openMenuKey === key && "border-[oklch(0.70_0.15_280_/_0.34)] bg-[oklch(0.70_0.15_280_/_0.09)] text-white/80"
          )}
          aria-label="消息操作"
        >
          ⋯
        </button>

        {openMenuKey === key && (
          <div className="absolute right-0 top-8 z-30 w-[148px] rounded-2xl border border-white/[0.08] bg-black/90 p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl animate-scale-in">
            <button
              type="button"
              onClick={() => {
                handleSpeak(text, key)
                setOpenMenuKey(null)
              }}
              className="flex h-9 w-full items-center gap-2 rounded-xl px-2.5 text-left text-[12px] font-semibold text-white/72 transition-premium hover:bg-white/[0.06] hover:text-white"
            >
              <span className="text-[13px]">▶</span>
              播放句子
            </button>
            <button
              type="button"
              onClick={() => handleToggleMeaning(key, text, note)}
              className="flex h-9 w-full items-center gap-2 rounded-xl px-2.5 text-left text-[12px] font-semibold text-white/72 transition-premium hover:bg-white/[0.06] hover:text-white"
            >
              <span className="text-[13px]">🌐</span>
              {isMeaningOpen ? '隐藏中文' : loadingMeaningKey === key ? '生成中文' : '查看中文'}
            </button>
            <button
              type="button"
              onClick={() => {
                onAddSentence?.(text, note || meaning)
                setOpenMenuKey(null)
              }}
              className="flex h-9 w-full items-center gap-2 rounded-xl px-2.5 text-left text-[12px] font-semibold text-white/72 transition-premium hover:bg-white/[0.06] hover:text-white"
            >
              <span className="text-[13px]">⭐</span>
              加入句库
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderEnglishBubble = (text: string, note: string, key: string, extraClass = '') => {
    const isMeaningOpen = expandedMeaningKey === key
    const meaning = note || meaningCache[key] || ''
    return (
      <div className={cn("relative rounded-2xl rounded-bl-md border border-[oklch(0.70_0.15_280_/_0.16)] bg-white/[0.055] px-4 py-3 pr-10 backdrop-blur-xl shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.06)]", extraClass)}>
        <div>
          <p className="whitespace-pre-wrap text-[14px] font-semibold text-white/94 leading-relaxed">
            <SpeakableText text={text} rate={0.9} />
          </p>
        </div>
        {renderBubbleMenu(text, note, key)}
        {isMeaningOpen && (
          <p className="mt-2.5 border-t border-white/[0.06] pt-2 text-xs leading-relaxed text-[oklch(0.70_0.15_280_/_0.62)] whitespace-pre-wrap">
            {loadingMeaningKey === key ? '正在生成中文意思...' : meaning || '中文意思待补充'}
          </p>
        )}
      </div>
    )
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
      <div className={cn("flex justify-end animate-slide-up", messageGapClass)}>
        <div className="max-w-[86%] space-y-2">
          <div className="relative rounded-2xl rounded-br-md bg-[oklch(0.70_0.15_280_/_0.16)] backdrop-blur-xl border border-[oklch(0.70_0.15_280_/_0.24)] px-4 py-3 shadow-[0_0_22px_oklch(0.70_0.15_280_/_0.1)]">
            <p className="relative text-[14px] text-white/95 leading-relaxed">{message.text}</p>
          </div>
          
          {message.translation && (
            renderEnglishBubble(
              message.translation.sentence,
              message.translation.note,
              `user-translation-${message.id}`,
              'rounded-br-md border-white/[0.06] bg-white/[0.035]'
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex animate-slide-up", messageGapClass)}>
      <div className="max-w-[86%] space-y-2">
        
        {parsed.type === 'daily-sentences' && (
          <div className="space-y-2">
            {parsed.pairs.map((pair, i) => (
              <div key={i}>
                {renderEnglishBubble(pair.en, pair.zh, `daily-${message.id}-${i}`)}
              </div>
            ))}
          </div>
        )}

        {parsed.type === 'chat' && (
          <div className="space-y-2">
            {parsed.content.map((item, i) => (
              <div key={i} className="relative">
                {item.type === 'text' ? (
                  <div className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
                    <p className="text-[14px] text-white/74 leading-relaxed">{item.text}</p>
                  </div>
                ) : (
                  renderEnglishBubble(item.text, item.zh || '', `chat-${message.id}-${i}`)
                )}
              </div>
            ))}
          </div>
        )}

        {parsed.type === 'structured' && (
          <div className="space-y-2">
              {parsed.intro.map((paragraph, i) => (
                <div key={`intro-${i}`} className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
                  <p className="text-[14px] text-white/72 leading-relaxed">
                  {paragraph}
                  </p>
                </div>
              ))}

              <div className="space-y-2">
                {parsed.pairs.map((pair, i) => (
                  <div key={i}>
                    {renderEnglishBubble(pair.en, pair.zh, `structured-${message.id}-${i}`)}
                  </div>
                ))}
              </div>

              {parsed.outro.map((paragraph, i) => (
                <div key={`outro-${i}`} className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
                  <p className="text-[14px] text-white/72 leading-relaxed">
                    {paragraph}
                  </p>
                </div>
              ))}
          </div>
        )}

        {parsed.type === 'simple' && (
          isEnglishLike(extractEnglishLines(parsed.text))
            ? renderEnglishBubble(extractEnglishLines(parsed.text), extractChineseLines(parsed.text), `simple-${message.id}`)
            : (
              <div className="relative rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
                <p className="relative text-[14px] text-white/74 leading-relaxed whitespace-pre-wrap">{parsed.text}</p>
              </div>
            )
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
