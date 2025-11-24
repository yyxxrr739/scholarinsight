import reportsData from '@/data/reports.json'
import ReportDetailClient from './ReportDetailClient'

// 生成静态参数（在构建时调用）
export async function generateStaticParams() {
  return reportsData.reports.map((report) => ({
    filename: report.filename.replace('.html', ''),
  }))
}

export default function ReportDetailPage() {
  return <ReportDetailClient />
}
