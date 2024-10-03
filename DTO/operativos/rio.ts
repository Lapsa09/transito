import { db } from '@/drizzle'
import { operativos, registros, zonas } from '@/drizzle/schema/nuevo_control'
import { barrios } from '@/drizzle/schema/schema'
import { eq, SQL } from 'drizzle-orm'

export async function rioDTO({
  page,
  per_page,
  orderBy,
  where,
}: {
  page: number
  per_page: number
  orderBy: SQL
  where?: SQL
}) {
  return db
    .select({
      id: registros.id,
      dominio: registros.dominio,
      fecha_carga: registros.fechacarga,
      lpcarga: registros.lpcarga,
      id_operativo: registros.idOperativo,
      motivo: operativos.motivo,
      zona_infractor: barrios.barrio,
      fecha: operativos.fecha,
      turno: operativos.turno,
      legajo: operativos.lp,
      zona: zonas.zona,
    })
    .from(registros)
    .innerJoin(operativos, eq(operativos.idOp, registros.idOperativo))
    .innerJoin(barrios, eq(barrios.idBarrio, registros.idLocalidad))
    .innerJoin(zonas, eq(zonas.idZona, registros.idZona))
    .where(where)
    .orderBy(orderBy)
    .limit(per_page)
    .offset((page - 1) * per_page)
}

export type RioDTO = Awaited<ReturnType<typeof rioDTO>>[0]
