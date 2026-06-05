/**
 * Mock AI 对话 API
 * 真实接入时替换此文件中的函数实现
 * 接口签名保持不变
 */

import type {
  AIDialogRequest,
  AIDialogResponse,
  AIImageRequest,
  AIImageResponse,
  CharacterProfile,
} from '@/types/game'

// ============================================================
// 模拟叙事库 —— 按主题分类的文学性文段
// ============================================================
const NARRATIVE_FRAGMENTS = {
  work: [
    '清晨的工位上，那杯咖啡早已凉透。{name}盯着屏幕，手指悬在键盘上方，那些数字在荧光灯下显得如此陌生。窗外的城市正在缓慢苏醒，而你，已在这里待了整整三年。',
    '有些日子是灰色的。不是令人绝望的那种灰，而是像旧照片的底色，沉默而诚实。{name}在这样的日子里学会了一件事：努力不一定有回报，但放弃一定没有。',
    '老板今天说了一句话，{name}记了很久——"你很聪明，但聪明不是最稀缺的东西。"那晚，{name}在路灯下站了很久，试图搞懂这句话的重量。',
  ],
  travel: [
    '火车驶出隧道的瞬间，光突然灌进来，{name}眯起了眼。窗外是{name}从未见过的山，是某种被折叠过的寂静。旅行的意义，或许就藏在这样的瞬间里。',
    '那是一个陌生城市的雨夜。{name}撑着一把借来的伞，走进一家没有招牌的小馆。汤的味道出乎意料地好，像是某种遥远的记忆忽然触岸。',
  ],
  relationship: [
    '有些人进入你的生命，像一阵风，走了，但留下了轻微的气味。{name}在多年后仍然记得那个人说话时的样子——总是把视线落在比说话者更远的地方。',
    '爱情是一种奇怪的记账方式。{name}发现自己越来越不擅长这种计算。但也许，不擅长本身就是一种诚实。',
  ],
  introspection: [
    '三十岁那年，{name}第一次觉得自己真正认识了镜子里的人。不是更好了，只是更清楚了。这两件事，{name}曾经以为是一回事。',
    '有时候生活像一条没有目的地的江，你以为自己在掌舵，其实只是在跟随水流学习漂流的方式。{name}渐渐不再抗拒这件事。',
    '{name}学会了一件事：把"我不知道"说出口，需要比任何答案都多的勇气。',
  ],
  crisis: [
    '那段时间，{name}很难描述自己的状态——不是痛苦，也不是麻木，而是像一部旧机器，还在运转，但每个零件都在发出轻微的摩擦声。',
    '最难的不是失去，而是不知道失去的是什么。{name}在那段时间反复翻看旧照片，试图找出某个时刻，某个可以被命名的转折点。',
  ],
  joy: [
    '有时候快乐就是这么简单：一个意外的晴天，一首久违的歌，一个人忽然在人群中转身，冲你笑了一下。{name}把这个瞬间按在记忆里，很久都没有放开。',
    '{name}后来常常想起那个夏天的傍晚。橘色的光把每个人的脸都变得柔和，好像世界暂时达成了某种协议：今天，所有事情都可以暂停一下。',
  ],
}

// 随机选择一个叙事片段
function pickNarrative(theme: keyof typeof NARRATIVE_FRAGMENTS, name: string): string {
  const fragments = NARRATIVE_FRAGMENTS[theme]
  const chosen = fragments[Math.floor(Math.random() * fragments.length)]
  return chosen.replace(/{name}/g, name)
}

// 分析玩家输入的主题
function detectTheme(input: string): keyof typeof NARRATIVE_FRAGMENTS {
  if (/工作|上班|项目|老板|同事|升职|加班|公司/.test(input)) return 'work'
  if (/旅行|旅游|出发|离开|外出|流浪|漂泊/.test(input)) return 'travel'
  if (/爱|喜欢|约会|朋友|分手|结婚|恋|情人/.test(input)) return 'relationship'
  if (/思考|反思|回忆|想起|记得|感觉|觉得|明白/.test(input)) return 'introspection'
  if (/失败|崩溃|生病|难过|迷茫|放弃|绝望/.test(input)) return 'crisis'
  return 'joy'
}

// ============================================================
// 模拟随机事件
// ============================================================
const RANDOM_EVENTS = [
  { title: '意外的邂逅', theme: 'relationship' as const, statsChange: { mood: 15, relationship: 10 }, yearAdvance: 1 },
  { title: '一场大病', theme: 'crisis' as const, statsChange: { health: -20, mood: -10, wisdom: 8 }, yearAdvance: 1 },
  { title: '意外之财', theme: 'joy' as const, statsChange: { wealth: 20, mood: 10 }, yearAdvance: 1 },
  { title: '职业危机', theme: 'crisis' as const, statsChange: { wealth: -10, mood: -15, wisdom: 10 }, yearAdvance: 1 },
  { title: '一次顿悟', theme: 'introspection' as const, statsChange: { wisdom: 20, mood: 5 }, yearAdvance: 0 },
]

// ============================================================
// 主 API 函数
// ============================================================

/**
 * 模拟 AI 对话响应
 * TODO: 替换为真实大模型 API 调用
 *
 * @example 真实接入时替换为:
 * const response = await fetch('/api/ai/dialog', {
 *   method: 'POST',
 *   body: JSON.stringify(request),
 * })
 * return response.json()
 */
export async function callAIDialog(request: AIDialogRequest): Promise<AIDialogResponse> {
  // 模拟网络延迟
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200))

  const { character, playerInput } = request
  const name = character.name
  const theme = detectTheme(playerInput)

  // 随机触发突发事件 (20% 概率)
  const hasRandomEvent = Math.random() < 0.2
  const randomEvent = hasRandomEvent
    ? RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
    : null

  const mainNarration = pickNarrative(theme, name)
  const eventNarration = randomEvent
    ? `\n\n——就在此时，生活插入了一个意想不到的括号：${randomEvent.title}。${pickNarrative(randomEvent.theme, name)}`
    : ''

  const yearAdvance = Math.floor(Math.random() * 2) + 1

  // 组合 stats 变化
  const statsChange = randomEvent
    ? { ...getBaseStatsChange(theme), ...randomEvent.statsChange }
    : getBaseStatsChange(theme)

  return {
    narration: mainNarration + eventNarration,
    yearAdvance,
    statsChange,
    eventType: hasRandomEvent ? 'event' : 'action',
    eventTitle: hasRandomEvent && randomEvent ? randomEvent.title : playerInput.slice(0, 20) + '…',
    backgroundImagePrompt: generateBackgroundPrompt(theme, character),
    portraitUpdateNeeded: yearAdvance >= 5,
  }
}

function getBaseStatsChange(theme: keyof typeof NARRATIVE_FRAGMENTS) {
  const changes: Record<string, Partial<{ health: number; wealth: number; mood: number; relationship: number; wisdom: number; reputation: number }>> = {
    work: { wealth: 5, wisdom: 3, mood: -5 },
    travel: { mood: 10, wisdom: 8, health: 5 },
    relationship: { mood: 8, relationship: 10 },
    introspection: { wisdom: 12, mood: 5 },
    crisis: { health: -10, mood: -10, wisdom: 5 },
    joy: { mood: 15, health: 5, relationship: 5 },
  }
  return changes[theme] ?? {}
}

function generateBackgroundPrompt(
  theme: keyof typeof NARRATIVE_FRAGMENTS,
  character: CharacterProfile
): string {
  const cityHints: Record<string, string> = {
    work: `dimly lit office at night, city skyline through window, melancholic atmosphere`,
    travel: `misty mountain road at dawn, solitary figure, ${character.country} landscape`,
    relationship: `cafe window rain, two empty chairs, soft bokeh lights`,
    introspection: `empty bridge over river at twilight, reflection in water, philosophical mood`,
    crisis: `bare tree in winter fog, desolate street, muted colors`,
    joy: `golden hour street, warm light, ${character.birthplace} architecture`,
  }
  return cityHints[theme] ?? `atmospheric ${character.country} landscape, cinematic, literary mood`
}

/**
 * 模拟 AI 图像生成
 * TODO: 替换为真实图像生成 API
 *
 * @example 真实接入时替换为:
 * const response = await fetch('/api/ai/image', {
 *   method: 'POST',
 *   body: JSON.stringify(request),
 * })
 * return response.json()
 */
export async function callAIImage(request: AIImageRequest): Promise<AIImageResponse> {
  // 模拟延迟
  await new Promise((r) => setTimeout(r, 1500))

  // 返回本地占位图（实际接入后替换）
  const placeholderImages = {
    portrait: [
      '/assets/images/portrait-placeholder-1.svg',
      '/assets/images/portrait-placeholder-2.svg',
    ],
    background: [
      '/assets/images/bg-placeholder-1.svg',
      '/assets/images/bg-placeholder-2.svg',
    ],
  }

  const pool = placeholderImages[request.style]
  const imageUrl = pool[Math.floor(Math.random() * pool.length)]

  return {
    imageUrl,
    prompt: request.prompt,
  }
}

/**
 * 生成人物立绘 prompt
 */
export function buildPortraitPrompt(character: CharacterProfile): string {
  const ageDesc = character.currentAge < 10
    ? 'young child'
    : character.currentAge < 20
    ? 'teenager'
    : character.currentAge < 35
    ? 'young adult'
    : character.currentAge < 55
    ? 'middle-aged adult'
    : 'elderly person'

  return `Semi-realistic illustration portrait, ${ageDesc}, ${character.appearance}, 
    personality traits: ${character.personality}, 
    from ${character.birthplace} ${character.country}, 
    literary atmospheric style, warm ink wash painting texture, 
    introspective expression, soft light, no text, no background`
}

/**
 * 生成背景图 prompt
 */
export function buildBackgroundPrompt(prompt: string): string {
  return `Atmospheric literary scene: ${prompt}, 
    cinematic composition, muted palette with one warm accent, 
    deep shadows, painterly texture, NO text, NO people`
}
