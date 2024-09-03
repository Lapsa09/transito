import { db } from '@/drizzle'
import { kilometrajeVehiculos } from '@/drizzle/schema/logistica'
import { kilometrajeDTO } from '@/DTO/logistica/kilometraje'
import { searchParamsSchema } from '@/schemas/form'
import { kilometrajeInputSchema } from '@/schemas/logistica'
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
  const json = await req.json()
  const body = kilometrajeInputSchema.parse(json)
  const { patente } = params

  await db.insert(kilometrajeVehiculos).values({
    patente,
    fecha: sql`to_date(${body.fecha}, 'YYYY-MM-DD')`,
    km: body.km,
    filtroAceite: body.filtro_aceite,
    proximoCambioFiltro: body.proximo_cambio_filtro,
    kitDistribucion: body.kit_distribucion,
    proximoCambioDistribucion: body.proximo_cambio_distribucion,
    kitPolyV: body.kit_poly_v,
    proximoCambioPolyV: body.proximo_cambio_poly_v,
  })
  revalidateTag('kilometraje')
  return NextResponse.json('Exito')
}
