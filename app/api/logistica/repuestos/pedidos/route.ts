import { db } from '@/drizzle'
import {
  pedidoRepuesto,
  proveedor as proveedores,
  repuesto,
} from '@/drizzle/schema/logistica'
import { pedidosDTO } from '@/DTO/logistica/pedidos'
import { filterColumn } from '@/lib/filter-column'
import { searchParamsSchema } from '@/schemas/form'
import { pedidoRepuestoSchema } from '@/schemas/logistica'
import { and, count, eq, or, SQL } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const { page, per_page, operator, proveedor } = searchParamsSchema
      .merge(
        z.object({
          proveedor: z.string().optional(),
        }),
      )
      .parse(Object.fromEntries(new URLSearchParams(searchParams).entries()))
    const expressions: (SQL<unknown> | undefined)[] = [
      !!proveedor
        ? filterColumn({
            column: proveedores.nombre,
            value: proveedor,
          })
        : undefined,
    ]

    const where =
      !operator || operator === 'and' ? and(...expressions) : or(...expressions)

    const pedidos = await pedidosDTO({
      page,
      per_page,
      where,
    })

    const total = await db
      .select({
        count: count(),
      })
      .from(pedidoRepuesto)
      .innerJoin(proveedores, eq(proveedores.id, pedidoRepuesto.idProveedor))
      .where(where)
      .execute()
      .then((res) => res[0].count)

    return NextResponse.json({
      data: pedidos,
      pages: Math.ceil(total / per_page),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json([], {
      status: 500,
    })
  }
}

export async function POST(req: NextRequest) {
  const json = await req.json()

  const body = pedidoRepuestoSchema.parse(json)

  const [pedido] = await db
    .insert(pedidoRepuesto)
    .values({
      idProveedor: body.proveedor.id,
      fechaPedido: body.fechaPedido,
      fechaEntrega: body.fechaEntrega,
      ordenCompra: body.ordenCompra,
    })
    .returning({ id: pedidoRepuesto.id })

  for (const _repuesto of body.repuestos) {
    for (let i = 0; i < _repuesto.cantidad; i++)
      await db.insert(repuesto).values({
        idPedido: pedido.id,
        idTipoRepuesto: _repuesto.tipo_repuesto.idTipoRepuesto,
        item: _repuesto.item,
      })
  }
  revalidateTag('pedidos')
  revalidateTag('repuestos')
  revalidatePath('/logistica/repuestos/reparaciones/create')
  return NextResponse.json(pedido)
}
