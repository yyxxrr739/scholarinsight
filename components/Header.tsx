'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import reportsData from '@/data/reports.json'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  // Extract scholars and institutions from reports data for search suggestions
  const subjects = reportsData.reports.map(report => ({
    id: report.networkNode.id,
    name: report.networkNode.name,
    shortName: report.networkNode.shortName,
    type: report.subject.type as 'scholar' | 'institution',
    link: report.subject.type === 'scholar' ? `/scholars/${report.networkNode.id}` : report.networkNode.link
  }))

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = subjects
        .filter(subject => 
          subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subject.shortName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(subject => subject.name)
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
      // Find the subject by name and navigate to their page
      const subject = subjects.find(s => s.name === searchQuery.trim())
      if (subject) {
        window.location.href = subject.link
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    const subject = subjects.find(s => s.name === suggestion)
    if (subject) {
      window.location.href = subject.link
    }
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
              学者与机构
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
                      placeholder="搜索学者或机构..."
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
                学者与机构
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
