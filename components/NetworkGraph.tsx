'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface Scholar extends d3.SimulationNodeDatum {
  id: string
  name: string
  shortName: string
  hIndex: number
  institution: string
  field: string
  category: string
  image?: string
  connections: string[]
}

interface NetworkGraphProps {
  scholars: Scholar[]
  categoryColors?: Record<string, string>
  darkMode?: boolean
}

export default function NetworkGraph({ scholars, categoryColors, darkMode = false }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || scholars.length === 0) return

    // 清除之前的图形
    d3.select(svgRef.current).selectAll("*").remove()

    // 设置画布尺寸
    const width = 1000
    const height = 600
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', 'transparent')

    // 定义渐变
    const defs = svg.append('defs')
    
    // 为每个类别创建渐变
    const gradients = {
      ai: defs.append('radialGradient')
        .attr('id', 'gradient-ai')
        .attr('cx', '30%')
        .attr('cy', '30%')
        .attr('r', '70%'),
      neuroscience: defs.append('radialGradient')
        .attr('id', 'gradient-neuroscience')
        .attr('cx', '30%')
        .attr('cy', '30%')
        .attr('r', '70%'),
      physics: defs.append('radialGradient')
        .attr('id', 'gradient-physics')
        .attr('cx', '30%')
        .attr('cy', '30%')
        .attr('r', '70%'),
      biology: defs.append('radialGradient')
        .attr('id', 'gradient-biology')
        .attr('cx', '30%')
        .attr('cy', '30%')
        .attr('r', '70%'),
      chemistry: defs.append('radialGradient')
        .attr('id', 'gradient-chemistry')
        .attr('cx', '30%')
        .attr('cy', '30%')
        .attr('r', '70%'),
      mathematics: defs.append('radialGradient')
        .attr('id', 'gradient-mathematics')
        .attr('cx', '30%')
        .attr('cy', '30%')
        .attr('r', '70%')
    }

    // 添加渐变停止点
    gradients.ai.append('stop').attr('offset', '0%').attr('stop-color', '#3B82F6')
    gradients.ai.append('stop').attr('offset', '100%').attr('stop-color', '#1D4ED8')
    
    gradients.neuroscience.append('stop').attr('offset', '0%').attr('stop-color', '#8B5CF6')
    gradients.neuroscience.append('stop').attr('offset', '100%').attr('stop-color', '#7C3AED')
    
    gradients.physics.append('stop').attr('offset', '0%').attr('stop-color', '#EF4444')
    gradients.physics.append('stop').attr('offset', '100%').attr('stop-color', '#DC2626')
    
    gradients.biology.append('stop').attr('offset', '0%').attr('stop-color', '#10B981')
    gradients.biology.append('stop').attr('offset', '100%').attr('stop-color', '#059669')
    
    gradients.chemistry.append('stop').attr('offset', '0%').attr('stop-color', '#F59E0B')
    gradients.chemistry.append('stop').attr('offset', '100%').attr('stop-color', '#D97706')
    
    gradients.mathematics.append('stop').attr('offset', '0%').attr('stop-color', '#EC4899')
    gradients.mathematics.append('stop').attr('offset', '100%').attr('stop-color', '#DB2777')

    // 创建力导向图
    const simulation = d3.forceSimulation<Scholar>(scholars)
      .force('link', d3.forceLink<Scholar, any>().id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => Math.sqrt((d as Scholar).hIndex) * 2 + 10))

    // 创建连接数据
    const links: any[] = []
    scholars.forEach(scholar => {
      scholar.connections.forEach(targetId => {
        const target = scholars.find(s => s.id === targetId)
        if (target) {
          links.push({
            source: scholar.id,
            target: targetId,
            strength: Math.random() * 0.5 + 0.5 // 模拟合作强度
          })
        }
      })
    })

    // 添加连接线
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', darkMode ? '#374151' : '#999')
      .attr('stroke-opacity', darkMode ? 0.3 : 0.6)
      .attr('stroke-width', (d: any) => d.strength * 1.5)
      .style('filter', darkMode ? 'drop-shadow(0 0 1px rgba(59, 130, 246, 0.2))' : 'none')

    // 添加节点组
    const node = svg.append('g')
      .selectAll('g')
      .data(scholars)
      .enter().append('g')
      .call(d3.drag<SVGGElement, Scholar>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // 添加节点圆圈 - 使用D3渐变
    node.append('circle')
      .attr('r', (d: Scholar) => Math.sqrt(d.hIndex) * 2)
      .attr('fill', (d: Scholar) => {
        if (d.category && gradients[d.category as keyof typeof gradients]) {
          return `url(#gradient-${d.category})`
        }
        // 默认渐变色
        return 'url(#gradient-ai)'
      })
      .attr('stroke', darkMode ? '#1F2937' : '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('filter', darkMode ? 
        'drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 
        'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
      )
      .on('click', (event, d: Scholar) => {
        // TODO: 导航到学者详情页
        console.log('Clicked on:', d.name)
      })
      .on('mouseover', function(event, d: Scholar) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .style('filter', darkMode ? 
            'drop-shadow(0 6px 12px rgba(0,0,0,0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6))' : 
            'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          )
      })
      .on('mouseout', function(event, d: Scholar) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .style('filter', darkMode ? 
            'drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 
            'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          )
      })

    // 添加节点标签 - 使用短名称
    node.append('text')
      .text((d: Scholar) => d.shortName)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', darkMode ? '#FFFFFF' : '#000000')
      .style('text-shadow', darkMode ? '0 0 3px rgba(0,0,0,0.9)' : '0 0 2px rgba(255,255,255,0.9)')
      .style('pointer-events', 'none')

    // 更新力导向图
    simulation.nodes(scholars)
    simulation.force<d3.ForceLink<Scholar, any>>('link')!.links(links)

    // 更新位置 - 添加动态效果
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('transform', (d: Scholar) => `translate(${d.x},${d.y})`)
    })

    // 添加轻微的持续动画效果
    const animate = () => {
      simulation.alpha(0.1).restart()
      setTimeout(animate, 12000) // 每12秒重新激活一次
    }
    setTimeout(animate, 6000)

    // 拖拽函数
    function dragstarted(event: any, d: Scholar) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: Scholar) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: Scholar) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // 清理函数
    return () => {
      simulation.stop()
    }
  }, [scholars, categoryColors, darkMode])

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        className="mx-auto"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  )
}
