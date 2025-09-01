'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ReportContentProps {
  reportFile: string
  selectedSection: string
}

export default function ReportContent({ reportFile, selectedSection }: ReportContentProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 在实际应用中，这里会从API获取报告内容
        // 现在我们先使用模拟数据
        const mockContent = `
# 学者信息分析报告——Karl J. Friston

## 执行摘要

### 分析目标

**核心目标：** 本报告旨在全面、准确地获取学者Karl Friston的规范类与补充类信息，并通过多源交叉验证，构建其完整的学术与思想画像。报告将重点剖析其核心理论——自由能原理（Free Energy Principle, FEP）——的理论体系、思想演进脉络，并深入评估其在理论神经科学、计算精神病学以及人工智能（特别是主动推断AI）等领域的革命性与跨学科影响。

### 关键发现

- **学术地位：** Karl Friston是全球最具影响力的理论神经科学家之一，被广泛认为是当代脑科学领域的思想领袖。他的工作不仅在方法论上彻底改变了脑成像数据分析领域，更在理论上提出了一个极具雄心、试图统一生命与心智的大脑理论。

- **核心贡献：**
  1. **方法学革命：** 发明了统计参数图（Statistical Parametric Mapping, SPM）、基于体素的形态学分析（Voxel-Based Morphometry, VBM）和动态因果模型（Dynamic Causal Modelling, DCM）。这些工具已成为全球神经影像分析的国际标准，为人类脑图谱的构建奠定了方法论基石。
  2. **理论统一：** 提出了自由能原理（FEP）及其在行动和决策上的推论"主动推断"（Active Inference）。该理论试图在单一的、源于物理学和信息论的第一性原理下，统一解释大脑的感知、学习、行动、决策乃至生命本身的存在方式。

- **影响力指标：** 其学术影响力达到了全球顶尖水平。根据Google Scholar数据，其H-index高达285以上，总引用量超过37万次，是全球被引次数最高的神经科学家之一。

## 第一章 学者档案

### 1.1 基础信息

| 信息类别 | 详细信息 | 数据来源 | 验证状态 |
|---------|---------|---------|---------|
| **学者全名** | Karl John Friston | UCL Profiles, Wikidata | 已验证 |
| **ORCID ID** | 0000-0001-7984-8909 | ORCID, UCL Profiles | 已验证 |
| **出生日期** | 1959-07-12 | Wikidata | 已验证 |
| **国籍** | 英国 | Medium, LinkedIn | 已验证 |
| **当前机构** | 伦敦大学学院 (UCL) | UCL Profiles | 已验证 |
| **学术头衔** | 教授，Wellcome人类神经影像中心科学主任 | UCL Profiles | 已验证 |

### 1.2 教育背景

Karl Friston在牛津大学获得了医学学位，并在伦敦大学学院完成了神经影像学的研究生学习。他的早期研究主要集中在脑成像技术的开发和应用。

### 1.3 职业生涯

Friston的职业生涯始于伦敦大学学院，在那里他建立了Wellcome人类神经影像中心，并成为该中心的科学主任。他的工作主要集中在开发新的脑成像分析方法和理论神经科学。

## 第二章 学术影响力评估

### 2.1 文献计量指标

- **H-index:** 285+
- **总引用量:** 370,000+
- **论文数量:** 1,000+
- **高被引论文:** 50+

### 2.2 权威榜单与排名

- 全球被引次数最高的神经科学家之一
- 多次获得国际顶级科学奖项
- 在多个学术影响力排名中位居前列

## 第三章 学术贡献分析

### 3.1 研究脉络演进

Friston的研究历程可以分为几个主要阶段：

1. **早期阶段（1980s-1990s）：** 专注于脑成像技术的开发
2. **方法学阶段（1990s-2000s）：** 开发SPM、VBM等分析工具
3. **理论阶段（2000s-至今）：** 提出自由能原理和主动推断理论

### 3.2 核心学术贡献

**自由能原理（Free Energy Principle）**

自由能原理是Friston提出的一个统一理论框架，试图解释大脑如何工作以及生命如何维持自身。该原理基于热力学和信息论的概念，认为大脑是一个预测机器，不断更新其内部模型以最小化预测误差。

**主动推断（Active Inference）**

主动推断是自由能原理在行动和决策方面的应用。它提供了一个统一的框架来解释感知、学习和行动如何协同工作。

## 第四章 学术网络与合作

### 4.1 机构网络

Friston与全球多个顶级研究机构建立了合作关系，包括：

- 伦敦大学学院（UCL）
- 牛津大学
- 剑桥大学
- 麻省理工学院（MIT）
- 斯坦福大学

### 4.2 合作网络分析

Friston的合作网络非常广泛，涵盖了神经科学、人工智能、精神病学等多个领域。他的合作者包括：

- Yoshua Bengio（深度学习）
- Geoffrey Hinton（深度学习）
- Andrew Ng（机器学习）

## 第五章 思想画像分析

### 5.1 核心思想体系

Friston的思想体系以自由能原理为核心，试图建立一个统一的理论来解释大脑和生命的工作原理。他的理论具有以下特点：

- **统一性：** 试图用一个原理解释多个现象
- **数学严谨性：** 基于严格的数学推导
- **跨学科性：** 涉及神经科学、物理学、信息论等多个领域

### 5.2 思想渊源与影响

Friston的思想受到了多个领域的影响：

- **物理学：** 热力学和信息论
- **神经科学：** 预测编码理论
- **哲学：** 康德的认识论

## 第六章 知识传播与转化

### 6.1 软件工具与数据集

Friston开发了多个重要的软件工具：

- **SPM（Statistical Parametric Mapping）：** 脑成像分析的标准工具
- **VBM（Voxel-Based Morphometry）：** 脑结构分析工具
- **DCM（Dynamic Causal Modelling）：** 脑功能连接分析工具

### 6.2 公众影响力

Friston的工作不仅在学术界有重要影响，也在公众中引起了广泛关注。他的理论被用于解释意识、精神疾病等现象。

## 第七章 综合评估与展望

### 7.1 学术地位评估

Karl Friston是当代最具影响力的理论神经科学家之一，他的工作不仅在方法论上推动了脑科学的发展，在理论上也提出了具有革命性意义的观点。

### 7.2 学术贡献评价

Friston的贡献可以从以下几个方面评价：

- **方法学贡献：** 开发了多个重要的分析工具
- **理论贡献：** 提出了自由能原理和主动推断理论
- **应用贡献：** 推动了多个领域的发展

### 7.3 未来发展趋势

Friston的理论正在向多个领域扩展：

- **人工智能：** 主动推断AI的发展
- **精神病学：** 计算精神病学的应用
- **机器人学：** 基于主动推断的机器人控制
        `
        
        setContent(mockContent)
      } catch (err) {
        setError('加载报告内容时出错')
        console.error('Error loading report:', err)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [reportFile])

  // 简单的markdown渲染函数
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // 处理标题
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-academic-900 mb-4 mt-8">{line.substring(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-academic-900 mb-3 mt-6">{line.substring(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-academic-900 mb-2 mt-4">{line.substring(4)}</h3>
        }
        
        // 处理列表
        if (line.startsWith('- ')) {
          return <li key={index} className="text-academic-700 mb-1 ml-4">{line.substring(2)}</li>
        }
        
        // 处理表格行
        if (line.includes('|')) {
          const cells = line.split('|').filter(cell => cell.trim())
          if (cells.length > 1) {
            return (
              <tr key={index} className="border-b border-academic-200">
                {cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 text-sm text-academic-700">
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            )
          }
        }
        
        // 处理空行
        if (line.trim() === '') {
          return <div key={index} className="h-2"></div>
        }
        
        // 处理普通段落
        return <p key={index} className="text-academic-700 mb-3 leading-relaxed">{line}</p>
      })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-academic-600">加载报告中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card text-center">
        <h3 className="text-xl font-semibold text-academic-900 mb-2">加载失败</h3>
        <p className="text-academic-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="prose prose-academic max-w-none">
        {renderMarkdown(content)}
      </div>
    </div>
  )
}
