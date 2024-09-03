import { db } from '@/drizzle'
import { vtv } from '@/drizzle/schema/logistica'
import { vtvDTO } from '@/DTO/logistica/vtv'
import { searchParamsSchema } from '@/schemas/form'
import { vtvInputSchema } from '@/schemas/logistica'
import { count, eq, sql } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params

  const { searchParams } = req.nextUrl
  const { page, per_page } = searchParamsSchema.parse(searchParams)

  const vehiculo = await vtvDTO({ patente, page, per_page })

  const total = await db
    .select({
      count: count(),
    })
    .from(vtv)
    .where(eq(vtv.patente, patente))
    .execute()
    .then((res) => res[0].count)

  return NextResponse.json({
    data: vehiculo,
    pages: Math.ceil(total / per_page).toString(),
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const json = await req.json()
  const body = vtvInputSchema.parse(json)
  const { patente } = params

  await db.insert(vtv).values({
    patente,
    fechaEmision: sql`to_date(${body.fecha_emision}, 'YYYY-MM-DD')`,
    vencimiento: sql`to_date(${body.vencimiento}, 'YYYY-MM-DD')`,
    condicion: body.condicion,
    estado: body.estado,
    observacion: body.observacion,
  })
  revalidateTag('vtv')
  return NextResponse.json('Exito')
}
