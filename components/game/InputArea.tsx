'use client'

import { useState, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { callAIDialog } from '@/lib/api'

export const InputArea = memo(function InputArea() {
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    character,
    stats,
    messages,
    currentYear,
    addMessage,
    setNarratorTyping,
    updateStats,
    advanceTime,
    addTimelineEntry,
    setBackgroundImage,
  } = useGameStore()

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isSubmitting || !character) return

    const playerInput = input.trim()
    setInput('')
    setIsSubmitting(true)

    // 添加玩家消息
    addMessage({
      role: 'player',
      content: playerInput,
      year: currentYear,
      age: currentYear - character.birthYear,
    })

    // 显示叙述者正在写
    setNarratorTyping(true)

    try {
      // 调用 AI（当前为 Mock）
      const response = await callAIDialog({
        character,
        stats,
        history: messages.slice(-10),
        playerInput,
        currentYear,
      })

      setNarratorTyping(false)

      // 添加叙述者回复
      addMessage({
        role: 'narrator',
        content: response.narration,
        year: currentYear + response.yearAdvance,
        age: currentYear - character.birthYear + response.yearAdvance,
        backgroundImageHint: response.backgroundImagePrompt,
      })

      // 更新状态
      if (Object.keys(response.statsChange).length > 0) {
        updateStats(response.statsChange as any)
      }

      // 推进时间
      if (response.yearAdvance > 0) {
        advanceTime(response.yearAdvance)
      }

      // 添加时间线记录
      addTimelineEntry({
        year: currentYear + response.yearAdvance,
        age: currentYear - character.birthYear + response.yearAdvance,
        type: response.eventType,
        title: response.eventTitle,
        content: response.narration.slice(0, 100) + '…',
        statsChange: response.statsChange as any,
      })

      // 更新背景图（Mock：使用随机渐变）
      if (response.backgroundImagePrompt) {
        // 真实接入时替换为: const img = await callAIImage({ prompt: buildBackgroundPrompt(response.backgroundImagePrompt), style: 'background' })
        // setBackgroundImage(img.imageUrl)
        // Mock：生成随机渐变
        const mockGradient = generateMockBackground(response.eventType)
        setBackgroundImage(mockGradient)
      }

    } catch (error) {
      setNarratorTyping(false)
      addMessage({
        role: 'system',
        content: '叙事暂时停止，请稍后再试',
      })
    } finally {
      setIsSubmitting(false)
      textareaRef.current?.focus()
    }
  }, [input, isSubmitting, character, stats, messages, currentYear, addMessage, setNarratorTyping, updateStats, advanceTime, addTimelineEntry, setBackgroundImage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // 自动高度
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  if (!character) return null

  return (
    <div className="relative border-t border-parchment/10 glass-panel">
      <div className="px-4 md:px-6 py-4">
        <div className="relative flex items-end gap-3">
          {/* 文本输入区 */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={`告诉我，${character.name}想做什么……`}
              disabled={isSubmitting}
              className="literary-input w-full px-4 py-3 rounded-sm text-sm font-literary resize-none leading-relaxed min-h-[48px] max-h-[120px] disabled:opacity-50"
              rows={1}
              aria-label="行动输入"
            />

            {/* 快捷提示 */}
            <div className="absolute bottom-2 right-3 flex items-center gap-2 pointer-events-none">
              <span className="font-ui text-[10px] text-dust/30">
                Enter 发送 · Shift+Enter 换行
              </span>
            </div>
          </div>

          {/* 发送按钮 */}
          <motion.button
            onClick={handleSubmit}
            disabled={!input.trim() || isSubmitting}
            className="flex-none w-10 h-10 flex items-center justify-center rounded-sm transition-all duration-300 disabled:opacity-30"
            style={{
              background: input.trim() && !isSubmitting
                ? 'linear-gradient(135deg, #c8962a, #d4a843)'
                : 'rgba(245,240,232,0.08)',
            }}
            whileHover={input.trim() ? { scale: 1.05 } : {}}
            whileTap={input.trim() ? { scale: 0.95 } : {}}
            aria-label="发送行动"
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-4 h-4 border-2 border-ink/40 border-t-ink rounded-full animate-spin"
                />
              ) : (
                <motion.svg
                  key="send"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={input.trim() ? '#1a1611' : '#8c8070'}
                  strokeWidth="2"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* 底部装饰 */}
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="font-ui text-[10px] text-dust/30">
            {character.name} · {currentYear}年
          </span>

          {/* 字数计数 */}
          {input.length > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-ui text-[10px] text-dust/40"
            >
              {input.length}/500
            </motion.span>
          )}
        </div>
      </div>
    </div>
  )
})

// 生成 Mock 背景渐变（真实接入时移除）
function generateMockBackground(eventType: string): string {
  const gradients: Record<string, string> = {
    joy: 'linear-gradient(135deg, #1a1208 0%, #2a1f08 50%, #0d0b08 100%)',
    tragedy: 'linear-gradient(135deg, #0d0b08 0%, #140b0e 50%, #0d0b08 100%)',
    event: 'linear-gradient(135deg, #080d14 0%, #0d1220 50%, #0d0b08 100%)',
    milestone: 'linear-gradient(135deg, #0d0b08 0%, #1a1808 50%, #0d0b08 100%)',
    action: 'linear-gradient(135deg, #0d0b08 0%, #121008 50%, #0d0b08 100%)',
  }
  return gradients[eventType] ?? gradients.action
}
