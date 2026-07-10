import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const CDP_URL = process.env.JULEBU_CDP_URL || 'http://127.0.0.1:9223'
const HOMEPAGE_PATH = path.resolve('data/old-site/mall-homepage.json')
const OUT_PATH = path.resolve('data/old-site/acquired-packs.json')

async function main() {
  const homepage = JSON.parse(await fs.readFile(HOMEPAGE_PATH, 'utf8'))
  const packMap = new Map()
  for (const section of homepage.sections || []) {
    for (const pack of section.coursePacks || []) packMap.set(pack.id, pack)
  }
  const packs = Array.from(packMap.values())
  const browser = await chromium.connectOverCDP(CDP_URL)
  const context = browser.contexts()[0]
  const page = await context.newPage()
  const results = []

  for (const [index, pack] of packs.entries()) {
    await page.goto(`https://julebu.ai/mall/${pack.id}`, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(2200)
    const acquireButton = page.getByRole('button', { name: /^获取课程包$/ })
    const buttonCount = await acquireButton.count()

    if (!buttonCount) {
      const text = await page.locator('body').innerText().catch(() => '')
      const status = text.includes('已获取') || text.includes('开始学习') ? 'already-acquired' : 'no-acquire-button'
      results.push({ id: pack.id, title: pack.title, status })
      console.log(`${String(index + 1).padStart(2, '0')}. ${pack.title}: ${status}`)
      continue
    }

    const createResponse = page
      .waitForResponse((response) => response.url().includes('userCoursePacks.create') && response.status() === 200, { timeout: 30000 })
      .catch(() => null)
    await acquireButton.first().click()
    const response = await createResponse
    await page.waitForTimeout(1600)
    const text = await page.locator('body').innerText().catch(() => '')
    const status = response || text.includes('已获取') || text.includes('获取成功') ? 'acquired' : 'unknown'
    results.push({ id: pack.id, title: pack.title, status })
    console.log(`${String(index + 1).padStart(2, '0')}. ${pack.title}: ${status}`)
  }

  await fs.writeFile(OUT_PATH, JSON.stringify(results, null, 2))
  await page.close().catch(() => {})
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error)
  process.exit(1)
})
