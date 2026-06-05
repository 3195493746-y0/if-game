'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { useGameStore } from '@/store/gameStore'

interface TypewriterTextProps {
  text: string
  messageId: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export const TypewriterText = memo(function TypewriterText({
  text,
  messageId,
  speed,
  className = '',
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { settings, markMessageRevealed } = useGameStore()

  const typingSpeed = speed ?? settings.typingSpeed

  useEffect(() => {
    // 重置
    indexRef.current = 0
    setDisplayedText('')
    setIsComplete(false)

    const type = () => {
      if (indexRef.current < text.length) {
        indexRef.current++
        setDisplayedText(text.slice(0, indexRef.current))
        timerRef.current = setTimeout(type, typingSpeed)
      } else {
        setIsComplete(true)
        markMessageRevealed(messageId)
        onComplete?.()
      }
    }

    timerRef.current = setTimeout(type, 300) // 初始延迟

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, messageId, typingSpeed]) // eslint-disable-line react-hooks/exhaustive-deps

  // 点击跳过
  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setDisplayedText(text)
    setIsComplete(true)
    markMessageRevealed(messageId)
    onComplete?.()
  }

  return (
    <span
      className={`${className} cursor-pointer`}
      onClick={!isComplete ? handleSkip : undefined}
      title={!isComplete ? '点击跳过' : undefined}
    >
      {displayedText}
      {!isComplete && <span className="typing-cursor" />}
    </span>
  )
})
