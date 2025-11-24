import reportsData from '@/data/reports.json'
import ScholarClient from './ScholarClient'

// 生成静态参数（在构建时调用）
export async function generateStaticParams() {
  return reportsData.reports
    .filter(report => report.subject.type === 'scholar')
    .map((report) => ({
      id: report.networkNode.id,
    }))
}

export default function ScholarPage({ params }: { params: { id: string } }) {
  return <ScholarClient params={params} />
}
