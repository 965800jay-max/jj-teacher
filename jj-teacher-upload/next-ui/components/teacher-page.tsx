'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Sparkles, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/chat-message'
import type { TeacherMessage } from '@/lib/sample-data'

export type TeacherQuickMode = 'topic' | 'daily' | 'free'

interface TeacherPageProps {
  messages: TeacherMessage[]
  activeMode?: TeacherQuickMode | null
  isSending?: boolean
  onSendMessage?: (text: string, mode?: TeacherQuickMode | null) => void
  onQuickAction?: (action: TeacherQuickMode) => void
  onAddSentence?: (text: string, note: string) => void
}

export function TeacherPage({
  messages,
  activeMode = null,
  isSending = false,
  onSendMessage,
  onQuickAction,
  onAddSentence
}: TeacherPageProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
        </div>
      </div>

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
    </section>
  )
}
