import { db } from '@/drizzle'
import { vtv } from '@/drizzle/schema/logistica'
import { desc, eq, sql } from 'drizzle-orm'

export async function vtvDTO({
  patente,
  page,
  per_page,
}: {
  patente: string
  page: number
  per_page: number
}) {
  return await db
    .select({
      fecha_emision: vtv.fechaEmision,
      vencimiento: vtv.vencimiento,
      condicion: vtv.condicion,
      estado: vtv.estado,
      observacion: vtv.observacion,
      mes: sql`extract(month from ${vtv.fechaEmision})`,
      año: sql`extract(year from ${vtv.fechaEmision})`,
    })
    .from(vtv)
    .where(eq(vtv.patente, patente))
    .limit(per_page)
    .offset((page - 1) * per_page)
    .orderBy(desc(vtv.fechaEmision))
}

export type VTVDTO = Awaited<ReturnType<typeof vtvDTO>>[0]
