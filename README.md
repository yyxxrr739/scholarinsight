# ScholarInsight - 学者信息分析平台

ScholarInsight 是一个现代化的学者信息分析网站，旨在深度分析知名学者的学术贡献、影响力与合作网络。

## 功能特性

### 🏠 首页
- **学者合作网络可视化**：使用D3.js展示学者之间的合作关系网络
- **搜索功能**：快速搜索学者姓名
- **统计数据展示**：显示平台收录的学者数量、合作关系等统计信息

### 👥 学者列表
- **多维度排序**：支持按姓名、H-index、引用量等排序
- **智能搜索**：支持按学者姓名、机构、研究领域搜索
- **领域筛选**：按研究领域筛选学者
- **响应式设计**：在笔记本、台式电脑和手机端都有良好的展示效果

### 📊 学者详情页
- **左侧边栏**：
  - 学者列表：快速切换不同学者
  - 报告目录：结构化导航，支持章节跳转
- **主内容区**：展示学者的详细分析报告
- **右侧批注面板**：用户可以对报告内容进行批注和笔记
- **响应式布局**：支持移动端访问

### 📝 报告内容
- **结构化展示**：基于Karl Friston报告框架的标准化展示
- **Markdown渲染**：支持富文本内容展示
- **章节导航**：快速跳转到特定章节
- **批注功能**：支持用户添加、编辑、删除批注

## 技术栈

### 前端
- **Next.js 14**：React框架，支持SSR/SSG
- **TypeScript**：类型安全的JavaScript
- **Tailwind CSS**：原子化CSS框架
- **D3.js**：数据可视化库
- **Lucide React**：图标库

### 后端（计划中）
- **Node.js + Express** 或 **Python + FastAPI**
- **PostgreSQL**：关系型数据库
- **Redis**：缓存和会话管理

### 数据可视化
- **D3.js**：前端网络图
- **Plotly.js**：与Python Plotly兼容的交互式图表

## 项目结构

```
scholarinsight/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── scholars/          # 学者相关页面
│   │   ├── page.tsx       # 学者列表页
│   │   └── [id]/          # 学者详情页
│   │       └── page.tsx
├── components/            # React组件
│   ├── Header.tsx         # 网站头部
│   ├── Footer.tsx         # 网站底部
│   ├── NetworkGraph.tsx   # 网络图组件
│   ├── ScholarSidebar.tsx # 学者侧边栏
│   ├── ReportContent.tsx  # 报告内容组件
│   └── AnnotationPanel.tsx # 批注面板
├── public/               # 静态资源
├── package.json          # 项目配置
├── tailwind.config.js    # Tailwind配置
├── tsconfig.json         # TypeScript配置
└── README.md            # 项目说明
```

## 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建生产版本
```bash
npm run build
npm start
```

## 数据格式

### 学者数据结构
```typescript
interface Scholar {
  id: string
  name: string
  hIndex: number
  institution: string
  field: string
  image?: string
  citations: number
  publications: number
  country: string
  hasReport: boolean
  connections: string[] // 合作学者ID列表
}
```

### 报告内容格式
报告内容使用Markdown格式，包含以下主要章节：
- 执行摘要
- 学者档案
- 学术影响力评估
- 学术贡献分析
- 学术网络与合作
- 思想画像分析
- 知识传播与转化
- 综合评估与展望

## 开发计划

### 已完成
- ✅ 基础项目架构
- ✅ 首页设计和网络图可视化
- ✅ 学者列表页面
- ✅ 学者详情页面
- ✅ 报告内容展示
- ✅ 批注功能
- ✅ 响应式设计

### 待开发
- 🔄 后端API开发
- 🔄 数据库设计和实现
- 🔄 用户认证系统
- 🔄 搜索功能优化
- 🔄 数据可视化增强
- 🔄 AI应用集成

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

© 2024 ScholarInsight. All Rights Reserved.
