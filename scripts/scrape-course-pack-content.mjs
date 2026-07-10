import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const CDP_URL = process.env.JULEBU_CDP_URL || 'http://127.0.0.1:9223'
const DETAILS_DIR = path.resolve('data/old-site/mall-details')
const OUT_DIR = path.resolve('data/old-site/course-packs')
const MODE = 'chinese_to_english'
const PRESET_KEY = 'advanced'
const PACK_IDS = process.env.PACK_IDS ? process.env.PACK_IDS.split(',').map((item) => item.trim()).filter(Boolean) : null
const COURSE_LIMIT = Number(process.env.COURSE_LIMIT || 0)
const RESPONSE_TIMEOUT = Number(process.env.RESPONSE_TIMEOUT || 25000)
const SETTLE_WAIT = Number(process.env.SETTLE_WAIT || 250)

function parseTrpcBatch(text, procedure) {
  const parsed = JSON.parse(text)
  const payload = parsed.at(-1)?.result?.data?.json || parsed[0]?.result?.data?.json
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

async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

async function getPackDetails() {
  const index = await readJson(path.join(DETAILS_DIR, 'index.json'), [])
  const details = []
  for (const item of index) {
    if (PACK_IDS && !PACK_IDS.includes(item.id)) continue
    const detail = await readJson(path.join(DETAILS_DIR, `${item.id}.json`))
    if (detail?.id) details.push(detail)
  }
  return details
}

async function captureCourse(page, pack, course) {
  const gameUrl = `https://julebu.ai/game/course/${pack.id}/${course.id}?mode=${MODE}&presetKey=${PRESET_KEY}`
  const detailPromise = page.waitForResponse(
    (response) => response.url().includes('/trpc/courses.findOne') && response.status() === 200,
    { timeout: RESPONSE_TIMEOUT },
  )
  const learningPromise = page
    .waitForResponse(
      (response) => response.url().includes('/trpc/courses.findCourseLearningContent') && response.status() === 200,
      { timeout: RESPONSE_TIMEOUT },
    )
    .catch(() => null)

  await page.goto(gameUrl, { waitUntil: 'domcontentloaded', timeout: 45000 })
  const detailResponse = await detailPromise
  const learningResponse = await learningPromise
  const detail = parseTrpcBatch(await detailResponse.text(), 'courses.findOne')
  const learningContent = learningResponse
    ? parseTrpcBatch(await learningResponse.text(), 'courses.findCourseLearningContent')
    : { overview: '', sentences: [] }
  await page.waitForTimeout(SETTLE_WAIT)

  const statements = normalizeStatements(detail)
  return {
    id: course.id,
    order: course.order,
    title: course.title,
    description: course.description,
    type: course.type,
    isLocked: course.isLocked,
    mediaUrl: course.mediaUrl,
    image: course.image,
    mode: MODE,
    presetKey: PRESET_KEY,
    statementCount: statements.length,
    sentenceCount: learningContent?.sentences?.length || 0,
    overview: learningContent?.overview || '',
    sentences: learningContent?.sentences || [],
    statements,
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })
  const details = await getPackDetails()
  if (!details.length) throw new Error('No course pack details found')

  const browser = await chromium.connectOverCDP(CDP_URL)
  const context = browser.contexts()[0]
  const page = await context.newPage()

  for (const pack of details) {
    const outPath = path.join(OUT_DIR, `${pack.id}.json`)
    const existing = await readJson(outPath, null)
    const existingCourses = new Map((existing?.courses || []).map((course) => [course.id, course]))
    const sortedCourses = [...(pack.courses || [])].sort((a, b) => a.order - b.order)
    const coursesToScrape = COURSE_LIMIT ? sortedCourses.slice(0, COURSE_LIMIT) : sortedCourses
    const output = existing || {
      capturedAt: new Date().toISOString(),
      source: 'https://julebu.ai',
      coursePack: {
        id: pack.id,
        title: pack.title,
        description: pack.description,
        cover: pack.cover,
        author: pack.author,
        usageCount: pack.usageCount,
        freeTrialCourseCount: pack.freeTrialCourseCount,
        courseCount: sortedCourses.length,
        mode: MODE,
        presetKey: PRESET_KEY,
      },
      courses: [],
    }

    console.log(`\n${pack.title} (${coursesToScrape.length}/${sortedCourses.length})`)

    for (const course of coursesToScrape) {
      if (existingCourses.has(course.id) && !existingCourses.get(course.id).error) {
        console.log(`- ${course.order}. ${course.title}: skip`)
        continue
      }

      let captured
      try {
        captured = await captureCourse(page, pack, course)
        console.log(`- ${course.order}. ${course.title}: ${captured.statementCount} statements`)
      } catch (error) {
        captured = {
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
        }
        console.error(`- ${course.order}. ${course.title}: ${error.message}`)
      }

      const withoutCourse = output.courses.filter((item) => item.id !== course.id)
      withoutCourse.push(captured)
      output.courses = withoutCourse.sort((a, b) => a.order - b.order)
      output.capturedAt = new Date().toISOString()
      await fs.writeFile(outPath, JSON.stringify(output, null, 2))
    }
  }

  await page.close().catch(() => {})
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error)
  process.exit(1)
})
