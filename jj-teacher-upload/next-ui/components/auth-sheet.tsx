'use client'

import { useState } from 'react'
import { X, LogOut, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthSheetProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogin?: (email: string, password: string) => Promise<void> | void
  onRegister?: (name: string, email: string, password: string) => Promise<void> | void
  onLogout?: () => void
}

export function AuthSheet({ 
  isOpen, 
  onClose, 
  isLoggedIn = false,
  user,
  onLogin,
  onRegister,
  onLogout
}: AuthSheetProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [learningLanguage, setLearningLanguage] = useState('english')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('')
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await onLogin?.(email, password)
      } else {
        await onRegister?.(name, email, password)
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '账号服务暂时不可用')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <section 
      id="authSheet" 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="w-full max-w-[520px] relative overflow-hidden glass-sheet rounded-t-[2rem] p-7 animate-in slide-in-from-bottom duration-400"
        role="dialog"
        aria-modal="true"
        aria-labelledby="authTitle"
      >
        {/* 顶部拉手 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full" />
        
        {/* 顶部光线 */}
        <div className="top-highlight" />
        
        {/* 内部光泽 */}
        <div className="inner-glow rounded-t-[2rem]" />
        
        <div className="relative mt-2">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.15em] uppercase mb-0.5">Account</p>
              <h2 id="authTitle" className="text-xl font-semibold text-white/95 tracking-wide">
                {isLoggedIn ? '账号设置' : (mode === 'login' ? '登录账号' : '注册账号')}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white/45 hover:text-white/80 transition-premium"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>

          {isLoggedIn && user ? (
            // 已登录状态
            <div className="space-y-6">
              <div id="accountProfile" className="flex items-center gap-5 p-5 glass-card rounded-2xl overflow-hidden">
                <div className="inner-glow rounded-2xl" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[oklch(0.70_0.15_280_/_0.3)] to-[oklch(0.60_0.13_280_/_0.2)] border border-[oklch(0.70_0.15_280_/_0.3)] flex items-center justify-center text-[oklch(0.80_0.15_280)] font-semibold text-lg">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="relative">
                  <p id="authProfileName" className="font-semibold text-white/95 text-lg">{user.name}</p>
                  <p id="authProfileEmail" className="text-sm text-white/45 mt-0.5">{user.email}</p>
                </div>
              </div>

              <div id="accountSettings" className="space-y-4">
                <p className="text-[10px] text-white/35 font-semibold uppercase tracking-[0.15em] px-1">学习语言</p>
                <div id="languageOptions" className="space-y-2.5">
                  {[
                    { id: 'english', label: '英语', flag: 'EN' },
                    { id: 'japanese', label: '日语', flag: 'JP' },
                    { id: 'korean', label: '韩语', flag: 'KR' }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLearningLanguage(lang.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-premium",
                        learningLanguage === lang.id 
                          ? "glass-card-accent" 
                          : "glass-card"
                      )}
                    >
                      <div className="inner-glow rounded-2xl" />
                      <span className={cn(
                        "relative w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold tracking-wider",
                        learningLanguage === lang.id 
                          ? "bg-[oklch(0.70_0.15_280_/_0.25)] text-[oklch(0.80_0.15_280)]" 
                          : "glass-button text-white/50"
                      )}>
                        {lang.flag}
                      </span>
                      <span className={cn(
                        "relative text-sm font-semibold transition-colors",
                        learningLanguage === lang.id ? "text-white/95" : "text-white/60"
                      )}>
                        {lang.label}
                      </span>
                      {learningLanguage === lang.id && (
                        <ChevronRight className="relative w-4 h-4 text-[oklch(0.80_0.15_280)] ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="authLogoutButton"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[oklch(0.62_0.22_25_/_0.1)] border border-[oklch(0.62_0.22_25_/_0.2)] text-[oklch(0.70_0.22_25)] hover:bg-[oklch(0.62_0.22_25_/_0.15)] transition-premium"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span className="text-sm font-semibold">退出登录</span>
              </button>

              <button
                id="authCancelButton"
                onClick={onClose}
                className="w-full py-3.5 text-sm text-white/40 hover:text-white/60 font-medium transition-colors"
              >
                关闭
              </button>
            </div>
          ) : (
            // 未登录状态
            <form onSubmit={handleSubmit} className="space-y-5">
              <p id="authStatusText" className="text-sm text-white/45 mb-6 leading-relaxed">
                {status || '请使用授权账号登录。登录后会同步句子、学习状态和导师聊天记录。'}
              </p>

              {mode === 'register' && (
                <input
                  id="authName"
                  type="text"
                  placeholder="昵称"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 px-5 glass-input rounded-2xl text-white/95 placeholder:text-white/30 outline-none text-[15px] transition-premium"
                />
              )}

              <input
                id="authEmail"
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-5 glass-input rounded-2xl text-white/95 placeholder:text-white/30 outline-none text-[15px] transition-premium"
              />

              <input
                id="authPassword"
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-5 glass-input rounded-2xl text-white/95 placeholder:text-white/30 outline-none text-[15px] transition-premium"
              />

              <button
                id="authSubmitButton"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl glass-button-primary text-sm font-semibold transition-premium"
              >
                {isSubmitting ? '正在连接...' : (mode === 'login' ? '登录' : '注册')}
              </button>

              <button
                id="authModeButton"
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="w-full py-4 rounded-2xl glass-button text-white/60 text-sm font-semibold hover:text-white/85 transition-premium"
              >
                {mode === 'login' ? '还没有账号？注册' : '已有账号？登录'}
              </button>

              <button
                id="authCancelButton"
                type="button"
                onClick={onClose}
                className="w-full py-3 text-sm text-white/35 hover:text-white/55 font-medium transition-colors"
              >
                稍后
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// 更新弹窗
interface UpdateSheetProps {
  isOpen: boolean
  versionName: string
  notes: string
  onLater: () => void
  onUpdate: () => void
}

export function UpdateSheet({ isOpen, versionName, notes, onLater, onUpdate }: UpdateSheetProps) {
  if (!isOpen) return null

  return (
    <section 
      id="updateSheet" 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-[520px] relative overflow-hidden glass-sheet rounded-t-[2rem] p-7 animate-in slide-in-from-bottom duration-400">
        {/* 顶部拉手 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full" />
        
        <div className="top-highlight" />
        <div className="inner-glow rounded-t-[2rem]" />
        
        <div className="relative mt-2">
          <p className="text-[10px] text-[oklch(0.70_0.15_280)] font-semibold tracking-[0.15em] uppercase mb-1">App Update</p>
          <h2 id="updateVersionText" className="text-xl font-semibold text-white/95 mb-4">
            发现新版本 {versionName}
          </h2>
          <p id="updateNotesText" className="text-sm text-white/45 mb-8 leading-relaxed">
            {notes}
          </p>
          <div className="flex gap-4">
            <button
              id="updateLaterButton"
              onClick={onLater}
              className="flex-1 py-4 rounded-2xl glass-button text-white/60 text-sm font-semibold hover:text-white/85 transition-premium"
            >
              稍后
            </button>
            <button
              id="updateNowButton"
              onClick={onUpdate}
              className="flex-1 py-4 rounded-2xl glass-button-primary text-sm font-semibold transition-premium"
            >
              立即更新
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
