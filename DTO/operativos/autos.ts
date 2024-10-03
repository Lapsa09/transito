import { db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/operativos'
import {
  barrios,
  controlSustancias,
  motivos,
  tipoLicencias,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { eq, SQL } from 'drizzle-orm'

export async function autosDTO({
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
  return await db
    .select({
      id: registros.id,
      acta: registros.acta,
      dominio: registros.dominio,
      graduacion_alcoholica: registros.graduacionAlcoholica,
      resolucion: registros.resolucion,
      fecha_carga: registros.fechacarga,
      lpcarga: registros.lpcarga,
      resultado: registros.resultado,
      id_operativo: registros.idOperativo,
      motivo: motivos.motivo,
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
      es_del: registros.esDel,
      control_sustancias: controlSustancias.resultado,
    })
    .from(registros)
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(barrios, eq(registros.idZonaInfractor, barrios.idBarrio))
    .leftJoin(motivos, eq(registros.idMotivo, motivos.idMotivo))
    .leftJoin(tipoLicencias, eq(registros.idLicencia, tipoLicencias.idTipo))
    .innerJoin(vicenteLopez, eq(operativos.idLocalidad, vicenteLopez.idBarrio))
    .innerJoin(
      controlSustancias,
      eq(registros.idSustancias, controlSustancias.id),
    )
    .where(where)
    .orderBy(orderBy)
    .limit(per_page)
    .offset((page - 1) * per_page)
}

export type AutosDTO = Awaited<ReturnType<typeof autosDTO>>[0]
