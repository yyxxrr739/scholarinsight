'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface ScrollIndicatorProps {
  targetId?: string // Optional target element ID to scroll to
  className?: string
  text?: string
}

export default function ScrollIndicator({ 
  targetId, 
  className = '', 
  text = '向下滚动查看更多内容' 
}: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle scroll detection
  useEffect(() => {
    if (!isMobile) {
      setIsVisible(false)
      return
    }

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Hide indicator when user has scrolled down more than 100px
      // or when they're near the bottom of the page
      const shouldHide = scrollTop > 100 || (scrollTop + windowHeight) >= (documentHeight - 100)
      setIsVisible(!shouldHide)
    }

    // Ensure the page is fully loaded before checking scroll position
    const initializeScrollDetection = () => {
      // Check if the page has enough content to scroll
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      
      // Only show indicator if there's content to scroll to
      if (documentHeight > windowHeight + 100) {
        handleScroll()
        window.addEventListener('scroll', handleScroll)
      } else {
        setIsVisible(false)
      }
    }

    // Use multiple strategies to ensure proper initialization
    const timer1 = setTimeout(initializeScrollDetection, 100)
    const timer2 = setTimeout(initializeScrollDetection, 500) // Fallback timer
    
    // Use requestAnimationFrame to ensure DOM is fully rendered
    const rafTimer = requestAnimationFrame(() => {
      requestAnimationFrame(initializeScrollDetection)
    })
    
    // Also check when the page is fully loaded
    if (document.readyState === 'complete') {
      initializeScrollDetection()
    } else {
      window.addEventListener('load', initializeScrollDetection)
    }

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      cancelAnimationFrame(rafTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('load', initializeScrollDetection)
    }
  }, [isMobile])

  const handleClick = () => {
    if (targetId) {
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    } else {
      // Scroll down by viewport height
      window.scrollBy({
        top: window.innerHeight * 0.8,
        behavior: 'smooth'
      })
    }
  }

  if (!isVisible || !isMobile) {
    return null
  }

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 scroll-indicator ${className}`}>
      <button
        onClick={handleClick}
        className="flex flex-col items-center space-y-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 animate-bounce"
        aria-label="向下滚动查看更多内容"
      >
        <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
          {text}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 animate-pulse" />
      </button>
    </div>
  )
}
