'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, ArrowRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SavedSentence } from '@/lib/sample-data'

interface ExamPageProps {
  sentences: SavedSentence[]
  onComplete?: () => void
  onBack?: () => void
}

export function ExamPage({ sentences, onComplete, onBack }: ExamPageProps) {
  const learningSentences = sentences.filter(s => !s.learned && s.note)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const currentSentence = learningSentences[currentIndex]

  if (learningSentences.length === 0) {
    return (
      <section id="examPage" className="px-5 py-5 animate-fade-in">
        <div className="text-center py-20">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-white/5 blur-xl" />
            <div className="relative w-24 h-24 rounded-3xl glass-card flex items-center justify-center">
              <div className="inner-glow rounded-3xl" />
              <AlertCircle className="w-10 h-10 text-white/40" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white/95 mb-3">暂无可复习的句子</h2>
          <p className="text-sm text-white/45 mb-8">请先添加一些句子并填写中文意思</p>
          <button
            onClick={onBack}
            className="px-8 py-4 glass-button text-white/80 rounded-2xl text-sm font-semibold transition-premium"
          >
            返回句读
          </button>
        </div>
      </section>
    )
  }

  const handleCheck = () => {
    const normalized = (text: string) => 
      text.toLowerCase()
        .replace(/[.,!?;:'"]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    
    const correct = normalized(userAnswer) === normalized(currentSentence.text)
    setIsCorrect(correct)
    setShowResult(true)
  }

  const handleDontKnow = () => {
    setIsCorrect(false)
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentIndex < learningSentences.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
      setShowResult(false)
      setIsCorrect(null)
    } else {
      onComplete?.()
    }
  }

  return (
    <section id="examPage" className="px-5 py-5 animate-fade-in">
      {/* 进度 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack} 
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-premium font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            返回
          </button>
          <span id="examProgress" className="text-sm text-white/45 font-medium tabular-nums">
            {currentIndex + 1} / {learningSentences.length}
          </span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[oklch(0.70_0.15_280)] to-[oklch(0.65_0.13_280)] transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_oklch(0.70_0.15_280_/_0.4)]"
            style={{ width: `${((currentIndex + 1) / learningSentences.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 题目卡片 - 高级玻璃效果 */}
      <div className="relative glass-card rounded-3xl p-6 overflow-hidden">
        <div className="inner-glow rounded-3xl" />
        <div className="top-highlight" />
        
        <div className="relative">
          <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.15em] uppercase mb-3">中文句意</p>
          <h2 id="examPrompt" className="text-xl font-semibold text-white/95 mb-8 leading-relaxed">
            {currentSentence.note}
          </h2>

          {/* 输入区 */}
          <textarea
            id="examAnswer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="输入完整英文句子..."
            disabled={showResult}
            className={cn(
              "w-full min-h-[120px] glass-input rounded-2xl px-5 py-4 text-[15px] text-white/95 placeholder:text-white/30 resize-none outline-none leading-relaxed transition-premium",
              showResult && "opacity-50"
            )}
          />

          {/* 操作按钮 */}
          {!showResult ? (
            <div className="flex gap-4 mt-5">
              <button
                id="examCheckButton"
                onClick={handleCheck}
                disabled={!userAnswer.trim()}
                className={cn(
                  "flex-1 py-4 rounded-2xl text-sm font-semibold transition-premium",
                  userAnswer.trim()
                    ? "glass-button-primary"
                    : "glass-button text-white/35"
                )}
              >
                检查
              </button>
              <button
                id="examDontKnowButton"
                onClick={handleDontKnow}
                className="flex-1 py-4 rounded-2xl text-sm font-semibold glass-button text-white/60 hover:text-white/85 transition-premium"
              >
                我不会
              </button>
            </div>
          ) : (
            <>
              {/* 结果反馈 */}
              <div 
                id="examFeedback"
                className={cn(
                  "mt-5 p-5 rounded-2xl animate-scale-in",
                  isCorrect 
                    ? "bg-[oklch(0.72_0.18_155_/_0.1)] border border-[oklch(0.72_0.18_155_/_0.2)]" 
                    : "bg-[oklch(0.62_0.22_25_/_0.1)] border border-[oklch(0.62_0.22_25_/_0.2)]"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-[oklch(0.80_0.18_155)]" />
                      <span className="font-semibold text-[oklch(0.80_0.18_155)]">正确!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-6 h-6 text-[oklch(0.70_0.22_25)]" />
                      <span className="font-semibold text-[oklch(0.70_0.22_25)]">
                        {userAnswer.trim() ? '不太对' : '没关系，看看答案'}
                      </span>
                    </>
                  )}
                </div>
                
                {!isCorrect && (
                  <div id="examAnswerPanel" className="mt-4">
                    <p className="text-xs text-white/45 mb-2 font-medium">正确答案：</p>
                    <p className="text-white/95 font-semibold leading-relaxed">{currentSentence.text}</p>
                  </div>
                )}
              </div>

              {/* 下一题 */}
              <button
                id="examNextButton"
                onClick={handleNext}
                className="w-full mt-5 py-4 rounded-2xl text-sm font-semibold glass-button-primary flex items-center justify-center gap-2 transition-premium"
              >
                {currentIndex < learningSentences.length - 1 ? (
                  <>
                    下一题
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  '完成复习'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
