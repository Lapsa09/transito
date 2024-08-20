import { db } from '@/drizzle'
import {
  KilometrajeVehiculos,
  kilometrajeVehiculos,
} from '@/drizzle/schema/logistica'
import { kilometrajeDTO } from '@/DTO/logistica/kilometraje'
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

  const vehiculo = await kilometrajeDTO({ patente, page, per_page })

  const total = await db
    .select({ count: count() })
    .from(kilometrajeVehiculos)
    .where(eq(kilometrajeVehiculos.patente, patente))
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
  const body: KilometrajeVehiculos = await req.json()
  const { patente } = params

  await db.insert(kilometrajeVehiculos).values({
    patente,
    fecha: sql`to_date(${body.fecha}, 'YYYY-MM-DD')`,
    km: body.km,
    filtroAceite: body.filtroAceite,
    proximoCambioFiltro: body.proximoCambioFiltro,
    kitDistribucion: body.kitDistribucion,
    proximoCambioDistribucion: body.proximoCambioDistribucion,
    kitPolyV: body.kitPolyV,
    proximoCambioPolyV: body.proximoCambioPolyV,
  })
  revalidateTag('kilometraje')
  return NextResponse.json('Exito')
}
