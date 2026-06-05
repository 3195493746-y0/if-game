import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化年份和年龄
export function formatAge(age: number): string {
  if (age < 1) return '出生'
  if (age === 1) return '1岁'
  return `${age}岁`
}

export function getAgeStage(age: number): string {
  if (age < 3) return '婴儿'
  if (age < 7) return '幼年'
  if (age < 13) return '少年'
  if (age < 18) return '青少年'
  if (age < 25) return '青年'
  if (age < 40) return '中青年'
  if (age < 60) return '中年'
  if (age < 75) return '老年'
  return '暮年'
}

// 状态值转文字描述
export function describeHealth(value: number): string {
  if (value >= 85) return '精力充沛'
  if (value >= 65) return '身体尚可'
  if (value >= 45) return '略感疲惫'
  if (value >= 25) return '健康告警'
  return '岌岌可危'
}

export function describeMood(value: number): string {
  if (value >= 85) return '心旷神怡'
  if (value >= 65) return '平静愉悦'
  if (value >= 45) return '波澜起伏'
  if (value >= 25) return '郁郁寡欢'
  return '深渊边缘'
}

export function describeWealth(value: number): string {
  if (value >= 85) return '衣食无忧'
  if (value >= 65) return '温饱有余'
  if (value >= 45) return '勉强度日'
  if (value >= 25) return '捉襟见肘'
  return '一无所有'
}

// 延迟工具
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 生成唯一 ID
export const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
