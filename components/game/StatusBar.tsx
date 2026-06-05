'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { formatAge, getAgeStage, describeHealth, describeMood, describeWealth } from '@/lib/utils'
import { AnimatedNumber } from '@/components/animations/MotionElements'

const STAT_CONFIGS = [
  { key: 'health' as const, label: '身体', icon: '♥', color: '#8b2635', descFn: describeHealth },
  { key: 'wealth' as const, label: '财富', icon: '◈', color: '#c8962a', descFn: describeWealth },
  { key: 'mood' as const, label: '心境', icon: '◉', color: '#4a6741', descFn: describeMood },
  { key: 'relationship' as const, label: '关系', icon: '❋', color: '#6a7fa8', descFn: (v: number) => v >= 70 ? '温情脉脉' : v >= 40 ? '平淡如常' : '疏离孤独' },
  { key: 'wisdom' as const, label: '智慧', icon: '✦', color: '#9b7eb8', descFn: (v: number) => v >= 70 ? '通透豁达' : v >= 40 ? '明事知理' : '初涉世事' },
]

export const StatusBar = memo(function StatusBar() {
  const { character, stats, currentYear } = useGameStore()

  if (!character) return null

  const age = currentYear - character.birthYear
  const stage = getAgeStage(age)

  return (
    <motion.header
      className="relative z-30 glass-panel border-b border-parchment/10"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-4 px-4 md:px-6 py-3">
        {/* 人物信息 */}
        <div className="flex items-baseline gap-2 min-w-fit">
          <span className="font-literary text-parchment text-base">{character.name}</span>
          <span className="font-ui text-dust text-xs">·</span>
          <motion.span
            className="font-literary text-amber-500 text-lg font-medium"
            key={age}
            initial={{ scale: 1.3, color: '#d4a843' }}
            animate={{ scale: 1, color: '#c8962a' }}
            transition={{ duration: 0.4 }}
          >
            <AnimatedNumber value={age} />岁
          </motion.span>
          <span className="font-ui text-dust/60 text-xs hidden sm:inline">· {stage}</span>
        </div>

        {/* 年份 */}
        <div className="hidden md:flex items-center gap-1 text-dust/50 text-xs font-ui">
          <span className="text-dust/30">|</span>
          <span>{currentYear}年</span>
        </div>

        {/* 状态指示器 */}
        <div className="flex-1 flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
          {STAT_CONFIGS.map(({ key, label, icon, color, descFn }) => {
            const value = stats[key]
            return (
              <div key={key} className="flex items-center gap-1.5 min-w-fit group relative">
                {/* 图标 */}
                <span
                  className="text-[10px] opacity-70"
                  style={{ color }}
                  aria-hidden="true"
                >
                  {icon}
                </span>

                {/* 进度条 */}
                <div className="w-12 md:w-16 h-1 bg-parchment/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={false}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>

                {/* 标签（宽屏显示） */}
                <span className="hidden lg:inline font-ui text-[10px] text-dust/50">{label}</span>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-ink rounded text-[10px] font-ui text-parchment/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-parchment/10">
                  {label}：{descFn(value)}（{value}）
                </div>
              </div>
            )
          })}
        </div>

        {/* 设置按钮 */}
        <button
          onClick={() => useGameStore.getState().setPhase('settings' as any)}
          className="text-dust/40 hover:text-dust transition-colors p-1 ml-auto"
          aria-label="设置"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </motion.header>
  )
})
