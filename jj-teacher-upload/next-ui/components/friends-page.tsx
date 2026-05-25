'use client'

import { useState } from 'react'
import { RefreshCw, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Friend {
  id: string
  name: string
  email: string
  avatar?: string
  sentenceCount: number
  lastActive: string
}

interface FriendsPageProps {
  friends?: Friend[]
  onRefresh?: () => void
}

export function FriendsPage({ friends = [], onRefresh }: FriendsPageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <section id="friendsPage" className="px-5 py-5 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.15em] uppercase mb-0.5">Community</p>
          <h1 className="text-2xl font-semibold text-white/95 tracking-wide">好友</h1>
        </div>
        <button 
          id="refreshFriendsButton"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-3 glass-button text-white/60 rounded-2xl text-sm font-semibold hover:text-white/85 transition-premium disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          刷新
        </button>
      </div>

      {/* 好友列表 */}
      <div id="friendList" className="space-y-4">
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <div 
              key={friend.id}
              className="glass-card rounded-2xl p-5 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="inner-glow rounded-2xl" />
              <div className="relative flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.70_0.15_280_/_0.3)] to-[oklch(0.60_0.13_280_/_0.2)] border border-[oklch(0.70_0.15_280_/_0.3)] flex items-center justify-center text-[oklch(0.80_0.15_280)] font-semibold text-lg">
                  {friend.avatar ? (
                    <img src={friend.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    friend.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white/95 truncate text-base">{friend.name}</p>
                  <p className="text-xs text-white/45 mt-1">{friend.sentenceCount} 句子 · {friend.lastActive}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-white/5 blur-xl" />
              <div className="relative w-24 h-24 rounded-3xl glass-card flex items-center justify-center">
                <div className="inner-glow rounded-3xl" />
                <Users className="w-10 h-10 text-white/35" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white/95 mb-3">暂无好友</h2>
            <p className="text-sm text-white/45 leading-relaxed max-w-[240px] mx-auto">登录后可以添加好友，一起学习英语</p>
          </div>
        )}
      </div>
    </section>
  )
}
