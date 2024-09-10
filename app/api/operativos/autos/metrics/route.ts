import { db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/operativos'
import {
  barrios,
  motivos,
  tipoLicencias,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { and, count, desc, eq, isNotNull, sql, sum } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchParamsSchema = z.object({
  y: z.coerce.number().optional().default(new Date().getFullYear()),
})

export async function GET(req: NextRequest) {
  const { y } = searchParamsSchema.parse(req.nextUrl.searchParams)
  const autos = db
    .select({
      id: registros.id,
      resolucion: registros.resolucion,
      motivo: motivos.motivo,
      zona_infractor: barrios.barrio,
      fecha: operativos.fecha,
      direccion_full: operativos.direccionFull,
      latitud: operativos.latitud,
      longitud: operativos.longitud,
      es_del: registros.esDel,
      qth: operativos.qth,
    })
    .from(registros)
    .where(eq(sql`extract(year from ${operativos.fecha})`, y))
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(barrios, eq(registros.idZonaInfractor, barrios.idBarrio))
    .leftJoin(motivos, eq(registros.idMotivo, motivos.idMotivo))
    .leftJoin(tipoLicencias, eq(registros.idLicencia, tipoLicencias.idTipo))
    .innerJoin(vicenteLopez, eq(operativos.idLocalidad, vicenteLopez.idBarrio))
    .as('autos')

  const byTrim = await db.transaction(async (tx) => {
    const trimAuto = sql<number>`extract(quarter from ${autos.fecha})`

    const _autos = await tx
      .select({
        value: count(),
        id: trimAuto,
      })
      .from(autos)
      .groupBy(trimAuto)

    return _autos.map((auto) => ({
      id: auto.id,
      value: auto.value,
      label: `Trim. ${auto.id}`,
    }))
  })

  const byMes = await db.transaction(async (tx) => {
    const mesAuto = sql<number>`extract(month from ${autos.fecha})`

    const _autos = await tx
      .select({
        value: count(),
        id: mesAuto,
      })
      .from(autos)
      .groupBy(mesAuto)

    return _autos.map((auto) => ({
      value: auto.value,
      label: Intl.DateTimeFormat('es', { month: 'long' }).format(
        new Date().setMonth(auto.id - 1),
      ),
      id: auto.id,
    }))
  })

  const byResolucion = await db.transaction(async (tx) => {
    const _autos = await tx
      .select({
        value: count(),
        id: autos.resolucion,
      })
      .from(autos)
      .groupBy(autos.resolucion)
      .orderBy(desc(count()))

    return _autos
  })
  const byVecinos = await db.transaction(async (tx) => {
    const vilo = (await db.select().from(vicenteLopez)).map((v) => v.barrio)
    const id = sql`CASE WHEN ${autos.zona_infractor} = 'CABA' THEN 'caba' ELSE case when ${autos.zona_infractor} in ${vilo} THEN 'vecinos' else 'otros' end END`
    const aux = db
      .select({ id: id.as('id'), value: count().as('value') })
      .from(autos)
      .groupBy(autos.zona_infractor)
      .as('aux')
    const _autos = await tx
      .select({
        value: sum(aux.value),
        id: aux.id,
      })
      .from(aux)
      .groupBy(aux.id)

    return _autos
  })

  const byMotivos = await db.transaction(async (tx) => {
    const _autos = await tx
      .select({
        value: count(),
        id: autos.motivo,
      })
      .from(autos)
      .where(isNotNull(autos.motivo))
      .groupBy(autos.motivo)
      .orderBy(desc(count()))

    return _autos
  })

  const byLocalidad = await db.transaction(async (tx) => {
    const _autos = await tx
      .select({
        value: count(),
        id: autos.zona_infractor,
      })
      .from(autos)
      .groupBy(autos.zona_infractor)
      .orderBy(desc(count()))

    return _autos
  })

  const geoJSON = await db.transaction(async (tx) => {
    const _autos = await tx
      .select({
        id: autos.id,
        latitud: autos.latitud,
        longitud: autos.longitud,
        qth: autos.qth,
      })
      .from(autos)
      .where(and(isNotNull(autos.latitud), isNotNull(autos.longitud)))

    return {
      type: 'FeatureCollection',
      features: _autos.map((auto) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [auto.longitud, auto.latitud],
        },
        properties: {
          id: auto.id,
          qth: auto.qth,
        },
      })),
    }
  })

  return NextResponse.json({
    byTrim,
    byMes,
    byResolucion,
    byVecinos,
    byMotivos,
    byLocalidad,
    geoJSON,
  })
}
