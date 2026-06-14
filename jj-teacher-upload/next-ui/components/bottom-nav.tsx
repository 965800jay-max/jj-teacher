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
      {/* 产品级浅色导航背景 */}
      <div className="absolute inset-0 glass-nav" />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-[#E5E7EB]" />
      
      <div className="relative max-w-[520px] mx-auto flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
          <button
            key={tab.id}
            id={`${tab.id}Nav`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-premium relative group"
            )}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {/* 活跃指示器 - 顶部光线 */}
            <div className={cn(
              "absolute top-0 w-10 h-[2px] rounded-full transition-all duration-300",
              activeTab === tab.id 
                ? "opacity-100 bg-[#2563EB]" 
                : "opacity-0"
            )} />
            
            {/* 选中浅蓝底 */}
            <div className={cn(
              "absolute inset-x-3 inset-y-2 rounded-2xl transition-all duration-300 overflow-hidden",
              activeTab === tab.id 
                ? "bg-[#EEF4FF]" 
                : "bg-transparent group-hover:bg-[#F3F4F6]"
            )} />

            <Icon className={cn(
              "relative w-4 h-4 transition-all duration-300",
              activeTab === tab.id
                ? "text-[#2563EB]"
                : "text-[#9CA3AF] group-hover:text-[#6B7280]"
            )} />
            
            <span className={cn(
              "relative text-[14px] tracking-wide transition-all duration-300",
              activeTab === tab.id 
                ? "font-semibold text-[#2563EB]" 
                : "font-medium text-[#9CA3AF] group-hover:text-[#6B7280]"
            )}>
              {tab.label}
            </span>
          </button>
        )})}
      </div>
    </nav>
  )
}
