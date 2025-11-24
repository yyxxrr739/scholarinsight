/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 启用静态导出
  images: {
    domains: ['picture-search.tiangong.cn'],
    unoptimized: true, // 静态导出需要禁用图片优化
  },
}

module.exports = nextConfig
