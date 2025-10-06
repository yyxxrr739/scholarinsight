'use client'

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import * as d3 from 'd3'

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  shortName: string
  type: 'scholar' | 'institution'
  institution: string
  field: string
  category: string
  hIndex: number
  image?: string
  connections: string[]
  description?: string
}

interface NetworkConnection {
  source: string
  target: string
  strength: number
  type: string
}

interface NetworkData {
  nodes: NetworkNode[]
  connections: NetworkConnection[]
  categories: Record<string, {
    name: string
    color: string
    nodeStyle: 'circle' | 'rect'
  }>
}

interface NetworkGraphProps {
  data?: NetworkData
  darkMode?: boolean
  onZoomChange?: (zoomLevel: number) => void
}

export interface NetworkGraphRef {
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
}

const NetworkGraph = forwardRef<NetworkGraphRef, NetworkGraphProps>(({ data, darkMode = false, onZoomChange }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const currentZoomRef = useRef<d3.ZoomTransform>(d3.zoomIdentity)
  const fitToViewRef = useRef<(() => void) | null>(null)

  // 缩放控制函数
  const zoomIn = () => {
    if (zoomRef.current && svgRef.current) {
      const currentTransform = currentZoomRef.current
      const newScale = Math.min(currentTransform.k * 1.5, 4)
      const newTransform = currentTransform.scale(newScale)
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, newTransform)
    }
  }

  const zoomOut = () => {
    if (zoomRef.current && svgRef.current) {
      const currentTransform = currentZoomRef.current
      const newScale = Math.max(currentTransform.k / 1.5, 0.1)
      const newTransform = currentTransform.scale(newScale)
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, newTransform)
    }
  }

  const resetView = () => {
    if (fitToViewRef.current) {
      fitToViewRef.current()
    }
  }

  // 将控制函数暴露给父组件
  useImperativeHandle(ref, () => ({
    zoomIn,
    zoomOut,
    resetView
  }))

  useEffect(() => {
    if (!svgRef.current || !data || data.nodes.length === 0) return

    // 清除之前的图形
    d3.select(svgRef.current).selectAll("*").remove()

    // 获取容器尺寸并设置响应式画布尺寸
    const container = svgRef.current.parentElement
    const containerWidth = container?.clientWidth || 1000
    const containerHeight = Math.min(600, window.innerHeight * 0.7) // 限制最大高度为屏幕高度的70%
    
    // 移动端适配
    const isMobile = window.innerWidth < 768
    const width = isMobile ? Math.min(containerWidth - 40, 400) : Math.min(containerWidth - 40, 1000)
    const height = isMobile ? Math.min(containerHeight * 0.8, 500) : Math.min(containerHeight, 600)
    
    const margin = isMobile ? { top: 10, right: 10, bottom: 10, left: 10 } : { top: 20, right: 20, bottom: 20, left: 20 }

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', 'transparent')

    // 创建缩放行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4]) // 缩放范围：0.1x 到 4x
      .filter((event) => {
        // 移动端优化：允许触摸手势和鼠标滚轮
        if (isMobile) {
          return !event.ctrlKey && !event.button
        }
        return true
      })
      .on('zoom', (event) => {
        const { transform } = event
        currentZoomRef.current = transform
        onZoomChange?.(transform.k)
        
        // 应用变换到所有图形元素
        svg.selectAll('g.zoomable').attr('transform', transform)
      })

    // 将缩放行为应用到SVG
    svg.call(zoom)
    zoomRef.current = zoom

    // 定义渐变
    const defs = svg.append('defs')
    
    // 为每个类别创建渐变
    const gradients: Record<string, any> = {}
    Object.entries(data.categories).forEach(([categoryKey, categoryData]) => {
      gradients[categoryKey] = defs.append('radialGradient')
        .attr('id', `gradient-${categoryKey}`)
        .attr('cx', '30%')
        .attr('cy', '30%')
        .attr('r', '70%')
      
      // 从渐变色字符串中提取颜色
      const colorMatch = categoryData.color.match(/linear-gradient\([^,]+,\s*([^,]+),\s*([^)]+)\)/)
      if (colorMatch) {
        gradients[categoryKey].append('stop').attr('offset', '0%').attr('stop-color', colorMatch[1].trim())
        gradients[categoryKey].append('stop').attr('offset', '100%').attr('stop-color', colorMatch[2].trim())
      }
    })

    // 计算移动端缩放比例
    const maxHIndex = Math.max(...data.nodes.map(n => n.hIndex || 0))
    const maxRadius = Math.sqrt(maxHIndex) * 2
    const maxRectSize = maxRadius * 2
    // 移动端使用更大的基础尺寸，确保触摸友好
    const mobileScale = isMobile ? Math.min(1.2, 32 / maxRectSize) : 1
    
    // 为每个节点创建照片图案
    data.nodes.forEach(node => {
      if (node.image) {
        if (node.category === 'institution') {
          // 机构节点：矩形照片，边长等于最大学者节点的直径
          const rectSize = maxRectSize
          const finalRectSize = rectSize * mobileScale // 应用移动端缩放
          
          defs.append('pattern')
            .attr('id', `image-${node.id}`)
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', finalRectSize)
            .attr('height', finalRectSize)
            .append('image')
            .attr('xlink:href', node.image)
            .attr('width', finalRectSize)
            .attr('height', finalRectSize)
            .attr('preserveAspectRatio', 'xMidYMid slice')
        } else {
          // 学者节点：圆形照片
          const radius = Math.max(Math.sqrt(node.hIndex || 1) * 2, 8) // 最小半径8px
          const finalRadius = radius * mobileScale // 应用移动端缩放
          
          defs.append('pattern')
            .attr('id', `image-${node.id}`)
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('x', -finalRadius)
            .attr('y', -finalRadius)
            .attr('width', finalRadius * 2)
            .attr('height', finalRadius * 2)
            .append('image')
            .attr('xlink:href', node.image)
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', finalRadius * 2)
            .attr('height', finalRadius * 2)
            .attr('preserveAspectRatio', 'xMidYMid slice')
        }
      }
    })

    // 定义节点领域分类
    const categorizeNode = (node: NetworkNode): 'ai' | 'neuroscience' => {
      const field = node.field.toLowerCase()
      if (field.includes('deep learning') || field.includes('artificial intelligence') || field.includes('ai safety')) {
        return 'ai'
      }
      return 'neuroscience'
    }

    // 计算两个领域的中心点位置
    const leftCenterX = width * 0.25  // 左侧中心点 (AI领域)
    const rightCenterX = width * 0.75 // 右侧中心点 (Neuroscience领域)
    const centerY = height / 2

    // 创建力导向图
    const simulation = d3.forceSimulation<NetworkNode>(data.nodes)
      .force('link', d3.forceLink<NetworkNode, any>().id((d) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05)) // 整体中心力较弱
      .force('fieldPosition', (alpha: number) => {
        // 自定义力：将节点拉向各自领域的中心点
        data.nodes.forEach(node => {
          const category = categorizeNode(node)
          const targetX = category === 'ai' ? leftCenterX : rightCenterX
          const targetY = centerY
          
          // 计算当前位置到目标位置的距离
          const dx = targetX - (node.x || 0)
          const dy = targetY - (node.y || 0)
          
          // 应用力，强度随alpha衰减，降低强度使布局更稳定
          node.vx = (node.vx || 0) + dx * alpha * 0.1
          node.vy = (node.vy || 0) + dy * alpha * 0.1
        })
      })
      .force('collision', d3.forceCollide().radius((d: any) => {
        if (d.type === 'institution') {
          // 机构节点碰撞检测：边长等于最大学者节点的直径 + 额外间距
          return (maxRectSize * mobileScale) + 20
        } else {
          const baseRadius = Math.max(Math.sqrt(d.hIndex || 1) * 2, 8) // 最小半径8px
          return (baseRadius * mobileScale) + 15
        }
      }))

    // 使用预定义的连接数据
    const links = data.connections.map(conn => ({
      source: conn.source,
      target: conn.target,
      strength: conn.strength,
      type: conn.type
    }))

    // 创建可缩放的组
    const zoomableGroup = svg.append('g').attr('class', 'zoomable')

    // 添加连接线
    const link = zoomableGroup.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', (d: any) => {
        // 基于节点类型组合决定颜色
        const sourceNode = data.nodes.find(n => n.id === d.source)
        const targetNode = data.nodes.find(n => n.id === d.target)
        const isInstitutionToScholar = (sourceNode?.type === 'institution' && targetNode?.type === 'scholar') ||
                                     (sourceNode?.type === 'scholar' && targetNode?.type === 'institution')
        
        if (isInstitutionToScholar) return darkMode ? '#10B981' : '#059669'
        return darkMode ? '#374151' : '#999'
      })
      .attr('stroke-opacity', (d: any) => {
        // 基于节点类型组合决定透明度
        const sourceNode = data.nodes.find(n => n.id === d.source)
        const targetNode = data.nodes.find(n => n.id === d.target)
        const isInstitutionToScholar = (sourceNode?.type === 'institution' && targetNode?.type === 'scholar') ||
                                     (sourceNode?.type === 'scholar' && targetNode?.type === 'institution')
        
        if (isInstitutionToScholar) return darkMode ? 0.6 : 0.8
        return darkMode ? 0.3 : 0.6
      })
      .attr('stroke-width', (d: any) => d.strength * 1.5)
      .attr('stroke-dasharray', (d: any) => {
        // 基于节点类型组合决定线型：机构-学者连线使用虚线
        const sourceNode = data.nodes.find(n => n.id === d.source)
        const targetNode = data.nodes.find(n => n.id === d.target)
        const isInstitutionToScholar = (sourceNode?.type === 'institution' && targetNode?.type === 'scholar') ||
                                     (sourceNode?.type === 'scholar' && targetNode?.type === 'institution')
        
        return isInstitutionToScholar ? '5,5' : 'none'
      })
      .style('filter', darkMode ? 'drop-shadow(0 0 1px rgba(59, 130, 246, 0.2))' : 'none')


    // 添加节点组
    const node = zoomableGroup.append('g')
      .selectAll('g')
      .data(data.nodes)
      .enter().append('g')
      .call(d3.drag<SVGGElement, NetworkNode>()
        .filter((event) => {
          // 移动端优化：防止与缩放手势冲突
          if (isMobile) {
            return event.touches ? event.touches.length === 1 : true
          }
          return true
        })
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // 根据节点类型创建不同形状，使用照片作为背景
    node.each(function(d: NetworkNode) {
      const nodeGroup = d3.select(this)
      const categoryData = data.categories[d.category]
      const nodeStyle = categoryData?.nodeStyle || 'circle'
      
      if (nodeStyle === 'rect') {
        // 机构节点使用矩形，边长等于最大学者节点的直径
        const finalRectSize = maxRectSize * mobileScale // 应用移动端缩放
        
        // 添加矩形形状
        nodeGroup.append('rect')
          .attr('x', -finalRectSize/2)
          .attr('y', -finalRectSize/2)
          .attr('width', finalRectSize)
          .attr('height', finalRectSize)
          .attr('rx', 4) // 圆角
          .attr('fill', d.image ? `url(#image-${d.id})` : (gradients[d.category] ? `url(#gradient-${d.category})` : '#10B981'))
          .attr('stroke', darkMode ? '#1F2937' : '#fff')
          .attr('stroke-width', isMobile ? 1.5 : 2)
          .style('cursor', 'pointer')
          .style('filter', darkMode ? 
            'drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 
            'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          )
      } else {
        // 学者节点使用圆形，尺寸与hIndex成正比，但确保最小可见尺寸
        const radius = Math.max(Math.sqrt(d.hIndex || 1) * 2, 8) // 最小半径8px
        const finalRadius = radius * mobileScale // 应用移动端缩放
        
        // 添加圆形形状
        nodeGroup.append('circle')
          .attr('r', finalRadius)
          .attr('fill', d.image ? `url(#image-${d.id})` : (gradients[d.category] ? `url(#gradient-${d.category})` : '#3B82F6'))
          .attr('stroke', darkMode ? '#1F2937' : '#fff')
          .attr('stroke-width', isMobile ? 1.5 : 2)
          .style('cursor', 'pointer')
          .style('filter', darkMode ? 
            'drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 
            'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          )
      }
    })

    // 添加交互事件
    node
      .on('click', (event, d: NetworkNode) => {
        console.log('Clicked on:', d.name, 'Type:', d.type)
      })
      .on('mouseover', function(event, d: NetworkNode) {
        d3.select(this).select('circle, rect')
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .style('filter', darkMode ? 
            'drop-shadow(0 6px 12px rgba(0,0,0,0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6))' : 
            'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          )
      })
      .on('mouseout', function(event, d: NetworkNode) {
        d3.select(this).select('circle, rect')
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .style('filter', darkMode ? 
            'drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 
            'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          )
      })

    // 添加节点标签 - 使用短名称，放在节点形状正下方
    node.each(function(d: NetworkNode) {
      const nodeGroup = d3.select(this)
      const categoryData = data.categories[d.category]
      const nodeStyle = categoryData?.nodeStyle || 'circle'
      
      // 计算标签的垂直偏移量
      let labelOffsetY = 0
      if (nodeStyle === 'rect') {
        // 机构节点：矩形边长的一半 + 动态间距
        const finalRectSize = maxRectSize * mobileScale
        const spacing = Math.max(12, finalRectSize * 0.2) // 最小12px，或节点大小的20%
        labelOffsetY = finalRectSize / 2 + spacing
      } else {
        // 学者节点：圆形半径 + 动态间距
        const radius = Math.max(Math.sqrt(d.hIndex || 1) * 2, 8)
        const finalRadius = radius * mobileScale
        const spacing = Math.max(12, finalRadius * 0.25) // 最小12px，或节点大小的25%
        labelOffsetY = finalRadius + spacing
      }
      
      // 计算合适的字体大小
      let fontSize = isMobile ? '10px' : '11px'
      if (nodeStyle === 'rect') {
        const finalRectSize = maxRectSize * mobileScale
        // 机构节点字体稍大，基于节点大小调整
        fontSize = isMobile ? '11px' : '12px'
      } else {
        const radius = Math.max(Math.sqrt(d.hIndex || 1) * 2, 8)
        const finalRadius = radius * mobileScale
        // 学者节点字体基于节点大小动态调整
        if (finalRadius > 20) {
          fontSize = isMobile ? '11px' : '12px'
        } else if (finalRadius > 15) {
          fontSize = isMobile ? '10px' : '11px'
        } else {
          fontSize = isMobile ? '9px' : '10px'
        }
      }
      
      // 添加文本标签
      nodeGroup.append('text')
        .text(d.shortName)
        .attr('text-anchor', 'middle')
        .attr('dy', labelOffsetY) // 使用计算出的偏移量
        .attr('font-size', fontSize)
        .attr('font-weight', '600')
        .attr('fill', darkMode ? '#FFFFFF' : '#000000')
        .style('text-shadow', darkMode ? '0 0 3px rgba(0,0,0,0.9)' : '0 0 2px rgba(255,255,255,0.9)')
        .style('pointer-events', 'none')
        .style('user-select', 'none') // 防止文本选择
    })

    // 更新力导向图
    simulation.nodes(data.nodes)
    simulation.force<d3.ForceLink<NetworkNode, any>>('link')!.links(links)
    
    // 设置模拟参数，让它在稳定后停止
    simulation.alphaDecay(0.08) // 稍微增加alpha衰减率，让模拟更快稳定
    simulation.velocityDecay(0.5) // 增加速度衰减，减少震荡

    // 自适应显示所有节点的函数
    const fitToView = () => {
      if (!data.nodes.length) return
      
      // 计算所有节点的边界框
      const xCoords = data.nodes.map(n => n.x || 0)
      const yCoords = data.nodes.map(n => n.y || 0)
      const minX = Math.min(...xCoords)
      const maxX = Math.max(...xCoords)
      const minY = Math.min(...yCoords)
      const maxY = Math.max(...yCoords)
      
      // 添加一些边距，移动端使用更大的边距
      const padding = isMobile ? 80 : 50
      const bounds = {
        x: minX - padding,
        y: minY - padding,
        width: maxX - minX + 2 * padding,
        height: maxY - minY + 2 * padding
      }
      
      // 计算适合的缩放比例
      const scaleX = width / bounds.width
      const scaleY = height / bounds.height
      const scale = Math.min(scaleX, scaleY, 1) // 不超过1倍缩放
      
      // 计算居中位置
      const translateX = (width - bounds.width * scale) / 2 - bounds.x * scale
      const translateY = (height - bounds.height * scale) / 2 - bounds.y * scale
      
      // 应用变换
      const transform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale)
      
      svg.transition()
        .duration(750)
        .call(zoom.transform, transform)
    }

    // 保存fitToView函数到ref中
    fitToViewRef.current = fitToView

    // 更新位置 - 添加动态效果
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('transform', (d: NetworkNode) => `translate(${d.x},${d.y})`)
    })

    // 模拟完成后自适应显示所有节点
    simulation.on('end', () => {
      // 延迟一点时间确保所有节点位置已更新
      setTimeout(() => {
        fitToView()
      }, 100)
    })


    // 拖拽函数
    function dragstarted(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: NetworkNode) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // 窗口大小变化监听器
    const handleResize = () => {
      if (svgRef.current) {
        // 重新计算尺寸并重新渲染
        const container = svgRef.current.parentElement
        const containerWidth = container?.clientWidth || 1000
        const containerHeight = Math.min(600, window.innerHeight * 0.7)
        
        const isMobile = window.innerWidth < 768
        const newWidth = isMobile ? Math.min(containerWidth - 40, 400) : Math.min(containerWidth - 40, 1000)
        const newHeight = isMobile ? Math.min(containerHeight * 0.8, 500) : Math.min(containerHeight, 600)
        
        // 更新SVG尺寸
        d3.select(svgRef.current)
          .attr('width', newWidth)
          .attr('height', newHeight)
        
        // 重新计算力导向图中心点
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
        simulation.alpha(0.3).restart()
      }
    }

    window.addEventListener('resize', handleResize)

    // 清理函数
    return () => {
      simulation.stop()
      window.removeEventListener('resize', handleResize)
    }
  }, [data, darkMode])

  return (
    <div className="w-full overflow-hidden relative">
      <svg
        ref={svgRef}
        className="mx-auto touch-none select-none"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          touchAction: 'none', // 防止默认触摸行为
          userSelect: 'none'   // 防止文本选择
        }}
      />
      
      {/* 归位按钮 - 悬浮在右上角 */}
      <div className="absolute bottom-0.5 right-0.5">
        <button
          onClick={resetView}
          className="p-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 touch-manipulation rounded-lg shadow-lg border border-white/30"
          title="归位到默认位置"
        >
          <svg className="w-3 h-3 text-gray-600 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
})

NetworkGraph.displayName = 'NetworkGraph'

export default NetworkGraph
