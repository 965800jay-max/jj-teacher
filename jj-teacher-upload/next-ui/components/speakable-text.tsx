'use client'

import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'

interface SpeakableTextProps {
  text: string
  rate?: number
  className?: string
  wordClassName?: string
  punctuationClassName?: string
}

const TOKEN_PATTERN = /[A-Za-z]+(?:['’][A-Za-z]+)?|\d+(?:[.,]\d+)?|[^\w\s]+|\s+/g

function getTokens(text: string) {
  return text.match(TOKEN_PATTERN) || [text]
}

function cleanToken(token: string) {
  return token.replace(/[“”"()[\]{}.,!?;:，。！？；：]/g, '').trim()
}

export function SpeakableText({
  text,
  rate = 1,
  className,
  wordClassName,
  punctuationClassName
}: SpeakableTextProps) {
  return (
    <span className={cn('inline', className)}>
      {getTokens(text).map((token, index) => {
        if (/^\s+$/.test(token)) return <span key={index}> </span>

        const clean = cleanToken(token)
        const isWord = /^[A-Za-z]+(?:['’][A-Za-z]+)?$/.test(clean)
        if (!isWord) {
          return (
            <span key={index} className={cn('text-white/45', punctuationClassName)}>
              {token}
            </span>
          )
        }

        return (
          <button
            key={index}
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              speakEnglish(clean.replace(/’/g, "'"), { mode: 'word', rate })
            }}
            className={cn(
              'inline rounded-lg px-1 -mx-1 text-left transition-premium hover:bg-[oklch(0.70_0.15_280_/_0.1)] hover:text-[oklch(0.80_0.15_280)]',
              wordClassName
            )}
          >
            {token}
          </button>
        )
      })}
    </span>
  )
}
