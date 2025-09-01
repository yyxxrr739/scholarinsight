'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'

// 学者数据用于搜索建议
const scholars = [
  { id: 'karl-friston', name: 'Karl J. Friston', shortName: 'K. Friston' },
  { id: 'yoshua-bengio', name: 'Yoshua Bengio', shortName: 'Y. Bengio' },
  { id: 'geoffrey-hinton', name: 'Geoffrey Hinton', shortName: 'G. Hinton' },
  { id: 'andrew-ng', name: 'Andrew Ng', shortName: 'A. Ng' },
  { id: 'yann-lecun', name: 'Yann LeCun', shortName: 'Y. LeCun' },
  { id: 'jordan-michael', name: 'Michael I. Jordan', shortName: 'M. Jordan' },
  { id: 'demis-hassabis', name: 'Demis Hassabis', shortName: 'D. Hassabis' },
  { id: 'fei-fei-li', name: 'Fei-Fei Li', shortName: 'F. Li' }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

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
    setIsSearchExpanded(false)
    // TODO: 导航到学者页面
    console.log('Selected:', suggestion)
  }

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-white">ScholarInsight</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              首页
            </Link>
            <Link href="/scholars" className="text-gray-300 hover:text-white transition-colors">
              学者列表
            </Link>
            <Link href="/network" className="text-gray-300 hover:text-white transition-colors">
              合作网络
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              关于我们
            </Link>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchExpanded ? (
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索学者姓名..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(suggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-64 pl-4 pr-12 py-2 text-sm text-white bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 搜索建议 */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg z-50">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 text-white hover:bg-gray-800/50 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                href="/scholars" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                学者列表
              </Link>
              <Link 
                href="/network" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                合作网络
              </Link>
              <Link 
                href="/about" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                关于我们
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
