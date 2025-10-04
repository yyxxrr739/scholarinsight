# ScholarInsight - 学术情报分析平台

ScholarInsight 是一个现代化的学术情报分析网站，旨在深度分析学者、研究机构与企业的学术贡献、影响力与创新模式。

## 功能特性

### 🏠 首页
- **学者合作网络可视化**：使用D3.js展示学者之间的合作关系网络
- **最新报告展示**：展示最新的学术分析报告
- **搜索功能**：快速搜索学者姓名、机构或研究领域

### 📊 研究报告
- **报告列表**：展示所有可用的HTML格式学术报告
- **分类筛选**：支持按学者分析、机构分析、企业分析等分类筛选
- **类型筛选**：支持按学者、机构、企业等主体类型筛选
- **智能搜索**：支持按标题、描述、标签、主体名称搜索
- **多维度排序**：支持按日期、标题、分类排序

### 📄 报告详情
- **完整展示**：展示完整的HTML格式报告内容
- **元信息显示**：显示报告标题、作者、日期、分类、标签等信息
- **主体信息**：展示被分析对象（学者/机构/企业）的详细信息
- **分享下载**：支持报告分享和下载功能
- **响应式设计**：适配桌面和移动端设备

### 👥 学者档案
- **学者列表**：展示学者基本信息，支持搜索和筛选
- **学者详情**：展示学者的详细分析报告
- **多维度排序**：支持按姓名、H-index、引用量等排序
- **响应式设计**：在笔记本、台式电脑和手机端都有良好的展示效果

### 🕸️ 合作网络
- **交互式网络图**：使用D3.js展示学者合作网络
- **节点交互**：点击节点查看学者详细信息
- **搜索筛选**：支持按学者姓名、机构、领域搜索和筛选
- **网络分析**：展示学者间的合作关系和影响力

## 技术栈

### 前端
- **Next.js 14**：React框架，支持SSR/SSG
- **TypeScript**：类型安全的JavaScript
- **Tailwind CSS**：原子化CSS框架
- **D3.js**：数据可视化库
- **Lucide React**：图标库

### 数据管理
- **静态HTML文件**：存储在 `public/reports/` 目录
- **JSON配置文件**：存储在 `data/reports.json` 管理报告元数据
- **客户端搜索**：无需后端，直接在浏览器中进行搜索和筛选

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
