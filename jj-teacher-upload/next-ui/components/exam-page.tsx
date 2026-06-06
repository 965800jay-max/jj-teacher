'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertCircle, ArrowRight, CheckCircle, ChevronLeft, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'

export interface ExamSourceItem {
  id: string
  text: string
  note: string
}

interface BlankRange {
  start: number
  end: number
  answer: string
}

interface BlankQuestion {
  id: string
  chinese: string
  original: string
  blanks: BlankRange[]
}

interface ExamPageProps {
  sentences: ExamSourceItem[]
  title?: string
  onComplete?: () => void
  onBack?: () => void
  onTranslateText?: (text: string) => Promise<string>
}

const stopWords = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being',
  'it', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
  'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their', 'to',
  'of', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but', 'so', 'if', 'as',
  'do', 'does', 'did', 'can', 'could', 'will', 'would', 'should', 'have', 'has',
  'had', 'not', 'no', 'yes', 'there', 'here'
])

const phraseCandidates = [
  'cover the ears',
  'keep some length',
  'grow out',
  'low taper',
  'mid taper',
  'skin fade',
  'soft perm',
  'korean perm',
  'down perm',
  'middle part',
  'side part',
  'two block',
  'wolf cut',
  'natural look',
  'style your hair',
  'hold monday',
  'routine checkup',
  'consultation issue',
  'take a quick look',
  'look at the menu',
  'order delivery',
  'make an appointment',
  'book an appointment',
  'keep it natural',
  'not too short',
  'a little higher',
  'work for you',
  'works well',
  'come back',
  'follow up',
  'recommend',
  'maintain',
  'volume',
  'texture'
]

const valuableWords = new Set([
  'style', 'maintain', 'recommend', 'consultation', 'appointment', 'available',
  'routine', 'checkup', 'issue', 'natural', 'volume', 'texture', 'taper', 'fade',
  'perm', 'bangs', 'sideburns', 'neckline', 'length', 'shorter', 'higher',
  'lower', 'clean', 'cover', 'grow', 'menu', 'delivery', 'reservation', 'spicy',
  'comfort', 'workout', 'machine', 'weight', 'sets', 'recovery', 'protein',
  'flight', 'hotel', 'directions', 'payment', 'receipt', 'recommendation'
])

function isMissingChinesePrompt(value: string) {
  const clean = value.replace(/\s+/g, '').trim()
  return !clean || clean === '中文意思待补充' || clean === '中文待补充' || clean === '待补充'
}

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function countWords(value: string) {
  return value.match(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g)?.length || 0
}

function targetBlankCount(text: string) {
  const words = countWords(text)
  if (words <= 7) return 1
  if (words <= 14) return 2
  return 3
}

function overlaps(a: Pick<BlankRange, 'start' | 'end'>, b: Pick<BlankRange, 'start' | 'end'>) {
  return a.start < b.end && b.start < a.end
}

function addRange(ranges: BlankRange[], range: BlankRange) {
  if (ranges.some((item) => overlaps(item, range))) return false
  ranges.push(range)
  ranges.sort((a, b) => a.start - b.start)
  return true
}

function findPhraseRanges(text: string, limit: number) {
  const ranges: BlankRange[] = []
  const sortedPhrases = [...phraseCandidates].sort((a, b) => b.length - a.length)

  for (const phrase of sortedPhrases) {
    if (ranges.length >= limit) break
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`\\b${escaped.replace(/\s+/g, '\\s+')}\\b`, 'gi')
    const matches = Array.from(text.matchAll(pattern))
    for (const match of matches) {
      if (ranges.length >= limit) break
      const start = match.index ?? -1
      if (start < 0) continue
      addRange(ranges, {
        start,
        end: start + match[0].length,
        answer: match[0]
      })
    }
  }

  return ranges
}

function scoreWord(word: string) {
  const clean = normalizeAnswer(word)
  if (!clean || stopWords.has(clean) || clean.length <= 2) return -100
  let score = clean.length
  if (valuableWords.has(clean)) score += 60
  if (/(ing|ed|er|ion|ment|ity|al|ive)$/.test(clean)) score += 12
  if (/^(style|grow|keep|cover|hold|book|make|order|recommend|maintain|work|need|want|take|look)$/i.test(clean)) score += 20
  return score
}

function buildQuestion(item: ExamSourceItem): BlankQuestion | null {
  const original = item.text.replace(/\s+/g, ' ').trim()
  if (!original) return null

  const limit = targetBlankCount(original)
  const ranges = findPhraseRanges(original, limit)
  const wordMatches = Array.from(original.matchAll(/\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b/g))
    .map((match) => ({
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
      answer: match[0],
      score: scoreWord(match[0])
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)

  for (const match of wordMatches) {
    if (ranges.length >= limit) break
    addRange(ranges, match)
  }

  if (!ranges.length) return null

  return {
    id: item.id,
    chinese: item.note?.trim() || '',
    original,
    blanks: ranges.slice(0, limit).sort((a, b) => a.start - b.start)
  }
}

function renderQuestionInline(
  question: BlankQuestion,
  values: string[],
  status: 'idle' | 'correct' | 'wrong' | 'unknown',
  wrongIndices: Set<number>,
  onChange: (index: number, value: string) => void
) {
  const nodes: ReactNode[] = []
  let cursor = 0

  question.blanks.forEach((blank, index) => {
    if (blank.start > cursor) {
      nodes.push(<span key={`text-${index}-${cursor}`}>{question.original.slice(cursor, blank.start)}</span>)
    }

    const isWrong = status === 'wrong' && wrongIndices.has(index)
    const answerLength = Math.max(blank.answer.length, 7)
    nodes.push(
      <input
        key={`blank-${index}`}
        value={values[index] || ''}
        onChange={(event) => onChange(index, event.target.value)}
        disabled={status !== 'idle'}
        aria-label={`空 ${index + 1}`}
        className={cn(
          "mx-1 inline-flex h-10 min-w-[74px] rounded-xl border bg-black/28 px-2.5 text-center text-[15px] font-semibold text-white/95 outline-none transition-premium align-baseline",
          "placeholder:text-white/20 focus:border-[oklch(0.70_0.15_280_/_0.52)] focus:bg-[oklch(0.70_0.15_280_/_0.10)]",
          status === 'correct' && "border-[oklch(0.72_0.18_155_/_0.46)] bg-[oklch(0.72_0.18_155_/_0.10)]",
          isWrong ? "border-[oklch(0.70_0.22_25_/_0.56)] bg-[oklch(0.62_0.22_25_/_0.12)]" : "border-white/[0.10]"
        )}
        style={{ width: `${Math.min(150, answerLength * 12 + 26)}px` }}
      />
    )
    cursor = blank.end
  })

  if (cursor < question.original.length) {
    nodes.push(<span key="text-tail">{question.original.slice(cursor)}</span>)
  }

  return nodes
}

function HighlightedAnswer({ question }: { question: BlankQuestion }) {
  const nodes: ReactNode[] = []
  let cursor = 0

  question.blanks.forEach((blank, index) => {
    if (blank.start > cursor) {
      nodes.push(<span key={`answer-text-${index}`}>{question.original.slice(cursor, blank.start)}</span>)
    }
    nodes.push(
      <mark
        key={`answer-blank-${index}`}
        className="rounded-lg bg-[oklch(0.70_0.15_280_/_0.22)] px-1.5 py-0.5 text-white"
      >
        {question.original.slice(blank.start, blank.end)}
      </mark>
    )
    cursor = blank.end
  })

  if (cursor < question.original.length) {
    nodes.push(<span key="answer-tail">{question.original.slice(cursor)}</span>)
  }

  return <>{nodes}</>
}

export function ExamPage({ sentences, title = '关键词填空考试', onComplete, onBack, onTranslateText }: ExamPageProps) {
  const questions = useMemo(
    () => sentences.map(buildQuestion).filter(Boolean) as BlankQuestion[],
    [sentences]
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'unknown'>('idle')
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set())
  const [promptCache, setPromptCache] = useState<Record<string, string>>({})
  const [loadingPromptId, setLoadingPromptId] = useState('')
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    setCurrentIndex(0)
    setAnswers([])
    setStatus('idle')
    setWrongIndices(new Set())
  }, [questions.length])

  useEffect(() => {
    if (!currentQuestion) return
    setAnswers(Array.from({ length: currentQuestion.blanks.length }, () => ''))
    setStatus('idle')
    setWrongIndices(new Set())
  }, [currentQuestion?.id])

  useEffect(() => {
    if (!currentQuestion || !onTranslateText) return
    if (!isMissingChinesePrompt(currentQuestion.chinese) || promptCache[currentQuestion.id]) return

    let cancelled = false
    setLoadingPromptId(currentQuestion.id)
    onTranslateText(currentQuestion.original)
      .then((translated) => {
        if (cancelled) return
        const clean = translated.replace(/\s+/g, ' ').trim()
        if (clean && !isMissingChinesePrompt(clean)) {
          setPromptCache((current) => ({
            ...current,
            [currentQuestion.id]: clean
          }))
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingPromptId('')
      })

    return () => {
      cancelled = true
    }
  }, [currentQuestion, onTranslateText, promptCache])

  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
  }, [])

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((current) => {
      const next = [...current]
      next[index] = value
      return next
    })
  }

  const handleNext = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1)
      return
    }

    onComplete?.()
  }

  const handleCheck = () => {
    if (!currentQuestion) return
    const wrong = new Set<number>()
    currentQuestion.blanks.forEach((blank, index) => {
      if (normalizeAnswer(answers[index] || '') !== normalizeAnswer(blank.answer)) {
        wrong.add(index)
      }
    })

    if (!wrong.size) {
      setWrongIndices(new Set())
      setStatus('correct')
      advanceTimerRef.current = setTimeout(handleNext, 750)
      return
    }

    setWrongIndices(wrong)
    setStatus('wrong')
  }

  const handleDontKnow = () => {
    setStatus('unknown')
    setWrongIndices(new Set(currentQuestion?.blanks.map((_, index) => index) || []))
  }

  if (!questions.length) {
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
          <h2 className="text-xl font-semibold text-white/95 mb-3">暂无可考试的句子</h2>
          <p className="text-sm text-white/45 mb-8">当前来源里没有可以挖空的英文句子。</p>
          <button
            onClick={onBack}
            className="px-8 py-4 glass-button text-white/80 rounded-2xl text-sm font-semibold transition-premium"
          >
            返回
          </button>
        </div>
      </section>
    )
  }

  const allFilled = currentQuestion.blanks.every((_, index) => answers[index]?.trim())
  const chinesePrompt = !isMissingChinesePrompt(currentQuestion.chinese)
    ? currentQuestion.chinese
    : promptCache[currentQuestion.id] || (loadingPromptId === currentQuestion.id ? '正在生成中文提示...' : '根据中文意思补全重点词')

  return (
    <section id="examPage" className="px-5 py-5 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-premium font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            返回
          </button>
          <span id="examProgress" className="text-sm text-white/45 font-medium tabular-nums">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[oklch(0.70_0.15_280)] to-[oklch(0.65_0.13_280)] transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_oklch(0.70_0.15_280_/_0.4)]"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative glass-card rounded-3xl p-5 overflow-visible">
        <div className="inner-glow rounded-3xl" />
        <div className="top-highlight" />

        <div className="relative">
          <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.15em] uppercase mb-2">
            {title}
          </p>
          <h2 id="examPrompt" className="text-lg font-semibold text-white/95 mb-6 leading-relaxed">
            {chinesePrompt}
          </h2>

          <div
            id="keywordBlankQuestion"
            className="rounded-3xl border border-white/[0.07] bg-black/22 px-4 py-4 text-[17px] font-semibold leading-[2.65rem] text-white/92"
          >
            {renderQuestionInline(currentQuestion, answers, status, wrongIndices, handleAnswerChange)}
          </div>

          {status === 'wrong' && (
            <div id="examFeedback" className="mt-4 rounded-2xl border border-[oklch(0.62_0.22_25_/_0.24)] bg-[oklch(0.62_0.22_25_/_0.10)] px-4 py-3 animate-scale-in">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[oklch(0.72_0.20_25)]">
                <AlertCircle className="h-4 w-4" />
                有空不太对
              </div>
              <div className="space-y-1.5 text-xs text-white/60">
                {currentQuestion.blanks.map((blank, index) => wrongIndices.has(index) && (
                  <p key={index}>
                    空{index + 1} 正确答案：
                    <span className="font-semibold text-white/90">{blank.answer}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {status === 'correct' && (
            <div id="examFeedback" className="mt-4 flex items-center gap-2 rounded-2xl border border-[oklch(0.72_0.18_155_/_0.24)] bg-[oklch(0.72_0.18_155_/_0.10)] px-4 py-3 text-sm font-semibold text-[oklch(0.80_0.18_155)] animate-scale-in">
              <CheckCircle className="h-5 w-5" />
              正确，马上进入下一题
            </div>
          )}

          {status === 'unknown' && (
            <div id="examAnswerPanel" className="mt-4 rounded-2xl border border-[oklch(0.70_0.15_280_/_0.20)] bg-[oklch(0.70_0.15_280_/_0.08)] px-4 py-4 animate-scale-in">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[oklch(0.70_0.15_280)]">完整答案</p>
              <p className="text-[15px] font-semibold leading-relaxed text-white/92">
                <HighlightedAnswer question={currentQuestion} />
              </p>
              <p className="mt-3 border-t border-white/[0.06] pt-3 text-xs leading-relaxed text-white/50">
                {chinesePrompt}
              </p>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            {status === 'idle' ? (
              <>
                <button
                  id="examCheckButton"
                  onClick={handleCheck}
                  disabled={!allFilled}
                  className={cn(
                    "flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-premium",
                    allFilled ? "glass-button-primary" : "glass-button text-white/35"
                  )}
                >
                  检查
                </button>
                <button
                  id="examDontKnowButton"
                  onClick={handleDontKnow}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold glass-button text-white/60 hover:text-white/85 transition-premium"
                >
                  我不会
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => speakEnglish(currentQuestion.original, { mode: 'sentence' })}
                  className="h-12 w-12 shrink-0 rounded-2xl glass-button text-white/60 flex items-center justify-center hover:text-white transition-premium"
                  aria-label="朗读完整句子"
                >
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
                <button
                  id="examNextButton"
                  onClick={handleNext}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold glass-button-primary flex items-center justify-center gap-2 transition-premium"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>
                      下一题
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    '完成考试'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
