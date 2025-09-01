import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScholarInsight - 学者信息分析平台',
  description: '深度分析知名学者的学术贡献、影响力与合作网络',
  keywords: '学者分析,学术影响力,合作网络,学术研究',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-academic-50">
        {children}
      </body>
    </html>
  )
}
