import { db } from '@/drizzle'
import {
  pedidoRepuesto,
  reparaciones,
  repuesto,
} from '@/drizzle/schema/logistica'
import { reparacionesByMovilDTO } from '@/DTO/logistica/reparaciones'
import { filterColumn } from '@/lib/filter-column'
import { searchParamsSchema } from '@/schemas/form'
import { reparacionInputSchema } from '@/schemas/logistica'
import { and, count, or, SQL, sql } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params
  const { searchParams } = req.nextUrl
  const {
    page,
    per_page,
    fecha,
    fecha_entrega,
    fecha_pedido,
    orden_compra,
    repuesto: articulo,
    operator,
  } = searchParamsSchema
    .merge(
      z.object({
        fecha: z.string().optional(),
        fecha_entrega: z.string().optional(),
        fecha_pedido: z.string().optional(),
        orden_compra: z.string().optional(),
        repuesto: z.string().optional(),
      }),
    )
    .parse(Object.fromEntries(new URLSearchParams(searchParams).entries()))

  const expressions: (SQL<unknown> | undefined)[] = [
    filterColumn({
      column: reparaciones.patente,
      value: patente,
    }),
    !!fecha
      ? filterColumn({
          column: reparaciones.fecha,
          value: fecha,
          isDate: true,
        })
      : undefined,
    !!fecha_entrega
      ? filterColumn({
          column: pedidoRepuesto.fechaEntrega,
          value: fecha_entrega,
          isDate: true,
        })
      : undefined,
    !!fecha_pedido
      ? filterColumn({
          column: pedidoRepuesto.fechaPedido,
          value: fecha_pedido,
          isDate: true,
        })
      : undefined,
    !!orden_compra
      ? filterColumn({
          column: pedidoRepuesto.ordenCompra,
          value: orden_compra,
        })
      : undefined,
    !!articulo
      ? filterColumn({
          column: repuesto.item,
          value: articulo,
        })
      : undefined,
  ]

  const where =
    !operator || operator === 'and' ? and(...expressions) : or(...expressions)
  const reparacionesList = reparacionesByMovilDTO({ where, page, per_page })

  const total = await db
    .select({ count: count() })
    .from(reparaciones)
    .where(where)
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
  const json = await req.json()
  const body = reparacionInputSchema.parse(json)
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
