'use client'

import { memo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { StatusBar } from './StatusBar'
import { CharacterPortrait } from './CharacterPortrait'
import { DialogPanel } from './DialogPanel'
import { InputArea } from './InputArea'
import { ParticleField } from '@/components/animations/MotionElements'

export default function GamePage() {
  const { character, backgroundImage, setPhase, messages } = useGameStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [prevBackground, setPrevBackground] = useState<string | null>(null)

  // 处理背景切换
  useEffect(() => {
    if (backgroundImage && backgroundImage !== prevBackground) {
      setPrevBackground(backgroundImage)
    }
  }, [backgroundImage])

  // 如果没有角色，返回创建页
  useEffect(() => {
    if (!character) {
      setPhase('create')
    }
  }, [character, setPhase])

  if (!character) return null

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-ink-deep">
      {/* ==========================================
          背景层系统
          ========================================== */}
      <div className="fixed inset-0 z-0">
        {/* 基础深色背景 */}
        <div className="absolute inset-0 bg-ink-deep" />

        {/* 动态背景（AI生成图 or 渐变） */}
        <AnimatePresence>
          {backgroundImage && (
            <motion.div
              key={backgroundImage}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              style={{
                background: backgroundImage.startsWith('linear') || backgroundImage.startsWith('radial')
                  ? backgroundImage
                  : `url(${backgroundImage}) center/cover no-repeat`,
              }}
            />
          )}
        </AnimatePresence>

        {/* 暗化遮罩 */}
        <div className="absolute inset-0 bg-ink-deep/70" />

        {/* 边缘渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-deep/80 via-transparent to-ink-deep/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep/60 via-transparent to-ink-deep/60" />

        {/* 粒子 */}
        <ParticleField count={30} />

        {/* 纸质纹理 */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ==========================================
          状态栏
          ========================================== */}
      <div className="relative z-30">
        <StatusBar />
      </div>

      {/* ==========================================
          主内容区
          ========================================== */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* === 左侧：人物立绘 === */}
        <motion.aside
          className="hidden md:flex flex-col w-64 lg:w-72 xl:w-80 border-r border-parchment/8 flex-shrink-0"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {/* 立绘区域 */}
          <div className="flex-1 relative overflow-hidden">
            <CharacterPortrait />
          </div>

          {/* 底部：时间线预览 */}
          <div className="border-t border-parchment/8 p-4">
            <p className="font-ui text-[10px] text-dust/40 tracking-widest uppercase mb-2">
              近期事件
            </p>
            <TimelineMini />
          </div>
        </motion.aside>

        {/* === 中间：对话区域 === */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 对话区 */}
          <div className="flex-1 overflow-hidden relative">
            {/* 顶部渐变 */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-ink-deep/40 to-transparent z-10 pointer-events-none" />

            <DialogPanel />
          </div>

          {/* 输入区 */}
          <InputArea />
        </div>

        {/* === 移动端：人物立绘浮层按钮 === */}
        <div className="md:hidden fixed bottom-24 right-4 z-40">
          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center border border-parchment/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="font-literary text-amber-500 text-sm">人</span>
          </motion.button>
        </div>
      </div>

      {/* === 移动端：人物立绘侧边栏 === */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-ink-deep/80 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden flex flex-col"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex-1 glass-panel border-r border-parchment/15 overflow-hidden flex flex-col">
                <div className="flex-1 relative">
                  <CharacterPortrait />
                </div>
                <div className="p-4 border-t border-parchment/8">
                  <TimelineMini />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// 时间线缩略预览
const TimelineMini = memo(function TimelineMini() {
  const { timeline } = useGameStore()
  const recent = timeline.slice(-4).reverse()

  if (recent.length === 0) {
    return <p className="font-ui text-[10px] text-dust/30 italic">旅程尚未开始</p>
  }

  const typeColors = {
    joy: '#4a6741',
    tragedy: '#8b2635',
    event: '#6a7fa8',
    milestone: '#c8962a',
    action: '#8c8070',
  }

  return (
    <div className="space-y-1.5">
      {recent.map((entry) => (
        <div key={entry.id} className="flex items-start gap-2">
          <div
            className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
            style={{ backgroundColor: typeColors[entry.type] ?? '#8c8070' }}
          />
          <div className="min-w-0">
            <p className="font-ui text-[10px] text-parchment/60 truncate">{entry.title}</p>
            <p className="font-ui text-[9px] text-dust/40">{entry.age}岁</p>
          </div>
        </div>
      ))}
    </div>
  )
})
