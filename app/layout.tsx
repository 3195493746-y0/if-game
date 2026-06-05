import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'if —— 人生模拟器',
  description: '如果，你的人生可以重来——一款以AI为核心驱动的文学性人生模拟器',
  keywords: ['人生模拟器', 'if', 'AI游戏', '文学游戏', '互动叙事'],
  openGraph: {
    title: 'if —— 人生模拟器',
    description: '如果，你的人生可以重来',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0d0b08',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
