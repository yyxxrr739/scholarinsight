'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronDown, Building2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import reportsData from '@/data/reports.json'

type SortField = 'name' | 'hIndex' | 'citations' | 'publications'
type SortOrder = 'asc' | 'desc'
type SubjectType = 'all' | 'scholar' | 'institution'

export default function ScholarsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('hIndex')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterField, setFilterField] = useState<string>('all')
  const [subjectTypeFilter, setSubjectTypeFilter] = useState<SubjectType>('all')

  // Function to map specific fields to broader categories
  const mapFieldToCategory = (field: string): string => {
    const fieldLower = field.toLowerCase()
    
    // Philosophy category
    if (fieldLower.includes('philosophy') || fieldLower.includes('mind') || fieldLower.includes('cognitive science')) {
      return '哲学'
    }
    
    // Neuroscience category
    if (fieldLower.includes('neuroscience') || fieldLower.includes('neuroimaging') || fieldLower.includes('brain') || 
        fieldLower.includes('theoretical') || fieldLower.includes('computational') || fieldLower.includes('anatomy')) {
      return '神经科学'
    }
    
    // Artificial Intelligence category
    if (fieldLower.includes('artificial intelligence') || fieldLower.includes('deep learning') || 
        fieldLower.includes('ai') || fieldLower.includes('machine learning') || fieldLower.includes('neural network')) {
      return '人工智能'
    }
    
    // Default fallback
    return '神经科学'
  }

  // Extract scholars and institutions from reports data
  const subjects = reportsData.reports.map(report => ({
    id: report.networkNode.id,
    name: report.networkNode.name,
    type: report.subject.type as 'scholar' | 'institution',
    hIndex: report.networkNode.hIndex || 0,
    institution: report.networkNode.institution,
    field: report.networkNode.field,
    category: mapFieldToCategory(report.networkNode.field),
    image: report.networkNode.image,
    citations: report.networkNode.citations || (report.networkNode.hIndex || 0) * 1000,
    citationsIsEstimated: !report.networkNode.citations,
    publications: report.networkNode.papers || Math.floor((report.networkNode.hIndex || 0) * 3),
    publicationsIsEstimated: !report.networkNode.papers || 
      (report.networkNode.id === 'richard-frackowiak' && report.networkNode.papers === 450) ||
      (report.networkNode.id === 'philipp-schwartenbeck' && report.networkNode.papers === 65),
    country: report.networkNode.institution.includes('UK') || report.networkNode.institution.includes('London') ? 'UK' :
             report.networkNode.institution.includes('Canada') || report.networkNode.institution.includes('Montreal') ? 'Canada' :
             report.networkNode.institution.includes('USA') || report.networkNode.institution.includes('Stanford') || report.networkNode.institution.includes('Berkeley') ? 'USA' :
             report.networkNode.institution.includes('Australia') || report.networkNode.institution.includes('Monash') ? 'Australia' :
             report.networkNode.institution.includes('Germany') || report.networkNode.institution.includes('Tuebingen') ? 'Germany' :
             report.networkNode.institution.includes('Denmark') ? 'Denmark' : 'Other',
    hasReport: true,
    // For linking - scholars use /scholars/[id], institutions use the link from networkNode
    link: report.subject.type === 'scholar' ? `/scholars/${report.networkNode.id}` : report.networkNode.link
  }))

  // 过滤和排序学者和机构
  const filteredAndSortedSubjects = subjects
    .filter(subject => {
      const matchesSearch = 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.field.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesField = filterField === 'all' || subject.category === filterField
      const matchesType = subjectTypeFilter === 'all' || subject.type === subjectTypeFilter
      
      return matchesSearch && matchesField && matchesType
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

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [SortField, SortOrder]
    setSortField(field)
    setSortOrder(order)
  }

  const getSortDisplayValue = () => {
    const orderText = sortOrder === 'asc' ? '升序' : '降序'
    const fieldText = {
      'name': 'A-Z',
      'hIndex': 'H-index',
      'citations': '引用量',
      'publications': '论文数'
    }[sortField]
    return `${fieldText} (${orderText})`
  }

  const getUniqueFields = () => {
    const categories = subjects.map(s => s.category)
    return ['all', ...Array.from(new Set(categories))]
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* 页面头部 */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">学者与机构</h1>
            <p className="text-xl text-primary-100">
              探索全球顶尖学者的学术贡献与研究机构的影响力
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
                  placeholder="搜索学者、机构名称或研究领域..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-academic-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* 筛选器 */}
              <div className="flex items-center space-x-4">
                {/* 类型筛选 */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-academic-600" />
                  <select
                    value={subjectTypeFilter}
                    onChange={(e) => setSubjectTypeFilter(e.target.value as SubjectType)}
                    className="px-3 py-2 border border-academic-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">所有类型</option>
                    <option value="scholar">学者</option>
                    <option value="institution">机构</option>
                  </select>
                </div>
                
                {/* 领域筛选 */}
                <div className="flex items-center space-x-2">
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

        {/* 学者和机构列表 */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* 排序选项 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-academic-600">
                共找到 {filteredAndSortedSubjects.length} 个结果
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-academic-600">排序方式：</span>
                <div className="relative">
                  <select
                    value={`${sortField}-${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-white border border-academic-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm min-w-[140px]"
                  >
                    <option value="name-asc">A-Z (升序)</option>
                    <option value="name-desc">A-Z (降序)</option>
                    <option value="hIndex-desc">H-index (降序)</option>
                    <option value="hIndex-asc">H-index (升序)</option>
                    <option value="citations-desc">引用量 (降序)</option>
                    <option value="citations-asc">引用量 (升序)</option>
                    <option value="publications-desc">论文数 (降序)</option>
                    <option value="publications-asc">论文数 (升序)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-academic-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedSubjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={subject.link}
                  className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    {/* 头像/图标 */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-academic-200 flex-shrink-0">
                      {subject.image ? (
                        <img 
                          src={subject.image} 
                          alt={subject.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-academic-300 flex items-center justify-center">
                          {subject.type === 'institution' ? (
                            <Building2 className="w-8 h-8 text-academic-600" />
                          ) : (
                            <span className="text-academic-600 font-semibold text-lg">
                              {subject.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <h3 className="font-semibold text-academic-900 truncate">{subject.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          subject.type === 'institution' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {subject.type === 'institution' ? '机构' : '学者'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-academic-600 mb-1 truncate">{subject.institution}</p>
                      <p className="text-sm text-academic-500 mb-3">{subject.category}</p>
                      
                      {/* 指标 */}
                      {subject.type === 'scholar' && (
                        <div className="flex items-center space-x-4 text-xs text-academic-600">
                          <div>
                            <span className="font-medium">H-index:</span> {subject.hIndex}
                          </div>
                          <div>
                            <span className="font-medium">引用:</span> {(subject.citations / 1000).toFixed(0)}k
                            {subject.citationsIsEstimated && <span className="text-academic-500 ml-1">（估算）</span>}
                          </div>
                          <div>
                            <span className="font-medium">论文:</span> {subject.publications}
                            {subject.publicationsIsEstimated && <span className="text-academic-500 ml-1">（估算）</span>}
                          </div>
                        </div>
                      )}
                      {subject.type === 'institution' && (
                        <div className="text-xs text-academic-600">
                          <span className="font-medium">领域:</span> {subject.field}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 空状态 */}
            {filteredAndSortedSubjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-academic-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-academic-400" />
                </div>
                <h3 className="text-lg font-semibold text-academic-900 mb-2">未找到匹配的结果</h3>
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
