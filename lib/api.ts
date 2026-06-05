/**
 * AI API 集成层
 * 调用 Vercel Serverless Function -> DeepSeek / 通义万相
 */

import type {
  AIDialogRequest,
  AIDialogResponse,
  AIImageRequest,
  AIImageResponse,
  CharacterProfile,
} from '@/types/game'
import { buildNarratorSystemPrompt } from './prompts'

function buildFallbackResponse(request: AIDialogRequest): AIDialogResponse {
  return {
    narration: '时光在这一刻微微停顿，仿佛在思考什么...',
    yearAdvance: 1,
    statsChange: {},
    eventType: 'action',
    eventTitle: request.playerInput.slice(0, 20) + '...',
    backgroundImagePrompt: '',
    portraitUpdateNeeded: false,
  }
}

export async function callAIDialog(request: AIDialogRequest): Promise<AIDialogResponse> {
  try {
    const systemPrompt = buildNarratorSystemPrompt(
      request.character,
      request.stats,
      request.currentYear
    )

    const recentHistory = request.history.slice(-10).map((msg) => ({
      role: msg.role === 'player' ? 'user' : msg.role === 'narrator' ? 'assistant' : 'system',
      content: msg.content,
    }))

    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: request.playerInput },
    ]

    const response = await fetch('/api/ai/dialog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      console.error('AI dialog API error:', response.status)
      return buildFallbackResponse(request)
    }

    const data = await response.json()
    if (data.error) {
      console.error('AI dialog API returned error:', data.error)
      return buildFallbackResponse(request)
    }

    return {
      narration: data.narration,
      yearAdvance: data.yearAdvance,
      statsChange: data.statsChange,
      eventType: data.eventType,
      eventTitle: data.eventTitle,
      backgroundImagePrompt: data.backgroundImagePrompt,
      portraitUpdateNeeded: data.portraitUpdateNeeded,
    }
  } catch (error) {
    console.error('callAIDialog error:', error)
    return buildFallbackResponse(request)
  }
}

export async function callAIImage(request: AIImageRequest): Promise<AIImageResponse> {
  try {
    const response = await fetch('/api/ai/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      console.error('AI image API error:', response.status)
      return { imageUrl: '', prompt: request.prompt }
    }

    const data = await response.json()
    if (data.error) {
      console.error('AI image API returned error:', data.error)
      return { imageUrl: '', prompt: request.prompt }
    }

    return {
      imageUrl: data.imageUrl,
      prompt: data.prompt,
    }
  } catch (error) {
    console.error('callAIImage error:', error)
    return { imageUrl: '', prompt: request.prompt }
  }
}

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

export function buildBackgroundPrompt(prompt: string): string {
  return `Atmospheric literary scene: ${prompt},
    cinematic composition, muted palette with one warm accent,
    deep shadows, painterly texture, NO text, NO people`
}
