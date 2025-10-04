'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Calendar, User, Building2, Tag } from 'lucide-react'
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
    summary: "本报告全面分析了Karl Friston的学术生涯、核心贡献和影响力。作为自由能原理的提出者和SPM软件的开发者，Friston在理论神经科学领域具有举足轻重的地位。",
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
    summary: "本报告深入分析了WCHN这一世界级神经影像研究中心的成功模式。从方法论革命（SPM）、理论基石（贝叶斯大脑）到技术前沿（7T MRI、可穿戴MEG），WCHN构建了一个强大的创新飞轮。",
    featured: true,
    thumbnail: "https://agents-download.skywork.ai/image/rt/fa8e364e9f474c5b0f624eeb3e98d38b.jpg"
  }
]

type SortField = 'date' | 'title' | 'category'
type SortOrder = 'asc' | 'desc'

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  // 过滤和排序报告
  const filteredAndSortedReports = reports
    .filter(report => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        report.subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.subject.institution.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || report.category === filterCategory
      const matchesType = filterType === 'all' || report.subject.type === filterType
      
      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'title') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      } else if (sortField === 'date') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const getUniqueCategories = () => {
    const categories = reports.map(r => r.category)
    return ['all', ...Array.from(new Set(categories))]
  }

  const getUniqueTypes = () => {
    const types = reports.map(r => r.subject.type)
    return ['all', ...Array.from(new Set(types))]
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* 页面头部 */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">研究报告</h1>
            <p className="text-xl text-primary-100">
              深度分析学者、研究机构与企业的学术贡献与影响力
            </p>
          </div>
        </section>

        {/* 搜索和筛选 */}
        <section className="bg-white border-b border-academic-200 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索报告标题、描述、标签或主体名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-academic-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* 筛选器 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-academic-600" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-academic-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? '所有分类' : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-academic-600" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-academic-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {getUniqueTypes().map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? '所有类型' : type === 'scholar' ? '学者' : type === 'institution' ? '机构' : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 报告列表 */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* 排序选项 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-academic-600">
                共找到 {filteredAndSortedReports.length} 份报告
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-academic-600">排序方式：</span>
                <button
                  onClick={() => handleSort('date')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    sortField === 'date' ? 'bg-primary-100 text-primary-700' : 'hover:bg-academic-100'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>日期</span>
                </button>
                <button
                  onClick={() => handleSort('title')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    sortField === 'title' ? 'bg-primary-100 text-primary-700' : 'hover:bg-academic-100'
                  }`}
                >
                  <span>标题</span>
                </button>
                <button
                  onClick={() => handleSort('category')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    sortField === 'category' ? 'bg-primary-100 text-primary-700' : 'hover:bg-academic-100'
                  }`}
                >
                  <span>分类</span>
                </button>
              </div>
            </div>

            {/* 报告卡片网格 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/reports/${report.filename}`}
                  className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex flex-col h-full">
                    {/* 报告缩略图和头部信息 */}
                    <div className="flex items-start space-x-4 mb-4">
                      {/* 缩略图 */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-academic-200 flex-shrink-0">
                        {report.thumbnail ? (
                          <img 
                            src={report.thumbnail} 
                            alt={report.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-academic-300 flex items-center justify-center">
                            {report.subject.type === 'scholar' ? (
                              <User className="w-8 h-8 text-academic-600" />
                            ) : (
                              <Building2 className="w-8 h-8 text-academic-600" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* 标题和元信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-academic-900 line-clamp-2">{report.title}</h3>
                          <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                            {report.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-academic-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(report.date).toLocaleDateString('zh-CN')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{report.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 主体信息 */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-academic-700 mb-2">
                        {report.subject.type === 'scholar' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Building2 className="w-4 h-4" />
                        )}
                        <span className="font-medium">{report.subject.name}</span>
                        <span className="text-academic-500">·</span>
                        <span className="text-academic-600">{report.subject.institution}</span>
                      </div>
                      <p className="text-sm text-academic-600">{report.subject.field}</p>
                    </div>

                    {/* 描述 */}
                    <div className="flex-1 mb-4">
                      <p className="text-sm text-academic-700 line-clamp-3">{report.summary}</p>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1">
                      {report.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-academic-100 text-academic-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {report.tags.length > 4 && (
                        <span className="text-xs text-academic-500">
                          +{report.tags.length - 4} 更多
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 空状态 */}
            {filteredAndSortedReports.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-academic-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-academic-400" />
                </div>
                <h3 className="text-lg font-semibold text-academic-900 mb-2">未找到匹配的报告</h3>
                <p className="text-academic-600">请尝试调整搜索条件或筛选器</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
