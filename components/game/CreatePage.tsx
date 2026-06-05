'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { FadeIn, MagneticButton } from '@/components/animations/MotionElements'
import { buildPortraitPrompt } from '@/lib/api'
import type { CharacterProfile } from '@/types/game'

// 默认占位人物图（SVG内联）
const PORTRAIT_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect fill='%231a1611' width='300' height='400'/%3E%3Cellipse cx='150' cy='140' rx='60' ry='70' fill='%23c8962a' opacity='0.15'/%3E%3Ccircle cx='150' cy='120' r='45' fill='%23c8962a' opacity='0.08'/%3E%3Cpath d='M80 280 Q150 230 220 280 L220 400 L80 400Z' fill='%23c8962a' opacity='0.06'/%3E%3Ctext x='150' y='370' text-anchor='middle' fill='%238c8070' font-size='11' font-family='serif'%3E待创造的灵魂%3C/text%3E%3C/svg%3E`

// 国家/地区选项
const COUNTRIES = [
  '中国', '日本', '法国', '英国', '美国', '德国', '俄罗斯', '意大利',
  '西班牙', '印度', '巴西', '韩国', '澳大利亚', '加拿大', '墨西哥',
]

// 性格倾向
const PERSONALITIES = [
  '内敛沉思型', '热情开朗型', '理性分析型', '感性浪漫型',
  '冒险进取型', '温和保守型', '创意艺术型', '实干务实型',
]

// 家庭背景
const FAMILY_BACKGROUNDS = [
  '贫困家庭', '普通工薪家庭', '小康中产家庭', '书香文化家庭',
  '商人世家', '官宦背景', '农村务农家庭', '单亲家庭', '孤儿',
]

interface FormData {
  name: string
  birthYear: number
  birthplace: string
  country: string
  family: string
  personality: string
  appearance: string
  initialDream: string
}

export default function CreatePage() {
  const { setCharacter, setPhase, updateCharacterPortrait } = useGameStore()
  const [form, setForm] = useState<FormData>({
    name: '',
    birthYear: 1990,
    birthplace: '上海',
    country: '中国',
    family: '普通工薪家庭',
    personality: '内敛沉思型',
    appearance: '',
    initialDream: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [portraitUrl, setPortraitUrl] = useState<string>(PORTRAIT_PLACEHOLDER)
  const [portraitGenerated, setPortraitGenerated] = useState(false)
  const [step, setStep] = useState(1) // 1: 基础信息, 2: 性格外貌

  const updateForm = useCallback((key: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    // 当关键信息变更时，重置立绘
    if (['name', 'birthYear', 'country', 'appearance'].includes(key)) {
      setPortraitGenerated(false)
    }
  }, [])

  const handleGeneratePortrait = async () => {
    if (!form.name || isGenerating) return
    setIsGenerating(true)

    try {
      const tempProfile: CharacterProfile = {
        id: 'preview',
        ...form,
        currentAge: 0,
        portraitStyle: 'child',
      }
      const prompt = buildPortraitPrompt(tempProfile)
      // Mock: 模拟 AI 生成
      await new Promise((r) => setTimeout(r, 1800))
      // 在真实接入时替换为: const result = await callAIImage({ prompt, style: 'portrait', age: 0 })
      // 使用生成式 SVG 占位图（展示人物轮廓）
      const mockPortraitSvg = generateMockPortrait(form.name, form.appearance)
      setPortraitUrl(mockPortraitSvg)
      setPortraitGenerated(true)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStart = () => {
    if (!form.name) return
    const character: CharacterProfile = {
      id: `char-${Date.now()}`,
      ...form,
      currentAge: 0,
      portraitUrl,
      portraitStyle: 'child',
    }
    setCharacter(character)
    if (portraitGenerated) updateCharacterPortrait(portraitUrl)
    setPhase('playing')
  }

  const isFormValid = form.name.trim().length > 0

  return (
    <main className="relative min-h-[100dvh] bg-ink-deep flex overflow-hidden">
      {/* 左侧：表单区域 */}
      <div className="flex-1 flex flex-col overflow-y-auto px-6 md:px-12 py-8 md:py-12 max-w-2xl">

        {/* 返回按钮 */}
        <FadeIn delay={0} duration={0.5}>
          <button
            className="flex items-center gap-2 text-dust hover:text-parchment transition-colors duration-300 text-sm font-ui mb-10"
            onClick={() => setPhase('landing')}
          >
            <span className="text-amber-500">←</span>
            <span>返回</span>
          </button>
        </FadeIn>

        {/* 标题 */}
        <FadeIn delay={0.1}>
          <h1 className="font-literary text-3xl md:text-4xl text-parchment mb-2">
            创造一个灵魂
          </h1>
          <p className="font-ui text-dust text-sm tracking-wide mb-8">
            描述这个将要展开人生旅途的人
          </p>
        </FadeIn>

        {/* 步骤切换 */}
        <FadeIn delay={0.2}>
          <div className="flex gap-1 mb-8">
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`flex-1 py-2 text-xs font-ui tracking-wider transition-all duration-300 border-b-2 ${
                  step === s
                    ? 'border-amber-500 text-parchment'
                    : 'border-transparent text-dust hover:text-dust-light'
                }`}
              >
                {s === 1 ? '出生与背景' : '外貌与志向'}
              </button>
            ))}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* 姓名 */}
              <FormField label="姓名" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="这个人叫什么？"
                  className="literary-input w-full px-4 py-3 rounded-sm text-sm font-ui"
                  maxLength={20}
                />
              </FormField>

              {/* 出生年份 */}
              <FormField label="出生年份">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1900}
                    max={2020}
                    value={form.birthYear}
                    onChange={(e) => updateForm('birthYear', parseInt(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="font-literary text-amber-500 w-16 text-right text-lg">
                    {form.birthYear}
                  </span>
                </div>
              </FormField>

              {/* 出生地 */}
              <FormField label="出生城市">
                <input
                  type="text"
                  value={form.birthplace}
                  onChange={(e) => updateForm('birthplace', e.target.value)}
                  placeholder="如：上海、北京、成都..."
                  className="literary-input w-full px-4 py-3 rounded-sm text-sm font-ui"
                />
              </FormField>

              {/* 国家 */}
              <FormField label="国家/地区">
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateForm('country', c)}
                      className={`px-3 py-1.5 text-xs font-ui rounded-sm transition-all duration-200 ${
                        form.country === c
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-parchment/5 text-dust hover:bg-parchment/10 border border-transparent'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </FormField>

              {/* 家庭背景 */}
              <FormField label="家庭环境">
                <div className="flex flex-wrap gap-2">
                  {FAMILY_BACKGROUNDS.map((f) => (
                    <button
                      key={f}
                      onClick={() => updateForm('family', f)}
                      className={`px-3 py-1.5 text-xs font-ui rounded-sm transition-all duration-200 ${
                        form.family === f
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-parchment/5 text-dust hover:bg-parchment/10 border border-transparent'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </FormField>

              <div className="pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!form.name.trim()}
                  className="btn-primary w-full py-3 rounded-sm font-ui text-sm tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  下一步：外貌与志向 →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* 性格倾向 */}
              <FormField label="性格倾向">
                <div className="flex flex-wrap gap-2">
                  {PERSONALITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => updateForm('personality', p)}
                      className={`px-3 py-1.5 text-xs font-ui rounded-sm transition-all duration-200 ${
                        form.personality === p
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-parchment/5 text-dust hover:bg-parchment/10 border border-transparent'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </FormField>

              {/* 外貌描述 */}
              <FormField label="外貌描述" hint="AI将据此生成人物立绘">
                <textarea
                  value={form.appearance}
                  onChange={(e) => updateForm('appearance', e.target.value)}
                  placeholder="例如：高挑，短发，眼神深邃，常穿素色衬衫，略显清瘦..."
                  className="literary-input w-full px-4 py-3 rounded-sm text-sm font-ui resize-none"
                  rows={3}
                  maxLength={200}
                />
              </FormField>

              {/* 初始梦想 */}
              <FormField label="最初的梦想" hint="这将影响AI叙事的起点">
                <textarea
                  value={form.initialDream}
                  onChange={(e) => updateForm('initialDream', e.target.value)}
                  placeholder="例如：成为一名画家，或者只是平静地生活..."
                  className="literary-input w-full px-4 py-3 rounded-sm text-sm font-ui resize-none"
                  rows={2}
                  maxLength={150}
                />
              </FormField>

              {/* 生成立绘按钮（移动端放这里） */}
              <div className="md:hidden">
                <button
                  onClick={handleGeneratePortrait}
                  disabled={!form.name || isGenerating}
                  className="w-full py-2.5 border border-amber-500/30 text-amber-500 text-xs font-ui tracking-widest rounded-sm transition-all hover:bg-amber-500/10 disabled:opacity-40"
                >
                  {isGenerating ? '生成中...' : '生成人物立绘预览'}
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-dust/30 text-dust hover:text-parchment text-sm font-ui rounded-sm transition-all"
                >
                  ← 返回
                </button>
                <MagneticButton
                  onClick={handleStart}
                  disabled={!isFormValid}
                  className="btn-primary flex-1 py-3 rounded-sm font-literary text-base tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {form.name ? `开启${form.name}的人生` : '开始人生'}
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 右侧：人物立绘展示 */}
      <div className="hidden md:flex flex-col w-80 lg:w-96 border-l border-parchment/10 bg-ink/50 p-8 items-center justify-center gap-6 sticky top-0 h-[100dvh]">
        {/* 立绘容器 */}
        <motion.div
          className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border border-parchment/10"
          layout
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={portraitUrl}
              className="absolute inset-0"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={portraitUrl}
                alt={form.name ? `${form.name}的人物立绘` : '人物立绘'}
                className="w-full h-full object-cover"
              />
              {/* 底部渐变遮罩 */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* 加载状态 */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-ink/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin mx-auto" />
                  <p className="font-literary text-xs text-dust">正在描绘...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 人物信息摘要 */}
        {form.name && (
          <motion.div
            className="text-center space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-literary text-parchment text-lg">{form.name}</p>
            <p className="font-ui text-dust text-xs">
              {form.birthYear}年生 · {form.birthplace} · {form.country}
            </p>
            <p className="font-ui text-dust/70 text-xs">{form.personality}</p>
          </motion.div>
        )}

        {/* 生成立绘按钮 */}
        <button
          onClick={handleGeneratePortrait}
          disabled={!form.name || isGenerating}
          className="w-full py-2.5 border border-amber-500/30 text-amber-500 text-xs font-ui tracking-widest rounded-sm transition-all hover:bg-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 border border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
              绘制人物立绘...
            </span>
          ) : portraitGenerated ? (
            '重新生成'
          ) : (
            '生成人物立绘'
          )}
        </button>

        <p className="font-ui text-dust/40 text-[10px] text-center leading-relaxed">
          接入AI图像生成后，
          <br />将根据外貌描述自动创作专属立绘
        </p>
      </div>
    </main>
  )
}

// 表单字段组件
function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="font-ui text-sm text-parchment/80 tracking-wider">
          {label}
          {required && <span className="text-amber-500 ml-1">*</span>}
        </label>
        {hint && <span className="font-ui text-xs text-dust/60">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

// 生成 Mock 人物立绘 SVG
function generateMockPortrait(name: string, appearance: string): string {
  const initial = name.charAt(0) || '?'
  // 根据外貌描述选择色调
  const warm = appearance.includes('温暖') || appearance.includes('阳光')
  const cool = appearance.includes('冷') || appearance.includes('疏离')
  const accent = warm ? '#d4a843' : cool ? '#6a9bcc' : '#c8962a'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#0d0b08" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
  </defs>
  
  <!-- 背景 -->
  <rect width="300" height="400" fill="url(#bg)"/>
  
  <!-- 光晕 -->
  <ellipse cx="150" cy="150" rx="80" ry="100" fill="url(#glow)" filter="url(#blur)"/>
  
  <!-- 人物轮廓（剪影风格） -->
  <!-- 头部 -->
  <ellipse cx="150" cy="120" rx="48" ry="54" fill="${accent}" opacity="0.25"/>
  <!-- 颈部 -->
  <rect x="138" y="168" width="24" height="28" fill="${accent}" opacity="0.2"/>
  <!-- 肩膀/身体 -->
  <path d="M60 220 Q90 195 138 196 L162 196 Q210 195 240 220 L250 400 L50 400Z" fill="${accent}" opacity="0.15"/>
  
  <!-- 首字母 -->
  <text x="150" y="135" text-anchor="middle" dominant-baseline="middle" 
    font-family="serif" font-size="42" fill="${accent}" opacity="0.6" font-weight="300">
    ${initial}
  </text>
  
  <!-- 装饰线 -->
  <line x1="60" y1="370" x2="240" y2="370" stroke="${accent}" stroke-opacity="0.3" stroke-width="0.5"/>
  
  <!-- 底部文字 -->
  <text x="150" y="388" text-anchor="middle" font-family="serif" font-size="10" fill="${accent}" opacity="0.5">
    ${name || '·'}
  </text>
</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
