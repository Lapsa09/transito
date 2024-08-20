import { partesDTO } from '@/DTO/radio'
import { searchParamsSchema } from '@/schemas/form'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const partesInputSchema = searchParamsSchema.merge(
  z.object({ fecha: z.string() }),
)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const { fecha, page, per_page } = partesInputSchema.parse(searchParams)
  const partes = await partesDTO({ fecha, page, per_page })

  return NextResponse.json(partes)
}
