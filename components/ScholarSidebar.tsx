'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Users, BookOpen, Search } from 'lucide-react'
import { TocSection } from '@/utils/tocGenerator'

interface Scholar {
  id: string
  name: string
  hIndex: number | null
  institution: string
  field: string
  image?: string
  reportFile?: string | null
}

interface ScholarSidebarProps {
  scholars: Scholar[]
  currentScholar: Scholar
  selectedSection: string
  onSectionSelect: (section: string) => void
  dynamicToc?: TocSection[]
}

// 报告目录结构
const reportSections = [
  {
    id: 'executive-summary',
    title: '执行摘要',
    subsections: [
      { id: 'analysis-objectives', title: '分析目标' },
      { id: 'key-findings', title: '关键发现' },
      { id: 'completeness-assessment', title: '信息完整度评估' }
    ]
  },
  {
    id: 'scholar-profile',
    title: '第一章 学者档案',
    subsections: [
      { id: 'basic-info', title: '1.1 基础信息' },
      { id: 'education', title: '1.2 教育背景' },
      { id: 'career', title: '1.3 职业生涯' },
      { id: 'honors', title: '1.4 身份与荣誉' }
    ]
  },
  {
    id: 'academic-impact',
    title: '第二章 学术影响力评估',
    subsections: [
      { id: 'bibliometric-indicators', title: '2.1 文献计量指标' },
      { id: 'rankings', title: '2.2 权威榜单与排名' },
      { id: 'impact-conclusion', title: '2.3 影响力评估结论' }
    ]
  },
  {
    id: 'academic-contributions',
    title: '第三章 学术贡献分析',
    subsections: [
      { id: 'research-evolution', title: '3.1 研究脉络演进' },
      { id: 'core-contributions', title: '3.2 核心学术贡献' },
      { id: 'publications', title: '3.3 主要出版物分析' },
      { id: 'projects', title: '3.4 科研项目与基金' },
      { id: 'representative-works', title: '3.5 代表作分析' }
    ]
  },
  {
    id: 'collaboration-network',
    title: '第四章 学术网络与合作',
    subsections: [
      { id: 'institutional-network', title: '4.1 机构网络' },
      { id: 'collaboration-analysis', title: '4.2 合作网络分析' },
      { id: 'academic-lineage', title: '4.3 学术传承' }
    ]
  },
  {
    id: 'thought-portrait',
    title: '第五章 思想画像分析',
    subsections: [
      { id: 'core-ideas', title: '5.1 核心思想体系' },
      { id: 'intellectual-heritage', title: '5.2 思想渊源与影响' },
      { id: 'theory-application', title: '5.3 理论与应用结合' },
      { id: 'future-trends', title: '5.4 未来发展趋势' },
      { id: 'controversies', title: '5.5 争议与批评' }
    ]
  },
  {
    id: 'knowledge-dissemination',
    title: '第六章 知识传播与转化',
    subsections: [
      { id: 'tools-datasets', title: '6.1 软件工具与数据集' },
      { id: 'public-influence', title: '6.2 公众影响力' },
      { id: 'industry-transfer', title: '6.3 产业转化' }
    ]
  },
  {
    id: 'comprehensive-assessment',
    title: '第七章 综合评估与展望',
    subsections: [
      { id: 'academic-status', title: '7.1 学术地位评估' },
      { id: 'contribution-evaluation', title: '7.2 学术贡献评价' },
      { id: 'future-prospects', title: '7.3 未来发展趋势' }
    ]
  }
]

export default function ScholarSidebar({ 
  scholars, 
  currentScholar, 
  selectedSection, 
  onSectionSelect,
  dynamicToc 
}: ScholarSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // 使用动态目录或默认目录
  const tocSections = dynamicToc && dynamicToc.length > 0 ? dynamicToc : reportSections

  // 当动态目录加载时，自动展开第一个章节
  useEffect(() => {
    if (dynamicToc && dynamicToc.length > 0 && expandedSections.length === 0) {
      setExpandedSections([dynamicToc[0].id])
    }
  }, [dynamicToc, expandedSections.length])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const filteredScholars = scholars.filter(scholar =>
    scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholar.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholar.field.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex flex-col sticky top-16 overflow-hidden">
      {/* 学者列表 */}
      <div className="p-3 border-b border-academic-200">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-3 h-3 text-academic-600" />
          <h3 className="font-medium text-academic-900 text-sm">学者</h3>
        </div>
        
        {/* 搜索框 */}
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-academic-400" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 text-xs border border-academic-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* 学者列表 */}
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {filteredScholars.map((scholar) => (
            <Link
              key={scholar.id}
              href={`/scholars/${scholar.id}`}
              className={`block p-2 rounded transition-colors ${
                scholar.id === currentScholar.id
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'hover:bg-academic-100 text-academic-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-academic-200 flex-shrink-0">
                  {scholar.image && (
                    <img 
                      src={scholar.image} 
                      alt={scholar.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs truncate">{scholar.name}</div>
                  <div className="text-xs text-academic-500 truncate">{scholar.institution}</div>
                </div>
                <div className="text-xs bg-academic-200 text-academic-700 px-1.5 py-0.5 rounded text-xs">
                  {scholar.hIndex || 'N/A'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 报告目录 */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-3 h-3 text-academic-600" />
          <h3 className="font-medium text-academic-900 text-sm">目录</h3>
        </div>

        <div className="space-y-0.5">
          {tocSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full text-left p-1.5 rounded transition-colors flex items-center justify-between ${
                  expandedSections.includes(section.id)
                    ? 'bg-academic-100 text-academic-900'
                    : 'hover:bg-academic-50 text-academic-700'
                }`}
              >
                <span className="text-xs font-medium truncate flex-1">{section.title}</span>
                {expandedSections.includes(section.id) ? (
                  <ChevronDown className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                )}
              </button>
              
              {expandedSections.includes(section.id) && (
                <div className="ml-3 mt-0.5 space-y-0.5">
                  {section.subsections?.map((subsection) => (
                    <button
                      key={subsection.id}
                      onClick={() => onSectionSelect(subsection.id)}
                      className={`w-full text-left p-1.5 rounded transition-colors text-xs ${
                        selectedSection === subsection.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-academic-50 text-academic-600'
                      }`}
                    >
                      <span className="truncate block">{subsection.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
