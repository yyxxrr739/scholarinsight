'use client'

import { useState } from 'react'
import { ChevronLeft, BookOpen, Menu, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScholarSidebar from '@/components/ScholarSidebar'
import ReportContent from '@/components/ReportContent'
import HtmlReportContent from '@/components/HtmlReportContent'
import ScrollIndicator from '@/components/ScrollIndicator'
import reportsData from '@/data/reports.json'
import { TocSection } from '@/utils/tocGenerator'

export default function ScholarPage({ params }: { params: { id: string } }) {
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [dynamicToc, setDynamicToc] = useState<TocSection[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Extract all subjects (scholars and institutions) from reports data
  const subjects = reportsData.reports.map(report => ({
    id: report.networkNode.id,
    name: report.networkNode.name,
    type: report.subject.type as 'scholar' | 'institution',
    hIndex: report.networkNode.hIndex,
    institution: report.networkNode.institution,
    field: report.networkNode.field,
    image: report.networkNode.image,
    reportFile: null,
    htmlReportFile: report.filename,
    link: report.subject.type === 'scholar' ? `/scholars/${report.networkNode.id}` : `/reports/static/${report.filename.replace('.html', '')}`
  }))
  
  // Keep scholars variable for finding current scholar
  const scholars = subjects
  
  const currentScholar = scholars.find(s => s.id === params.id)
  
  if (!currentScholar) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
      <main className="flex-1 flex items-center justify-center pt-16">
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
      
      <main className="flex-1 flex pt-16">
        {/* 移动端侧边栏遮罩 */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 左侧边栏 */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-80 bg-white border-r border-academic-200 flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <ScholarSidebar 
            scholars={scholars}
            currentScholar={currentScholar}
            selectedSection={selectedSection}
            onSectionSelect={setSelectedSection}
            dynamicToc={dynamicToc}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* 主内容区域 */}
        <div className="flex-1">
          {/* 报告内容 */}
          <div className="flex-1 bg-academic-50">
            <div className="p-1 lg:p-2 mobile-report-container">
              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-20 left-4 z-30 bg-white border border-academic-300 rounded-lg p-2 shadow-md hover:bg-academic-50 transition-colors"
              >
                <Menu className="w-5 h-5 text-academic-700" />
              </button>

              {/* 页面头部 */}
              <div className="flex items-center justify-between mb-6 lg:ml-0 ml-12">
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
                
              </div>

              {/* 报告内容 */}
              <div id="report-content">
                {currentScholar.htmlReportFile ? (
                  <HtmlReportContent 
                    reportFilename={currentScholar.htmlReportFile}
                    selectedSection={selectedSection}
                    onTocGenerated={setDynamicToc}
                  />
                ) : currentScholar.reportFile ? (
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
          </div>
        </div>
      </main>

      <Footer />
      
      {/* 移动端滚动提示 */}
      <ScrollIndicator 
        targetId="report-content"
        text="向下滚动查看报告内容"
      />
    </div>
  )
}
