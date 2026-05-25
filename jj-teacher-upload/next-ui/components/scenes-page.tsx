'use client'

import { useState } from 'react'
import { Plus, Play, ChevronLeft, BookA, Theater } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakEnglish } from '@/lib/speech'
import { SpeakableText } from '@/components/speakable-text'
import type { VocabItem, Scene } from '@/lib/sample-data'

interface ScenesPageProps {
  vocabGroups: { id: string; label: string; english?: string }[]
  vocabItems: VocabItem[]
  sceneGroups: { id: string; label: string }[]
  scenes: Scene[]
  onAddSentence?: (text: string, note: string) => void
}

export function ScenesPage({ 
  vocabGroups, 
  vocabItems, 
  sceneGroups, 
  scenes,
  onAddSentence 
}: ScenesPageProps) {
  const [mode, setMode] = useState<'vocab' | 'scenes'>('vocab')
  const [activeGroup, setActiveGroup] = useState(mode === 'vocab' ? vocabGroups[0]?.id : sceneGroups[0]?.id)
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const currentGroups = mode === 'vocab' ? vocabGroups : sceneGroups
  const filteredVocab = vocabItems.filter(v => v.group === activeGroup)
  const filteredScenes = scenes.filter(s => s.group === activeGroup)

  const handleSpeak = (text: string, id: string) => {
    setPlayingId(id)
    setTimeout(() => setPlayingId(null), 300)
    speakEnglish(text, { mode: 'sentence', rate: 0.9 })
  }

  const handleModeChange = (newMode: 'vocab' | 'scenes') => {
    setMode(newMode)
    setActiveGroup(newMode === 'vocab' ? vocabGroups[0]?.id : sceneGroups[0]?.id)
    setSelectedScene(null)
  }

  if (selectedScene) {
    return (
      <div id="sceneDetail" className="px-5 py-5 animate-fade-in">
        <button 
          onClick={() => setSelectedScene(null)}
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 mb-6 transition-premium font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          返回列表
        </button>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="glass-chip-active">{selectedScene.level}</span>
          </div>
          <h2 className="text-2xl font-semibold text-white/95 tracking-wide">{selectedScene.title}</h2>
          <p className="text-sm text-white/45 mt-2 leading-relaxed">{selectedScene.description}</p>
        </div>

        <div className="space-y-4">
          {selectedScene.dialogue.map((line, i) => (
            <div 
              key={i}
              className={cn(
                "relative glass-card rounded-2xl px-5 py-4 overflow-hidden animate-slide-up",
                line.speaker === 'A' 
                  ? "ml-0 mr-10" 
                  : "ml-10 mr-0"
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="inner-glow rounded-2xl" />
              <div className="relative flex items-center gap-3 mb-3">
                <span className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold",
                  line.speaker === 'A' 
                    ? "glass-button text-white/70" 
                    : "bg-[oklch(0.70_0.15_280_/_0.2)] border border-[oklch(0.70_0.15_280_/_0.3)] text-[oklch(0.80_0.15_280)]"
                )}>
                  {line.speaker}
                </span>
                <span className="text-xs text-white/45 font-medium">{line.zh}</span>
              </div>
              <div className="relative flex items-center gap-3">
                <p className="flex-1 text-[15px] font-semibold text-white/95 leading-relaxed">
                  <SpeakableText text={line.english} rate={0.9} />
                </p>
                <button
                  onClick={() => handleSpeak(line.english, `scene-${i}`)}
                  className={cn(
                    "flex-shrink-0 w-9 h-9 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-white transition-premium",
                    playingId === `scene-${i}` && "scale-90 brightness-125"
                  )}
                >
                  <Play className={cn(
                    "w-4 h-4 ml-0.5 transition-transform duration-300",
                    playingId === `scene-${i}` && "scale-125"
                  )} />
                </button>
                <button
                  onClick={() => onAddSentence?.(line.english, line.zh)}
                  className="flex-shrink-0 w-9 h-9 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-[oklch(0.80_0.15_280)] transition-premium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section id="scenesPage" className="px-5 py-5 animate-fade-in">
      {/* 模式切换 - 高级玻璃标签带图标 */}
      <div id="sceneModeTabs" className="glass-tabs flex gap-1 mb-6">
        <button
          onClick={() => handleModeChange('vocab')}
          className={cn(
            "flex-1 glass-tab flex items-center justify-center gap-2",
            mode === 'vocab' && "glass-tab-active"
          )}
        >
          <BookA className={cn(
            "w-4 h-4 transition-transform duration-300",
            mode === 'vocab' ? "text-[oklch(0.85_0.15_280)]" : "text-white/50"
          )} />
          <span>单词</span>
        </button>
        <button
          onClick={() => handleModeChange('scenes')}
          className={cn(
            "flex-1 glass-tab flex items-center justify-center gap-2",
            mode === 'scenes' && "glass-tab-active"
          )}
        >
          <Theater className={cn(
            "w-4 h-4 transition-transform duration-300",
            mode === 'scenes' ? "text-[oklch(0.85_0.15_280)]" : "text-white/50"
          )} />
          <span>场景</span>
        </button>
      </div>

      {/* 分类标签 - 芯片样式 */}
      <div 
        id="sceneGroupTabs" 
        className="flex gap-2.5 overflow-x-auto pb-5 -mx-5 px-5 scrollbar-hide"
      >
        {currentGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={cn(
              "flex-shrink-0 whitespace-nowrap transition-premium",
              activeGroup === group.id 
                ? "glass-chip-active" 
                : "glass-chip"
            )}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* 内容列表 */}
      <div id="sceneList" className="space-y-4">
        {mode === 'vocab' ? (
          filteredVocab.length > 0 ? (
            filteredVocab.map((item, index) => (
              <div 
                key={item.id}
                className="glass-card rounded-2xl px-5 py-5 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="inner-glow rounded-2xl" />
                <div className="relative flex items-center gap-4 mb-3">
                  <span className="text-lg font-semibold text-white/95">
                    <SpeakableText text={item.word} rate={0.9} />
                  </span>
                  <span className="text-sm text-white/45">{item.meaning}</span>
                  <button
                    onClick={() => handleSpeak(item.word, `vocab-${item.id}`)}
                    className={cn(
                      "ml-auto w-10 h-10 rounded-xl glass-button text-white/60 flex items-center justify-center hover:text-white transition-premium",
                      playingId === `vocab-${item.id}` && "scale-90 brightness-125"
                    )}
                  >
                    <Play className={cn(
                      "w-[18px] h-[18px] ml-0.5 transition-transform duration-300",
                      playingId === `vocab-${item.id}` && "scale-125"
                    )} />
                  </button>
                </div>
                <p className="relative text-sm text-white/50 italic leading-relaxed">
                  <SpeakableText text={item.example} rate={0.9} />
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-white/35">暂无单词</p>
            </div>
          )
        ) : (
          filteredScenes.length > 0 ? (
            filteredScenes.map((scene, index) => (
              <button
                key={scene.id}
                onClick={() => setSelectedScene(scene)}
                className="w-full text-left glass-card rounded-2xl px-5 py-5 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="inner-glow rounded-2xl" />
                <div className="relative flex items-center gap-3 mb-2">
                  <span className="glass-chip-active text-[11px]">{scene.level}</span>
                  <span className="text-xs text-white/35 font-medium">{scene.dialogue.length} 句对话</span>
                </div>
                <h3 className="relative text-base font-semibold text-white/95">{scene.title}</h3>
                <p className="relative text-sm text-white/45 mt-1 leading-relaxed">{scene.description}</p>
              </button>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-white/35">暂无场景</p>
            </div>
          )
        )}
      </div>
    </section>
  )
}
