// 游戏核心类型定义

export interface CharacterProfile {
  id: string
  name: string
  birthYear: number
  birthplace: string
  country: string
  family: string
  personality: string
  appearance: string
  initialDream: string
  // 动态状态
  currentAge: number
  portraitUrl?: string
  portraitStyle?: 'child' | 'teen' | 'young' | 'middle' | 'elder'
}

export interface LifeStats {
  health: number      // 0-100
  wealth: number      // 0-100
  mood: number        // 0-100
  relationship: number // 0-100
  wisdom: number      // 0-100
  reputation: number  // 0-100
}

export interface TimelineEntry {
  id: string
  year: number
  age: number
  type: 'action' | 'event' | 'milestone' | 'tragedy' | 'joy'
  title: string
  content: string
  portraitSnapshot?: string
  backgroundImage?: string
  statsChange?: Partial<LifeStats>
}

export interface DialogMessage {
  id: string
  role: 'player' | 'narrator' | 'system'
  content: string
  timestamp: number
  year?: number
  age?: number
  // 朗读完的 flag
  revealed?: boolean
  backgroundImageHint?: string
}

export interface GameState {
  phase: 'landing' | 'create' | 'playing' | 'gameover' | 'archive'
  character: CharacterProfile | null
  stats: LifeStats
  currentYear: number
  timeline: TimelineEntry[]
  messages: DialogMessage[]
  backgroundImage: string | null
  isNarratorTyping: boolean
  settings: GameSettings
}

export interface GameSettings {
  typingSpeed: number   // ms per character: 20-100
  bgmEnabled: boolean
  sfxEnabled: boolean
  textSize: 'sm' | 'md' | 'lg'
  theme: 'dark' | 'sepia'
}

// API 接口 (预留)
export interface AIDialogRequest {
  character: CharacterProfile
  stats: LifeStats
  history: DialogMessage[]
  playerInput: string
  currentYear: number
}

export interface AIDialogResponse {
  narration: string
  yearAdvance: number   // 推进的年数
  statsChange: Partial<LifeStats>
  eventType: TimelineEntry['type']
  eventTitle: string
  backgroundImagePrompt?: string
  portraitUpdateNeeded?: boolean
}

export interface AIImageRequest {
  prompt: string
  style: 'portrait' | 'background'
  characterDescription?: string
  age?: number
}

export interface AIImageResponse {
  imageUrl: string
  prompt: string
}
