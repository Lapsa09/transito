import { db } from '@/drizzle/db'
import {
  reparaciones,
  repuesto,
  tipoRepuesto,
} from '@/drizzle/schema/logistica'
import { eq, isNull } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const repuestos = await db
    .selectDistinctOn([repuesto.item], {
      id: repuesto.id,
      item: repuesto.item,
      idPedido: repuesto.idPedido,
      idTipoRepuesto: repuesto.idTipoRepuesto,
      tipoRepuesto: tipoRepuesto.tipo,
    })
    .from(repuesto)
    .fullJoin(
      tipoRepuesto,
      eq(repuesto.idTipoRepuesto, tipoRepuesto.idTipoRepuesto),
    )
    .fullJoin(reparaciones, eq(repuesto.id, reparaciones.articulo))
    .where(isNull(reparaciones.articulo))

  return NextResponse.json(repuestos)
}
