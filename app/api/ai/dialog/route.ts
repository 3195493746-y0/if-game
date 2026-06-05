import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'DEEPSEEK_API_KEY not configured' }, { status: 500 })
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages,
        temperature: 0.85,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API error:', errorText)
      return NextResponse.json({ error: 'DeepSeek API request failed' }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Empty response from DeepSeek' }, { status: 502 })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      console.error('Failed to parse DeepSeek JSON response:', content)
      return NextResponse.json({ error: 'Invalid JSON from DeepSeek' }, { status: 502 })
    }

    const result = {
      narration: parsed.narration || '时间在你眼前缓缓展开...',
      yearAdvance: typeof parsed.yearAdvance === 'number' ? parsed.yearAdvance : 1,
      statsChange: parsed.statsChange || {},
      eventType: ['action', 'event', 'milestone', 'tragedy', 'joy'].includes(parsed.eventType)
        ? parsed.eventType
        : 'action',
      eventTitle: parsed.eventTitle || '一段时光',
      backgroundImagePrompt: parsed.backgroundImagePrompt || '',
      portraitUpdateNeeded: parsed.portraitUpdateNeeded ?? false,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Dialog API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
