'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Download } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function StaticReportPage() {
  const params = useParams()
  const router = useRouter()
  const [reportContent, setReportContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filename = params.filename as string

  useEffect(() => {
    const loadReport = async () => {
      if (!filename) return
      
      try {
        setLoading(true)
        setError(null)
        
        // 加载静态HTML报告文件
        const response = await fetch(`/reports/${filename}.html`)
        if (!response.ok) {
          throw new Error('报告文件未找到')
        }
        
        const htmlContent = await response.text()
        setReportContent(htmlContent)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载报告时发生错误')
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [filename])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '学术报告',
        text: '查看这份学术分析报告',
        url: window.location.href,
      })
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `/reports/${filename}.html`
    link.download = `${filename}.html`
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* 报告头部控制栏 */}
        <section className="bg-white border-b border-academic-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/reports')}
                className="flex items-center space-x-2 text-academic-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回报告列表</span>
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <Share2 className="w-4 h-4" />
                  <span>分享</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <Download className="w-4 h-4" />
                  <span>下载</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 报告内容 */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-academic-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-academic-900 mb-2">正在加载报告</h3>
                <p className="text-academic-600">请稍候...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 text-red-600">⚠️</div>
                </div>
                <h3 className="text-lg font-semibold text-academic-900 mb-2">加载失败</h3>
                <p className="text-academic-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  重新加载
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-academic-200 overflow-hidden">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: reportContent }}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
