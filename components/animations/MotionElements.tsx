'use client'

import { useEffect, useRef, memo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface ParticleFieldProps {
  count?: number
  className?: string
}

// 永久循环粒子背景 —— 独立 memo 组件避免父级重渲染
export const ParticleField = memo(function ParticleField({
  count = 60,
  className = '',
}: ParticleFieldProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }))

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-500/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity * 0.3, p.opacity, p.opacity * 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
})

// 文字扫光效果
interface TextGlowProps {
  children: React.ReactNode
  className?: string
}

export const TextGlow = memo(function TextGlow({ children, className = '' }: TextGlowProps) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        textShadow: '0 0 40px rgba(200, 150, 42, 0.3)',
      }}
    >
      {children}
    </span>
  )
})

// 渐入容器
interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  className = '',
  direction = 'up',
}: FadeInProps) {
  const initial = {
    opacity: 0,
    y: direction === 'up' ? 16 : direction === 'down' ? -16 : 0,
    x: direction === 'left' ? 16 : direction === 'right' ? -16 : 0,
  }

  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 磁吸按钮
interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  strength?: number
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  disabled = false,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    animate(x, (e.clientX - cx) * strength, { duration: 0.3, ease: 'easeOut' })
    animate(y, (e.clientY - cy) * strength, { duration: 0.3, ease: 'easeOut' })
  }

  const handleMouseLeave = () => {
    animate(x, 0, { duration: 0.5, ease: [0.16, 1, 0.3, 1] })
    animate(y, 0, { duration: 0.5, ease: [0.16, 1, 0.3, 1] })
  }

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// 数字滚动动画
interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedNumber({ value, duration = 0.8, className = '' }: AnimatedNumberProps) {
  const motionValue = useMotionValue(value)
  const rounded = useTransform(motionValue, (v) => Math.round(v))
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current !== value) {
      animate(motionValue, value, { duration, ease: 'easeOut' })
      prevValue.current = value
    }
  }, [value, duration, motionValue])

  return <motion.span className={className}>{rounded}</motion.span>
}
