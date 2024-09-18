import { db } from '@/drizzle'
import { kilometrajeVehiculos } from '@/drizzle/schema/logistica'
import { kilometrajeDTO } from '@/DTO/logistica/kilometraje'
import { filterColumn } from '@/lib/filter-column'
import { searchParamsSchema } from '@/schemas/form'
import { kilometrajeInputSchema } from '@/schemas/logistica'
import { and, count, eq, SQL, sql } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params
  const { searchParams } = req.nextUrl
  const { page, per_page, fecha } = searchParamsSchema
    .merge(
      z.object({
        fecha: z.string().optional(),
      }),
    )
    .parse(Object.fromEntries(new URLSearchParams(searchParams).entries()))

  const expressions: (SQL<unknown> | undefined)[] = [
    !!fecha
      ? filterColumn({
          column: kilometrajeVehiculos.fecha,
          value: fecha,
          isDate: true,
        })
      : undefined,
  ]

  const where = and(...expressions, eq(kilometrajeVehiculos.patente, patente))

  const vehiculo = await kilometrajeDTO({ patente, page, per_page, where })

  const total = await db
    .select({ count: count() })
    .from(kilometrajeVehiculos)
    .where(where)
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
