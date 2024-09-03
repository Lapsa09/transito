import { db } from '@/drizzle'
import { pedidoRepuesto, repuesto } from '@/drizzle/schema/logistica'
import { PedidosDTO, pedidosDTO } from '@/DTO/logistica/pedidos'
import { searchParamsSchema } from '@/schemas/form'
import { pedidoRepuestoSchema } from '@/schemas/logistica'
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
