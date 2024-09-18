import { camionesMetrics } from '@/DTO/operativos/metrics'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchParamsSchema = z.object({
  y: z.coerce.number().default(new Date().getFullYear()),
})

export async function GET(req: NextRequest) {
  const { y } = searchParamsSchema.parse(req.nextUrl.searchParams)

  const data = await camionesMetrics({ y })

  return NextResponse.json(data)
}
