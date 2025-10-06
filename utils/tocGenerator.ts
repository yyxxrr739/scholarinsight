/**
 * 从HTML内容中自动提取目录结构
 */

export interface TocSection {
  id: string
  title: string
  level: number
  subsections?: TocSection[]
}

export interface TocItem {
  id: string
  title: string
  level: number
}

/**
 * 从HTML字符串中提取标题结构
 */
export function extractTocFromHtml(htmlContent: string): TocSection[] {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    
    // 查找所有带有id的标题元素 (h1, h2, h3, h4)
    const headings = doc.querySelectorAll('h1[id], h2[id], h3[id], h4[id]')
    
    const tocItems: TocItem[] = []
    
    headings.forEach(heading => {
      const id = heading.getAttribute('id')
      const title = heading.textContent?.trim() || ''
      const level = parseInt(heading.tagName.charAt(1))
      
      if (id && title) {
        tocItems.push({ id, title, level })
      }
    })
    
    // 将扁平结构转换为层级结构
    return buildTocHierarchy(tocItems)
  } catch (error) {
    console.error('Error extracting TOC from HTML:', error)
    return []
  }
}

/**
 * 将扁平的标题列表转换为层级结构
 */
function buildTocHierarchy(items: TocItem[]): TocSection[] {
  const result: TocSection[] = []
  const stack: TocSection[] = []
  
  items.forEach(item => {
    const section: TocSection = {
      id: item.id,
      title: item.title,
      level: item.level,
      subsections: []
    }
    
    // 调整栈以匹配当前层级
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      // 顶级标题
      result.push(section)
    } else {
      // 子标题
      const parent = stack[stack.length - 1]
      if (!parent.subsections) {
        parent.subsections = []
      }
      parent.subsections.push(section)
    }
    
    stack.push(section)
  })
  
  return result
}

/**
 * 根据标题内容过滤掉目录页面本身
 */
export function filterTocSections(sections: TocSection[]): TocSection[] {
  return sections.filter(section => 
    !section.title.includes('目录') && 
    !section.title.includes('Table of Contents') &&
    !section.title.includes('Contents')
  )
}

/**
 * 标准化章节ID，用于跳转
 */
export function normalizeSectionId(sectionId: string): string {
  return sectionId.replace(/^section-/, '')
}

/**
 * 滚动到指定章节
 */
export function scrollToSection(sectionId: string): void {
  // 首先尝试查找精确的ID
  let element = document.getElementById(sectionId)
  
  // 如果没找到，尝试添加'section-'前缀
  if (!element) {
    element = document.getElementById(`section-${sectionId}`)
  }
  
  // 如果还没找到，尝试在html-report-content容器内查找
  if (!element) {
    const reportContainer = document.querySelector('.html-report-content')
    if (reportContainer) {
      element = reportContainer.querySelector(`#${sectionId}`) as HTMLElement
      if (!element) {
        element = reportContainer.querySelector(`#section-${sectionId}`) as HTMLElement
      }
    }
  }
  
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    })
    
    // 添加高亮效果
    element.style.transition = 'background-color 0.3s ease'
    element.style.backgroundColor = '#fef3c7'
    
    setTimeout(() => {
      element.style.backgroundColor = ''
    }, 2000)
  } else {
    console.warn(`Section with ID "${sectionId}" not found`)
  }
}
