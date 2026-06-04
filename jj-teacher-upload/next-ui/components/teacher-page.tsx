'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Send, MessageCircle, Sparkles, Coffee, Brain, X, Trash2, Power, MousePointerClick, RefreshCw, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/chat-message'
import type { TeacherMessage, TutorMemoryProfile } from '@/lib/sample-data'

export type TeacherQuickMode = 'topic' | 'daily' | 'free' | 'select'

interface TeacherPageProps {
  messages: TeacherMessage[]
  activeMode?: TeacherQuickMode | null
  isSending?: boolean
  memoryProfile?: TutorMemoryProfile
  replyOptions?: string[]
  replyOptionMeanings?: string[]
  isReplyOptionsLoading?: boolean
  replyOptionsError?: string
  onSendMessage?: (text: string, mode?: TeacherQuickMode | null) => void
  onQuickAction?: (action: TeacherQuickMode) => void
  onSelectReplyOption?: (option: string) => void
  onRetryReplyOptions?: () => void
  onAddSentence?: (text: string, note: string) => void
  onToggleMemory?: (enabled: boolean) => void
  onClearMemory?: () => void
}

const memorySectionLabels: Array<[keyof TutorMemoryProfile, string]> = [
  ['preferences', '偏好'],
  ['interests', '爱好'],
  ['habits', '习惯'],
  ['learningProfile', '学习'],
  ['communicationStyle', '风格'],
  ['correctionPatterns', '常错'],
  ['personalFacts', '信息'],
  ['avoid', '避开']
]

export function TeacherPage({
  messages,
  activeMode = null,
  isSending = false,
  memoryProfile,
  replyOptions = [],
  replyOptionMeanings = [],
  isReplyOptionsLoading = false,
  replyOptionsError = '',
  onSendMessage,
  onQuickAction,
  onSelectReplyOption,
  onRetryReplyOptions,
  onAddSentence,
  onToggleMemory,
  onClearMemory
}: TeacherPageProps) {
  const [inputValue, setInputValue] = useState('')
  const [showMemory, setShowMemory] = useState(false)
  const [optionPreview, setOptionPreview] = useState<{ text: string; note: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressFiredRef = useRef(false)
  const memory = memoryProfile || {
    enabled: true,
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
  const memorySections = memorySectionLabels
    .map(([key, label]) => ({
      key,
      label,
      items: Array.isArray(memory[key]) ? memory[key] as string[] : []
    }))
    .filter((section) => section.items.length > 0)
  const hasMemory = Boolean(memory.summary || memorySections.length)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending) return
    onSendMessage?.(inputValue.trim(), activeMode)
    setInputValue('')
  }

  const handleQuickAction = (action: TeacherQuickMode) => {
    if (isSending) return
    onQuickAction?.(action)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    const target = e.target
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 120) + 'px'
  }

  const clearOptionLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const startOptionLongPress = (option: string, note: string) => {
    clearOptionLongPress()
    longPressFiredRef.current = false
    longPressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true
      setOptionPreview({ text: option, note: note || '中文意思待补充' })
    }, 520)
  }

  const handleOptionClick = (option: string) => {
    if (longPressFiredRef.current) {
      setTimeout(() => {
        longPressFiredRef.current = false
      }, 0)
      return
    }
    onSelectReplyOption?.(option)
  }

  const visibleReplyOptions = replyOptions.slice(0, 3)

  return (
    <section id="teacherPage" className="flex flex-1 min-h-0 flex-col animate-fade-in">
      {/* 聊天消息区 */}
      <div 
        id="chatMessages" 
        className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            {/* 图标 - 带光晕 */}
            <div className="relative mb-8">
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-[oklch(0.70_0.15_280_/_0.15)] blur-xl animate-glow" />
              <div className="relative w-24 h-24 rounded-3xl glass-card flex items-center justify-center">
                <div className="inner-glow rounded-3xl" />
                <Sparkles className="w-10 h-10 text-[oklch(0.80_0.15_280)]" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white/95 mb-3 tracking-wide">开始和智语导师聊天</h2>
            <p className="text-sm text-white/45 leading-relaxed max-w-[280px]">
              用中文告诉我你想表达什么，我会教你自然的英文说法。
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg}
                onAddSentence={onAddSentence}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 快捷操作 */}
      <div className="flex-shrink-0 px-5 pb-3">
        <div className="flex gap-3 overflow-x-auto py-2 -mx-5 px-5 scrollbar-hide">
          <button
            id="topicButton"
            onClick={() => handleQuickAction('topic')}
            disabled={isSending}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide whitespace-nowrap transition-premium",
              activeMode === 'topic'
                ? "glass-button-primary"
                : "glass-button text-white/55 hover:text-white/85"
            )}
          >
            <MessageCircle className="w-[18px] h-[18px]" />
            话题
          </button>
          <button
            onClick={() => handleQuickAction('daily')}
            disabled={isSending}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide whitespace-nowrap transition-premium",
              activeMode === 'daily'
                ? "glass-button-primary"
                : "glass-button text-white/55 hover:text-white/85"
            )}
          >
            <Sparkles className="w-[18px] h-[18px]" />
            英语日常句子
          </button>
          <button
            id="freeChatButton"
            onClick={() => handleQuickAction('free')}
            disabled={isSending}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide whitespace-nowrap transition-premium",
              activeMode === 'free'
                ? "glass-button-primary"
                : "glass-button text-white/55 hover:text-white/85"
            )}
          >
            <Coffee className="w-[18px] h-[18px]" />
            闲聊模式
          </button>
          <button
            id="selectDialogueButton"
            onClick={() => handleQuickAction('select')}
            disabled={isSending}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide whitespace-nowrap transition-premium",
              activeMode === 'select'
                ? "glass-button-primary"
                : "glass-button text-white/55 hover:text-white/85"
            )}
          >
            <MousePointerClick className="w-[18px] h-[18px]" />
            点选对话
          </button>
          <button
            id="memoryButton"
            type="button"
            onClick={() => setShowMemory(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide whitespace-nowrap transition-premium glass-button text-white/55 hover:text-white/85"
          >
            <Brain className="w-[18px] h-[18px]" />
            记忆
          </button>
        </div>
      </div>

      {(activeMode === 'select' || visibleReplyOptions.length > 0 || replyOptionsError) && (
        <div className="flex-shrink-0 px-5 pb-3">
          <div className="relative glass-card rounded-3xl px-4 py-3 overflow-hidden">
            <div className="inner-glow rounded-3xl" />
            <div className="relative mb-2 flex items-center justify-between gap-3">
              <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.16em] uppercase">
                Pick a Reply
              </p>
              {isReplyOptionsLoading && (
                <span className="text-[11px] text-white/35">正在生成...</span>
              )}
            </div>

            {visibleReplyOptions.length > 0 ? (
              <div className="relative flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {visibleReplyOptions.map((option, index) => {
                  const note = replyOptionMeanings[index] || ''
                  return (
                    <button
                      key={`${option}-${index}`}
                      type="button"
                      disabled={isSending || isReplyOptionsLoading}
                      onPointerDown={() => startOptionLongPress(option, note)}
                      onPointerUp={clearOptionLongPress}
                      onPointerCancel={clearOptionLongPress}
                      onPointerLeave={clearOptionLongPress}
                      onContextMenu={(event) => {
                        event.preventDefault()
                        clearOptionLongPress()
                        setOptionPreview({ text: option, note: note || '中文意思待补充' })
                      }}
                      onClick={() => handleOptionClick(option)}
                      className={cn(
                        "min-w-[78%] rounded-2xl border border-[oklch(0.70_0.15_280_/_0.26)] bg-[oklch(0.70_0.15_280_/_0.075)] px-4 py-3 text-left text-sm font-semibold leading-relaxed text-white/86 shadow-[0_0_24px_oklch(0.70_0.15_280_/_0.08)] transition-premium",
                        "hover:bg-[oklch(0.70_0.15_280_/_0.14)] active:scale-[0.98]",
                        (isSending || isReplyOptionsLoading) && "opacity-50"
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="relative text-sm text-white/42 leading-relaxed">
                {isReplyOptionsLoading ? 'AI 正在准备可以直接点击的英文回复...' : '点击“点选对话”开始。'}
              </p>
            )}

            {replyOptionsError && (
              <div className="relative mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[oklch(0.62_0.22_25_/_0.22)] bg-[oklch(0.62_0.22_25_/_0.08)] px-3 py-2">
                <p className="text-xs text-[oklch(0.72_0.20_25)]">{replyOptionsError}</p>
                <button
                  type="button"
                  onClick={onRetryReplyOptions}
                  disabled={isSending || isReplyOptionsLoading}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-white/75 transition-premium hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  重新生成
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 输入框 - 高级玻璃效果 */}
      <form onSubmit={handleSubmit} className="flex-shrink-0 px-5 pb-[calc(96px+env(safe-area-inset-bottom))]">
        <div className="relative glass-card flex items-end gap-3 rounded-3xl px-5 py-3 overflow-hidden">
          <div className="inner-glow rounded-3xl" />
          <textarea
            ref={inputRef}
            id="teacherInput"
            className="relative flex-1 bg-transparent border-0 outline-none resize-none text-[15px] text-white/95 placeholder:text-white/30 min-h-[28px] max-h-[120px] py-1.5 leading-relaxed"
            placeholder="用中文告诉我你想表达什么..."
            value={inputValue}
            onChange={handleInputChange}
            disabled={isSending}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className={cn(
              "relative flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-premium",
              inputValue.trim() && !isSending
                ? "glass-button-primary"
                : "glass-button text-white/30"
            )}
          >
            <Send className="w-[18px] h-[18px]" />
          </button>
        </div>
      </form>

      {optionPreview && typeof document !== 'undefined' ? createPortal((
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/70 backdrop-blur-md px-4 pb-4 pt-20 animate-fade-in">
          <button
            className="absolute inset-0 cursor-default"
            aria-label="关闭回复意思"
            onClick={() => setOptionPreview(null)}
          />
          <div className="relative w-full max-w-[520px] glass-sheet rounded-[2rem] p-5 animate-scale-in">
            <div className="top-highlight" />
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.18em] uppercase mb-1">
                  Reply
                </p>
                <h2 className="text-lg font-semibold text-white/95 leading-relaxed">{optionPreview.text}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOptionPreview(null)}
                className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/55 hover:text-white transition-premium"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-4 mb-4">
              <p className="text-[11px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.14em] uppercase mb-2">
                中文意思
              </p>
              <p className="text-sm text-white/72 leading-relaxed">{optionPreview.note}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddSentence?.(optionPreview.text, optionPreview.note)
                setOptionPreview(null)
              }}
              className="w-full h-12 rounded-2xl glass-button-primary flex items-center justify-center gap-2 text-sm font-semibold transition-premium"
            >
              <Plus className="w-4 h-4" />
              加入句读
            </button>
          </div>
        </div>
      ), document.body) : null}

      {showMemory && typeof document !== 'undefined' ? createPortal((
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 backdrop-blur-md px-4 pb-4 pt-20 animate-fade-in">
          <button
            className="absolute inset-0 cursor-default"
            aria-label="关闭记忆"
            onClick={() => setShowMemory(false)}
          />
          <div className="relative w-full max-w-[520px] max-h-[82dvh] overflow-y-auto glass-sheet rounded-[2rem] p-6 animate-scale-in">
            <div className="top-highlight" />
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.18em] uppercase mb-1">
                  Memory
                </p>
                <h2 className="text-xl font-semibold text-white/95">长期记忆</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowMemory(false)}
                className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/55 hover:text-white transition-premium"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <button
                type="button"
                onClick={() => onToggleMemory?.(!memory.enabled)}
                className={cn(
                  "flex items-center gap-2 h-11 px-4 rounded-2xl text-sm font-semibold transition-premium",
                  memory.enabled ? "glass-button-primary" : "glass-button text-white/55"
                )}
              >
                <Power className="w-4 h-4" />
                {memory.enabled ? '已开启' : '已关闭'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('清空全部长期记忆？')) onClearMemory?.()
                }}
                className="flex items-center gap-2 h-11 px-4 rounded-2xl text-sm font-semibold transition-premium glass-button text-white/55 hover:text-[oklch(0.70_0.22_25)]"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </button>
            </div>

            {hasMemory ? (
              <div className="space-y-4">
                {memory.summary && (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-4">
                    <p className="text-sm text-white/72 leading-relaxed whitespace-pre-wrap">{memory.summary}</p>
                  </div>
                )}
                {memorySections.map((section) => (
                  <div key={section.key as string} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-4">
                    <p className="text-[11px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.12em] uppercase mb-3">
                      {section.label}
                    </p>
                    <div className="space-y-2">
                      {section.items.map((item, index) => (
                        <p key={`${section.key as string}-${index}`} className="text-sm text-white/70 leading-relaxed">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-8 text-center">
                <p className="text-sm text-white/45">还没有记忆</p>
              </div>
            )}
          </div>
        </div>
      ), document.body) : null}
    </section>
  )
}
