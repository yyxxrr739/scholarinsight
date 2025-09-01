'use client'

import { useState } from 'react'
import { ChevronLeft, BookOpen, MessageSquare, Share2, Download } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScholarSidebar from '@/components/ScholarSidebar'
import ReportContent from '@/components/ReportContent'
import AnnotationPanel from '@/components/AnnotationPanel'

// 模拟学者数据
const scholars = [
  {
    id: 'karl-friston',
    name: 'Karl J. Friston',
    hIndex: 285,
    institution: 'University College London',
    field: 'Theoretical Neuroscience',
    image: 'https://picture-search.tiangong.cn/image/rt/f009eb9bfbfca01ab6d15840acace810.jpg',
    reportFile: '学者信息分析报告_Karl_Friston_ZH.md'
  },
  {
    id: 'yoshua-bengio',
    name: 'Yoshua Bengio',
    hIndex: 245,
    institution: 'University of Montreal',
    field: 'Deep Learning',
    reportFile: null
  },
  {
    id: 'geoffrey-hinton',
    name: 'Geoffrey Hinton',
    hIndex: 235,
    institution: 'University of Toronto',
    field: 'Deep Learning',
    reportFile: null
  },
  {
    id: 'andrew-ng',
    name: 'Andrew Ng',
    hIndex: 185,
    institution: 'Stanford University',
    field: 'Machine Learning',
    reportFile: null
  }
]

export default function ScholarPage({ params }: { params: { id: string } }) {
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [showAnnotations, setShowAnnotations] = useState(false)
  
  const currentScholar = scholars.find(s => s.id === params.id)
  
  if (!currentScholar) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-academic-900 mb-4">学者未找到</h1>
            <p className="text-academic-600">抱歉，您查找的学者信息不存在。</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        {/* 左侧边栏 */}
        <div className="w-80 bg-white border-r border-academic-200 flex-shrink-0">
          <ScholarSidebar 
            scholars={scholars}
            currentScholar={currentScholar}
            selectedSection={selectedSection}
            onSectionSelect={setSelectedSection}
          />
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex">
          {/* 报告内容 */}
          <div className="flex-1 bg-academic-50">
            <div className="p-6">
              {/* 页面头部 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-academic-200">
                    {currentScholar.image && (
                      <img 
                        src={currentScholar.image} 
                        alt={currentScholar.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-academic-900">{currentScholar.name}</h1>
                    <p className="text-academic-600">{currentScholar.institution}</p>
                    <p className="text-academic-500 text-sm">{currentScholar.field}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    H-index: {currentScholar.hIndex}
                  </div>
                  <button className="btn-secondary">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="btn-secondary">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 报告内容 */}
              {currentScholar.reportFile ? (
                <ReportContent 
                  reportFile={currentScholar.reportFile}
                  selectedSection={selectedSection}
                />
              ) : (
                <div className="card text-center">
                  <BookOpen className="w-16 h-16 text-academic-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-academic-900 mb-2">
                    报告正在准备中
                  </h3>
                  <p className="text-academic-600">
                    该学者的详细分析报告正在制作中，敬请期待。
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 右侧批注面板 */}
          {showAnnotations && (
            <div className="w-80 bg-white border-l border-academic-200 flex-shrink-0">
              <AnnotationPanel />
            </div>
          )}
        </div>

        {/* 批注切换按钮 */}
        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className="fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </main>

      <Footer />
    </div>
  )
}
