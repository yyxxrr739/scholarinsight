'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface HtmlReportContentProps {
  reportFilename: string
  selectedSection: string
}

export default function HtmlReportContent({ reportFilename, selectedSection }: HtmlReportContentProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 加载HTML报告文件
        const response = await fetch(`/reports/${reportFilename}`)
        if (!response.ok) {
          throw new Error('报告文件未找到')
        }
        
        const htmlContent = await response.text()
        
        // 提取body内容，避免HTML文档结构影响页面
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        
        // 获取body内容，但排除可能影响布局的全局样式
        const bodyContent = doc.body.innerHTML
        
        // 提取style标签中的样式，但限制作用域
        const styleTags = doc.querySelectorAll('style')
        let scopedStyles = ''
        styleTags.forEach(styleTag => {
          let css = styleTag.textContent || ''
          // 为所有CSS规则添加作用域前缀，避免影响全局样式
          css = css.replace(/([^{}]+)\s*{/g, `.html-report-content $1 {`)
          scopedStyles += css
        })
        
        // 组合样式和内容
        const finalContent = `
          <style>
            .html-report-content {
              all: initial;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
              line-height: 1.8;
              color: #333;
              font-size: 16px;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            .html-report-content * {
              box-sizing: border-box;
            }
            ${scopedStyles}
          </style>
          <div class="html-report-content">
            ${bodyContent}
          </div>
        `
        
        setContent(finalContent)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载报告时发生错误')
        console.error('Error loading HTML report:', err)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [reportFilename])

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
    <div className="card overflow-hidden p-0">
      <div 
        className="w-full"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
