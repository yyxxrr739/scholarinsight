# ScholarInsight 部署指南

## 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装和运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 生产部署

### 构建生产版本
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 部署到 Vercel（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 选择 Next.js 框架
4. 自动部署完成

### 部署到其他平台

#### Netlify
```bash
# 构建
npm run build

# 部署到 Netlify
netlify deploy --prod --dir=.next
```

#### Docker 部署
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 环境变量配置

创建 `.env.local` 文件：
```env
# 数据库配置（后续添加）
DATABASE_URL=your_database_url

# API 密钥（后续添加）
API_KEY=your_api_key

# 图片域名白名单
NEXT_PUBLIC_IMAGE_DOMAINS=picture-search.tiangong.cn
```

## 性能优化

### 图片优化
- 使用 Next.js Image 组件
- 配置图片域名白名单
- 启用图片压缩

### 代码分割
- 使用动态导入
- 配置路由级别的代码分割

### 缓存策略
- 配置静态资源缓存
- 使用 CDN 加速

## 监控和分析

### 错误监控
- 集成 Sentry 进行错误追踪
- 配置性能监控

### 用户分析
- 集成 Google Analytics
- 配置用户行为分析

## 安全配置

### 内容安全策略
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

### HTTPS 配置
- 启用 HTTPS
- 配置 SSL 证书
- 强制 HTTPS 重定向

## 备份和恢复

### 数据备份
- 定期备份数据库
- 备份静态资源
- 配置自动备份

### 灾难恢复
- 制定恢复计划
- 测试恢复流程
- 配置监控告警

## 维护和更新

### 定期更新
- 更新依赖包
- 安全补丁更新
- 功能版本更新

### 性能监控
- 监控页面加载速度
- 监控 API 响应时间
- 监控服务器资源使用

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本
   - 清理 node_modules 重新安装
   - 检查 TypeScript 错误

2. **图片加载失败**
   - 检查图片域名配置
   - 验证图片 URL 有效性
   - 检查网络连接

3. **网络图不显示**
   - 检查 D3.js 依赖
   - 验证数据格式
   - 检查浏览器控制台错误

### 日志查看
```bash
# 查看应用日志
npm run dev 2>&1 | tee app.log

# 查看构建日志
npm run build 2>&1 | tee build.log
```

## 联系支持

如遇到部署问题，请联系：
- Email: support@scholarinsight.com
- GitHub Issues: [项目仓库](https://github.com/your-repo/scholarinsight)
