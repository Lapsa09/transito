import { db } from '@/drizzle'
import {
  pedidoRepuesto,
  reparaciones,
  repuesto,
  tipoRepuesto,
} from '@/drizzle/schema/logistica'
import { eq, SQL, sql } from 'drizzle-orm'

export async function repuestosDTO({
  page,
  per_page,
  order,
}: {
  page: number
  per_page: number
  order: SQL
}) {
  return await db
    .select({
      id: repuesto.id,
      item: repuesto.item,
      tipoRepuesto: tipoRepuesto.tipo,
      ubicacion: reparaciones.patente || sql<string>`'En almacen'`,
      estado: reparaciones ? sql<string>`'Usado'` : sql<string>`'Sin usar'`,
    })
    .from(repuesto)
    .limit(per_page)
    .offset((page - 1) * per_page)
    .innerJoin(
      tipoRepuesto,
      eq(repuesto.idTipoRepuesto, tipoRepuesto.idTipoRepuesto),
    )
    .innerJoin(pedidoRepuesto, eq(repuesto.idPedido, pedidoRepuesto.id))
    .leftJoin(reparaciones, eq(repuesto.id, reparaciones.articulo))
    .orderBy(order)
}

export type RepuestosDTO = Awaited<ReturnType<typeof repuestosDTO>>[0]
