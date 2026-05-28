const fs = require('fs')
const path = require('path')

const sharp = require('../next-ui/node_modules/sharp')

const root = path.resolve(__dirname, '..')

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function channelToHex(value) {
  const clamped = Math.max(0, Math.min(255, Math.round(value)))
  return clamped.toString(16).padStart(2, '0').toUpperCase()
}

function oklchToHex(lightness, chroma, hueDegrees) {
  const hue = (hueDegrees * Math.PI) / 180
  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)

  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b

  const l = lPrime ** 3
  const m = mPrime ** 3
  const s = sPrime ** 3

  const linearR = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const linearG = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const linearB = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const toSrgb = (value) => {
    const clamped = Math.max(0, Math.min(1, value))
    return clamped <= 0.0031308
      ? 12.92 * clamped * 255
      : (1.055 * clamped ** (1 / 2.4) - 0.055) * 255
  }

  return `#${channelToHex(toSrgb(linearR))}${channelToHex(toSrgb(linearG))}${channelToHex(toSrgb(linearB))}`
}

const colors = {
  bg: '#030308',
  bg2: '#090615',
  bg3: '#120A24',
  accent: oklchToHex(0.70, 0.15, 280),
  accentBright: oklchToHex(0.80, 0.15, 280),
  accentDeep: oklchToHex(0.55, 0.18, 300),
  white: '#F7F2FF',
}

function iconSvg(size, options = {}) {
  const roundRadius = options.round ? 512 : 228
  const bgShape = options.round
    ? `<circle cx="512" cy="512" r="512" fill="url(#iconBg)" />`
    : `<rect width="1024" height="1024" rx="${roundRadius}" fill="url(#iconBg)" />`

  return `
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="iconBg" cx="32%" cy="20%" r="86%">
      <stop offset="0%" stop-color="${colors.bg3}" />
      <stop offset="44%" stop-color="${colors.bg2}" />
      <stop offset="100%" stop-color="${colors.bg}" />
    </radialGradient>
    <linearGradient id="brandStroke" x1="302" y1="282" x2="728" y2="704" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${colors.accentBright}" />
      <stop offset="54%" stop-color="${colors.accent}" />
      <stop offset="100%" stop-color="${colors.accentDeep}" />
    </linearGradient>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="20" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.48 0 0 0 0 0.34 0 0 0 0 1 0 0 0 0.95 0" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  ${bgShape}
  <circle cx="512" cy="508" r="280" fill="${colors.accent}" opacity="0.08" />
  <circle cx="512" cy="508" r="214" fill="${colors.accentDeep}" opacity="0.08" />
  <g opacity="0.26">
    <circle cx="256" cy="236" r="5" fill="${colors.accentBright}" />
    <circle cx="814" cy="316" r="4" fill="${colors.white}" />
    <circle cx="742" cy="786" r="3" fill="${colors.accent}" />
  </g>
  <g filter="url(#softGlow)">
    <path d="M352 392C352 332 400 296 466 296H594C660 296 708 338 708 400V506C708 568 660 610 594 610H514L424 680C404 696 376 680 382 654L394 610C368 606 352 584 352 546V392Z"
      fill="${colors.bg}" fill-opacity="0.34" stroke="url(#brandStroke)" stroke-width="46" stroke-linejoin="round" />
    <path d="M444 414H604L438 516H612"
      fill="none" stroke="${colors.white}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M684 312L704 354L746 374L704 394L684 436L664 394L622 374L664 354L684 312Z"
      fill="${colors.accentBright}" opacity="0.9" />
  </g>
</svg>`.trim()
}

function foregroundSvg(size) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brandStroke" x1="302" y1="282" x2="728" y2="704" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${colors.accentBright}" />
      <stop offset="54%" stop-color="${colors.accent}" />
      <stop offset="100%" stop-color="${colors.accentDeep}" />
    </linearGradient>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="20" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.48 0 0 0 0 0.34 0 0 0 0 1 0 0 0 0.95 0" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <g filter="url(#softGlow)">
    <path d="M352 392C352 332 400 296 466 296H594C660 296 708 338 708 400V506C708 568 660 610 594 610H514L424 680C404 696 376 680 382 654L394 610C368 606 352 584 352 546V392Z"
      fill="${colors.bg}" fill-opacity="0.18" stroke="url(#brandStroke)" stroke-width="46" stroke-linejoin="round" />
    <path d="M444 414H604L438 516H612"
      fill="none" stroke="${colors.white}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M684 312L704 354L746 374L704 394L684 436L664 394L622 374L664 354L684 312Z"
      fill="${colors.accentBright}" opacity="0.9" />
  </g>
</svg>`.trim()
}

function splashSvg(width, height) {
  const min = Math.min(width, height)
  const isPortrait = height >= width
  const centerX = Math.round(isPortrait ? width / 2 : width * 0.35)
  const logoSize = Math.round(min * (isPortrait ? 0.34 : 0.28))
  const logoX = Math.round(centerX - logoSize / 2)
  const logoY = Math.round(height * (isPortrait ? 0.28 : 0.27))
  const tiny = Math.max(1, Math.round(min / 360))
  const titleY = Math.round(height * (isPortrait ? 0.17 : 0.14))
  const subtitleY = titleY + Math.round(min * 0.09)
  const statusY = Math.round(logoY + logoSize + min * (isPortrait ? 0.12 : 0.10))
  const cardWidth = Math.round(isPortrait ? Math.min(width * 0.74, min * 0.78) : Math.min(width * 0.40, min * 0.74))
  const cardHeight = Math.round(min * 0.11)
  const cardX = Math.round(isPortrait ? (width - cardWidth) / 2 : width * 0.56)
  const cardGap = Math.round(min * 0.035)
  const cardY = Math.round(isPortrait
    ? Math.min(statusY + min * 0.08, height - cardHeight * 3 - cardGap * 2 - min * 0.11)
    : height * 0.30)
  const titleSize = Math.max(24, Math.round(min * 0.085))
  const eyebrowSize = Math.max(10, Math.round(min * 0.032))
  const bodySize = Math.max(12, Math.round(min * 0.042))
  const cardTitleSize = Math.max(12, Math.round(min * 0.040))
  const cardSubSize = Math.max(9, Math.round(min * 0.028))
  const dotSize = Math.max(7, Math.round(min * 0.025))

  const card = (index, title, subtitle) => {
    const y = cardY + index * (cardHeight + cardGap)
    return `
  <g transform="translate(${cardX} ${y})">
    <rect width="${cardWidth}" height="${cardHeight}" rx="${Math.round(cardHeight * 0.36)}" fill="${colors.accent}" fill-opacity="0.055" stroke="${colors.accent}" stroke-opacity="0.18" />
    <circle cx="${Math.round(cardHeight * 0.48)}" cy="${Math.round(cardHeight / 2)}" r="${dotSize}" fill="${colors.accentBright}" fill-opacity="0.88" />
    <text x="${Math.round(cardHeight * 0.88)}" y="${Math.round(cardHeight * 0.45)}" fill="${colors.white}" fill-opacity="0.88" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif" font-size="${cardTitleSize}" font-weight="700">${title}</text>
    <text x="${Math.round(cardHeight * 0.88)}" y="${Math.round(cardHeight * 0.73)}" fill="${colors.white}" fill-opacity="0.42" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif" font-size="${cardSubSize}" font-weight="500">${subtitle}</text>
  </g>`
  }

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="screenBg" cx="50%" cy="42%" r="86%">
      <stop offset="0%" stop-color="${colors.bg3}" />
      <stop offset="45%" stop-color="${colors.bg2}" />
      <stop offset="100%" stop-color="${colors.bg}" />
    </radialGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.22" />
      <stop offset="54%" stop-color="${colors.accentDeep}" stop-opacity="0.06" />
      <stop offset="100%" stop-color="${colors.bg}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="brandStroke" x1="302" y1="282" x2="728" y2="704" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${colors.accentBright}" />
      <stop offset="54%" stop-color="${colors.accent}" />
      <stop offset="100%" stop-color="${colors.accentDeep}" />
    </linearGradient>
    <filter id="softGlow" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="22" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.48 0 0 0 0 0.34 0 0 0 0 1 0 0 0 0.9 0" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#screenBg)" />
  <circle cx="${width / 2}" cy="${height / 2}" r="${Math.round(min * 0.58)}" fill="url(#centerGlow)" />
  <circle cx="${centerX}" cy="${logoY + Math.round(logoSize / 2)}" r="${Math.round(logoSize * 0.92)}" fill="${colors.accent}" opacity="0.045" />
  <g opacity="0.32">
    <circle cx="${Math.round(width * 0.17)}" cy="${Math.round(height * 0.22)}" r="${tiny}" fill="${colors.accentBright}" />
    <circle cx="${Math.round(width * 0.78)}" cy="${Math.round(height * 0.28)}" r="${tiny}" fill="${colors.white}" />
    <circle cx="${Math.round(width * 0.24)}" cy="${Math.round(height * 0.72)}" r="${tiny}" fill="${colors.white}" />
    <circle cx="${Math.round(width * 0.70)}" cy="${Math.round(height * 0.78)}" r="${tiny}" fill="${colors.accent}" />
  </g>
  <text x="${centerX}" y="${titleY}" text-anchor="middle" fill="${colors.accentBright}" fill-opacity="0.95" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif" font-size="${eyebrowSize}" font-weight="800" letter-spacing="${Math.max(2, Math.round(min * 0.012))}">AI TUTOR</text>
  <text x="${centerX}" y="${subtitleY}" text-anchor="middle" fill="${colors.white}" fill-opacity="0.96" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif" font-size="${titleSize}" font-weight="760">智语导师</text>
  <g transform="translate(${logoX} ${logoY}) scale(${logoSize / 1024})" filter="url(#softGlow)">
    <rect width="1024" height="1024" rx="228" fill="${colors.bg}" fill-opacity="0.72" stroke="${colors.accent}" stroke-opacity="0.28" stroke-width="12" />
    <circle cx="512" cy="508" r="280" fill="${colors.accent}" opacity="0.08" />
    <path d="M352 392C352 332 400 296 466 296H594C660 296 708 338 708 400V506C708 568 660 610 594 610H514L424 680C404 696 376 680 382 654L394 610C368 606 352 584 352 546V392Z"
      fill="${colors.bg}" fill-opacity="0.24" stroke="url(#brandStroke)" stroke-width="46" stroke-linejoin="round" />
    <path d="M444 414H604L438 516H612"
      fill="none" stroke="${colors.white}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M684 312L704 354L746 374L704 394L684 436L664 394L622 374L664 354L684 312Z"
      fill="${colors.accentBright}" opacity="0.9" />
  </g>
  <text x="${centerX}" y="${statusY}" text-anchor="middle" fill="${colors.white}" fill-opacity="0.66" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif" font-size="${bodySize}" font-weight="600">正在准备你的英语练习</text>
  ${card(0, '自然表达', '像朋友聊天一样学英语')}
  ${card(1, '长期记忆', '记住你的习惯和偏好')}
  ${card(2, '场景复习', '句读、单词、场景同步准备')}
</svg>`.trim()
}

async function writePng(filePath, svg, width, height = width) {
  ensureDir(filePath)
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(filePath)
}

async function main() {
  const densityIcons = [
    ['mdpi', 48, 108],
    ['hdpi', 72, 162],
    ['xhdpi', 96, 216],
    ['xxhdpi', 144, 324],
    ['xxxhdpi', 192, 432],
  ]

  for (const [density, iconSize, foregroundSize] of densityIcons) {
    const dir = path.join(root, 'android/app/src/main/res', `mipmap-${density}`)
    await writePng(path.join(dir, 'ic_launcher.png'), iconSvg(iconSize), iconSize)
    await writePng(path.join(dir, 'ic_launcher_round.png'), iconSvg(iconSize, { round: true }), iconSize)
    await writePng(path.join(dir, 'ic_launcher_foreground.png'), foregroundSvg(foregroundSize), foregroundSize)
  }

  const webSvg = iconSvg(180)
  fs.writeFileSync(path.join(root, 'next-ui/public/icon.svg'), `${webSvg}\n`)
  await writePng(path.join(root, 'next-ui/public/apple-icon.png'), iconSvg(180), 180)
  await writePng(path.join(root, 'next-ui/public/icon-dark-32x32.png'), iconSvg(32), 32)
  await writePng(path.join(root, 'next-ui/public/icon-light-32x32.png'), iconSvg(32), 32)
  await writePng(path.join(root, 'JJTeacher-icon.png'), iconSvg(1024), 1024)
  await writePng(path.join(root, 'preview.png'), iconSvg(1024), 1024)
  await writePng(path.join(root, 'www/preview.png'), iconSvg(1024), 1024)

  const splashTargets = [
    ['android/app/src/main/res/drawable/splash.png', 480, 320],
    ['android/app/src/main/res/drawable-port-mdpi/splash.png', 320, 480],
    ['android/app/src/main/res/drawable-port-hdpi/splash.png', 480, 800],
    ['android/app/src/main/res/drawable-port-xhdpi/splash.png', 720, 1280],
    ['android/app/src/main/res/drawable-port-xxhdpi/splash.png', 960, 1600],
    ['android/app/src/main/res/drawable-port-xxxhdpi/splash.png', 1280, 1920],
    ['android/app/src/main/res/drawable-land-mdpi/splash.png', 480, 320],
    ['android/app/src/main/res/drawable-land-hdpi/splash.png', 800, 480],
    ['android/app/src/main/res/drawable-land-xhdpi/splash.png', 1280, 720],
    ['android/app/src/main/res/drawable-land-xxhdpi/splash.png', 1600, 960],
    ['android/app/src/main/res/drawable-land-xxxhdpi/splash.png', 1920, 1280],
  ]

  for (const [target, width, height] of splashTargets) {
    await writePng(path.join(root, target), splashSvg(width, height), width, height)
  }

  console.log(JSON.stringify(colors, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
