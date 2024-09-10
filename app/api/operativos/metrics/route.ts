import { db } from '@/drizzle'
import * as Camiones from '@/drizzle/schema/camiones'
import * as Motos from '@/drizzle/schema/motos'
import * as Autos from '@/drizzle/schema/operativos'
import { count, eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchParamsSchema = z.object({
  y: z.coerce.number().optional().default(new Date().getFullYear()),
})

export async function GET(req: NextRequest) {
  const { y } = searchParamsSchema.parse(req.nextUrl.searchParams)
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
      mes: Intl.DateTimeFormat('es', { month: 'long' }).format(
        new Date().setMonth(auto.id - 1),
      ),
    }))
  })

  return NextResponse.json({
    byTrim,
    byMes,
  })
}
