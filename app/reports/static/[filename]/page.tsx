import reportsData from '@/data/reports.json'
import StaticReportClient from './StaticReportClient'

// 生成静态参数（在构建时调用）
export async function generateStaticParams() {
  return reportsData.reports
    .filter(report => report.subject.type === 'institution')
    .map((report) => ({
      filename: report.filename.replace('.html', ''),
    }))
}

export default function StaticReportPage({ params }: { params: { filename: string } }) {
  return <StaticReportClient params={params} />
}
