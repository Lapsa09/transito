import { db } from '@/drizzle'
import {
  localidad_destino,
  localidad_origen,
  operativos,
  registros,
} from '@/drizzle/schema/camiones'
import { barrios, motivos, vicenteLopez } from '@/drizzle/schema/schema'
import { and, count, desc, eq, isNotNull, sql, sum } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchParamsSchema = z.object({
  y: z.coerce.number().default(new Date().getFullYear()),
})

export async function GET(req: NextRequest) {
  const { y } = searchParamsSchema.parse(req.nextUrl.searchParams)
  const camiones = db
    .select({
      id: registros.id,
      resolucion: registros.resolucion,
      motivo: motivos.motivo,
      localidadOrigen: barrios.barrio,
      //   localidadDestino: localidad_destino.barrio,
      remito: registros.remito,
      carga: registros.carga,
      fecha: operativos.fecha,
      direccion_full: operativos.direccionFull,
      latitud: operativos.latitud,
      longitud: operativos.longitud,
      qth: operativos.direccion,
      idLocalidadDestino: registros.idLocalidadDestino,
      idLocalidadOrigen: registros.idLocalidadOrigen,
    })
    .from(registros)
    .where(eq(sql`extract(year from ${operativos.fecha})`, y))
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(barrios, eq(registros.idLocalidadOrigen, barrios.idBarrio))
    .innerJoin(
      localidad_destino,
      eq(registros.idLocalidadDestino, localidad_destino.idBarrio),
    )
    .leftJoin(motivos, eq(registros.idMotivo, motivos.idMotivo))
    .innerJoin(vicenteLopez, eq(operativos.idLocalidad, vicenteLopez.idBarrio))
    .as('camiones')

  const byTrim = await db.transaction(async (tx) => {
    const trimAuto = sql<number>`extract(quarter from ${camiones.fecha})`

    const _camiones = await tx
      .select({
        value: count(),
        id: trimAuto,
      })
      .from(camiones)
      .groupBy(trimAuto)

    return _camiones.map((auto) => ({
      id: auto.id,
      value: auto.value,
      label: `Trim. ${auto.id}`,
    }))
  })

  const byMes = await db.transaction(async (tx) => {
    const mesCamion = sql<number>`extract(month from ${camiones.fecha})`

    const _camiones = await tx
      .select({
        value: count(),
        id: mesCamion,
      })
      .from(camiones)
      .groupBy(mesCamion)

    return _camiones.map((auto) => ({
      value: auto.value,
      label: Intl.DateTimeFormat('es', { month: 'long' }).format(
        new Date().setMonth(auto.id - 1),
      ),
      id: auto.id,
    }))
  })

  const byResolucion = await db.transaction(async (tx) => {
    const _camiones = await tx
      .select({
        value: count(),
        id: camiones.resolucion,
      })
      .from(camiones)
      .groupBy(camiones.resolucion)
      .orderBy(desc(count()))

    return _camiones
  })
  const byVecinos = await db.transaction(async (tx) => {
    const vilo = (await tx.select().from(vicenteLopez)).map((v) => v.barrio)
    const id = sql`CASE WHEN ${camiones.localidadOrigen} = 'CABA' THEN 'caba' ELSE case when ${camiones.localidadOrigen} in ${vilo} THEN 'vecinos' else 'otros' end END`
    const aux = tx
      .select({ id: id.as('id'), value: count().as('value') })
      .from(camiones)
      .groupBy(camiones.localidadOrigen)
      .as('aux')
    const _camiones = await tx
      .select({
        value: sum(aux.value),
        id: aux.id,
      })
      .from(aux)
      .groupBy(aux.id)

    return _camiones
  })

  const byMotivos = await db.transaction(async (tx) => {
    const _camiones = await tx
      .select({
        value: count(),
        id: camiones.motivo,
      })
      .from(camiones)
      .where(isNotNull(camiones.motivo))
      .groupBy(camiones.motivo)
      .orderBy(desc(count()))

    return _camiones
  })

  const byLocalidad = await db.transaction(async (tx) => {
    const destino = tx.select().from(localidad_destino).as('destino')
    const _camiones = await tx
      .select({
        value: count(),
        origen: camiones.localidadOrigen,
        destino: destino.barrio,
      })
      .from(camiones)
      .innerJoin(destino, eq(camiones.idLocalidadDestino, destino.idBarrio))
      .groupBy(camiones.localidadOrigen, destino.barrio)
      .orderBy(desc(count()))

    return _camiones
  })

  const geoJSON = await db.transaction(async (tx) => {
    const _camiones = await tx
      .select({
        id: camiones.id,
        latitud: camiones.latitud,
        longitud: camiones.longitud,
        qth: camiones.qth,
      })
      .from(camiones)
      .where(and(isNotNull(camiones.latitud), isNotNull(camiones.longitud)))

    return {
      type: 'FeatureCollection',
      features: _camiones.map((auto) => ({
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

  const byRemito = await db.transaction(async (tx) => {
    const _camiones = await tx
      .select({
        value: count(),
        id: camiones.remito,
      })
      .from(camiones)
      .groupBy(camiones.remito)

    return _camiones.map((camion) => ({
      value: camion.value,
      id: camion.id ? 'Con remito' : 'Sin remito',
    }))
  })

  return NextResponse.json({
    byTrim,
    byMes,
    byResolucion,
    byVecinos,
    byMotivos,
    byLocalidad,
    geoJSON,
    byRemito,
  })
}
