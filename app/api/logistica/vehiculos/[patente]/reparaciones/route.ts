import { db } from '@/drizzle'
import {
  Reparaciones,
  reparaciones,
  Repuestos,
} from '@/drizzle/schema/logistica'
import { reparacionesByMovilDTO } from '@/DTO/logistica/reparaciones'
import { searchParamsSchema } from '@/schemas/form'
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
  const reparacionesList = reparacionesByMovilDTO({ patente, page, per_page })

  const total = await db
    .select({ count: count() })
    .from(reparaciones)
    .where(eq(reparaciones.patente, patente))
    .execute()
    .then((res) => res[0].count)

  return NextResponse.json({
    data: reparacionesList,
    pages: Math.ceil(total / per_page).toString(),
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const body: Reparaciones & { repuesto: Repuestos } = await req.json()
  const { patente } = params

  await db.insert(reparaciones).values({
    patente,
    articulo: body.repuesto.id,
    fecha: sql`to_date(${body.fecha}, 'YYYY-MM-DD')`,
    concepto: body.concepto,
    estado: body.estado,
    observacion: body.observacion,
    retira: body.retira,
  })
  revalidateTag('reparaciones')
  return NextResponse.json('Exito')
}
