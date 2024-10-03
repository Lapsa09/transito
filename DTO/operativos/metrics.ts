import { readFileSync } from 'fs'
import xlsx from 'xlsx'
import { db } from '@/drizzle'
import * as Camiones from '@/drizzle/schema/camiones'
import * as Motos from '@/drizzle/schema/motos'
import * as Autos from '@/drizzle/schema/operativos'
import { and, count, desc, eq, isNotNull, sql, sum } from 'drizzle-orm'
import {
  barrios,
  motivos,
  tipoLicencias,
  vicenteLopez,
} from '@/drizzle/schema/schema'

const filePath = process.env.NEXT_PUBLIC_FILEPATH!

type Res = {
  Número: number
  'Tipo de servicio': string
  'Situación reportada': string
  Ubicación: string
  'Fecha de ingreso': number
  Estado: string
  Prioridad: string
  'Fecha de estado': number
  'Fecha de vencimiento': number | string
  LAT: number
  LNG: number
  LAT2: string
  LNG2: string
  duracion: number
  Turno: string
  Sobra: number
  Mes: number
}

export function citymisMetrics() {
  function excelDateToJSDate(serial: number) {
    const utc_days = Math.floor(serial - 25569)
    const utc_value = utc_days * 86400
    const date_info = new Date(utc_value * 1000)

    const fractional_day = serial - Math.floor(serial) + 0.0000001

    let total_seconds = Math.floor(86400 * fractional_day)

    const seconds = total_seconds % 60

    total_seconds -= seconds
    const hours = Math.floor(total_seconds / (60 * 60))
    const minutes = Math.floor(total_seconds / 60) % 60
    date_info.setUTCHours(hours, minutes, seconds)
    return new Date(date_info)
  }

  const file = readFileSync(filePath)

  // Load the Excel file
  const workbook = xlsx.read(file, { type: 'buffer' })

  // Get the first sheet of the workbook
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  // Convert the worksheet to JSON
  const jsonData = xlsx.utils.sheet_to_json<Res>(worksheet)

  // Display the JSON data in the console
  const data = jsonData.map((row) => ({
    ...row,
    'Fecha de ingreso': excelDateToJSDate(row['Fecha de ingreso']),
    'Fecha de estado': excelDateToJSDate(row['Fecha de estado']),
    'Fecha de vencimiento':
      typeof row['Fecha de vencimiento'] === 'string'
        ? row['Fecha de vencimiento']
        : excelDateToJSDate(row['Fecha de vencimiento']),
    Sobra: excelDateToJSDate(row.Sobra),
    LAT2: +row.LAT2.replace(/,/g, '.'),
    LNG2: +row.LNG2.replace(/,/g, '.'),
  }))

  const byTrim = data.reduce<{ label: string; value: number; id: number }[]>(
    (acc, row) => {
      const quarter = Math.ceil(row.Mes / 3)

      const q = acc.findIndex((q) => q.id === quarter)

      if (q === -1) {
        acc.push({
          id: quarter,
          label: `Trim. ${quarter}`,
          value: 1,
        })
      } else acc[q].value += 1
      return acc
    },
    [],
  )

  const byMes = data.reduce<{ label: string; value: number; id: number }[]>(
    (acc, row) => {
      const mes = row.Mes

      const q = acc.findIndex((q) => q.id === mes)

      if (q === -1) {
        acc.push({
          id: mes,
          label: Intl.DateTimeFormat('es', { month: 'long' }).format(
            new Date().setMonth(mes - 1),
          ),
          value: 1,
        })
      } else acc[q].value += 1

      return acc
    },
    [],
  )

  const byDuracion = data
    .map((row) => ({
      ...row,
      duracion:
        (row['Fecha de estado'].getTime() - row['Fecha de ingreso'].getTime()) /
        1000,
    }))
    .reduce<{ label: string; value: number; id: string; cant: number }[]>(
      (acc, row) => {
        const q = acc.findIndex((q) => q.id === row.Turno)

        if (q === -1) {
          acc.push({
            id: row.Turno,
            label: 'Turno ' + row.Turno,
            value: row.duracion,
            cant: 1,
          })
        } else {
          acc[q].value += row.duracion
          acc[q].cant += 1
        }

        return acc
      },
      [],
    )
    .map((row) => ({
      id: row.id,
      label: row.label,
      value: row.value / row.cant,
    }))

  const totalDenuncias = byTrim.reduce((acc, { value }) => acc + value, 0)

  return {
    byTrim,
    byMes: byMes.slice(-(byMes.length % 3) || -(byMes.length / 3)),
    byDuracion,
    totalDenuncias,
  }
}

export type CitymisMetrics = ReturnType<typeof citymisMetrics>

export async function generalMetrics({ y }: { y: number }) {
  const autos = db
    .select()
    .from(Autos.registros)
    .innerJoin(
      Autos.operativos,
      eq(Autos.operativos.idOp, Autos.registros.idOperativo),
    )
    .where(eq(sql`extract(year from ${Autos.operativos.fecha})`, y))
    .as('autos')

  const motos = db
    .select()
    .from(Motos.registros)
    .innerJoin(
      Motos.operativos,
      eq(Motos.operativos.idOp, Motos.registros.idOperativo),
    )
    .where(eq(sql`extract(year from ${Motos.operativos.fecha})`, y))
    .as('motos')
  const camiones = db
    .select()
    .from(Camiones.registros)
    .innerJoin(
      Camiones.operativos,
      eq(Camiones.operativos.idOp, Camiones.registros.idOperativo),
    )
    .where(eq(sql`extract(year from ${Camiones.operativos.fecha})`, y))
    .as('camiones')

  const byTrim = await db.transaction(async (tx) => {
    const trimAuto = sql<number>`extract(quarter from ${autos.operativos.fecha})`
    const trimMoto = sql<number>`extract(quarter from ${motos.operativos.fecha})`
    const trimCamion = sql<number>`extract(quarter from ${camiones.operativos.fecha})`
    const _autos = await tx
      .select({
        value: count(),
        id: trimAuto,
      })
      .from(autos)
      .groupBy(trimAuto)
    const _motos = await tx
      .select({
        value: count(),
        id: trimMoto,
      })
      .from(motos)
      .groupBy(trimMoto)
    const _camiones = await tx
      .select({
        value: count(),
        id: trimCamion,
      })
      .from(camiones)
      .groupBy(trimCamion)

    return _autos.map((auto, i) => ({
      id: auto.id,
      value: auto.value + _motos[i].value + _camiones[i].value,
      label: `Trim. ${auto.id}`,
    }))
  })

  const byMes = await db.transaction(async (tx) => {
    const mesAuto = sql<number>`extract(month from ${autos.operativos.fecha})`
    const mesMoto = sql<number>`extract(month from ${motos.operativos.fecha})`
    const mesCamion = sql<number>`extract(month from ${camiones.operativos.fecha})`
    const _autos = await tx
      .select({
        value: count(),
        id: mesAuto,
      })
      .from(autos)
      .groupBy(mesAuto)
    const _motos = await tx
      .select({
        value: count(),
        id: mesMoto,
      })
      .from(motos)
      .groupBy(mesMoto)
    const _camiones = await tx
      .select({
        value: count(),
        id: mesCamion,
      })
      .from(camiones)
      .groupBy(mesCamion)

    return _autos.map((auto, i) => ({
      autos: auto.value,
      motos: _motos[i].value,
      camiones: _camiones[i].value,
      label: Intl.DateTimeFormat('es', { month: 'long' }).format(
        new Date().setMonth(auto.id - 1),
      ),
    }))
  })

  const totalVehiculos = byTrim.reduce((acc, { value }) => acc + value, 0)

  return {
    byTrim,
    byMes: byMes.slice(-(byMes.length % 3) || -(byMes.length / 3)),
    totalVehiculos,
  }
}

export type GeneralMetrics = Awaited<ReturnType<typeof generalMetrics>>

export async function autosMetrics({ y }: { y: number }) {
  const autos = db
    .select({
      id: Autos.registros.id,
      resolucion: Autos.registros.resolucion,
      motivo: motivos.motivo,
      zona_infractor: barrios.barrio,
      fecha: Autos.operativos.fecha,
      direccion_full: Autos.operativos.direccionFull,
      latitud: Autos.operativos.latitud,
      longitud: Autos.operativos.longitud,
      es_del: Autos.registros.esDel,
      qth: Autos.operativos.qth,
    })
    .from(Autos.registros)
    .where(eq(sql`extract(year from ${Autos.operativos.fecha})`, y))
    .innerJoin(
      Autos.operativos,
      eq(Autos.registros.idOperativo, Autos.operativos.idOp),
    )
    .innerJoin(barrios, eq(Autos.registros.idZonaInfractor, barrios.idBarrio))
    .leftJoin(motivos, eq(Autos.registros.idMotivo, motivos.idMotivo))
    .leftJoin(
      tipoLicencias,
      eq(Autos.registros.idLicencia, tipoLicencias.idTipo),
    )
    .innerJoin(
      vicenteLopez,
      eq(Autos.operativos.idLocalidad, vicenteLopez.idBarrio),
    )
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
        id: sql`${autos.resolucion}`.mapWith(String),
      })
      .from(autos)
      .groupBy(autos.resolucion)
      .orderBy(desc(count()))

    return _autos
  })
  const byVecinos = await db.transaction(async (tx) => {
    const vilo = (await db.select().from(vicenteLopez)).map((v) => v.barrio)
    const id = sql<string>`CASE WHEN ${autos.zona_infractor} = 'CABA' THEN 'caba' ELSE case when ${autos.zona_infractor} in ${vilo} THEN 'vecinos' else 'otros' end END`
    const aux = db
      .select({ id: id.as('id'), value: count().as('value') })
      .from(autos)
      .groupBy(autos.zona_infractor)
      .as('aux')
    const _autos = await tx
      .select({
        value: sum(aux.value).mapWith(Number),
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
        id: sql`${autos.motivo}`.mapWith(String),
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
          coordinates: [auto.longitud!, auto.latitud!],
        },
        properties: {
          id: auto.id,
          qth: auto.qth,
        },
      })),
    } satisfies GeoJSON.GeoJSON
  })

  return {
    byTrim,
    byMes: byMes.slice(-(byMes.length % 3) || -(byMes.length / 3)),
    byResolucion,
    byVecinos,
    byMotivos,
    byLocalidad,
    geoJSON,
  }
}

export type AutosMetrics = Awaited<ReturnType<typeof autosMetrics>>

export async function camionesMetrics({ y }: { y: number }) {
  const camiones = db
    .select({
      id: Camiones.registros.id,
      resolucion: Camiones.registros.resolucion,
      motivo: motivos.motivo,
      localidadOrigen: barrios.barrio,
      //   localidadDestino: localidad_destino.barrio,
      remito: Camiones.registros.remito,
      carga: Camiones.registros.carga,
      fecha: Camiones.operativos.fecha,
      direccion_full: Camiones.operativos.direccionFull,
      latitud: Camiones.operativos.latitud,
      longitud: Camiones.operativos.longitud,
      qth: Camiones.operativos.direccion,
      idLocalidadDestino: Camiones.registros.idLocalidadDestino,
      idLocalidadOrigen: Camiones.registros.idLocalidadOrigen,
    })
    .from(Camiones.registros)
    .where(eq(sql`extract(year from ${Camiones.operativos.fecha})`, y))
    .innerJoin(
      Camiones.operativos,
      eq(Camiones.registros.idOperativo, Camiones.operativos.idOp),
    )
    .innerJoin(
      barrios,
      eq(Camiones.registros.idLocalidadOrigen, barrios.idBarrio),
    )
    .innerJoin(
      Camiones.localidad_destino,
      eq(
        Camiones.registros.idLocalidadDestino,
        Camiones.localidad_destino.idBarrio,
      ),
    )
    .leftJoin(motivos, eq(Camiones.registros.idMotivo, motivos.idMotivo))
    .innerJoin(
      vicenteLopez,
      eq(Camiones.operativos.idLocalidad, vicenteLopez.idBarrio),
    )
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
        id: sql`${camiones.resolucion}`.mapWith(String),
      })
      .from(camiones)
      .groupBy(camiones.resolucion)
      .orderBy(desc(count()))

    return _camiones
  })
  const byVecinos = await db.transaction(async (tx) => {
    const vilo = (await tx.select().from(vicenteLopez)).map((v) => v.barrio)
    const id = sql<string>`CASE WHEN ${camiones.localidadOrigen} = 'CABA' THEN 'caba' ELSE case when ${camiones.localidadOrigen} in ${vilo} THEN 'vecinos' else 'otros' end END`
    const aux = tx
      .select({ id: id.as('id'), value: count().as('value') })
      .from(camiones)
      .groupBy(camiones.localidadOrigen)
      .as('aux')
    const _camiones = await tx
      .select({
        value: sum(aux.value).mapWith(Number),
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
        id: sql`${camiones.motivo}`.mapWith(String),
      })
      .from(camiones)
      .where(isNotNull(camiones.motivo))
      .groupBy(camiones.motivo)
      .orderBy(desc(count()))

    return _camiones
  })

  const byLocalidad = await db.transaction(async (tx) => {
    const destino = tx.select().from(Camiones.localidad_destino).as('destino')
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
          coordinates: [auto.longitud!, auto.latitud!],
        },
        properties: {
          id: auto.id,
          qth: auto.qth,
        },
      })),
    } satisfies GeoJSON.GeoJSON
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

  return {
    byTrim,
    byMes: byMes.slice(-(byMes.length % 3) || -(byMes.length / 3)),
    byResolucion,
    byVecinos,
    byMotivos,
    byLocalidad,
    geoJSON,
    byRemito,
  }
}

export type CamionesMetrics = Awaited<ReturnType<typeof camionesMetrics>>

export async function motosMetrics({ y }: { y: number }) {
  const motos = db
    .select({
      id: Motos.registros.id,
      resolucion: Motos.registros.resolucion,
      motivo: motivos.motivo,
      zona_infractor: barrios.barrio,
      fecha: Motos.operativos.fecha,
      direccion_full: Motos.operativos.direccionFull,
      latitud: Motos.operativos.latitud,
      longitud: Motos.operativos.longitud,
      qth: Motos.operativos.qth,
    })
    .from(Motos.registros)
    .where(eq(sql`extract(year from ${Motos.operativos.fecha})`, y))
    .innerJoin(
      Motos.operativos,
      eq(Motos.registros.idOperativo, Motos.operativos.idOp),
    )
    .innerJoin(barrios, eq(Motos.registros.idZonaInfractor, barrios.idBarrio))
    .leftJoin(
      Motos.motoMotivo,
      eq(Motos.registros.id, Motos.motoMotivo.idRegistro),
    )
    .leftJoin(motivos, eq(Motos.motoMotivo.idMotivo, motivos.idMotivo))
    .leftJoin(
      tipoLicencias,
      eq(Motos.registros.idLicencia, tipoLicencias.idTipo),
    )
    .innerJoin(vicenteLopez, eq(Motos.operativos.idZona, vicenteLopez.idBarrio))
    .as('motos')

  const byTrim = await db.transaction(async (tx) => {
    const trimAuto = sql<number>`extract(quarter from ${motos.fecha})`

    const _autos = await tx
      .select({
        value: count(),
        id: trimAuto,
      })
      .from(motos)
      .groupBy(trimAuto)

    return _autos.map((auto) => ({
      id: auto.id,
      value: auto.value,
      label: `Trim. ${auto.id}`,
    }))
  })

  const byMes = await db.transaction(async (tx) => {
    const mesAuto = sql<number>`extract(month from ${motos.fecha})`

    const _autos = await tx
      .select({
        value: count(),
        id: mesAuto,
      })
      .from(motos)
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
        id: sql`${motos.resolucion}`.mapWith(String),
      })
      .from(motos)
      .groupBy(motos.resolucion)
      .orderBy(desc(count()))

    return _autos
  })
  const byVecinos = await db.transaction(async (tx) => {
    const vilo = (await db.select().from(vicenteLopez)).map((v) => v.barrio)
    const id = sql<string>`CASE WHEN ${motos.zona_infractor} = 'CABA' THEN 'caba' ELSE case when ${motos.zona_infractor} in ${vilo} THEN 'vecinos' else 'otros' end END`
    const aux = db
      .select({ id: id.as('id'), value: count().as('value') })
      .from(motos)
      .groupBy(motos.zona_infractor)
      .as('aux')
    const _autos = await tx
      .select({
        value: sum(aux.value).mapWith(Number),
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
        id: sql`${motos.motivo}`.mapWith(String),
      })
      .from(motos)
      .where(isNotNull(motos.motivo))
      .groupBy(motos.motivo)
      .orderBy(desc(count()))

    return _autos
  })

  const byLocalidad = await db.transaction(async (tx) => {
    const _autos = await tx
      .select({
        value: count(),
        id: motos.zona_infractor,
      })
      .from(motos)
      .groupBy(motos.zona_infractor)
      .orderBy(desc(count()))

    return _autos
  })

  const geoJSON = await db.transaction(async (tx) => {
    const _autos = await tx
      .select({
        id: motos.id,
        latitud: motos.latitud,
        longitud: motos.longitud,
        qth: motos.qth,
      })
      .from(motos)
      .where(and(isNotNull(motos.latitud), isNotNull(motos.longitud)))

    return {
      type: 'FeatureCollection',
      features: _autos.map((auto) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [auto.longitud!, auto.latitud!],
        },
        properties: {
          id: auto.id,
          qth: auto.qth,
        },
      })),
    } satisfies GeoJSON.GeoJSON
  })

  return {
    byTrim,
    byMes: byMes.slice(-(byMes.length % 3) || -(byMes.length / 3)),
    byResolucion,
    byVecinos,
    byMotivos,
    byLocalidad,
    geoJSON,
  }
}

export type MotosMetrics = Awaited<ReturnType<typeof motosMetrics>>
