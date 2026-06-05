'use client'

import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/store/gameStore'
import { getAgeStage } from '@/lib/utils'

// 生成人物年龄阶段的占位 SVG
function getAgeStageSvg(age: number, name: string, portraitUrl?: string): string {
  if (portraitUrl && !portraitUrl.startsWith('data:image/svg+xml,data:image')) {
    return portraitUrl
  }

  const accent = age < 15 ? '#c8962a' : age < 35 ? '#d4a843' : age < 60 ? '#b8852a' : '#8c7050'
  const opacity = age > 60 ? '0.7' : '1'
  const initial = name.charAt(0) || '?'

  // 根据年龄调整轮廓
  const headSize = age < 10 ? 36 : age < 20 ? 44 : 48
  const bodyWidth = age < 10 ? 100 : age < 20 ? 140 : 160
  const bodyOpacity = age > 60 ? 0.12 : 0.15

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0d0b08"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="softer"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>
  <rect width="300" height="400" fill="url(#bg)"/>
  <ellipse cx="150" cy="130" rx="70" ry="90" fill="url(#glow)" filter="url(#softer)" opacity="${opacity}"/>
  <ellipse cx="150" cy="120" rx="${headSize}" ry="${headSize * 1.1}" fill="${accent}" opacity="${parseFloat(opacity) * 0.3}" filter="url(#soft)"/>
  <rect x="${150 - 20}" y="${120 + headSize * 0.9}" width="40" height="${age > 60 ? 20 : 28}" fill="${accent}" opacity="${parseFloat(opacity) * 0.22}" filter="url(#soft)"/>
  <path d="M${150 - bodyWidth/2} ${190 + (age > 60 ? 5 : 0)} Q${150 - bodyWidth/3} ${175} ${150 - 20} ${172} L${150 + 20} ${172} Q${150 + bodyWidth/3} ${175} ${150 + bodyWidth/2} ${190 + (age > 60 ? 5 : 0)} L${150 + bodyWidth/2 + 20} 400 L${150 - bodyWidth/2 - 20} 400Z" fill="${accent}" opacity="${bodyOpacity}" filter="url(#soft)"/>
  <text x="150" y="${120 + headSize * 0.4}" text-anchor="middle" dominant-baseline="middle" font-family="serif" font-size="${age < 15 ? 28 : 36}" fill="${accent}" opacity="0.55" font-weight="300">${initial}</text>
  <line x1="60" y1="375" x2="240" y2="375" stroke="${accent}" stroke-opacity="0.25" stroke-width="0.5"/>
  <text x="150" y="390" text-anchor="middle" font-family="serif" font-size="9" fill="${accent}" opacity="0.45">${name} · ${age}岁</text>
</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const CharacterPortrait = memo(function CharacterPortrait() {
  const { character, currentYear, stats } = useGameStore()
  const [isHovered, setIsHovered] = useState(false)

  if (!character) return null

  const age = currentYear - character.birthYear
  const stage = getAgeStage(age)
  const portraitSrc = character.portraitUrl || getAgeStageSvg(age, character.name)

  // 根据心境调整滤镜
  const moodFilter =
    stats.mood < 25
      ? 'grayscale(0.6) brightness(0.8)'
      : stats.mood < 45
      ? 'grayscale(0.2) brightness(0.9)'
      : stats.mood > 80
      ? 'brightness(1.05) saturate(1.1)'
      : 'none'

  return (
    <div
      className="relative w-full h-full flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 立绘主体 */}
      <div className="relative w-full flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${character.id}-${Math.floor(age / 5)}`}
            className="absolute inset-0"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              scale: isHovered ? 1.02 : 1,
            }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portraitSrc}
              alt={`${character.name} - ${stage}`}
              className="w-full h-full object-cover object-top"
              style={{ filter: moodFilter, transition: 'filter 1.5s ease' }}
            />

            {/* 底部渐变 */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-ink-deep via-ink-deep/60 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* 呼吸动画覆盖层 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(ellipse at 50% 60%, rgba(200,150,42,0) 0%, transparent 100%)',
              'radial-gradient(ellipse at 50% 60%, rgba(200,150,42,0.04) 0%, transparent 60%)',
              'radial-gradient(ellipse at 50% 60%, rgba(200,150,42,0) 0%, transparent 100%)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* 人物信息卡 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center">
          <p className="font-literary text-parchment text-base">{character.name}</p>
          <p className="font-ui text-dust text-xs mt-0.5">
            <motion.span
              className="text-amber-500"
              key={age}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {age}岁
            </motion.span>
            <span className="mx-1.5 opacity-40">·</span>
            <span className="opacity-70">{stage}</span>
          </p>

          {/* 健康警告 */}
          <AnimatePresence>
            {stats.health < 25 && (
              <motion.p
                className="text-[10px] font-ui text-crimson/80 mt-1 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ⚠ 健康告警
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 年龄时间线指示 */}
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-ink/70 backdrop-blur-sm border border-parchment/10 rounded-sm px-2 py-1">
          <span className="font-literary text-amber-500 text-sm">{currentYear}</span>
        </div>
      </div>
    </div>
  )
})
