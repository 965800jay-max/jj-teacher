'use client'

import { useState } from 'react'
import { Play, Trash2, Sparkles, Check, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SentenceCardProps {
  text: string
  note: string
  learned: boolean
  aiExplanation?: string
  speechRate?: number
  onSpeak?: () => void
  onAdd?: () => void
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
  onDelete,
  onToggleLearned,
  onAiExplain
}: SentenceCardProps) {
  const [showAiExplain, setShowAiExplain] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAiClicked, setIsAiClicked] = useState(false)
  const [isPlayClicked, setIsPlayClicked] = useState(false)

  const words = text.split(/(\s+|(?=[.,!?;:'"]))/).filter(Boolean)

  const handleWordClick = (word: string) => {
    if (word.trim() && !/^[.,!?;:'"]$/.test(word)) {
      if (!('speechSynthesis' in window)) return
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.rate = speechRate
      speechSynthesis.speak(utterance)
    }
  }

  const handleSpeak = () => {
    setIsPlayClicked(true)
    setTimeout(() => setIsPlayClicked(false), 300)
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = speechRate
    speechSynthesis.speak(utterance)
    onSpeak?.()
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
        {/* 英文句子 - 可点击单词 */}
        <div className="flex flex-wrap gap-x-1.5 gap-y-1.5 text-lg text-white/95 leading-relaxed mb-4 font-medium">
          {words.map((word, index) => {
            const isPunctuation = /^[.,!?;:'"]$/.test(word)
            const isSpace = /^\s+$/.test(word)
            
            if (isSpace) return <span key={index}> </span>
            if (isPunctuation) return <span key={index} className="text-white/40 -ml-1">{word}</span>
            
            return (
              <button
                key={index}
                onClick={() => handleWordClick(word)}
                className="hover:text-[oklch(0.80_0.15_280)] hover:bg-[oklch(0.70_0.15_280_/_0.1)] rounded-lg px-1 -mx-1 transition-premium"
              >
                {word}
              </button>
            )
          })}
        </div>

        {/* 中文意思 */}
        <p className="text-sm text-white/50 mb-6 leading-relaxed">
          {note || <span className="text-[oklch(0.70_0.15_280_/_0.7)] italic">点击添加中文意思</span>}
        </p>

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
            onClick={() => {
              setIsAiClicked(true)
              setTimeout(() => setIsAiClicked(false), 300)
              setShowAiExplain(!showAiExplain)
              if (!aiExplanation) onAiExplain?.()
            }}
            className={cn(
              "flex items-center gap-2 h-11 px-5 rounded-2xl text-sm font-semibold tracking-wide transition-premium",
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
            <span>AI 解答</span>
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

        {/* AI 解答展开 */}
        {showAiExplain && (
          <div className="mt-6 pt-6 border-t border-white/[0.06] animate-slide-up">
            {aiExplanation ? (
              <div className="space-y-3 text-sm">
                {aiExplanation.split('\n').map((line, i) => (
                  <p key={i} className={cn(
                    "leading-relaxed",
                    (line.startsWith('重点') || line.startsWith('例句')) 
                      ? 'text-[oklch(0.80_0.15_280)] font-medium' 
                      : 'text-white/60'
                  )}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-white/45">
                <div className="w-5 h-5 border-2 border-white/20 border-t-[oklch(0.70_0.15_280)] rounded-full animate-spin" />
                <span>正在生成解答...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
