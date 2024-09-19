import { citymisMetrics } from '@/DTO/operativos/metrics'
import { writeFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'

const filePath = '/citymis.xlsx'

export async function GET() {
  try {
    const data = citymisMetrics()

    return NextResponse.json(data)
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const file = form.get('file') as File
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    writeFileSync(filePath, buffer)

    return NextResponse.json({ message: 'File uploaded' })
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json([], { status: 500 })
  }
}
