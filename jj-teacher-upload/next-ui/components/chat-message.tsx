'use client'

import { useRef, useState, type PointerEvent } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'
import { SpeakableText } from '@/components/speakable-text'
import type { TeacherMessage } from '@/lib/sample-data'

interface ChatMessageProps {
  message: TeacherMessage
  compactAfter?: boolean
  allowUserAddSentence?: boolean
  messageMeaning?: string
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

function extractSpeakableEnglish(text: string) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  const chunks = clean
    .replace(/[\u4e00-\u9fff]+/g, '\n')
    .split(/\n+/)
    .map((line) => line.replace(/^\s*(英文|English|中文意思|中文|Meaning)\s*[:：]\s*/i, '').trim())
    .filter((line) => /[A-Za-z]/.test(line))
  const result = chunks.join(' ').replace(/\s+/g, ' ').trim()
  if (result) return result
  return /[A-Za-z]/.test(clean) && !hasChinese(clean) ? clean : ''
}

function translationFallback(text: string) {
  return hasChinese(text) ? '英文表达待补充' : '中文意思待补充'
}

function translationLoadingText(text: string) {
  return hasChinese(text) ? '正在生成英文表达...' : '正在生成中文意思...'
}

function translationButtonLabel(text: string, isOpen: boolean, isLoading: boolean) {
  if (isOpen) return hasChinese(text) ? '隐藏英文' : '隐藏中文'
  if (isLoading) return hasChinese(text) ? '生成英文' : '生成中文'
  return hasChinese(text) ? '查看英文' : '查看中文'
}

function isExplanationStyleText(text: string) {
  const clean = String(text || '').trim()
  if (!hasChinese(clean) || !/[A-Za-z]/.test(clean)) return false
  if (/(英文|英语|English|中文意思|Chinese meaning|Meaning)\s*[:：]/i.test(clean)) return false

  return /(为什么|为何|不是|意思|表示|这里|这个词|这句话|这个句子|用法|语法|区别|解释|所以|名词|动词|进行时|自然|地道)/u.test(clean)
}

export function ChatMessage({
  message,
  compactAfter = false,
  allowUserAddSentence = false,
  messageMeaning = '',
  onSpeak,
  onAddSentence,
  onTranslateText
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [expandedMeaningKey, setExpandedMeaningKey] = useState<string | null>(null)
  const [meaningCache, setMeaningCache] = useState<Record<string, string>>({})
  const [loadingMeaningKey, setLoadingMeaningKey] = useState<string | null>(null)
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null)
  const [dragState, setDragState] = useState<{ key: string; x: number } | null>(null)
  const dragStartXRef = useRef(0)
  const dragKeyRef = useRef<string | null>(null)
  const dragMovedRef = useRef(false)
  const messageGapClass = compactAfter ? 'mb-1.5' : 'mb-3'
  const messageLayerClass = openMenuKey || dragState ? 'relative z-[120]' : 'relative z-0'
  const dragThreshold = 42
  const maxDrag = 58

  const handleSpeak = (text: string, id: string) => {
    const speakText = extractSpeakableEnglish(text)
    if (!speakText) return
    setPlayingId(id)
    setTimeout(() => setPlayingId(null), 300)
    speakEnglish(speakText, { mode: 'sentence', rate: 0.9 })
    onSpeak?.(speakText)
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
        [key]: translated || translationFallback(text)
      }))
    } catch {
      setMeaningCache((current) => ({
        ...current,
        [key]: translationFallback(text)
      }))
    } finally {
      setLoadingMeaningKey(null)
    }
  }

  const clampDrag = (value: number) => Math.max(-maxDrag, Math.min(maxDrag, value))

  const resetMenuDrag = () => {
    dragKeyRef.current = null
    dragMovedRef.current = false
    setDragState(null)
  }

  const handleMenuPointerDown = (event: PointerEvent<HTMLButtonElement>, key: string) => {
    event.preventDefault()
    event.stopPropagation()
    dragStartXRef.current = event.clientX
    dragKeyRef.current = key
    dragMovedRef.current = false
    setDragState({ key, x: 0 })
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleMenuPointerMove = (event: PointerEvent<HTMLButtonElement>, key: string) => {
    if (dragKeyRef.current !== key) return
    event.stopPropagation()
    const nextX = clampDrag(event.clientX - dragStartXRef.current)
    if (Math.abs(nextX) > 5) {
      dragMovedRef.current = true
      setOpenMenuKey(null)
    }
    setDragState({ key, x: nextX })
  }

  const handleMenuPointerUp = (event: PointerEvent<HTMLButtonElement>, text: string, note: string, key: string) => {
    if (dragKeyRef.current !== key) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    const finalX = clampDrag(event.clientX - dragStartXRef.current)
    const didMove = dragMovedRef.current
    resetMenuDrag()

    if (finalX <= -dragThreshold) {
      handleSpeak(text, key)
      setOpenMenuKey(null)
      return
    }

    if (finalX >= dragThreshold) {
      handleToggleMeaning(key, text, note)
      return
    }

    if (!didMove) {
      setOpenMenuKey((current) => current === key ? null : key)
    }
  }

  const handleMenuPointerCancel = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    resetMenuDrag()
  }

  const renderBubbleMenu = (text: string, note: string, key: string, options: { showAddSentence?: boolean } = {}) => {
    const isMeaningOpen = expandedMeaningKey === key
    const meaning = note || meaningCache[key] || ''
    const showAddSentence = options.showAddSentence !== false
    const dragX = dragState?.key === key ? dragState.x : 0
    const isDraggingThis = dragState?.key === key
    const dragIntent = dragX <= -dragThreshold ? 'speak' : dragX >= dragThreshold ? 'meaning' : ''
    return (
      <div className="absolute bottom-2 right-2 z-[140] select-none">
        {isDraggingThis && dragX < -6 && (
          <div
            className={cn(
              "pointer-events-none absolute right-8 top-0 flex h-7 items-center rounded-lg border px-2 text-[10px] font-semibold transition-premium",
              dragIntent === 'speak'
                ? "border-[oklch(0.70_0.15_280_/_0.34)] bg-[oklch(0.70_0.15_280_/_0.18)] text-white"
                : "border-white/[0.06] bg-black/45 text-white/38"
            )}
            style={{ opacity: Math.min(1, Math.abs(dragX) / dragThreshold) }}
          >
            朗读
          </div>
        )}
        {isDraggingThis && dragX > 6 && (
          <div
            className={cn(
              "pointer-events-none absolute left-8 top-0 flex h-7 items-center rounded-lg border px-2 text-[10px] font-semibold transition-premium",
              dragIntent === 'meaning'
                ? "border-[oklch(0.70_0.15_280_/_0.34)] bg-[oklch(0.70_0.15_280_/_0.18)] text-white"
                : "border-white/[0.06] bg-black/45 text-white/38"
            )}
            style={{ opacity: Math.min(1, Math.abs(dragX) / dragThreshold) }}
          >
            中文
          </div>
        )}
        <button
          type="button"
          onPointerDown={(event) => handleMenuPointerDown(event, key)}
          onPointerMove={(event) => handleMenuPointerMove(event, key)}
          onPointerUp={(event) => handleMenuPointerUp(event, text, note, key)}
          onPointerCancel={handleMenuPointerCancel}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setOpenMenuKey((current) => current === key ? null : key)
            }
          }}
          style={{
            transform: `translateX(${dragX}px)`,
            touchAction: 'none'
          }}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.055] bg-white/[0.025] text-[18px] leading-none text-white/35 shadow-[0_0_0_rgba(0,0,0,0)] transition-[transform,background,border-color,color,box-shadow] duration-150 hover:border-[oklch(0.70_0.15_280_/_0.22)] hover:text-white/70",
            openMenuKey === key && "border-[oklch(0.70_0.15_280_/_0.34)] bg-[oklch(0.70_0.15_280_/_0.09)] text-white/80",
            dragIntent && "border-[oklch(0.70_0.15_280_/_0.48)] bg-[oklch(0.70_0.15_280_/_0.16)] text-white shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.18)]"
          )}
          aria-label="消息操作"
        >
          ⋯
        </button>

        {openMenuKey === key && (
          <div className="absolute right-0 top-8 z-[999] w-[148px] rounded-2xl border border-white/[0.08] bg-black/90 p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl animate-scale-in">
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
              {translationButtonLabel(text, isMeaningOpen, loadingMeaningKey === key)}
            </button>
            {showAddSentence && (
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
            )}
          </div>
        )}
      </div>
    )
  }

  const renderEnglishBubble = (text: string, note: string, key: string, extraClass = '') => {
    const isMeaningOpen = expandedMeaningKey === key
    const meaning = note || meaningCache[key] || ''
    return (
      <div className={cn(
        "relative overflow-visible rounded-2xl rounded-bl-md border border-[oklch(0.70_0.15_280_/_0.16)] bg-white/[0.055] px-4 py-3 pr-10 backdrop-blur-xl shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.06)]",
        openMenuKey === key ? "z-[130]" : "z-0",
        extraClass
      )}>
        <div>
          <p className="whitespace-pre-wrap text-[14px] font-semibold text-white/94 leading-relaxed">
            <SpeakableText text={text} rate={0.9} />
          </p>
        </div>
        {renderBubbleMenu(text, note, key)}
        {isMeaningOpen && (
          <p className="mt-2.5 border-t border-white/[0.06] pt-2 text-xs leading-relaxed text-[oklch(0.70_0.15_280_/_0.62)] whitespace-pre-wrap">
            {loadingMeaningKey === key ? translationLoadingText(text) : meaning || translationFallback(text)}
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
      if (isExplanationStyleText(message.text)) {
        return { type: 'simple', text: message.text }
      }

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
    const userTranslationKey = `user-message-${message.id}`
    const isUserTranslationOpen = expandedMeaningKey === userTranslationKey
    const userTranslation = messageMeaning || meaningCache[userTranslationKey] || ''

    return (
      <div className={cn("flex justify-end animate-slide-up", messageGapClass, messageLayerClass)}>
        <div className="max-w-[86%] space-y-2">
          <div className="relative rounded-2xl rounded-br-md bg-[oklch(0.70_0.15_280_/_0.16)] backdrop-blur-xl border border-[oklch(0.70_0.15_280_/_0.24)] px-4 py-3 pr-10 shadow-[0_0_22px_oklch(0.70_0.15_280_/_0.1)]">
            <p className="relative text-[14px] text-white/95 leading-relaxed">
              {isEnglishLike(message.text) ? <SpeakableText text={message.text} rate={0.9} /> : message.text}
            </p>
            {renderBubbleMenu(message.text, messageMeaning, userTranslationKey, { showAddSentence: allowUserAddSentence })}
            {isUserTranslationOpen && (
              <p className="mt-2.5 border-t border-white/[0.08] pt-2 text-xs leading-relaxed text-[oklch(0.83_0.13_280_/_0.76)] whitespace-pre-wrap">
                {loadingMeaningKey === userTranslationKey ? translationLoadingText(message.text) : userTranslation || translationFallback(message.text)}
              </p>
            )}
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
    <div className={cn("flex animate-slide-up", messageGapClass, messageLayerClass)}>
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
                  renderEnglishBubble(item.text, item.zh || (parsed.content.length === 1 ? messageMeaning : ''), `chat-${message.id}-${i}`)
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
          isEnglishLike(parsed.text.trim())
            ? renderEnglishBubble(parsed.text.trim(), messageMeaning, `simple-${message.id}`)
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
