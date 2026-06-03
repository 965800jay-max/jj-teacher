export interface WordLookup {
  word: string
  phonetic: string
  meaning: string
  example: string
  exampleZh: string
}

export interface VocabBookItem extends WordLookup {
  addedAt: number
}

export const WORD_CACHE_KEY = 'sentence-reader-word-cache'
export const VOCAB_BOOK_KEY = 'sentence-reader-vocab-book'
export const VOCAB_BOOK_EVENT = 'sentence-reader-vocab-book-updated'
export const ADD_WORD_EXAMPLE_EVENT = 'sentence-reader-add-word-example'

function hasStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (!hasStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function normalizeWordValue(word: string) {
  return String(word || '')
    .replace(/[“”"()[\]{}.,!?;:，。！？；：]/g, '')
    .replace(/’/g, "'")
    .trim()
    .toLowerCase()
}

function normalizeLookup(value: Partial<WordLookup> & Record<string, unknown>): WordLookup | null {
  const word = normalizeWordValue(String(value.word || ''))
  if (!word) return null
  return {
    word,
    phonetic: String(value.phonetic || '').trim(),
    meaning: String(value.meaning || '').trim(),
    example: String(value.example || '').trim(),
    exampleZh: String(value.exampleZh || '').trim()
  }
}

export function getCachedWord(word: string) {
  const key = normalizeWordValue(word)
  if (!key) return null
  const cache = readJson<Record<string, WordLookup>>(WORD_CACHE_KEY, {})
  const item = cache[key]
  return item ? normalizeLookup(item as Partial<WordLookup> & Record<string, unknown>) : null
}

export function cacheWord(item: WordLookup) {
  const clean = normalizeLookup(item as Partial<WordLookup> & Record<string, unknown>)
  if (!clean) return
  const cache = readJson<Record<string, WordLookup>>(WORD_CACHE_KEY, {})
  cache[clean.word] = clean
  writeJson(WORD_CACHE_KEY, cache)
}

export function getVocabBook() {
  const list = readJson<unknown[]>(VOCAB_BOOK_KEY, [])
  const seen = new Set<string>()
  const items: VocabBookItem[] = []
  for (const value of list) {
    const source = value && typeof value === 'object' ? value as Partial<VocabBookItem> & Record<string, unknown> : {}
    const clean = normalizeLookup(source)
    if (!clean || seen.has(clean.word)) continue
    seen.add(clean.word)
    items.push({
      ...clean,
      addedAt: typeof source.addedAt === 'number' ? source.addedAt : Date.now()
    })
  }
  return items.sort((a, b) => b.addedAt - a.addedAt)
}

export function notifyVocabBookChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(VOCAB_BOOK_EVENT))
}

export function addVocabBookItem(item: WordLookup) {
  const clean = normalizeLookup(item as Partial<WordLookup> & Record<string, unknown>)
  if (!clean) return
  const current = getVocabBook().filter((entry) => entry.word !== clean.word)
  writeJson(VOCAB_BOOK_KEY, [{ ...clean, addedAt: Date.now() }, ...current])
  notifyVocabBookChanged()
}

export function removeVocabBookItem(word: string) {
  const key = normalizeWordValue(word)
  if (!key) return
  writeJson(VOCAB_BOOK_KEY, getVocabBook().filter((entry) => entry.word !== key))
  notifyVocabBookChanged()
}

export function hasVocabBookItem(word: string) {
  const key = normalizeWordValue(word)
  return Boolean(key && getVocabBook().some((entry) => entry.word === key))
}
