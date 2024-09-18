import { db } from '@/drizzle'
import { motoMotivo, operativos, registros } from '@/drizzle/schema/motos'
import {
  barrios,
  motivos,
  tipoLicencias,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { eq, sql, SQL } from 'drizzle-orm'

export async function motosDTO({
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
      fecha_carga: registros.fechacarga,
      lpcarga: registros.lpcarga,
      id_operativo: registros.idOperativo,
      motivos: sql<
        string[]
      >`select array_agg(motivos.motivo) from ${motoMotivo} inner join ${motivos} on ${motoMotivo.idMotivo} = ${motivos.idMotivo} where ${motoMotivo.idRegistro} = ${registros.id}`,
      tipo_licencia: tipoLicencias.tipo,
      vehiculo: tipoLicencias.vehiculo,
      zona_infractor: barrios.barrio,
      fecha: operativos.fecha,
      hora: operativos.hora,
      direccion_full: operativos.direccionFull,
      latitud: operativos.latitud,
      longitud: operativos.longitud,
      cp: vicenteLopez.cp,
      localidad: vicenteLopez.barrio,
      seguridad: operativos.seguridad,
      turno: operativos.turno,
      qth: operativos.qth,
      legajo_a_cargo: operativos.legajoACargo,
      legajo_planilla: operativos.legajoPlanilla,
      licencia: registros.licencia,
      tipo_vehiculo: tipoLicencias.vehiculo,
    })
    .from(registros)
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(barrios, eq(registros.idZonaInfractor, barrios.idBarrio))
    .leftJoin(motivos, eq(motoMotivo.idMotivo, motivos.idMotivo))
    .leftJoin(tipoLicencias, eq(registros.idLicencia, tipoLicencias.idTipo))
    .innerJoin(vicenteLopez, eq(operativos.idZona, vicenteLopez.idBarrio))
    .where(where)
    .orderBy(orderBy)
    .limit(per_page)
    .offset((page - 1) * per_page)
}

export type MotosDTO = Awaited<ReturnType<typeof motosDTO>>[0]
