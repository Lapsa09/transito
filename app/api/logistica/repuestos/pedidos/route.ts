import { db } from '@/drizzle'
import {
  pedidoRepuesto,
  repuesto,
  tipoRepuesto,
} from '@/drizzle/schema/logistica'
import { PedidosDTO, pedidosDTO } from '@/DTO/logistica/pedidos'
import { searchParamsSchema } from '@/schemas/form'
import { count } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const { page, per_page, sort } = searchParamsSchema.parse(searchParams)
  const [column, order] = (sort?.split('.').filter(Boolean) ?? [
    'id',
    'desc',
  ]) as [keyof PedidosDTO, 'asc' | 'desc']

  const pedidos = await pedidosDTO({
    page,
    per_page,
  })

  const total = await db
    .select({
      count: count(),
    })
    .from(pedidoRepuesto)
    .execute()
    .then((res) => res[0].count)

  return NextResponse.json({
    data: pedidos,
    pages: Math.ceil(total / per_page),
  })
}

export async function POST(req: NextRequest) {
  const body: {
    repuestos: {
      tipo_repuesto: typeof tipoRepuesto.$inferSelect
      item: string
      cantidad: number
    }[]
    proveedor: {
      id: number
    }
    cantidad: number
    fecha_entrega: string
    fecha_pedido: string
    orden_compra: string
  } = await req.json()

  const [pedido] = await db
    .insert(pedidoRepuesto)
    .values({
      idProveedor: body.proveedor.id,
      fechaPedido: body.fecha_pedido,
      fechaEntrega: body.fecha_entrega,
      ordenCompra: body.orden_compra,
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
