import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // 读取reports.json文件
    const filePath = path.join(process.cwd(), 'data', 'reports.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const reports = JSON.parse(fileContents)
    
    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error reading reports data:', error)
    return NextResponse.json(
      { error: 'Failed to load reports data' },
      { status: 500 }
    )
  }
}
