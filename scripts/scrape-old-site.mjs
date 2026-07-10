import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const CDP_URL = process.env.JULEBU_CDP_URL || 'http://127.0.0.1:9223'
const COURSE_PACK_ID = process.env.JULEBU_COURSE_PACK_ID || 'rwtocajplud9ld732ep5u8ec'
const OUT_DIR = path.resolve('data/old-site')
const MODE = 'chinese_to_english'
const PRESET_KEY = 'advanced'

function encodeInput(input) {
  return encodeURIComponent(JSON.stringify(input))
}

async function trpcGet(page, procedure, input) {
  const url = `https://api.julebu.ai/trpc/${procedure}?batch=1&input=${encodeInput(input)}`
  const result = await page.evaluate(async (requestUrl) => {
    const response = await fetch(requestUrl, { credentials: 'include' })
    return {
      ok: response.ok,
      status: response.status,
      text: await response.text(),
    }
  }, url)

  if (!result.ok) {
    throw new Error(`${procedure} failed: ${result.status} ${result.text.slice(0, 300)}`)
  }

  return JSON.parse(result.text)
}

function parseTrpcBatch(text, procedure) {
  const parsed = JSON.parse(text)
  const payload = parsed[0]?.result?.data?.json
  if (!payload) {
    throw new Error(`Could not parse ${procedure} response`)
  }
  return payload
}

function normalizeStatements(detail) {
  return [...(detail?.statements || [])].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0
    const orderB = typeof b.order === 'number' ? b.order : 0
    return orderA - orderB
  })
}

async function captureCourseFromGame(page, course) {
  const audioRequests = []
  const onResponse = (response) => {
    const url = response.url()
    if (!url.includes('/api/audio') && !url.includes('audio.julebu.ai')) return

    audioRequests.push({
      url,
      status: response.status(),
      contentType: response.headers()['content-type'] || '',
    })
  }

  page.on('response', onResponse)

  try {
    const gameUrl = `https://julebu.ai/game/course/${COURSE_PACK_ID}/${course.id}?mode=${MODE}&presetKey=${PRESET_KEY}`
    const detailPromise = page.waitForResponse(
      (response) => response.url().includes('/trpc/courses.findOne') && response.status() === 200,
      { timeout: 45000 },
    )
    const learningPromise = page
      .waitForResponse(
        (response) => response.url().includes('/trpc/courses.findCourseLearningContent') && response.status() === 200,
        { timeout: 45000 },
      )
      .catch(() => null)

    await page.goto(gameUrl, { waitUntil: 'domcontentloaded', timeout: 45000 })

    const detailResponse = await detailPromise
    const learningResponse = await learningPromise

    const detail = parseTrpcBatch(await detailResponse.text(), 'courses.findOne')
    const learningContent = learningResponse
      ? parseTrpcBatch(await learningResponse.text(), 'courses.findCourseLearningContent')
      : { overview: '', sentences: [] }

    await page.waitForTimeout(1200)

    const statements = normalizeStatements(detail)
    return {
      id: course.id,
      order: course.order,
      title: course.title,
      description: course.description,
      type: course.type,
      isLocked: course.isLocked,
      mode: MODE,
      presetKey: PRESET_KEY,
      statementCount: statements.length,
      sentenceCount: learningContent?.sentences?.length || 0,
      overview: learningContent?.overview || '',
      sentences: learningContent?.sentences || [],
      statements,
      audioRequests,
    }
  } finally {
    page.off('response', onResponse)
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.connectOverCDP(CDP_URL)
  const context = browser.contexts()[0]
  const page = context.pages().find((candidate) => candidate.url().includes('julebu.ai')) || context.pages()[0]
  await page.goto('https://julebu.ai/home/')
  await page.waitForLoadState('networkidle').catch(() => {})

  const packResponse = await trpcGet(page, 'userCoursePacks.findOne', {
    0: { json: COURSE_PACK_ID },
  })
  const pack = packResponse[0]?.result?.data?.json
  if (!pack?.courses?.length) {
    throw new Error('No courses found in course pack response')
  }

  const courses = [...pack.courses].sort((a, b) => a.order - b.order)
  const courseContents = []

  for (const course of courses) {
    try {
      const captured = await captureCourseFromGame(page, course)
      courseContents.push(captured)
      console.log(
        `${String(course.order).padStart(2, '0')}. ${course.title}: ${captured.statementCount} statements, ${captured.sentenceCount} reading items`,
      )
    } catch (error) {
      courseContents.push({
        id: course.id,
        order: course.order,
        title: course.title,
        description: course.description,
        type: course.type,
        isLocked: course.isLocked,
        error: error.message,
        statementCount: 0,
        sentenceCount: 0,
        overview: '',
        sentences: [],
        statements: [],
        audioRequests: [],
      })
      console.error(`${String(course.order).padStart(2, '0')}. ${course.title}: ${error.message}`)
    }
  }

  const output = {
    capturedAt: new Date().toISOString(),
    source: 'https://julebu.ai',
    coursePack: {
      id: pack.id,
      title: pack.title,
      description: pack.description,
      cover: pack.cover,
      courseCount: courses.length,
      mode: MODE,
      presetKey: PRESET_KEY,
    },
    courses: courseContents,
  }

  const outputPath = path.join(OUT_DIR, 'xingrong-zero.json')
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2))
  console.log(`Saved ${outputPath}`)

  if (typeof browser.disconnect === 'function') {
    browser.disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
