import { db } from '@/drizzle'
import {
  pedidoRepuesto,
  proveedor,
  repuesto,
  tipoRepuesto,
} from '@/drizzle/schema/logistica'
import { eq, sql } from 'drizzle-orm'

export async function pedidosDTO({
  page,
  per_page,
}: {
  page: number
  per_page: number
}) {
  return await db
    .select({
      id: pedidoRepuesto.id,
      fechaPedido: pedidoRepuesto.fechaPedido,
      fechaEntrega: pedidoRepuesto.fechaEntrega,
      ordenCompra: pedidoRepuesto.ordenCompra,
      proveedor: proveedor.nombre,
      repuestos: sql<
        {
          item: string
          tipoRepuesto: string
          cantidad: number
        }[]
      >`select ${repuesto.item}, ${tipoRepuesto.tipo} as tipoRepuesto, count(*) as cantidad from ${repuesto} inner join ${tipoRepuesto} on ${repuesto.idTipoRepuesto} = ${tipoRepuesto.idTipoRepuesto} where ${repuesto.idPedido} = ${pedidoRepuesto.id} group by ${repuesto.item}, ${tipoRepuesto.tipo}`,
    })
    .from(pedidoRepuesto)
    .innerJoin(repuesto, eq(repuesto.idPedido, pedidoRepuesto.id))
    .innerJoin(
      tipoRepuesto,
      eq(repuesto.idTipoRepuesto, tipoRepuesto.idTipoRepuesto),
    )
    .innerJoin(proveedor, eq(pedidoRepuesto.idProveedor, proveedor.id))
    .offset((page - 1) * per_page)
    .limit(per_page)
}

export type PedidosDTO = Awaited<ReturnType<typeof pedidosDTO>>[0]
