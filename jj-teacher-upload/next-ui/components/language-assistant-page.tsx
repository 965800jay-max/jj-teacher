'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clipboard, Copy, Languages, Loader2, MessageCircle, Plus, RotateCcw, Scissors, Sparkles, Trash2, Volume2, WandSparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'
import { SpeakableText } from '@/components/speakable-text'

export type AssistantMode = 'translate' | 'localize' | 'hair' | 'reply' | 'explain' | 'pronunciation'

export interface LanguageAssistantAlternative {
  english: string
  chinese: string
}

export interface LanguageAssistantResult {
  id: string
  title?: string
  english?: string
  chinese?: string
  phonetic?: string
  scene?: string
  keyPoints?: string[]
  alternatives?: LanguageAssistantAlternative[]
}

interface LanguageAssistantPageProps {
  mode: AssistantMode
  inputValue: string
  results: LanguageAssistantResult[]
  onModeChange: (mode: AssistantMode) => void
  onInputChange: (value: string) => void
  onResultsChange: (results: LanguageAssistantResult[]) => void
  onReset: () => void
  onRunAssistant: (mode: AssistantMode, text: string) => Promise<LanguageAssistantResult[]>
  onAddSentence: (english: string, chinese: string) => void
}

const ASSISTANT_MODES: Array<{
  id: AssistantMode
  label: string
  icon: typeof Languages
  placeholder: string
  button: string
}> = [
  {
    id: 'translate',
    label: '翻译',
    icon: Languages,
    placeholder: '输入中文或英文，自动双向翻译...',
    button: '开始翻译'
  },
  {
    id: 'localize',
    label: '本地化',
    icon: Sparkles,
    placeholder: '输入一句生硬英文，我帮你改成本地人常说的表达...',
    button: '生成自然表达'
  },
  {
    id: 'hair',
    label: '发型师',
    icon: Scissors,
    placeholder: '输入中文，我帮你生成适合理发沟通的自然英文...',
    button: '生成理发英文'
  },
  {
    id: 'reply',
    label: 'AI回复',
    icon: MessageCircle,
    placeholder: '粘贴客人消息，我帮你生成自然英文回复...',
    button: '生成回复'
  },
  {
    id: 'explain',
    label: '解释',
    icon: WandSparkles,
    placeholder: '输入英文句子，我帮你解释意思和用法...',
    button: '解释句子'
  },
  {
    id: 'pronunciation',
    label: '发音',
    icon: Volume2,
    placeholder: '输入单词或句子，我帮你朗读和显示音标...',
    button: '分析发音'
  }
]

function cleanText(value?: string) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

export function AssistantResultCard({
  result,
  index = 0,
  onCopy,
  onAddSentence
}: {
  result: LanguageAssistantResult
  index?: number
  onCopy?: (text: string) => void
  onAddSentence?: (english: string, chinese: string) => void
}) {
  const english = cleanText(result.english)
  const chinese = cleanText(result.chinese)
  const phonetic = cleanText(result.phonetic)
  const copyText = english || chinese || result.alternatives?.map((item) => item.english).join('\n') || ''

  const renderActionButtons = () => (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {english && (
        <button
          type="button"
          onClick={() => speakEnglish(english, { mode: english.split(/\s+/).length > 1 ? 'sentence' : 'word' })}
          className="flex h-9 items-center gap-1.5 rounded-2xl glass-button px-3 text-xs font-semibold text-white/60 transition-premium hover:text-white"
        >
          <Volume2 className="w-3.5 h-3.5" />
          朗读
        </button>
      )}
      {onCopy && copyText && (
        <button
          type="button"
          onClick={() => onCopy(copyText)}
          className="flex h-9 items-center gap-1.5 rounded-2xl glass-button px-3 text-xs font-semibold text-white/60 transition-premium hover:text-white"
        >
          <Copy className="w-3.5 h-3.5" />
          复制
        </button>
      )}
      {english && chinese && onAddSentence && (
        <button
          type="button"
          onClick={() => onAddSentence(english, chinese)}
          className="flex h-9 items-center gap-1.5 rounded-2xl border border-[oklch(0.70_0.15_280_/_0.28)] bg-[oklch(0.70_0.15_280_/_0.10)] px-3 text-xs font-semibold text-[oklch(0.84_0.13_280)] transition-premium hover:bg-[oklch(0.70_0.15_280_/_0.16)]"
        >
          <Plus className="w-3.5 h-3.5" />
          加入句库
        </button>
      )}
    </div>
  )

  return (
    <div
      className="relative overflow-hidden glass-card rounded-[1.55rem] p-4 animate-slide-up"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="top-highlight" />
      {result.title && (
        <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-[oklch(0.70_0.15_280)] uppercase">
          {result.title}
        </p>
      )}
      {english && (
        <p className="text-[17px] font-semibold leading-relaxed text-white/94">
          <SpeakableText text={english} />
        </p>
      )}
      {phonetic && <p className="mt-2 text-sm text-[oklch(0.70_0.15_280_/_0.70)]">/{phonetic.replace(/^\/|\/$/g, '')}/</p>}
      {chinese && <p className="mt-3 text-sm leading-relaxed text-white/56">{chinese}</p>}

      {result.scene && (
          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3">
          <p className="mb-1 text-[11px] font-semibold tracking-[0.12em] text-[oklch(0.70_0.15_280_/_0.75)] uppercase">使用场景</p>
          <p className="text-sm leading-relaxed text-white/62">{result.scene}</p>
        </div>
      )}

      {Boolean(result.keyPoints?.length) && (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[oklch(0.70_0.15_280_/_0.75)] uppercase">重点词/短语</p>
          <div className="flex flex-wrap gap-2">
            {result.keyPoints?.map((point, pointIndex) => (
              <span key={`${point}-${pointIndex}`} className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-xs text-white/58">
                {point}
              </span>
            ))}
          </div>
        </div>
      )}

      {Boolean(result.alternatives?.length) && (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[oklch(0.70_0.15_280_/_0.75)] uppercase">替代表达</p>
          {result.alternatives?.map((item, altIndex) => (
            <div key={`${item.english}-${altIndex}`} className="rounded-2xl border border-white/[0.06] bg-black/15 px-3.5 py-3">
              <p className="text-sm font-semibold leading-relaxed text-white/86">
                <SpeakableText text={item.english} />
              </p>
              {item.chinese && <p className="mt-1.5 text-xs leading-relaxed text-white/46">{item.chinese}</p>}
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakEnglish(item.english, { mode: 'sentence' })}
                  className="h-7 rounded-xl glass-button px-2 text-[11px] text-white/55 transition-premium hover:text-white"
                >
                  朗读
                </button>
                {onAddSentence && (
                  <button
                    type="button"
                    onClick={() => onAddSentence(item.english, item.chinese)}
                    className="h-7 rounded-xl border border-[oklch(0.70_0.15_280_/_0.24)] bg-[oklch(0.70_0.15_280_/_0.09)] px-2 text-[11px] font-semibold text-[oklch(0.84_0.13_280)]"
                  >
                    加句读
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {renderActionButtons()}
    </div>
  )
}

export function LanguageAssistantPage({
  mode,
  inputValue,
  results,
  onModeChange,
  onInputChange,
  onResultsChange,
  onReset,
  onRunAssistant,
  onAddSentence
}: LanguageAssistantPageProps) {
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const activeMode = useMemo(
    () => ASSISTANT_MODES.find((item) => item.id === mode) || ASSISTANT_MODES[0],
    [mode]
  )

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (message: string) => setToast(message)

  const handleRun = async () => {
    const text = inputValue.trim()
    if (!text) {
      setError('请输入内容')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const nextResults = await onRunAssistant(mode, text)
      if (!nextResults.length) throw new Error('empty')
      onResultsChange(nextResults)
    } catch {
      setError('生成失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard?.readText?.()
      if (!text) return
      onInputChange(text)
      setError('')
    } catch {
      setError('粘贴失败，请手动输入')
    }
  }

  const handleCopy = async (text: string) => {
    const clean = cleanText(text)
    if (!clean) return
    try {
      await navigator.clipboard?.writeText?.(clean)
      showToast('已复制')
    } catch {
      setError('复制失败')
    }
  }

  const handleAddSentence = (english?: string, chinese?: string) => {
    const cleanEnglish = cleanText(english)
    const cleanChinese = cleanText(chinese)
    if (!cleanEnglish || !cleanChinese) return
    onAddSentence(cleanEnglish, cleanChinese)
    showToast('已加入句库')
  }

  return (
    <section id="languageAssistantPage" className="flex flex-1 min-h-0 flex-col overflow-hidden px-4 py-3 animate-fade-in">
      <div className="-mx-4 overflow-x-auto px-4 pb-3 scrollbar-hide">
        <div className="flex min-w-max gap-2">
          {ASSISTANT_MODES.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onModeChange(item.id)
                  setError('')
                }}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tracking-wide whitespace-nowrap transition-premium border",
                  mode === item.id
                    ? "border-[oklch(0.70_0.15_280_/_0.45)] bg-[oklch(0.70_0.15_280_/_0.16)] text-white shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.18)]"
                    : "border-white/[0.08] bg-white/[0.035] text-white/55 hover:text-white/85"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative glass-card rounded-[1.5rem] p-3">
        <textarea
          id="languageAssistantInput"
          value={inputValue}
          onChange={(event) => {
            onInputChange(event.target.value)
            if (error) setError('')
          }}
          placeholder={activeMode.placeholder}
          rows={4}
          className="min-h-[108px] w-full resize-none border-0 bg-transparent px-1 pb-9 pt-1 text-[15px] leading-relaxed text-white/92 outline-none placeholder:text-[oklch(0.70_0.15_280_/_0.48)]"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onInputChange('')
              onResultsChange([])
              setError('')
            }}
            className="flex h-8 items-center gap-1 rounded-xl glass-button px-2.5 text-[11px] font-semibold text-white/45 transition-premium hover:text-white"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空
          </button>
          <button
            type="button"
            onClick={handlePaste}
            className="flex h-8 items-center gap-1 rounded-xl glass-button px-2.5 text-[11px] font-semibold text-white/45 transition-premium hover:text-white"
          >
            <Clipboard className="w-3.5 h-3.5" />
            粘贴
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleRun}
          disabled={isLoading}
          className={cn(
            "flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-premium",
            isLoading ? "glass-button text-white/42" : "glass-button-primary"
          )}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <WandSparkles className="w-4 h-4" />}
          <span className="truncate">{isLoading ? '正在生成...' : activeMode.button}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            onReset()
            setError('')
            showToast('已重置')
          }}
          disabled={isLoading}
          className="flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-2xl glass-button px-3 text-xs font-semibold text-white/55 transition-premium hover:text-white disabled:opacity-45"
          aria-label="一键重置"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-2xl border border-[oklch(0.62_0.22_25_/_0.25)] bg-[oklch(0.62_0.22_25_/_0.08)] px-4 py-3 text-sm text-[oklch(0.72_0.20_25)]">
          {error}
        </p>
      )}

      <div id="languageAssistantResults" className="min-h-0 flex-1 overflow-y-auto pt-3 pb-[calc(88px+env(safe-area-inset-bottom))] scrollbar-hide">
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result, index) => (
              <AssistantResultCard
                key={result.id || `${mode}-${index}`}
                result={result}
                index={index}
                onCopy={handleCopy}
                onAddSentence={handleAddSentence}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-[oklch(0.70_0.15_280_/_0.15)] blur-2xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl glass-card">
                <Languages className="w-7 h-7 text-[oklch(0.80_0.15_280)]" />
              </div>
            </div>
            <p className="text-base font-semibold text-white/88">快速处理一句英文</p>
            <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-white/42">
              翻译、润色、发型师沟通、AI 回复、解释和发音都放在这里。
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed left-1/2 bottom-[calc(5.4rem+env(safe-area-inset-bottom))] z-[140] -translate-x-1/2 rounded-full border border-[oklch(0.70_0.15_280_/_0.24)] bg-black/75 px-4 py-2 text-xs font-semibold text-white/86 shadow-[0_0_24px_oklch(0.70_0.15_280_/_0.18)] backdrop-blur-xl">
          {toast}
        </div>
      )}
    </section>
  )
}
