import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  GameState,
  CharacterProfile,
  LifeStats,
  DialogMessage,
  TimelineEntry,
  GameSettings,
} from '@/types/game'

const DEFAULT_STATS: LifeStats = {
  health: 70,
  wealth: 30,
  mood: 60,
  relationship: 50,
  wisdom: 20,
  reputation: 10,
}

const DEFAULT_SETTINGS: GameSettings = {
  typingSpeed: 40,
  bgmEnabled: false,
  sfxEnabled: true,
  textSize: 'md',
  theme: 'dark',
}

interface GameStore extends GameState {
  // 阶段控制
  setPhase: (phase: GameState['phase']) => void

  // 人物操作
  setCharacter: (character: CharacterProfile) => void
  updateCharacterPortrait: (url: string) => void

  // 对话操作
  addMessage: (message: Omit<DialogMessage, 'id' | 'timestamp'>) => void
  setNarratorTyping: (typing: boolean) => void
  markMessageRevealed: (id: string) => void

  // 状态操作
  updateStats: (changes: Partial<LifeStats>) => void
  advanceTime: (years: number) => void

  // 时间线操作
  addTimelineEntry: (entry: Omit<TimelineEntry, 'id'>) => void

  // 背景图
  setBackgroundImage: (url: string | null) => void

  // 设置
  updateSettings: (settings: Partial<GameSettings>) => void

  // 重置
  resetGame: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      phase: 'landing',
      character: null,
      stats: { ...DEFAULT_STATS },
      currentYear: new Date().getFullYear(),
      timeline: [],
      messages: [],
      backgroundImage: null,
      isNarratorTyping: false,
      settings: { ...DEFAULT_SETTINGS },

      setPhase: (phase) => set({ phase }),

      setCharacter: (character) =>
        set({
          character,
          currentYear: character.birthYear,
          stats: { ...DEFAULT_STATS },
          messages: [],
          timeline: [],
        }),

      updateCharacterPortrait: (url) =>
        set((state) => ({
          character: state.character
            ? { ...state.character, portraitUrl: url }
            : null,
        })),

      addMessage: (message) => {
        const { character, currentYear } = get()
        const newMsg: DialogMessage = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
          year: currentYear,
          age: character ? currentYear - character.birthYear : undefined,
          revealed: false,
        }
        set((state) => ({ messages: [...state.messages, newMsg] }))
        return newMsg.id
      },

      setNarratorTyping: (typing) => set({ isNarratorTyping: typing }),

      markMessageRevealed: (id) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, revealed: true } : m
          ),
        })),

      updateStats: (changes) =>
        set((state) => ({
          stats: {
            health: Math.min(100, Math.max(0, state.stats.health + (changes.health ?? 0))),
            wealth: Math.min(100, Math.max(0, state.stats.wealth + (changes.wealth ?? 0))),
            mood: Math.min(100, Math.max(0, state.stats.mood + (changes.mood ?? 0))),
            relationship: Math.min(100, Math.max(0, state.stats.relationship + (changes.relationship ?? 0))),
            wisdom: Math.min(100, Math.max(0, state.stats.wisdom + (changes.wisdom ?? 0))),
            reputation: Math.min(100, Math.max(0, state.stats.reputation + (changes.reputation ?? 0))),
          },
        })),

      advanceTime: (years) =>
        set((state) => ({
          currentYear: state.currentYear + years,
          character: state.character
            ? {
                ...state.character,
                currentAge: state.character.currentAge + years,
              }
            : null,
        })),

      addTimelineEntry: (entry) => {
        const newEntry: TimelineEntry = {
          ...entry,
          id: `entry-${Date.now()}`,
        }
        set((state) => ({ timeline: [...state.timeline, newEntry] }))
      },

      setBackgroundImage: (url) => set({ backgroundImage: url }),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      resetGame: () =>
        set({
          phase: 'landing',
          character: null,
          stats: { ...DEFAULT_STATS },
          currentYear: new Date().getFullYear(),
          timeline: [],
          messages: [],
          backgroundImage: null,
          isNarratorTyping: false,
        }),
    }),
    {
      name: 'if-game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phase: state.phase,
        character: state.character,
        stats: state.stats,
        currentYear: state.currentYear,
        timeline: state.timeline,
        messages: state.messages.slice(-50), // 只持久化最近50条
        backgroundImage: state.backgroundImage,
        settings: state.settings,
      }),
    }
  )
)
