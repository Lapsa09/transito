import { db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/camiones'
import { barrios, motivos, vicenteLopez } from '@/drizzle/schema/schema'
import { eq, sql, SQL } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

export const localidad_origen = alias(barrios, 'localidad_origen')
export const localidad_destino = alias(barrios, 'localidad_destino')

export async function camionesDTO({
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
      acta: registros.acta,
      dominio: registros.dominio,
      resolucion: registros.resolucion,
      lpcarga: registros.lpcarga,
      id_operativo: registros.idOperativo,
      motivo: motivos.motivo,
      localidad_origen: localidad_origen.barrio,
      localidad_destino: localidad_destino.barrio,
      fecha: operativos.fecha,
      hora: registros.hora,
      direccion_full: operativos.direccionFull,
      latitud: operativos.latitud,
      longitud: operativos.longitud,
      cp: vicenteLopez.cp,
      localidad: vicenteLopez.barrio,
      turno: operativos.turno,
      qth: operativos.direccion,
      legajo: operativos.legajo,
      licencia: registros.licencia,
      remito: registros.remito,
      carga: registros.carga,
      destino: sql<string>`upper(${registros.destino})`,
      origen: sql<string>`upper(${registros.origen})`,
    })
    .from(registros)
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(
      localidad_destino,
      eq(registros.idLocalidadDestino, localidad_destino.idBarrio),
    )
    .innerJoin(
      localidad_origen,
      eq(registros.idLocalidadOrigen, localidad_origen.idBarrio),
    )
    .leftJoin(motivos, eq(registros.idMotivo, motivos.idMotivo))
    .innerJoin(vicenteLopez, eq(operativos.idLocalidad, vicenteLopez.idBarrio))
    .where(where)
    .orderBy(orderBy)
    .limit(per_page)
    .offset((page - 1) * per_page)
}

export type CamionesDTO = Awaited<ReturnType<typeof camionesDTO>>[0]
