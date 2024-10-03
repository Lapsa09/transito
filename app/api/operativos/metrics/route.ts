import { generalMetrics } from '@/DTO/operativos/metrics'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchParamsSchema = z.object({
  y: z.coerce.number().default(new Date().getFullYear()),
})

export async function GET(req: NextRequest) {
  const { y } = searchParamsSchema.parse(
    Object.fromEntries(req.nextUrl.searchParams.entries()),
  )
  const data = await generalMetrics({ y })

  return NextResponse.json(data)
}
