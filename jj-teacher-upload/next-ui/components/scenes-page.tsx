'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ClipboardCheck, Clock3, Loader2, MessageCircle, MessagesSquare, MoreHorizontal, PlayCircle, Plus, Sparkles, Trash2, WandSparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/chat-message'
import { registerNativeBackHandler } from '@/lib/native-back'
import type { TeacherMessage, TutorMemoryProfile } from '@/lib/sample-data'
import {
  getTeacherDifficultyLabel,
  getTeacherScenarioLabel,
  type TeacherDifficulty,
  type TeacherScenarioId
} from '@/lib/teacher-scenarios'

export interface SavedDialogueMessage {
  id: string
  role: 'ai' | 'assistant' | 'user'
  english: string
  chinese: string
  createdAt: number
}

export interface SavedDialogueReplyOption {
  english: string
  chinese: string
}

export interface SavedDialogueCustomContext {
  scenarioName: string
  roleA: string
  roleB: string
  sourceDialogue?: string
}

export interface SavedDialogueRecord {
  id: string
  title: string
  scenario: TeacherScenarioId
  difficulty: TeacherDifficulty
  messages: SavedDialogueMessage[]
  replyOptions: SavedDialogueReplyOption[]
  conversationStage: string
  memory: TutorMemoryProfile | null
  createdAt: number
  updatedAt: number
  lastMessagePreview: string
  messageCount: number
  customContext?: SavedDialogueCustomContext | null
}

export interface CustomDialogueBuilderInput {
  scenarioName: string
  roleA: string
  roleB: string
  chineseDialogue: string
  complete: boolean
}

interface ScenesPageProps {
  records: SavedDialogueRecord[]
  selectedRecordId?: string | null
  onSelectedRecordIdChange?: (id: string | null) => void
  onDeleteRecord?: (id: string) => void
  onContinueRecord?: (record: SavedDialogueRecord) => void
  onStartExam?: (record: SavedDialogueRecord) => void
  onAddSentence?: (text: string, note: string) => void
  onTranslateText?: (text: string) => Promise<string>
  onGenerateCustomDialogue?: (input: CustomDialogueBuilderInput) => Promise<SavedDialogueRecord>
}

function formatSavedTime(value: number) {
  const date = new Date(value || Date.now())
  const now = new Date()
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return `今天 ${time}`
  }

  return `${date.getMonth() + 1}月${date.getDate()}日 ${time}`
}

function toTeacherMessage(message: SavedDialogueMessage): TeacherMessage {
  return {
    id: message.id,
    role: message.role === 'user' ? 'user' : 'assistant',
    text: message.english,
    mode: 'select-dialogue',
    timestamp: message.createdAt || Date.now()
  }
}

function getLastPreview(record: SavedDialogueRecord) {
  const fallback = record.messages[record.messages.length - 1]?.english || ''
  return (record.lastMessagePreview || fallback || '还没有消息').replace(/\s+/g, ' ').trim()
}

export function ScenesPage({
  records,
  selectedRecordId: controlledSelectedRecordId,
  onSelectedRecordIdChange,
  onDeleteRecord,
  onContinueRecord,
  onStartExam,
  onAddSentence,
  onTranslateText,
  onGenerateCustomDialogue
}: ScenesPageProps) {
  const [internalSelectedRecordId, setInternalSelectedRecordId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [customScenarioName, setCustomScenarioName] = useState('')
  const [customRoleA, setCustomRoleA] = useState('')
  const [customRoleB, setCustomRoleB] = useState('')
  const [customDialogueText, setCustomDialogueText] = useState('')
  const [builderError, setBuilderError] = useState('')
  const [builderLoadingMode, setBuilderLoadingMode] = useState<'generate' | 'complete' | ''>('')
  const selectedRecordId = controlledSelectedRecordId !== undefined ? controlledSelectedRecordId : internalSelectedRecordId
  const setSelectedRecordId = (id: string | null) => {
    if (controlledSelectedRecordId === undefined) setInternalSelectedRecordId(id)
    onSelectedRecordIdChange?.(id)
  }
  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) || null,
    [records, selectedRecordId]
  )

  useEffect(() => {
    return registerNativeBackHandler(() => {
      if (showBuilder) {
        setShowBuilder(false)
        return true
      }
      if (openMenuId) {
        setOpenMenuId(null)
        return true
      }
      if (selectedRecordId) {
        setSelectedRecordId(null)
        return true
      }
      return false
    }, 60)
  }, [openMenuId, selectedRecordId, showBuilder])

  const handleDelete = (id: string) => {
    setOpenMenuId(null)
    if (typeof window !== 'undefined' && !window.confirm('确定要删除这条聊天记录吗？')) return
    onDeleteRecord?.(id)
    if (selectedRecordId === id) setSelectedRecordId(null)
  }

  const resetBuilder = () => {
    setCustomScenarioName('')
    setCustomRoleA('')
    setCustomRoleB('')
    setCustomDialogueText('')
    setBuilderError('')
    setBuilderLoadingMode('')
  }

  const openBuilder = () => {
    setOpenMenuId(null)
    setBuilderError('')
    setShowBuilder(true)
  }

  const handleGenerateCustomDialogue = async (complete: boolean) => {
    const scenarioName = customScenarioName.replace(/\s+/g, ' ').trim()
    const roleA = customRoleA.replace(/\s+/g, ' ').trim()
    const roleB = customRoleB.replace(/\s+/g, ' ').trim()
    const chineseDialogue = customDialogueText.trim()

    if (!scenarioName || !roleA || !roleB || !chineseDialogue) {
      setBuilderError('请填写场景名称、两个角色和中文对话。')
      return
    }
    if (!onGenerateCustomDialogue || builderLoadingMode) return

    setBuilderLoadingMode(complete ? 'complete' : 'generate')
    setBuilderError('')
    try {
      const record = await onGenerateCustomDialogue({ scenarioName, roleA, roleB, chineseDialogue, complete })
      setShowBuilder(false)
      resetBuilder()
      setSelectedRecordId(record.id)
    } catch (error) {
      setBuilderError(error instanceof Error ? error.message : '生成失败，请重试。')
    } finally {
      setBuilderLoadingMode('')
    }
  }

  if (selectedRecord) {
    const messages = selectedRecord.messages
    const recordTitle = selectedRecord.customContext?.scenarioName || getTeacherScenarioLabel(selectedRecord.scenario)

    return (
      <section id="chatRecordDetail" className="px-4 py-4 pb-28 animate-fade-in">
        <button
          type="button"
          onClick={() => setSelectedRecordId(null)}
          className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-white/50 transition-premium hover:text-white/85"
        >
          <ChevronLeft className="h-4 w-4" />
          返回记录
        </button>

        <div className="mb-4 rounded-3xl border border-white/[0.07] bg-white/[0.035] p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[oklch(0.70_0.15_280)]">
                SAVED CHAT
              </p>
              <h2 className="truncate text-lg font-semibold text-white/95">
                {recordTitle} · {getTeacherDifficultyLabel(selectedRecord.difficulty)}
              </h2>
              <p className="mt-1 text-xs text-white/38">
                {formatSavedTime(selectedRecord.updatedAt)} · 共 {selectedRecord.messageCount || messages.length} 条消息
              </p>
              {selectedRecord.customContext && (
                <p className="mt-1 text-xs text-[oklch(0.70_0.15_280_/_0.72)]">
                  {selectedRecord.customContext.roleA} / {selectedRecord.customContext.roleB}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                onClick={() => onContinueRecord?.(selectedRecord)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-[oklch(0.70_0.15_280_/_0.30)] bg-[oklch(0.70_0.15_280_/_0.12)] px-3 text-xs font-semibold text-white transition-premium hover:bg-[oklch(0.70_0.15_280_/_0.18)]"
              >
                <PlayCircle className="h-4 w-4" />
                继续对话
              </button>
              <button
                type="button"
                onClick={() => onStartExam?.(selectedRecord)}
                disabled={!messages.length}
                className={cn(
                  "flex h-10 items-center justify-center gap-1.5 rounded-2xl border px-3 text-xs font-semibold transition-premium",
                  messages.length
                    ? "border-white/[0.10] bg-white/[0.045] text-white/82 hover:border-[oklch(0.70_0.15_280_/_0.26)] hover:text-white"
                    : "border-white/[0.05] bg-white/[0.025] text-white/28"
                )}
              >
                <ClipboardCheck className="h-4 w-4" />
                开始考试
              </button>
            </div>
          </div>
          {selectedRecord.conversationStage && (
            <p className="rounded-2xl border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-white/42">
              当前阶段：{selectedRecord.conversationStage}
            </p>
          )}
        </div>

        {messages.length > 0 ? (
          <div className="space-y-0">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={toTeacherMessage(message)}
                compactAfter={messages[index + 1]?.role === message.role}
                allowUserAddSentence
                messageMeaning={message.chinese}
                onAddSentence={onAddSentence}
                onTranslateText={onTranslateText}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-white/35">这条记录里还没有消息。</p>
          </div>
        )}
      </section>
    )
  }

  return (
    <section id="chatRecordsPage" className="relative px-4 py-4 pb-28 animate-fade-in">
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[oklch(0.70_0.15_280)]">
          SAVED CHATS
        </p>
        <h2 className="text-xl font-semibold text-white/95">聊天记录</h2>
      </div>

      {records.length > 0 ? (
        <div className="space-y-3">
          {records.map((record, index) => {
            const isMenuOpen = openMenuId === record.id
            const recordTitle = record.customContext?.scenarioName || getTeacherScenarioLabel(record.scenario)
            return (
              <article
                key={record.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedRecordId(record.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setSelectedRecordId(record.id)
                }}
                className="relative rounded-3xl border border-white/[0.07] bg-white/[0.035] p-4 pr-14 text-left backdrop-blur-xl transition-premium animate-slide-up hover:border-[oklch(0.70_0.15_280_/_0.22)] hover:bg-white/[0.055]"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setOpenMenuId((current) => current === record.id ? null : record.id)
                  }}
                  className={cn(
                    "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/[0.055] bg-white/[0.025] text-white/38 transition-premium hover:text-white/78",
                    isMenuOpen && "border-[oklch(0.70_0.15_280_/_0.30)] bg-[oklch(0.70_0.15_280_/_0.10)] text-white"
                  )}
                  aria-label="记录操作"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-3 top-12 z-20 w-[132px] rounded-2xl border border-white/[0.08] bg-black/90 p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      className="flex h-9 w-full items-center gap-2 rounded-xl px-2.5 text-left text-[12px] font-semibold text-[oklch(0.72_0.20_25)] transition-premium hover:bg-white/[0.06]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      删除记录
                    </button>
                  </div>
                )}

                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/92">
                  <MessagesSquare className="h-4 w-4 text-[oklch(0.80_0.15_280)]" />
                  <span className="truncate">{recordTitle} · {getTeacherDifficultyLabel(record.difficulty)}</span>
                </div>
                {record.customContext && (
                  <p className="mb-2 text-xs font-semibold text-[oklch(0.70_0.15_280_/_0.70)]">
                    {record.customContext.roleA} / {record.customContext.roleB}
                  </p>
                )}
                <div className="mb-3 flex items-center gap-2 text-xs text-white/38">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{formatSavedTime(record.updatedAt)}</span>
                </div>
                <p className="mb-2 line-clamp-2 text-sm leading-relaxed text-white/68">
                  最后聊到：{getLastPreview(record)}
                </p>
                <p className="text-xs font-medium text-white/35">
                  共 {record.messageCount || record.messages.length} 条消息
                </p>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="flex min-h-[46vh] flex-col items-center justify-center px-6 text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full bg-[oklch(0.70_0.15_280_/_0.14)] blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
              <MessageCircle className="h-8 w-8 text-white/32" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white/90">还没有聊天记录</h2>
          <p className="max-w-[280px] text-sm leading-relaxed text-white/40">
            在智语导师保存点选对话，或点击右下角新建自己的中文场景对话。
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={openBuilder}
        className="fixed bottom-[calc(5.8rem+env(safe-area-inset-bottom))] right-5 z-40 flex h-14 items-center gap-2 rounded-3xl border border-[oklch(0.70_0.15_280_/_0.30)] bg-[oklch(0.70_0.15_280_/_0.16)] px-4 text-sm font-semibold text-white shadow-[0_0_28px_oklch(0.70_0.15_280_/_0.22)] backdrop-blur-xl transition-premium active:scale-95"
      >
        <Plus className="h-5 w-5" />
        新建对话
      </button>

      {showBuilder && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/70 px-4 pb-4 pt-16 backdrop-blur-md animate-fade-in">
          <button
            className="absolute inset-0 cursor-default"
            aria-label="关闭新建对话"
            onClick={() => !builderLoadingMode && setShowBuilder(false)}
          />
          <div className="relative w-full max-w-[520px] max-h-[88dvh] overflow-y-auto rounded-[2rem] border border-white/[0.08] bg-[#08080f]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl animate-scale-in">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[oklch(0.70_0.15_280)]">
                  Custom Conversation
                </p>
                <h2 className="text-xl font-semibold text-white/95">新建场景对话</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                disabled={Boolean(builderLoadingMode)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-white/45 transition-premium hover:text-white disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[oklch(0.70_0.15_280_/_0.82)]">1. 场景名称</span>
                <input
                  value={customScenarioName}
                  onChange={(event) => setCustomScenarioName(event.target.value)}
                  placeholder="美发客户交流"
                  className="h-12 w-full rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 text-sm text-white/92 outline-none placeholder:text-white/28 focus:border-[oklch(0.70_0.15_280_/_0.34)]"
                />
              </label>

              <div>
                <span className="mb-2 block text-xs font-semibold text-[oklch(0.70_0.15_280_/_0.82)]">2. 设置角色</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={customRoleA}
                    onChange={(event) => setCustomRoleA(event.target.value)}
                    placeholder="角色A：发型师"
                    className="h-12 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 text-sm text-white/92 outline-none placeholder:text-white/28 focus:border-[oklch(0.70_0.15_280_/_0.34)]"
                  />
                  <input
                    value={customRoleB}
                    onChange={(event) => setCustomRoleB(event.target.value)}
                    placeholder="角色B：客人"
                    className="h-12 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 text-sm text-white/92 outline-none placeholder:text-white/28 focus:border-[oklch(0.70_0.15_280_/_0.34)]"
                  />
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[oklch(0.70_0.15_280_/_0.82)]">3. 中文对话</span>
                <textarea
                  value={customDialogueText}
                  onChange={(event) => setCustomDialogueText(event.target.value)}
                  placeholder={'发型师：\n你今天有什么想法吗？\n\n客人：\n没有，你有什么推荐吗？'}
                  rows={9}
                  className="min-h-[210px] w-full resize-none rounded-[1.5rem] border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white/92 outline-none placeholder:text-white/26 focus:border-[oklch(0.70_0.15_280_/_0.34)]"
                />
              </label>

              {builderError && (
                <p className="rounded-2xl border border-[oklch(0.62_0.22_25_/_0.25)] bg-[oklch(0.62_0.22_25_/_0.08)] px-4 py-3 text-sm text-[oklch(0.72_0.20_25)]">
                  {builderError}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleGenerateCustomDialogue(false)}
                  disabled={Boolean(builderLoadingMode)}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[oklch(0.70_0.15_280_/_0.30)] bg-[oklch(0.70_0.15_280_/_0.14)] text-sm font-semibold text-white transition-premium hover:bg-[oklch(0.70_0.15_280_/_0.20)] disabled:opacity-45"
                >
                  {builderLoadingMode === 'generate' ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
                  生成英文对话
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateCustomDialogue(true)}
                  disabled={Boolean(builderLoadingMode)}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.045] text-sm font-semibold text-white/72 transition-premium hover:text-white disabled:opacity-45"
                >
                  {builderLoadingMode === 'complete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI补全对话
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
