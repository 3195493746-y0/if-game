'use client'

import { useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { TypewriterText } from '@/components/animations/TypewriterText'
import type { DialogMessage } from '@/types/game'

// 单条消息组件
const MessageBubble = memo(function MessageBubble({
  message,
  isLatest,
}: {
  message: DialogMessage
  isLatest: boolean
}) {
  const isNarrator = message.role === 'narrator'
  const isPlayer = message.role === 'player'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center my-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-amber-500/30" />
          <span className="font-ui text-xs text-amber-500/70 tracking-widest uppercase">
            {message.content}
          </span>
          <div className="h-px w-8 bg-amber-500/30" />
        </div>
      </motion.div>
    )
  }

  if (isPlayer) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-end mb-4"
      >
        <div className="max-w-[75%]">
          <div className="bg-parchment/8 border border-parchment/15 rounded-sm px-4 py-3">
            <p className="font-ui text-sm text-parchment/90 leading-relaxed">
              {message.content}
            </p>
          </div>
          {message.age !== undefined && (
            <p className="font-ui text-[10px] text-dust/40 text-right mt-1 pr-1">
              {message.age}岁 · {message.year}年
            </p>
          )}
        </div>
      </motion.div>
    )
  }

  // 叙述者消息 —— 核心文学对话
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6"
    >
      {/* 年份标记 */}
      {message.year && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-1 rounded-full bg-amber-500/60" />
          <span className="font-ui text-[10px] text-dust/50 tracking-widest">
            {message.year}年{message.age !== undefined ? ` · ${message.age}岁` : ''}
          </span>
        </div>
      )}

      {/* 叙事文本 */}
      <div className="relative">
        {/* 左侧装饰线 */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent" />

        <div className="pl-5 pr-2">
          <p className="font-literary text-parchment/92 leading-[2] text-sm md:text-base">
            {isLatest && !message.revealed ? (
              <TypewriterText
                text={message.content}
                messageId={message.id}
                className="font-literary"
              />
            ) : (
              <span>{message.content}</span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  )
})

// 正在输入指示器
const TypingIndicator = memo(function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 pl-5 mb-4"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-500/60"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span className="font-ui text-xs text-dust/50">叙事者正在书写...</span>
    </motion.div>
  )
})

// 主对话区域
export const DialogPanel = memo(function DialogPanel() {
  const { messages, isNarratorTyping, character } = useGameStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isNarratorTyping])

  if (!character) return null

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-1"
      role="log"
      aria-live="polite"
      aria-label="人生叙事对话"
    >
      {/* 开场白 */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="flex flex-col items-center justify-center h-full min-h-[200px] text-center py-12"
        >
          <div className="space-y-4">
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-amber-500/40 mx-auto" />
            <p className="font-literary text-dust/60 text-sm leading-relaxed max-w-xs">
              {character.name}的人生，从{character.birthplace}的某个清晨开始。
              <br />
              <br />
              告诉我，你想如何开始这段旅程？
            </p>
            <div className="w-px h-8 bg-gradient-to-b from-amber-500/40 to-transparent mx-auto" />
          </div>
        </motion.div>
      )}

      {/* 消息列表 */}
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isLatest={index === messages.length - 1}
        />
      ))}

      {/* 正在输入 */}
      <AnimatePresence>
        {isNarratorTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* 滚动锚点 */}
      <div ref={endRef} className="h-1" />
    </div>
  )
})
