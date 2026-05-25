'use client'

import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: 'sentences' | 'scenes' | 'teacher'
  onTabChange: (tab: 'sentences' | 'scenes' | 'teacher') => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'sentences' as const, label: '句读', english: 'Sentences' },
    { id: 'scenes' as const, label: '单词/场景', english: 'Words' },
    { id: 'teacher' as const, label: '智语导师', english: 'Tutor' }
  ]

  return (
    <nav 
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
    >
      {/* 高级玻璃背景 */}
      <div className="absolute inset-0 glass-nav" />
      
      {/* 顶部光线 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative max-w-[520px] mx-auto flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${tab.id}Nav`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-4 transition-premium relative group"
            )}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {/* 活跃指示器 - 顶部光线 */}
            <div className={cn(
              "absolute top-0 w-16 h-[2px] rounded-full transition-all duration-500",
              activeTab === tab.id 
                ? "opacity-100 bg-gradient-to-r from-transparent via-[oklch(0.70_0.15_280)] to-transparent shadow-[0_0_12px_oklch(0.70_0.15_280_/_0.5)]" 
                : "opacity-0"
            )} />
            
            {/* 背景高亮 - 渐变紫光 */}
            <div className={cn(
              "absolute inset-x-2 inset-y-1 rounded-2xl transition-all duration-400 overflow-hidden",
              activeTab === tab.id 
                ? "bg-gradient-to-b from-[oklch(0.70_0.15_280_/_0.15)] via-[oklch(0.55_0.18_300_/_0.08)] to-transparent shadow-[0_0_20px_oklch(0.65_0.18_290_/_0.08)]" 
                : "bg-transparent group-hover:bg-white/[0.03]"
            )} />
            
            <span className={cn(
              "relative text-[15px] tracking-wide transition-all duration-300",
              activeTab === tab.id 
                ? "font-semibold text-white" 
                : "font-medium text-white/40 group-hover:text-white/60"
            )}>
              {tab.label}
            </span>
            <span className={cn(
              "relative text-[10px] mt-0.5 tracking-[0.1em] uppercase transition-all duration-300",
              activeTab === tab.id 
                ? "text-[oklch(0.70_0.15_280_/_0.8)]" 
                : "text-white/25 group-hover:text-white/35"
            )}>
              {tab.english}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
