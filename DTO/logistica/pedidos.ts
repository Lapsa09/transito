import { db } from '@/drizzle'
import {
  pedidoRepuesto,
  proveedor,
  repuesto,
  tipoRepuesto,
} from '@/drizzle/schema/logistica'
import { jsonAgg } from '@/utils/misc'
import { SQL, eq } from 'drizzle-orm'

export async function pedidosDTO({
  page,
  per_page,
  where,
}: {
  page: number
  per_page: number
  where?: SQL
}) {
  return await db
    .select({
      id: pedidoRepuesto.id,
      fechaPedido: pedidoRepuesto.fechaPedido,
      fechaEntrega: pedidoRepuesto.fechaEntrega,
      ordenCompra: pedidoRepuesto.ordenCompra,
      proveedor: proveedor.nombre,
      repuestos: jsonAgg({
        item: repuesto.item,
        tipoRepuesto: tipoRepuesto.tipo,
      }),
    })
    .from(pedidoRepuesto)
    .where(where)
    .innerJoin(repuesto, eq(repuesto.idPedido, pedidoRepuesto.id))
    .groupBy(
      pedidoRepuesto.id,
      proveedor.nombre,
      pedidoRepuesto.fechaPedido,
      pedidoRepuesto.fechaEntrega,
      pedidoRepuesto.ordenCompra,
    )
    .innerJoin(
      tipoRepuesto,
      eq(repuesto.idTipoRepuesto, tipoRepuesto.idTipoRepuesto),
    )
    .innerJoin(proveedor, eq(pedidoRepuesto.idProveedor, proveedor.id))
    .offset((page - 1) * per_page)
    .limit(per_page)
}

export type PedidosDTO = Awaited<ReturnType<typeof pedidosDTO>>[0]
