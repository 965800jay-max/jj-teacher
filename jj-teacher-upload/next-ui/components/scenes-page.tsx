'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ClipboardCheck, Clock3, MessageCircle, MessagesSquare, MoreHorizontal, PlayCircle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/chat-message'
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
}

interface ScenesPageProps {
  records: SavedDialogueRecord[]
  onDeleteRecord?: (id: string) => void
  onContinueRecord?: (record: SavedDialogueRecord) => void
  onStartExam?: (record: SavedDialogueRecord) => void
  onAddSentence?: (text: string, note: string) => void
  onTranslateText?: (text: string) => Promise<string>
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
  onDeleteRecord,
  onContinueRecord,
  onStartExam,
  onAddSentence,
  onTranslateText
}: ScenesPageProps) {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) || null,
    [records, selectedRecordId]
  )

  const handleDelete = (id: string) => {
    setOpenMenuId(null)
    if (typeof window !== 'undefined' && !window.confirm('确定要删除这条聊天记录吗？')) return
    onDeleteRecord?.(id)
    if (selectedRecordId === id) setSelectedRecordId(null)
  }

  if (selectedRecord) {
    const messages = selectedRecord.messages

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
                {getTeacherScenarioLabel(selectedRecord.scenario)} · {getTeacherDifficultyLabel(selectedRecord.difficulty)}
              </h2>
              <p className="mt-1 text-xs text-white/38">
                {formatSavedTime(selectedRecord.updatedAt)} · 共 {selectedRecord.messageCount || messages.length} 条消息
              </p>
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
    <section id="chatRecordsPage" className="px-4 py-4 pb-28 animate-fade-in">
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
                  <span className="truncate">{getTeacherScenarioLabel(record.scenario)} · {getTeacherDifficultyLabel(record.difficulty)}</span>
                </div>
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
            在智语导师的点选对话里保存一次，或完成一轮点选对话后，这里会出现记录。
          </p>
        </div>
      )}
    </section>
  )
}
