'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { FadeIn } from '@/components/animations/MotionElements'

export default function SettingsPage() {
  const { settings, updateSettings, setPhase, character } = useGameStore()

  const typingSpeeds = [
    { label: '慢速', desc: '文字缓缓流淌', value: 80 },
    { label: '适中', desc: '舒适阅读节奏', value: 40 },
    { label: '快速', desc: '思绪如电', value: 15 },
    { label: '瞬间', desc: '立即显示全文', value: 0 },
  ]

  return (
    <main className="min-h-[100dvh] bg-ink-deep text-parchment">
      <header className="sticky top-0 z-10 glass-panel border-b border-parchment/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setPhase(character ? 'playing' : 'landing')}
          className="font-ui text-sm text-dust hover:text-parchment transition-colors flex items-center gap-2"
        >
          <span className="text-amber-500">←</span>
          返回
        </button>
        <h1 className="font-literary text-base text-parchment/80">偏好设定</h1>
        <div className="w-16" />
      </header>

      <div className="max-w-lg mx-auto px-6 py-10 space-y-10">

        {/* 文字速度 */}
        <FadeIn delay={0.1}>
          <SettingSection title="叙事节奏" desc="控制AI叙事文字的显现速度">
            <div className="grid grid-cols-2 gap-2">
              {typingSpeeds.map(({ label, desc, value }) => (
                <button
                  key={label}
                  onClick={() => updateSettings({ typingSpeed: value })}
                  className={`p-3 rounded-sm text-left transition-all duration-200 border ${
                    settings.typingSpeed === value
                      ? 'border-amber-500/40 bg-amber-500/10 text-parchment'
                      : 'border-parchment/10 bg-parchment/3 text-dust hover:border-parchment/20'
                  }`}
                >
                  <p className="font-ui text-sm">{label}</p>
                  <p className="font-ui text-xs opacity-60 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </SettingSection>
        </FadeIn>

        {/* 字体大小 */}
        <FadeIn delay={0.2}>
          <SettingSection title="文字大小" desc="叙事区域的字号偏好">
            <div className="flex gap-2">
              {(['sm', 'md', 'lg'] as const).map((size) => {
                const labels = { sm: '小', md: '中', lg: '大' }
                return (
                  <button
                    key={size}
                    onClick={() => updateSettings({ textSize: size })}
                    className={`flex-1 py-3 rounded-sm font-literary transition-all duration-200 border ${
                      settings.textSize === size
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                        : 'border-parchment/10 text-dust hover:border-parchment/20'
                    }`}
                    style={{ fontSize: size === 'sm' ? '12px' : size === 'md' ? '14px' : '16px' }}
                  >
                    {labels[size]}号字
                  </button>
                )
              })}
            </div>
          </SettingSection>
        </FadeIn>

        {/* 音效 */}
        <FadeIn delay={0.3}>
          <SettingSection title="声音" desc="游戏音效与背景音乐">
            <div className="space-y-3">
              <ToggleItem
                label="打字音效"
                desc="文字出现时的轻微音效"
                checked={settings.sfxEnabled}
                onChange={(v) => updateSettings({ sfxEnabled: v })}
              />
              <ToggleItem
                label="背景音乐"
                desc="环境氛围音乐（接入后生效）"
                checked={settings.bgmEnabled}
                onChange={(v) => updateSettings({ bgmEnabled: v })}
              />
            </div>
          </SettingSection>
        </FadeIn>

        {/* 主题 */}
        <FadeIn delay={0.4}>
          <SettingSection title="阅读主题" desc="界面色调风格">
            <div className="flex gap-2">
              {[
                { id: 'dark' as const, label: '暗夜', desc: '深邃的墨色基调' },
                { id: 'sepia' as const, label: '泛黄', desc: '旧书卷的温暖色调' },
              ].map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => updateSettings({ theme: id })}
                  className={`flex-1 p-4 rounded-sm text-left transition-all border ${
                    settings.theme === id
                      ? 'border-amber-500/40 bg-amber-500/10 text-parchment'
                      : 'border-parchment/10 text-dust hover:border-parchment/20'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded-sm mb-2"
                    style={{
                      background: id === 'dark'
                        ? 'linear-gradient(135deg, #0d0b08, #1a1611)'
                        : 'linear-gradient(135deg, #2c2418, #3d3020)',
                    }}
                  />
                  <p className="font-ui text-sm">{label}</p>
                  <p className="font-ui text-xs opacity-60">{desc}</p>
                </button>
              ))}
            </div>
          </SettingSection>
        </FadeIn>

        {/* API 配置预留 */}
        <FadeIn delay={0.5}>
          <SettingSection title="AI 接入（开发者）" desc="配置大模型与图像生成API">
            <div className="p-4 border border-dashed border-parchment/15 rounded-sm space-y-3">
              <input
                type="text"
                placeholder="大模型 API Key（接入时填写）"
                className="literary-input w-full px-3 py-2 rounded-sm text-xs font-ui"
              />
              <input
                type="text"
                placeholder="图像生成 API Key（接入时填写）"
                className="literary-input w-full px-3 py-2 rounded-sm text-xs font-ui"
              />
              <p className="font-ui text-[10px] text-dust/40">
                当前运行于 Mock 模式 · 填写 API Key 后将切换为真实 AI 推理
              </p>
            </div>
          </SettingSection>
        </FadeIn>

        <div className="pb-8" />
      </div>
    </main>
  )
}

function SettingSection({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-literary text-base text-parchment/90">{title}</h3>
        {desc && <p className="font-ui text-xs text-dust/50 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function ToggleItem({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-ui text-sm text-parchment/80">{label}</p>
        <p className="font-ui text-xs text-dust/50">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
          checked ? 'bg-amber-500/80' : 'bg-parchment/15'
        }`}
      >
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-parchment shadow-sm"
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </button>
    </div>
  )
}
