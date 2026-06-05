'use client'

import { useEffect, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ParticleField, FadeIn, MagneticButton, TextGlow } from '@/components/animations/MotionElements'

// 背景文字纹理 —— 从古典文学摘句
const LITERARY_QUOTES = [
  '如果可以重来',
  '往事如轻烟',
  '岁月不饶人',
  '人生若只如初见',
  '流年似水',
  '此刻即永恒',
  '命运的节点',
  '选择与放弃',
  '时光的重量',
  '另一种可能',
]

const BackgroundQuotes = memo(function BackgroundQuotes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {LITERARY_QUOTES.map((quote, i) => (
        <motion.span
          key={quote}
          className="absolute font-literary text-parchment/[0.04] whitespace-nowrap"
          style={{
            left: `${(i * 17 + 5) % 90}%`,
            top: `${(i * 13 + 8) % 85}%`,
            fontSize: `${Math.random() * 1.5 + 0.8}rem`,
            transform: `rotate(${(i % 3 - 1) * 8}deg)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.2 + 1, duration: 2 }}
        >
          {quote}
        </motion.span>
      ))}
    </div>
  )
})

// 标题字符逐一动画
function AnimatedTitle() {
  const chars = '《if》'.split('')

  return (
    <div className="flex items-center justify-center gap-0" aria-label="if 人生模拟器">
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className={`font-literary select-none ${
            char === '《' || char === '》'
              ? 'text-4xl md:text-6xl text-amber-500/60'
              : char === 'i' || char === 'f'
              ? 'text-7xl md:text-[9rem] lg:text-[12rem] text-parchment tracking-[-0.02em]'
              : ''
          }`}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 1.2,
            delay: i * 0.15 + 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            textShadow:
              char === 'i' || char === 'f'
                ? '0 0 80px rgba(200, 150, 42, 0.2), 0 0 160px rgba(200, 150, 42, 0.1)'
                : 'none',
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const { setPhase, phase, resetGame } = useGameStore()
  const [isReady, setIsReady] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const [hasSave, setHasSave] = useState(false)

  useEffect(() => {
    // 检测是否有存档
    try {
      const saved = localStorage.getItem('if-game-storage')
      if (saved) {
        const data = JSON.parse(saved)
        if (data?.state?.phase === 'playing' && data?.state?.character) {
          setHasSave(true)
        }
      }
    } catch {}

    // 延迟显示交互元素，营造仪式感
    const t = setTimeout(() => setIsReady(true), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-ink-deep">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-deep via-[#110f0b] to-ink-deep" />

      {/* 中央光晕 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(200,150,42,0.06) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* 背景引言文字 */}
      <BackgroundQuotes />

      {/* 粒子 */}
      <ParticleField count={50} />

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* 标题 */}
        <AnimatedTitle />

        {/* 副标题 */}
        <FadeIn delay={1.8} duration={1.2} direction="none">
          <p
            className="font-literary text-dust-light text-base md:text-lg tracking-[0.25em] uppercase"
            style={{ letterSpacing: '0.3em' }}
          >
            一款AI驱动的文学性人生模拟器
          </p>
        </FadeIn>

        {/* 分隔线 */}
        <FadeIn delay={2.2} duration={0.8}>
          <div className="flex items-center gap-4 w-48">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/40" />
            <div className="w-1 h-1 rounded-full bg-amber-500/60" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>
        </FadeIn>

        {/* 按钮组 */}
        <AnimatePresence>
          {isReady && (
            <motion.div
              className="flex flex-col items-center gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 开始人生按钮 */}
              <MagneticButton
                className="btn-primary px-12 py-4 rounded-sm font-literary text-lg tracking-widest relative overflow-hidden group"
                onClick={() => {
                  resetGame()
                  setPhase('create')
                }}
              >
                <span className="relative z-10">开始人生</span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </MagneticButton>

              {/* 继续存档 */}
              {hasSave && (
                <motion.button
                  className="font-ui text-sm text-dust-light hover:text-parchment transition-colors duration-300 tracking-widest underline underline-offset-4 decoration-dust/30"
                  onClick={() => setPhase('playing')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  继续上次的人生
                </motion.button>
              )}

              {/* 查看存档 */}
              <motion.button
                className="font-ui text-xs text-dust/60 hover:text-dust transition-colors duration-300 tracking-wider"
                onClick={() => setPhase('archive')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                人生存档
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 底部引言 */}
        <FadeIn delay={3} duration={1.5} direction="none">
          <blockquote className="font-literary text-dust/50 text-sm italic max-w-xs leading-relaxed">
            "如果，你有机会活另一种人生——"
          </blockquote>
        </FadeIn>
      </div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink-deep to-transparent pointer-events-none" />

      {/* 扫描线效果 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,240,232,0.5) 2px, rgba(245,240,232,0.5) 3px)',
          backgroundSize: '100% 3px',
        }}
        aria-hidden="true"
      />
    </main>
  )
}
