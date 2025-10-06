'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Calendar, User, Building2, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// 报告数据类型定义
interface ReportSubject {
  type: string
  name: string
  institution: string
  field: string
}

interface Report {
  id: string
  filename: string
  title: string
  description: string
  author: string
  date: string
  category: string
  tags: string[]
  subject: ReportSubject
  summary: string
  featured: boolean
  thumbnail: string
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [reportContent, setReportContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filename = params.filename as string
  const report = reports.find(r => r.filename === filename)

  // 加载报告数据
  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetch('/api/reports')
        if (!response.ok) {
          throw new Error('无法加载报告数据')
        }
        const reportsData = await response.json()
        setReports(reportsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载报告数据时发生错误')
      }
    }

    loadReports()
  }, [])

  useEffect(() => {
    const loadReport = async () => {
      if (!report || !filename) return
      
      try {
        setLoading(true)
        setError(null)
        
        // 加载HTML报告文件
        const response = await fetch(`/reports/${filename}`)
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
  }, [report, filename])

  if (reports.length === 0 && !error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-academic-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-academic-900 mb-2">正在加载报告数据</h3>
            <p className="text-academic-600">请稍候...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-academic-900 mb-4">报告未找到</h1>
            <p className="text-academic-600 mb-6">抱歉，您查找的报告不存在。</p>
            <button
              onClick={() => router.push('/reports')}
              className="btn-primary"
            >
              返回报告列表
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: report.description,
        url: window.location.href,
      })
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* 报告头部信息 */}
        <section className="bg-white border-b border-academic-200 py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => router.push('/reports')}
                className="flex items-center space-x-2 text-academic-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回报告列表</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* 报告缩略图 */}
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-academic-200 flex-shrink-0">
                {report.thumbnail ? (
                  <img 
                    src={report.thumbnail} 
                    alt={report.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-academic-300 flex items-center justify-center">
                    {report.subject.type === 'scholar' ? (
                      <User className="w-12 h-12 text-academic-600" />
                    ) : (
                      <Building2 className="w-12 h-12 text-academic-600" />
                    )}
                  </div>
                )}
              </div>

              {/* 报告信息 */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-academic-900 mb-4">{report.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-academic-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(report.date).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{report.author}</span>
                  </div>
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                    {report.category}
                  </span>
                </div>

                {/* 主体信息 */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-academic-700 mb-2">
                    {report.subject.type === 'scholar' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Building2 className="w-4 h-4" />
                    )}
                    <span className="font-medium">{report.subject.name}</span>
                    <span className="text-academic-500">·</span>
                    <span className="text-academic-600">{report.subject.institution}</span>
                  </div>
                  <p className="text-academic-600">{report.subject.field}</p>
                </div>

                {/* 描述 */}
                <p className="text-academic-700 mb-4">{report.description}</p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {report.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 text-xs bg-academic-100 text-academic-600 px-2 py-1 rounded"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 btn-secondary"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>分享</span>
                  </button>
                </div>
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
