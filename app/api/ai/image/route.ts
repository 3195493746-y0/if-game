import { NextRequest, NextResponse } from 'next/server'

const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, style } = body

    const apiKey = process.env.QWEN_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'QWEN_API_KEY not configured' }, { status: 500 })
    }

    const isPortrait = style === 'portrait'
    const enhancedPrompt = isPortrait
      ? `portrait illustration, ${prompt}, detailed face, soft lighting, no text`
      : `atmospheric scene, ${prompt}, cinematic, wide shot, no text`
    const size = isPortrait ? '1024*1280' : '1280*720'

    const response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'wan2.6-image',
        input: { prompt: enhancedPrompt },
        parameters: { size },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Qwen API error:', errorText)
      return NextResponse.json({ error: 'Qwen API request failed' }, { status: 502 })
    }

    const data = await response.json()

    let imageUrl = ''
    try {
      const content = data.output?.choices?.[0]?.message?.content
      if (typeof content === 'string') {
        const urlMatch = content.match(/https?:\/\/[^\\s"'<>]+/)
        if (urlMatch) imageUrl = urlMatch[0]
      }
    } catch (e) {
      console.error('Failed to extract image URL from Qwen response:', e)
    }

    if (!imageUrl) imageUrl = data.output?.image_url || data.output?.url || ''
    if (!imageUrl) {
      console.error('No image URL found in Qwen response:', JSON.stringify(data))
      return NextResponse.json({ error: 'No image URL in response' }, { status: 502 })
    }

    return NextResponse.json({ imageUrl, prompt: enhancedPrompt })
  } catch (error) {
    console.error('Image API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
