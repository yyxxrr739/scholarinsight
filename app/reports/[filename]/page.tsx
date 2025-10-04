'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Download, Calendar, User, Building2, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// 报告数据
const reports = [
  {
    id: "karl-friston-academic-report",
    filename: "Karl_Friston_Academic_Report.html",
    title: "Karl Friston学术情报分析报告",
    description: "深度分析知名理论神经科学家Karl Friston的学术贡献、影响力与合作网络",
    author: "ScholarInsight AI",
    date: "2024-01-15",
    category: "学者分析",
    tags: ["神经科学", "理论神经科学", "自由能原理", "SPM", "Karl Friston"],
    subject: {
      type: "scholar",
      name: "Karl J. Friston",
      institution: "University College London",
      field: "Theoretical Neuroscience"
    },
    summary: "本报告全面分析了Karl Friston的学术生涯、核心贡献和影响力。作为自由能原理的提出者和SPM软件的开发者，Friston在理论神经科学领域具有举足轻重的地位。报告深入探讨了他的理论框架、方法论贡献以及对整个领域的影响。",
    featured: true,
    thumbnail: "https://picture-search.tiangong.cn/image/rt/f009eb9bfbfca01ab6d15840acace810.jpg"
  },
  {
    id: "wellcome-trust-centre-analysis",
    filename: "Wellcome_Trust_Centre_Analysis_Report.html",
    title: "深度解析：Wellcome Centre for Human Neuroimaging (WCHN) 如何定义现代脑科学研究",
    description: "全面剖析WCHN的核心技术、战略思想与生态系统，系统性地揭示其成功的蓝图",
    author: "ScholarInsight AI",
    date: "2024-01-20",
    category: "机构分析",
    tags: ["神经影像", "研究机构", "WCHN", "SPM", "开放科学", "脑科学"],
    subject: {
      type: "institution",
      name: "Wellcome Centre for Human Neuroimaging",
      institution: "University College London",
      field: "Neuroscience"
    },
    summary: "本报告深入分析了WCHN这一世界级神经影像研究中心的成功模式。从方法论革命（SPM）、理论基石（贝叶斯大脑）到技术前沿（7T MRI、可穿戴MEG），WCHN构建了一个强大的创新飞轮。报告还探讨了其开放科学战略和全球合作网络。",
    featured: true,
    thumbnail: "https://agents-download.skywork.ai/image/rt/fa8e364e9f474c5b0f624eeb3e98d38b.jpg"
  }
]

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [reportContent, setReportContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filename = params.filename as string
  const report = reports.find(r => r.filename === filename)

  useEffect(() => {
    const loadReport = async () => {
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

    if (filename) {
      loadReport()
    }
  }, [filename])

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
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

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `/reports/${filename}`
    link.download = filename
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
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
