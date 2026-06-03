'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Play, Trash2, Sparkles, Check, BookOpen, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'
import { SpeakableText } from '@/components/speakable-text'

interface SentenceCardProps {
  text: string
  note: string
  learned: boolean
  aiExplanation?: string
  speechRate?: number
  onSpeak?: () => void
  onAdd?: () => void
  onUpdateText?: (text: string) => void
  onUpdateNote?: (note: string) => void
  onDelete?: () => void
  onToggleLearned?: () => void
  onAiExplain?: () => void
}

export function SentenceCard({
  text,
  note,
  learned,
  aiExplanation,
  speechRate = 0.9,
  onSpeak,
  onUpdateText,
  onUpdateNote,
  onDelete,
  onToggleLearned,
  onAiExplain
}: SentenceCardProps) {
  const [showAiExplain, setShowAiExplain] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAiClicked, setIsAiClicked] = useState(false)
  const [isPlayClicked, setIsPlayClicked] = useState(false)
  const [isEditingText, setIsEditingText] = useState(false)
  const [draftText, setDraftText] = useState(text)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [draftNote, setDraftNote] = useState(note)
  const lastNoteTapAtRef = useRef(0)
  const textInputRef = useRef<HTMLTextAreaElement>(null)
  const noteInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isEditingText) setDraftText(text)
  }, [isEditingText, text])

  useEffect(() => {
    if (!isEditingNote) setDraftNote(note)
  }, [isEditingNote, note])

  useEffect(() => {
    if (!isEditingText) return
    textInputRef.current?.focus()
    textInputRef.current?.setSelectionRange(draftText.length, draftText.length)
  }, [isEditingText])

  useEffect(() => {
    if (!isEditingNote) return
    noteInputRef.current?.focus()
    noteInputRef.current?.setSelectionRange(draftNote.length, draftNote.length)
  }, [isEditingNote])

  const handleSpeak = () => {
    setIsPlayClicked(true)
    setTimeout(() => setIsPlayClicked(false), 300)
    speakEnglish(text, { mode: 'sentence', rate: speechRate })
    onSpeak?.()
  }

  const handleAiClick = () => {
    setIsAiClicked(true)
    setTimeout(() => setIsAiClicked(false), 300)
    setShowAiExplain(true)
    if (!aiExplanation) onAiExplain?.()
  }

  const openTextInput = () => {
    if (!onUpdateText) return
    setDraftText(text)
    setIsEditingText(true)
  }

  const saveTextInput = () => {
    const cleanText = draftText.replace(/\s+/g, ' ').trim()
    if (cleanText) onUpdateText?.(cleanText)
    setDraftText(cleanText || text)
    setIsEditingText(false)
  }

  const openNoteInput = () => {
    if (!onUpdateNote) return
    setDraftNote(note)
    setIsEditingNote(true)
  }

  const saveNoteInput = () => {
    onUpdateNote?.(draftNote.trim())
    setIsEditingNote(false)
  }

  const handleNotePointerUp = () => {
    const now = Date.now()
    if (now - lastNoteTapAtRef.current < 450) {
      lastNoteTapAtRef.current = 0
      openNoteInput()
      return
    }
    lastNoteTapAtRef.current = now
  }

  return (
    <div className={cn(
      "group relative glass-card rounded-3xl transition-premium overflow-hidden",
      learned && "opacity-60"
    )}>
      {/* 内部光泽 */}
      <div className="inner-glow rounded-3xl" />
      
      {/* 顶部光线 */}
      <div className="top-highlight" />
      
      <div className="relative p-6">
        {/* 英文句子 - 可点击单词，双击可修改 */}
        {isEditingText ? (
          <textarea
            ref={textInputRef}
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            onBlur={saveTextInput}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                saveTextInput()
              }
              if (event.key === 'Escape') {
                event.preventDefault()
                setDraftText(text)
                setIsEditingText(false)
              }
            }}
            rows={2}
            className="mb-4 block w-full min-h-[3.25rem] resize-none bg-transparent border-0 p-0 text-lg text-white/95 placeholder:text-white/35 outline-none leading-relaxed font-medium"
          />
        ) : (
          <div
            className="text-lg text-white/95 leading-relaxed mb-4 font-medium"
            onDoubleClick={openTextInput}
          >
            <SpeakableText text={text} rate={speechRate} onDoubleTap={openTextInput} />
          </div>
        )}

        {/* 中文意思 */}
        {isEditingNote ? (
          <textarea
            ref={noteInputRef}
            value={draftNote}
            onChange={(event) => setDraftNote(event.target.value)}
            onBlur={saveNoteInput}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                saveNoteInput()
              }
              if (event.key === 'Escape') {
                event.preventDefault()
                setDraftNote(note)
                setIsEditingNote(false)
              }
            }}
            placeholder="点击添加中文意思"
            rows={1}
            className="mb-6 block w-full min-h-[1.5rem] resize-none bg-transparent border-0 p-0 text-sm text-[oklch(0.70_0.15_280_/_0.7)] placeholder:text-[oklch(0.70_0.15_280_/_0.7)] outline-none leading-relaxed"
          />
        ) : (
          <p
            className="text-sm text-[oklch(0.70_0.15_280_/_0.7)] mb-6 leading-relaxed"
            onDoubleClick={openNoteInput}
            onPointerUp={handleNotePointerUp}
          >
            {note || <span className="italic">点击添加中文意思</span>}
          </p>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSpeak}
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-2xl glass-button text-white/60 hover:text-white transition-premium",
              isPlayClicked && "scale-90 brightness-125"
            )}
            aria-label="朗读整句"
          >
            <Play className={cn(
              "w-[18px] h-[18px] ml-0.5 transition-transform duration-300",
              isPlayClicked && "scale-125"
            )} />
          </button>

          <button
            onClick={handleAiClick}
            className={cn(
              "flex shrink-0 items-center gap-2 h-11 px-4 rounded-2xl text-sm font-semibold tracking-wide whitespace-nowrap transition-premium",
              showAiExplain 
                ? "glass-button-primary" 
                : "glass-button text-white/60 hover:text-white/90",
              isAiClicked && "scale-90 brightness-125"
            )}
          >
            <Sparkles className={cn(
              "w-4 h-4 transition-transform duration-300",
              isAiClicked && "rotate-180 scale-125"
            )} />
            <span className="whitespace-nowrap">AI 解答</span>
          </button>

          <div className="flex-1" />

          <button
            onClick={onToggleLearned}
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-2xl transition-premium",
              learned 
                ? "bg-[oklch(0.72_0.18_155_/_0.15)] border border-[oklch(0.72_0.18_155_/_0.3)] text-[oklch(0.80_0.18_155)]" 
                : "glass-button text-white/45 hover:text-white/80"
            )}
            aria-label={learned ? "标记为学习中" : "标记为已学会"}
          >
            {learned ? <Check className="w-[18px] h-[18px]" /> : <BookOpen className="w-[18px] h-[18px]" />}
          </button>

          <button
            onClick={() => {
              if (isDeleting) {
                onDelete?.()
              } else {
                setIsDeleting(true)
                setTimeout(() => setIsDeleting(false), 3000)
              }
            }}
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-2xl transition-premium",
              isDeleting 
                ? "bg-[oklch(0.62_0.22_25_/_0.15)] border border-[oklch(0.62_0.22_25_/_0.3)] text-[oklch(0.70_0.22_25)]" 
                : "glass-button text-white/45 hover:text-[oklch(0.70_0.22_25)]"
            )}
            aria-label="删除句子"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>

      </div>

      {showAiExplain && typeof document !== 'undefined' ? createPortal((
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 backdrop-blur-md px-4 pb-4 pt-20 animate-fade-in">
          <button
            className="absolute inset-0 cursor-default"
            aria-label="关闭 AI 解答"
            onClick={() => setShowAiExplain(false)}
          />
          <div className="relative w-full max-w-[520px] max-h-[82dvh] overflow-y-auto glass-sheet rounded-[2rem] p-6 animate-scale-in">
            <div className="top-highlight" />
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.18em] uppercase mb-1">
                  AI 解答
                </p>
                <h2 className="text-xl font-semibold text-white/95">句子重点</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAiExplain(false)}
                className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/55 hover:text-white transition-premium"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-4 mb-5">
              <p className="text-[15px] font-semibold text-white/95 leading-relaxed">{text}</p>
              {note && <p className="text-sm text-white/45 leading-relaxed mt-2">{note}</p>}
            </div>

            {aiExplanation ? (
              <div className="space-y-3 text-[15px] text-white/72 leading-relaxed whitespace-pre-wrap">
                {aiExplanation}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-white/45 py-4">
                <div className="w-5 h-5 border-2 border-white/20 border-t-[oklch(0.70_0.15_280)] rounded-full animate-spin" />
                <span>正在生成句子重点...</span>
              </div>
            )}
          </div>
        </div>
      ), document.body) : null}
    </div>
  )
}
