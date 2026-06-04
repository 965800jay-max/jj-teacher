'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Send, Sparkles, Coffee, Brain, X, Trash2, Power, MousePointerClick, RefreshCw, Plus, Volume2, VolumeX, Gauge, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/chat-message'
import { speakEnglish } from '@/lib/speech'
import type { TeacherMessage, TutorMemoryProfile } from '@/lib/sample-data'
import {
  getTeacherDifficultyLabel,
  getTeacherScenarioLabel,
  teacherDifficultyOptions,
  teacherScenarioOptions,
  type TeacherDifficulty,
  type TeacherScenarioId
} from '@/lib/teacher-scenarios'

export type TeacherQuickMode = 'topic' | 'daily' | 'free' | 'select' | 'hair' | 'client'

interface TeacherPageProps {
  messages: TeacherMessage[]
  activeMode?: TeacherQuickMode | null
  isSending?: boolean
  memoryProfile?: TutorMemoryProfile
  replyOptions?: string[]
  replyOptionMeanings?: string[]
  isReplyOptionsLoading?: boolean
  replyOptionsError?: string
  selectSceneId?: TeacherScenarioId
  selectDifficulty?: TeacherDifficulty
  selectStage?: string
  onSendMessage?: (text: string, mode?: TeacherQuickMode | null) => void
  onQuickAction?: (action: TeacherQuickMode) => void
  onStartSelectDialogue?: (sceneId: TeacherScenarioId, options?: { reset?: boolean }) => void
  onDifficultyChange?: (difficulty: TeacherDifficulty) => void
  onSelectReplyOption?: (option: string) => void
  onRetryReplyOptions?: () => void
  onAddSentence?: (text: string, note: string) => void
  onTranslateText?: (text: string) => Promise<string>
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

const SELECT_DIALOGUE_MUTE_KEY = 'sentence-reader-select-dialogue-muted'

function hasChinese(text: string) {
  return /[\u4e00-\u9fff]/.test(text)
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

export function TeacherPage({
  messages,
  activeMode = null,
  isSending = false,
  memoryProfile,
  replyOptions = [],
  replyOptionMeanings = [],
  isReplyOptionsLoading = false,
  replyOptionsError = '',
  selectSceneId = 'daily-life',
  selectDifficulty = 'medium',
  selectStage = '',
  onSendMessage,
  onQuickAction,
  onStartSelectDialogue,
  onDifficultyChange,
  onSelectReplyOption,
  onRetryReplyOptions,
  onAddSentence,
  onTranslateText,
  onToggleMemory,
  onClearMemory
}: TeacherPageProps) {
  const [inputValue, setInputValue] = useState('')
  const [showMemory, setShowMemory] = useState(false)
  const [showScenePicker, setShowScenePicker] = useState(false)
  const [scenePickerMode, setScenePickerMode] = useState<'start' | 'new'>('start')
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false)
  const [optionPreview, setOptionPreview] = useState<{ text: string; note: string } | null>(null)
  const [selectDialogueMuted, setSelectDialogueMuted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressFiredRef = useRef(false)
  const spokenMessageIdsRef = useRef<Set<string>>(new Set())
  const mountedAtRef = useRef(Date.now())
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
    if (typeof window === 'undefined') return
    setSelectDialogueMuted(window.localStorage.getItem(SELECT_DIALOGUE_MUTE_KEY) === '1')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(SELECT_DIALOGUE_MUTE_KEY, selectDialogueMuted ? '1' : '0')
  }, [selectDialogueMuted])

  useEffect(() => {
    const newMessages = messages.filter((message) => !spokenMessageIdsRef.current.has(message.id))
    newMessages.forEach((message) => spokenMessageIdsRef.current.add(message.id))
    if (selectDialogueMuted || !newMessages.length) return

    newMessages
      .filter((message) =>
        message.mode === 'select-dialogue' &&
        !message.pending &&
        (!message.timestamp || message.timestamp >= mountedAtRef.current - 1000)
      )
      .forEach((message, index) => {
        const speakText = extractSpeakableEnglish(message.text)
        if (!speakText) return
        window.setTimeout(() => {
          speakEnglish(speakText, { mode: 'sentence', rate: 0.9 }).catch(() => {})
        }, index * 520)
      })
  }, [messages, selectDialogueMuted])

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

  const openScenePicker = (mode: 'start' | 'new') => {
    if (isSending) return
    setScenePickerMode(mode)
    setShowScenePicker(true)
  }

  const handleSceneSelect = (sceneId: TeacherScenarioId) => {
    setShowScenePicker(false)
    onStartSelectDialogue?.(sceneId, { reset: true })
  }

  const handleDifficultySelect = (difficulty: TeacherDifficulty) => {
    setShowDifficultyPicker(false)
    onDifficultyChange?.(difficulty)
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
    <section id="teacherPage" className="flex flex-1 min-h-0 flex-col overflow-hidden animate-fade-in">
      {/* 小型模式 chips */}
      <div className="flex-shrink-0 px-4 pb-0.5">
        <div className="flex gap-2 overflow-x-auto py-1 -mx-4 px-4 scrollbar-hide">
          <button
            id="selectDialogueButton"
            type="button"
            onClick={() => openScenePicker('start')}
            disabled={isSending}
            className={cn(
              "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tracking-wide whitespace-nowrap transition-premium border",
              activeMode === 'select'
                ? "border-[oklch(0.70_0.15_280_/_0.45)] bg-[oklch(0.70_0.15_280_/_0.16)] text-white shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.18)]"
                : "border-white/[0.08] bg-white/[0.035] text-white/55 hover:text-white/85"
            )}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            点选对话
          </button>
          <button
            id="selectDialogueMuteButton"
            type="button"
            onClick={() => setSelectDialogueMuted((current) => !current)}
            className={cn(
              "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tracking-wide whitespace-nowrap transition-premium border",
              selectDialogueMuted
                ? "border-[oklch(0.70_0.15_280_/_0.45)] bg-[oklch(0.70_0.15_280_/_0.16)] text-white shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.18)]"
                : "border-white/[0.08] bg-white/[0.035] text-white/55 hover:text-white/85"
            )}
          >
            {selectDialogueMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            {selectDialogueMuted ? '已静音' : '静音'}
          </button>
          <button
            id="memoryButton"
            type="button"
            onClick={() => setShowMemory(true)}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-semibold tracking-wide text-white/55 transition-premium hover:text-white/85"
          >
            <Brain className="w-3.5 h-3.5" />
            记忆
          </button>
          <button
            id="difficultyButton"
            type="button"
            onClick={() => setShowDifficultyPicker(true)}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-semibold tracking-wide text-white/55 transition-premium hover:text-white/85"
          >
            <Gauge className="w-3.5 h-3.5" />
            {getTeacherDifficultyLabel(selectDifficulty)}
          </button>
          <button
            id="freeChatButton"
            type="button"
            onClick={() => handleQuickAction('free')}
            disabled={isSending}
            className={cn(
              "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tracking-wide whitespace-nowrap transition-premium border",
              activeMode === 'free'
                ? "border-[oklch(0.70_0.15_280_/_0.45)] bg-[oklch(0.70_0.15_280_/_0.16)] text-white shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.18)]"
                : "border-white/[0.08] bg-white/[0.035] text-white/55 hover:text-white/85"
            )}
          >
            <Coffee className="w-3.5 h-3.5" />
            闲聊
          </button>
          <button
            id="newSelectDialogueButton"
            type="button"
            onClick={() => openScenePicker('new')}
            disabled={isSending}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-semibold tracking-wide text-white/55 transition-premium hover:text-white/85"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            新对话
          </button>
        </div>
        {activeMode === 'select' && (
          <div className="mt-1 flex items-center gap-2 overflow-hidden text-[10px] font-medium text-white/30">
            <span className="truncate">{getTeacherScenarioLabel(selectSceneId)}</span>
            {selectStage && <span className="truncate">/ {selectStage}</span>}
          </div>
        )}
      </div>

      {/* 聊天消息区 */}
      <div
        id="chatMessages"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-2"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            {/* 图标 - 带光晕 */}
            <div className="relative mb-5">
              <div className="absolute inset-0 w-[4.5rem] h-[4.5rem] rounded-full bg-[oklch(0.70_0.15_280_/_0.15)] blur-xl animate-glow" />
              <div className="relative w-[4.5rem] h-[4.5rem] rounded-3xl glass-card flex items-center justify-center">
                <div className="inner-glow rounded-3xl" />
                <Sparkles className="w-8 h-8 text-[oklch(0.80_0.15_280)]" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white/95 mb-2 tracking-wide">
              {activeMode === 'select' ? '选择场景开始练习' : '开始和智语导师聊天'}
            </h2>
            <p className="text-sm text-white/45 leading-relaxed max-w-[280px]">
              {activeMode === 'select'
                ? '点击顶部“点选对话”，选择真实场景后直接开始。'
                : '用中文告诉我你想表达什么，我会教你自然的英文说法。'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage 
                key={msg.id} 
                message={msg}
                compactAfter={messages[index + 1]?.role === msg.role}
                onAddSentence={onAddSentence}
                onTranslateText={onTranslateText}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {(activeMode === 'select' || visibleReplyOptions.length > 0 || replyOptionsError) && (
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="relative min-h-[76px] max-h-[90px] overflow-hidden rounded-2xl border border-[oklch(0.70_0.15_280_/_0.12)] bg-black/20 px-2.5 py-2 backdrop-blur-xl">
            {visibleReplyOptions.length > 0 ? (
              <div className="relative flex gap-2 overflow-x-auto pb-1 pr-2 scrollbar-hide scroll-smooth">
                {visibleReplyOptions.map((option, index) => {
                  const note = replyOptionMeanings[index] || '中文意思待补充'
                  const levelLabel = index === 0 ? '简单版' : index === 1 ? '自然版' : '进阶版'
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
                        "flex min-h-[56px] max-h-16 min-w-[150px] max-w-[80vw] shrink-0 flex-col justify-center rounded-2xl border border-[oklch(0.70_0.15_280_/_0.26)] bg-[oklch(0.70_0.15_280_/_0.075)] px-3 py-2 text-left shadow-[0_0_18px_oklch(0.70_0.15_280_/_0.08)] transition-premium",
                        "hover:bg-[oklch(0.70_0.15_280_/_0.14)] active:scale-[0.98]",
                        (isSending || isReplyOptionsLoading) && "opacity-50"
                      )}
                    >
                      <span className="mb-1 w-fit rounded-full border border-[oklch(0.70_0.15_280_/_0.22)] bg-black/20 px-2 py-0.5 text-[10px] font-semibold leading-none text-[oklch(0.78_0.15_280_/_0.72)]">
                        {levelLabel}
                      </span>
                      <span className="w-full overflow-hidden text-[13px] font-semibold leading-tight text-white/88 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">{option}</span>
                      <span className="mt-1 w-full truncate text-[11px] font-medium leading-tight text-[oklch(0.70_0.15_280_/_0.56)]">{note}</span>
                    </button>
                  )
                })}
                {isReplyOptionsLoading && (
                  <span className="flex h-9 shrink-0 items-center rounded-full border border-white/[0.07] bg-white/[0.035] px-3 text-[11px] text-white/38">
                    正在生成...
                  </span>
                )}
              </div>
            ) : (
              <p className="relative text-xs text-white/42 leading-relaxed">
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
      <form onSubmit={handleSubmit} className="flex-shrink-0 px-4 pb-[calc(72px+env(safe-area-inset-bottom))]">
        <div className="relative flex min-h-[52px] items-end gap-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 py-2 backdrop-blur-xl">
          <textarea
            ref={inputRef}
            id="teacherInput"
            className="relative flex-1 bg-transparent border-0 outline-none resize-none text-[15px] text-white/95 placeholder:text-white/30 min-h-[28px] max-h-[78px] py-1.5 leading-relaxed"
            placeholder="用中文告诉我你想表达什么…"
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
              "relative flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-premium",
              inputValue.trim() && !isSending
                ? "glass-button-primary"
                : "glass-button text-white/30"
            )}
          >
            <Send className="w-[18px] h-[18px]" />
          </button>
        </div>
      </form>

      {showScenePicker && typeof document !== 'undefined' ? createPortal((
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/70 backdrop-blur-md px-4 pb-4 pt-20 animate-fade-in">
          <button
            className="absolute inset-0 cursor-default"
            aria-label="关闭场景选择"
            onClick={() => setShowScenePicker(false)}
          />
          <div className="relative w-full max-w-[520px] max-h-[82dvh] overflow-y-auto glass-sheet rounded-[2rem] p-5 animate-scale-in">
            <div className="top-highlight" />
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.70_0.15_280)]">
                  Scenario
                </p>
                <h2 className="text-xl font-semibold text-white/95">
                  {scenePickerMode === 'new' ? '选择新对话场景' : '选择练习场景'}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-white/38">
                  AI 会扮演真实人物，按场景流程推进。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScenePicker(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl glass-button text-white/55 transition-premium hover:text-white"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {teacherScenarioOptions.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => handleSceneSelect(scenario.id)}
                  className={cn(
                    "min-h-[82px] rounded-2xl border px-3 py-3 text-left transition-premium active:scale-[0.98]",
                    selectSceneId === scenario.id
                      ? "border-[oklch(0.70_0.15_280_/_0.42)] bg-[oklch(0.70_0.15_280_/_0.13)] shadow-[0_0_22px_oklch(0.70_0.15_280_/_0.13)]"
                      : "border-white/[0.07] bg-white/[0.035] hover:border-[oklch(0.70_0.15_280_/_0.24)] hover:bg-white/[0.055]"
                  )}
                >
                  <span className="block text-sm font-semibold text-white/90">{scenario.label}</span>
                  <span className="mt-1.5 block text-[11px] leading-relaxed text-white/38">{scenario.detail}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ), document.body) : null}

      {showDifficultyPicker && typeof document !== 'undefined' ? createPortal((
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/70 backdrop-blur-md px-4 pb-4 pt-20 animate-fade-in">
          <button
            className="absolute inset-0 cursor-default"
            aria-label="关闭难度选择"
            onClick={() => setShowDifficultyPicker(false)}
          />
          <div className="relative w-full max-w-[520px] glass-sheet rounded-[2rem] p-5 animate-scale-in">
            <div className="top-highlight" />
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.70_0.15_280)]">
                  Difficulty
                </p>
                <h2 className="text-xl font-semibold text-white/95">选择难度</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDifficultyPicker(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl glass-button text-white/55 transition-premium hover:text-white"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2.5">
              {teacherDifficultyOptions.map((difficulty) => (
                <button
                  key={difficulty.id}
                  type="button"
                  onClick={() => handleDifficultySelect(difficulty.id)}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left transition-premium active:scale-[0.99]",
                    selectDifficulty === difficulty.id
                      ? "border-[oklch(0.70_0.15_280_/_0.42)] bg-[oklch(0.70_0.15_280_/_0.13)] text-white shadow-[0_0_20px_oklch(0.70_0.15_280_/_0.12)]"
                      : "border-white/[0.07] bg-white/[0.035] text-white/68 hover:bg-white/[0.055]"
                  )}
                >
                  <span className="block text-sm font-semibold">{difficulty.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-white/42">{difficulty.detail}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ), document.body) : null}

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
