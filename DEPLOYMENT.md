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

## Vercel 部署

### 部署步骤

1. **推送代码到 GitHub**：
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **在 Vercel 中导入项目**：
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 选择 Next.js 框架
   - 点击 "Deploy"

3. **自动部署完成**：
   - Vercel 会自动检测 Next.js 项目
   - 自动构建和部署
   - 提供临时域名用于测试

### 配置自定义域名

1. **在 Vercel Dashboard 中添加域名**：
   - 进入项目 Settings → Domains
   - 添加 `www.scholarinsight.top` 和 `scholarinsight.top`
   - 按照 Vercel 指示配置 DNS 记录

2. **配置 DNS 记录**：
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

3. **验证配置**：
   - 等待 DNS 传播完成（通常 5-30 分钟）
   - 访问 `https://www.scholarinsight.top` 验证
   - 检查 Vercel Dashboard 中域名状态为 "Valid Configuration"

## 环境变量配置

创建 `.env.local` 文件：
```env
# 图片域名白名单
NEXT_PUBLIC_IMAGE_DOMAINS=picture-search.tiangong.cn
```

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本
   - 清理 node_modules 重新安装
   - 检查 TypeScript 错误

2. **图片加载失败**
   - 检查图片域名配置
   - 验证图片 URL 有效性

3. **域名无法访问**
   - 检查 DNS 配置是否正确
   - 等待 DNS 传播完成
   - 检查 Vercel Dashboard 中域名状态

### 本地调试
```bash
# 查看应用日志
npm run dev

# 构建测试
npm run build
npm start
```

## 联系支持

如遇到部署问题，请联系：
- Email: support@scholarinsight.com
- GitHub Issues: [项目仓库](https://github.com/your-repo/scholarinsight)
