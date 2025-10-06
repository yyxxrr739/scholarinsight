'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ReportContentProps {
  reportFile: string
  selectedSection: string
}

export default function ReportContent({ reportFile, selectedSection }: ReportContentProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load actual report content from the public/reports directory
        if (reportFile) {
          const response = await fetch(`/reports/${reportFile}`)
          if (response.ok) {
            const htmlContent = await response.text()
            setContent(htmlContent)
          } else {
            setError('报告文件未找到')
          }
        } else {
          setError('未指定报告文件')
        }
      } catch (err) {
        setError('加载报告内容时出错')
        console.error('Error loading report:', err)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [reportFile])

  // Render HTML content
  const renderContent = (htmlContent: string) => {
    return (
      <div 
        className="prose prose-academic max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-academic-600">加载报告中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card text-center">
        <h3 className="text-xl font-semibold text-academic-900 mb-2">加载失败</h3>
        <p className="text-academic-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="card">
      {renderContent(content)}
    </div>
  )
}
