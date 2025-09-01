'use client'

import { useState } from 'react'
import { Search, Filter, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NetworkGraph from '@/components/NetworkGraph'

// 扩展的学者数据
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
  }
]

export default function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterField, setFilterField] = useState<string>('all')
  const [selectedScholar, setSelectedScholar] = useState<string | null>(null)

  const filteredScholars = scholars.filter(scholar => {
    const matchesSearch = 
      scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholar.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholar.field.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesField = filterField === 'all' || scholar.field === filterField
    
    return matchesSearch && matchesField
  })

  const getUniqueFields = () => {
    const fields = scholars.map(s => s.field)
    return ['all', ...Array.from(new Set(fields))]
  }

  const handleScholarClick = (scholarId: string) => {
    setSelectedScholar(selectedScholar === scholarId ? null : scholarId)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* 页面头部 */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">学者合作网络</h1>
            <p className="text-xl text-primary-100">
              探索学者之间的合作关系网络，发现学术界的连接模式
            </p>
          </div>
        </section>

        {/* 控制面板 */}
        <section className="bg-white border-b border-academic-200 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* 搜索框 */}
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索学者..."
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

                {/* 网络图控制按钮 */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-academic-600 hover:text-primary-600 transition-colors" title="放大">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-academic-600 hover:text-primary-600 transition-colors" title="缩小">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-academic-600 hover:text-primary-600 transition-colors" title="重置视图">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 网络图 */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-academic-900 mb-2">合作网络图</h2>
                <p className="text-academic-600">
                  节点大小代表H指数，连线粗细表示合作强度。点击节点查看学者详情。
                </p>
              </div>
              
              <NetworkGraph scholars={filteredScholars} />
            </div>
          </div>
        </section>

        {/* 学者列表 */}
        <section className="py-8 bg-academic-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-academic-900 mb-6">网络中的学者</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScholars.map((scholar) => (
                <div
                  key={scholar.id}
                  className={`card cursor-pointer transition-all duration-200 ${
                    selectedScholar === scholar.id 
                      ? 'ring-2 ring-primary-500 bg-primary-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleScholarClick(scholar.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-academic-200 flex-shrink-0">
                      {scholar.image ? (
                        <img 
                          src={scholar.image} 
                          alt={scholar.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-academic-300 flex items-center justify-center">
                          <span className="text-academic-600 font-semibold">
                            {scholar.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-academic-900 truncate">{scholar.name}</h3>
                      <p className="text-sm text-academic-600 truncate">{scholar.institution}</p>
                      <p className="text-xs text-academic-500">{scholar.field}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary-600">H-index: {scholar.hIndex}</div>
                      <div className="text-xs text-academic-500">{scholar.connections.length} 个合作者</div>
                    </div>
                  </div>
                  
                  {selectedScholar === scholar.id && (
                    <div className="mt-3 pt-3 border-t border-academic-200">
                      <h4 className="text-sm font-medium text-academic-900 mb-2">合作者：</h4>
                      <div className="flex flex-wrap gap-1">
                        {scholar.connections.map(connectionId => {
                          const connection = scholars.find(s => s.id === connectionId)
                          return connection ? (
                            <span
                              key={connectionId}
                              className="text-xs bg-academic-200 text-academic-700 px-2 py-1 rounded"
                            >
                              {connection.name.split(' ').slice(-1)[0]}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredScholars.length === 0 && (
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
