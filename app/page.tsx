'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Calendar, User, Building2, ArrowRight } from 'lucide-react'
import NetworkGraph from '@/components/NetworkGraph'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollIndicator from '@/components/ScrollIndicator'
import reportsDataRaw from '@/data/reports.json'

// 类型断言确保数据符合 ReportsData 接口
const reportsData = reportsDataRaw as any

// 从报告数据中提取网络节点信息
const networkNodes = reportsData.reports
  .filter((report: any) => report.networkNode)
  .map((report: any) => report.networkNode)

// 构建网络数据对象
const networkData = {
  nodes: networkNodes,
  connections: reportsData.connections,
  categories: reportsData.categories
}

// 最新报告数据 - 使用前两个报告
const latestReports = reportsData.reports.slice(0, 2)

// 从网络数据中提取学者和机构信息用于搜索建议
const subjects = reportsData.reports.map((report: any) => ({
  id: report.networkNode.id,
  name: report.networkNode.name,
  shortName: report.networkNode.shortName,
  type: report.subject.type,
  link: report.subject.type === 'scholar' ? `/scholars/${report.networkNode.id}` : report.networkNode.link
}))

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 生成搜索建议
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = subjects
        .filter((subject: any) => 
          subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subject.shortName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((subject: any) => subject.name)
        .slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Find the subject by name and navigate to their page
      const subject = subjects.find((s: any) => s.name === searchQuery.trim())
      if (subject) {
        window.location.href = subject.link
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    const subject = subjects.find((s: any) => s.name === suggestion)
    if (subject) {
      window.location.href = subject.link
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <main className="flex-1 relative flex flex-col pt-16">
        {/* 星空背景效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
          {/* 动态星星效果 */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* 标题区域 */}
          <section className="pt-16 pb-4 text-center flex-shrink-0">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                  人类群星闪耀时
                </h1>
                <p className="text-xl text-gray-300 mt-4 max-w-2xl">
                  深度分析学者、研究机构与企业的学术贡献与影响力，探索知识创新的前沿
                </p>
              </div>
            </div>
          </section>

          {/* 合作网络图 */}
          <section id="network-section" className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-6xl">
              <div className="relative">
                {/* 网络图容器 */}
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 md:p-6">
                  <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center">
                    <NetworkGraph 
                      data={networkData}
                      darkMode={true}
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 最新报告展示 */}
          <section id="reports-section" className="py-12 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">最新研究报告</h2>
                <p className="text-gray-300 text-lg">深度剖析学术前沿与创新力量</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {latestReports.map((report: any) => (
                  <Link
                    key={report.id}
                    href={`/reports/${report.filename}`}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start space-x-4">
                      {/* 缩略图 */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/20 flex-shrink-0">
                        {report.thumbnail ? (
                          <img 
                            src={report.thumbnail} 
                            alt={report.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {report.subject.type === 'scholar' ? (
                              <User className="w-8 h-8 text-white/60" />
                            ) : (
                              <Building2 className="w-8 h-8 text-white/60" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white line-clamp-2">{report.title}</h3>
                          <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                            {report.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-xs text-gray-300 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(report.date).toLocaleDateString('zh-CN')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {report.subject.type === 'scholar' ? (
                              <User className="w-3 h-3" />
                            ) : (
                              <Building2 className="w-3 h-3" />
                            )}
                            <span>{report.subject.name}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{report.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {report.tags.slice(0, 3).map((tag: any, index: number) => (
                            <span
                              key={index}
                              className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/reports"
                  className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-300"
                >
                  <span>查看所有报告</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      
      {/* 移动端滚动提示 */}
      <ScrollIndicator 
        targetId="reports-section"
        text="查看更多报告"
      />
    </div>
  )
}
