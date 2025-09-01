'use client'

import { useState } from 'react'
import { MessageSquare, Plus, X, Edit3, Trash2 } from 'lucide-react'

interface Annotation {
  id: string
  text: string
  timestamp: string
  section?: string
}

export default function AnnotationPanel() {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      text: '自由能原理是一个非常有启发性的理论框架，试图统一解释大脑的工作原理。',
      timestamp: '2024-01-15 14:30',
      section: '3.2 核心学术贡献'
    },
    {
      id: '2',
      text: 'Friston的H-index达到285，这在神经科学领域是非常罕见的成就。',
      timestamp: '2024-01-15 15:45',
      section: '2.1 文献计量指标'
    }
  ])
  
  const [newAnnotation, setNewAnnotation] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const addAnnotation = () => {
    if (newAnnotation.trim()) {
      const annotation: Annotation = {
        id: Date.now().toString(),
        text: newAnnotation.trim(),
        timestamp: new Date().toLocaleString('zh-CN'),
      }
      setAnnotations(prev => [annotation, ...prev])
      setNewAnnotation('')
    }
  }

  const deleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id))
  }

  const startEditing = (annotation: Annotation) => {
    setEditingId(annotation.id)
    setEditText(annotation.text)
  }

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      setAnnotations(prev => prev.map(ann => 
        ann.id === editingId 
          ? { ...ann, text: editText.trim(), timestamp: new Date().toLocaleString('zh-CN') }
          : ann
      ))
      setEditingId(null)
      setEditText('')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b border-academic-200">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-academic-600" />
          <h3 className="font-semibold text-academic-900">我的批注</h3>
        </div>
        <p className="text-sm text-academic-600 mt-1">
          对报告内容进行批注和笔记
        </p>
      </div>

      {/* 添加新批注 */}
      <div className="p-4 border-b border-academic-200">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="添加新批注..."
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAnnotation()}
            className="flex-1 px-3 py-2 text-sm border border-academic-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={addAnnotation}
            disabled={!newAnnotation.trim()}
            className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 批注列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {annotations.length === 0 ? (
          <div className="text-center text-academic-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-academic-300" />
            <p>还没有批注</p>
            <p className="text-sm">点击上方输入框添加批注</p>
          </div>
        ) : (
          <div className="space-y-4">
            {annotations.map((annotation) => (
              <div key={annotation.id} className="bg-academic-50 rounded-lg p-3">
                {editingId === annotation.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-academic-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm bg-academic-300 text-academic-700 rounded hover:bg-academic-400 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-academic-700 flex-1">{annotation.text}</p>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => startEditing(annotation)}
                          className="p-1 text-academic-500 hover:text-academic-700 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteAnnotation(annotation.id)}
                          className="p-1 text-academic-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-academic-500">
                        {annotation.timestamp}
                      </span>
                      {annotation.section && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {annotation.section}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部统计 */}
      <div className="p-4 border-t border-academic-200 bg-academic-50">
        <div className="text-sm text-academic-600">
          共 {annotations.length} 条批注
        </div>
      </div>
    </div>
  )
}
