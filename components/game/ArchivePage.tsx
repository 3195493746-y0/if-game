'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { FadeIn } from '@/components/animations/MotionElements'
import { getAgeStage } from '@/lib/utils'

export default function ArchivePage() {
  const { character, timeline, messages, stats, currentYear, setPhase } = useGameStore()

  if (!character) {
    return (
      <div className="min-h-[100dvh] bg-ink-deep flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-literary text-dust text-lg">尚无存档</p>
          <button
            onClick={() => setPhase('landing')}
            className="font-ui text-sm text-amber-500 hover:text-amber-400 transition-colors tracking-wider"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    )
  }

  const age = currentYear - character.birthYear
  const totalMessages = messages.filter((m) => m.role === 'player').length

  return (
    <main className="min-h-[100dvh] bg-ink-deep text-parchment">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 glass-panel border-b border-parchment/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setPhase('playing')}
          className="font-ui text-sm text-dust hover:text-parchment transition-colors flex items-center gap-2"
        >
          <span className="text-amber-500">←</span>
          回到人生
        </button>
        <h1 className="font-literary text-base text-parchment/80">人生回顾</h1>
        <div className="w-16" />
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-12">

        {/* 人物摘要卡 */}
        <FadeIn delay={0.1}>
          <div className="glass-panel rounded-sm p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-literary text-2xl text-parchment">{character.name}</h2>
                <p className="font-ui text-dust text-sm mt-1">
                  {character.birthYear}年生 · {character.birthplace} · {character.country}
                </p>
              </div>
              <div className="text-right">
                <p className="font-literary text-amber-500 text-2xl">{age}</p>
                <p className="font-ui text-dust text-xs">{getAgeStage(age)}</p>
              </div>
            </div>

            {/* 统计 */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-parchment/10">
              {[
                { label: '经历事件', value: timeline.length },
                { label: '行动次数', value: totalMessages },
                { label: '走过年岁', value: age },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="font-literary text-amber-500 text-xl">{value}</p>
                  <p className="font-ui text-dust/60 text-xs">{label}</p>
                </div>
              ))}
            </div>

            {/* 当前状态 */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { label: '健康', value: stats.health },
                { label: '财富', value: stats.wealth },
                { label: '心境', value: stats.mood },
                { label: '智慧', value: stats.wisdom },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-ui text-xs text-dust/60 w-10">{label}</span>
                  <div className="flex-1 h-1 bg-parchment/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500/70 rounded-full transition-all duration-1000"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="font-ui text-xs text-dust/40 w-8 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* 时间线 */}
        <FadeIn delay={0.3}>
          <div>
            <h3 className="font-literary text-lg text-parchment/80 mb-6">
              人生时间线
            </h3>

            {timeline.length === 0 ? (
              <p className="font-literary text-dust/50 text-sm italic text-center py-8">
                旅程尚未留下痕迹
              </p>
            ) : (
              <div className="relative space-y-0">
                {/* 时间线轴 */}
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent" />

                {timeline.map((entry, index) => {
                  const typeColor = {
                    joy: '#4a6741',
                    tragedy: '#8b2635',
                    event: '#6a7fa8',
                    milestone: '#c8962a',
                    action: '#5c5448',
                  }[entry.type] ?? '#5c5448'

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="flex gap-4 pb-6 group"
                    >
                      {/* 时间点 */}
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className="w-[9px] h-[9px] rounded-full border-2 border-ink-deep"
                          style={{ backgroundColor: typeColor }}
                        />
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0 pb-2 border-b border-parchment/5 group-last:border-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-literary text-sm text-parchment/80">{entry.title}</span>
                          <span className="font-ui text-[10px] text-dust/40">{entry.age}岁 · {entry.year}年</span>
                        </div>
                        <p className="font-literary text-xs text-dust/60 leading-relaxed line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </FadeIn>

        {/* 操作按钮 */}
        <FadeIn delay={0.5}>
          <div className="flex flex-col gap-3 pb-8">
            <button
              onClick={() => setPhase('playing')}
              className="btn-primary py-3 rounded-sm font-literary text-sm tracking-widest"
            >
              继续{character.name}的人生
            </button>
            <button
              onClick={() => {
                useGameStore.getState().resetGame()
                setPhase('landing')
              }}
              className="py-3 border border-dust/20 text-dust hover:text-parchment text-sm font-ui tracking-wider rounded-sm transition-all hover:border-dust/40"
            >
              结束此段人生，重新开始
            </button>
          </div>
        </FadeIn>
      </div>
    </main>
  )
}
