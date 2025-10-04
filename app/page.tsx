'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Calendar, User, Building2, ArrowRight } from 'lucide-react'
import NetworkGraph from '@/components/NetworkGraph'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// 最新报告数据
const latestReports = [
  {
    id: "karl-friston-academic-report",
    filename: "Karl_Friston_Academic_Report.html",
    title: "Karl Friston学术情报分析报告",
    description: "深度分析知名理论神经科学家Karl Friston的学术贡献、影响力与合作网络",
    author: "ScholarInsight AI",
    date: "2024-01-15",
    category: "学者分析",
    tags: ["神经科学", "理论神经科学", "自由能原理", "SPM"],
    subject: {
      type: "scholar",
      name: "Karl J. Friston",
      institution: "University College London",
      field: "Theoretical Neuroscience"
    },
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
    tags: ["神经影像", "研究机构", "WCHN", "开放科学"],
    subject: {
      type: "institution",
      name: "Wellcome Centre for Human Neuroimaging",
      institution: "University College London",
      field: "Neuroscience"
    },
    thumbnail: "https://agents-download.skywork.ai/image/rt/fa8e364e9f474c5b0f624eeb3e98d38b.jpg"
  }
]

// 扩展的学者数据，按研究领域分类
const scholars = [
  {
    id: 'karl-friston',
    name: 'Karl J. Friston',
    shortName: 'K. Friston',
    hIndex: 285,
    institution: 'University College London',
    field: 'Theoretical Neuroscience',
    category: 'neuroscience',
    image: 'https://picture-search.tiangong.cn/image/rt/f009eb9bfbfca01ab6d15840acace810.jpg',
    connections: ['yoshua-bengio', 'geoffrey-hinton', 'andrew-ng', 'yann-lecun']
  },
  {
    id: 'yoshua-bengio',
    name: 'Yoshua Bengio',
    shortName: 'Y. Bengio',
    hIndex: 245,
    institution: 'University of Montreal',
    field: 'Deep Learning',
    category: 'ai',
    connections: ['karl-friston', 'geoffrey-hinton', 'andrew-ng', 'yann-lecun', 'jordan-michael']
  },
  {
    id: 'geoffrey-hinton',
    name: 'Geoffrey Hinton',
    shortName: 'G. Hinton',
    hIndex: 235,
    institution: 'University of Toronto',
    field: 'Deep Learning',
    category: 'ai',
    connections: ['karl-friston', 'yoshua-bengio', 'andrew-ng', 'yann-lecun']
  },
  {
    id: 'andrew-ng',
    name: 'Andrew Ng',
    shortName: 'A. Ng',
    hIndex: 185,
    institution: 'Stanford University',
    field: 'Machine Learning',
    category: 'ai',
    connections: ['karl-friston', 'yoshua-bengio', 'geoffrey-hinton', 'jordan-michael']
  },
  {
    id: 'yann-lecun',
    name: 'Yann LeCun',
    shortName: 'Y. LeCun',
    hIndex: 175,
    institution: 'New York University',
    field: 'Computer Vision',
    category: 'ai',
    connections: ['karl-friston', 'yoshua-bengio', 'geoffrey-hinton']
  },
  {
    id: 'jordan-michael',
    name: 'Michael I. Jordan',
    shortName: 'M. Jordan',
    hIndex: 165,
    institution: 'University of California, Berkeley',
    field: 'Machine Learning',
    category: 'ai',
    connections: ['yoshua-bengio', 'andrew-ng']
  },
  {
    id: 'demis-hassabis',
    name: 'Demis Hassabis',
    shortName: 'D. Hassabis',
    hIndex: 155,
    institution: 'DeepMind',
    field: 'Artificial Intelligence',
    category: 'ai',
    connections: ['yoshua-bengio', 'geoffrey-hinton']
  },
  {
    id: 'fei-fei-li',
    name: 'Fei-Fei Li',
    shortName: 'F. Li',
    hIndex: 145,
    institution: 'Stanford University',
    field: 'Computer Vision',
    category: 'ai',
    connections: ['andrew-ng', 'yann-lecun']
  }
]

// 研究领域颜色映射 - 使用彩色渐变色
const categoryColors = {
  ai: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',        // 蓝色渐变
  neuroscience: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', // 紫色渐变
  physics: 'linear-gradient(135deg, #EF4444, #DC2626)',   // 红色渐变
  biology: 'linear-gradient(135deg, #10B981, #059669)',   // 绿色渐变
  chemistry: 'linear-gradient(135deg, #F59E0B, #D97706)', // 橙色渐变
  mathematics: 'linear-gradient(135deg, #EC4899, #DB2777)' // 粉色渐变
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 生成搜索建议
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = scholars
        .filter(scholar => 
          scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholar.shortName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(scholar => scholar.name)
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
      // TODO: 实现搜索功能
      console.log('Searching for:', searchQuery)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    // TODO: 导航到学者页面
    console.log('Selected:', suggestion)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <main className="flex-1 relative flex flex-col">
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
          <section className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-6xl">
              <div className="relative">
                {/* 网络图容器 */}
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                  <NetworkGraph 
                    scholars={scholars} 
                    categoryColors={categoryColors}
                    darkMode={true}
                  />
                </div>

                {/* 图例 */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-semibold mb-3 text-sm">研究领域</h3>
                  <div className="space-y-2">
                    {Object.entries(categoryColors).map(([category, gradient]) => (
                      <div key={category} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ background: gradient }}
                        />
                        <span className="text-gray-300 text-xs capitalize">
                          {category === 'ai' ? '人工智能' : 
                           category === 'neuroscience' ? '神经科学' :
                           category === 'physics' ? '物理学' :
                           category === 'biology' ? '生物学' :
                           category === 'chemistry' ? '化学' :
                           category === 'mathematics' ? '数学' : category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 最新报告展示 */}
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">最新研究报告</h2>
                <p className="text-gray-300 text-lg">深度剖析学术前沿与创新力量</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {latestReports.map((report) => (
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
                          {report.tags.slice(0, 3).map((tag, index) => (
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
    </div>
  )
}
