'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import NetworkGraph from '@/components/NetworkGraph'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
        </div>
      </main>

      <Footer />
    </div>
  )
}
