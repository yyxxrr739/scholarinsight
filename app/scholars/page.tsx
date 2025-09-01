'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// 模拟学者数据
const scholars = [
  {
    id: 'karl-friston',
    name: 'Karl J. Friston',
    hIndex: 285,
    institution: 'University College London',
    field: 'Theoretical Neuroscience',
    image: 'https://picture-search.tiangong.cn/image/rt/f009eb9bfbfca01ab6d15840acace810.jpg',
    citations: 370000,
    publications: 1200,
    country: 'UK',
    hasReport: true
  },
  {
    id: 'yoshua-bengio',
    name: 'Yoshua Bengio',
    hIndex: 245,
    institution: 'University of Montreal',
    field: 'Deep Learning',
    citations: 320000,
    publications: 800,
    country: 'Canada',
    hasReport: false
  },
  {
    id: 'geoffrey-hinton',
    name: 'Geoffrey Hinton',
    hIndex: 235,
    institution: 'University of Toronto',
    field: 'Deep Learning',
    citations: 310000,
    publications: 750,
    country: 'Canada',
    hasReport: false
  },
  {
    id: 'andrew-ng',
    name: 'Andrew Ng',
    hIndex: 185,
    institution: 'Stanford University',
    field: 'Machine Learning',
    citations: 250000,
    publications: 600,
    country: 'USA',
    hasReport: false
  },
  {
    id: 'yann-lecun',
    name: 'Yann LeCun',
    hIndex: 175,
    institution: 'New York University',
    field: 'Computer Vision',
    citations: 220000,
    publications: 550,
    country: 'USA',
    hasReport: false
  },
  {
    id: 'jordan-michael',
    name: 'Michael I. Jordan',
    hIndex: 165,
    institution: 'University of California, Berkeley',
    field: 'Machine Learning',
    citations: 200000,
    publications: 500,
    country: 'USA',
    hasReport: false
  }
]

type SortField = 'name' | 'hIndex' | 'citations' | 'publications'
type SortOrder = 'asc' | 'desc'

export default function ScholarsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('hIndex')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterField, setFilterField] = useState<string>('all')

  // 过滤和排序学者
  const filteredAndSortedScholars = scholars
    .filter(scholar => {
      const matchesSearch = 
        scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.field.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesField = filterField === 'all' || scholar.field === filterField
      
      return matchesSearch && matchesField
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'name') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
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

  const getUniqueFields = () => {
    const fields = scholars.map(s => s.field)
    return ['all', ...Array.from(new Set(fields))]
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* 页面头部 */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">学者列表</h1>
            <p className="text-xl text-primary-100">
              探索全球顶尖学者的学术贡献与影响力
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
                  placeholder="搜索学者姓名、机构或研究领域..."
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
                    value={filterField}
                    onChange={(e) => setFilterField(e.target.value)}
                    className="px-3 py-2 border border-academic-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {getUniqueFields().map(field => (
                      <option key={field} value={field}>
                        {field === 'all' ? '所有领域' : field}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 学者列表 */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* 排序选项 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-academic-600">
                共找到 {filteredAndSortedScholars.length} 位学者
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-academic-600">排序方式：</span>
                <button
                  onClick={() => handleSort('name')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    sortField === 'name' ? 'bg-primary-100 text-primary-700' : 'hover:bg-academic-100'
                  }`}
                >
                  <span>姓名</span>
                  {sortField === 'name' && (
                    sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={() => handleSort('hIndex')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    sortField === 'hIndex' ? 'bg-primary-100 text-primary-700' : 'hover:bg-academic-100'
                  }`}
                >
                  <span>H-index</span>
                  {sortField === 'hIndex' && (
                    sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={() => handleSort('citations')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    sortField === 'citations' ? 'bg-primary-100 text-primary-700' : 'hover:bg-academic-100'
                  }`}
                >
                  <span>引用量</span>
                  {sortField === 'citations' && (
                    sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* 学者卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedScholars.map((scholar) => (
                <Link
                  key={scholar.id}
                  href={`/scholars/${scholar.id}`}
                  className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    {/* 头像 */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-academic-200 flex-shrink-0">
                      {scholar.image ? (
                        <img 
                          src={scholar.image} 
                          alt={scholar.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-academic-300 flex items-center justify-center">
                          <span className="text-academic-600 font-semibold text-lg">
                            {scholar.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-academic-900 truncate">{scholar.name}</h3>
                        {scholar.hasReport && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                            有报告
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-academic-600 mb-1 truncate">{scholar.institution}</p>
                      <p className="text-sm text-academic-500 mb-3">{scholar.field}</p>
                      
                      {/* 指标 */}
                      <div className="flex items-center space-x-4 text-xs text-academic-600">
                        <div>
                          <span className="font-medium">H-index:</span> {scholar.hIndex}
                        </div>
                        <div>
                          <span className="font-medium">引用:</span> {(scholar.citations / 1000).toFixed(0)}k
                        </div>
                        <div>
                          <span className="font-medium">论文:</span> {scholar.publications}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 空状态 */}
            {filteredAndSortedScholars.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-academic-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-academic-400" />
                </div>
                <h3 className="text-lg font-semibold text-academic-900 mb-2">未找到匹配的学者</h3>
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
