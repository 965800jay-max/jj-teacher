'use client'

import { cn } from '@/lib/utils'
import { BookText, Languages, MessageCircle, MessagesSquare } from 'lucide-react'

interface BottomNavProps {
  activeTab: 'sentences' | 'scenes' | 'assistant' | 'teacher'
  onTabChange: (tab: 'sentences' | 'scenes' | 'assistant' | 'teacher') => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'sentences' as const, label: '句读', icon: BookText },
    { id: 'scenes' as const, label: '记录', icon: MessagesSquare },
    { id: 'assistant' as const, label: '助手', icon: Languages },
    { id: 'teacher' as const, label: '导师', icon: MessageCircle }
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
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
          <button
            key={tab.id}
            id={`${tab.id}Nav`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-3 transition-premium relative group"
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
              "absolute inset-x-3 inset-y-1.5 rounded-2xl transition-all duration-400 overflow-hidden",
              activeTab === tab.id 
                ? "bg-gradient-to-b from-[oklch(0.70_0.15_280_/_0.15)] via-[oklch(0.55_0.18_300_/_0.08)] to-transparent shadow-[0_0_20px_oklch(0.65_0.18_290_/_0.08)]" 
                : "bg-transparent group-hover:bg-white/[0.03]"
            )} />

            <Icon className={cn(
              "relative w-4 h-4 transition-all duration-300",
              activeTab === tab.id
                ? "text-[oklch(0.80_0.15_280)]"
                : "text-white/36 group-hover:text-white/58"
            )} />
            
            <span className={cn(
              "relative text-[14px] tracking-wide transition-all duration-300",
              activeTab === tab.id 
                ? "font-semibold text-white" 
                : "font-medium text-white/40 group-hover:text-white/60"
            )}>
              {tab.label}
            </span>
          </button>
        )})}
      </div>
    </nav>
  )
}
