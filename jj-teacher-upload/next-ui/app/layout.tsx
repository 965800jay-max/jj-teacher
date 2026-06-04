import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '智语导师 - 让英语表达更自然',
  description: '把真实生活里的中文想法，变成自然英文句子，并能反复听、保存、复习',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0a14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'overlays-content',
}

const stableViewportScript = `
(function () {
  var root = document.documentElement;
  var lastWidth = window.innerWidth;
  function hasTextFocus() {
    var el = document.activeElement;
    if (!el) return false;
    var tag = String(el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  }
  function setStableHeight(force) {
    if (!force && hasTextFocus()) return;
    var height = window.innerHeight || document.documentElement.clientHeight;
    if (height > 0) root.style.setProperty('--zhiyu-app-height', height + 'px');
  }
  setStableHeight(true);
  window.addEventListener('resize', function () {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      window.setTimeout(function () { setStableHeight(true); }, 80);
    }
  }, { passive: true });
  window.addEventListener('orientationchange', function () {
    window.setTimeout(function () { setStableHeight(true); }, 300);
  }, { passive: true });
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="bg-background">
      <body className="font-sans antialiased min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: stableViewportScript }} />
        {children}
      </body>
    </html>
  )
}
