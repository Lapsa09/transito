import { db } from '@/drizzle'
import { motoMotivo, operativos, registros } from '@/drizzle/schema/motos'
import {
  barrios,
  Motivo,
  motivos,
  tipoLicencias,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { motosInputPropsSchema } from '@/schemas/motos'
import { eq, sql } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const [moto] = await db
    .select({
      acta: registros.acta,
      dominio: registros.dominio,
      fecha: operativos.fecha,
      hora: operativos.hora,
      id_op: operativos.idOp,
      legajo_a_cargo: operativos.legajoACargo,
      legajo_planilla: operativos.legajoPlanilla,
      licencia: registros.licencia,
      qth: operativos.qth,
      resolucion: registros.resolucion,
      seguridad: operativos.seguridad,
      turno: operativos.turno,
      zona_infractor: barrios,
      localidad: vicenteLopez,
      tipo_licencia: tipoLicencias,
      motivos: sql<
        Motivo[]
      >`select json_agg(json_build_object(id_motivo,${motivos.idMotivo},motivo,${motivos.motivo})) from ${motoMotivo} inner join ${motivos} on ${motoMotivo.idMotivo} = ${motivos.idMotivo} where ${motoMotivo.idRegistro} = ${registros.id}`,
    })
    .from(registros)
    .where(eq(registros.id, Number(id)))
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(vicenteLopez, eq(operativos.idZona, vicenteLopez.idBarrio))
    .leftJoin(motoMotivo, eq(registros.id, motoMotivo.idRegistro))
    .innerJoin(barrios, eq(registros.idZonaInfractor, barrios.idBarrio))
    .innerJoin(motivos, eq(motoMotivo.idMotivo, motivos.idMotivo))
    .leftJoin(tipoLicencias, eq(registros.idLicencia, tipoLicencias.idTipo))

  if (moto) {
    return NextResponse.json(moto)
  }
  return NextResponse.json(null)
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state
  const json = await req.json()

  const body = motosInputPropsSchema
    .merge(
      z.object({
        id_op: z.number(),
        motivos: z.array(createSelectSchema(motivos)).optional(),
      }),
    )
    .parse(json)

  await db
    .update(operativos)
    .set({
      fecha: sql`to_date(${body.fecha}, 'YYYY-MM-DD')`,
      hora: body.hora,
      idZona: body.localidad?.idBarrio,
      turno: body.turno,
      legajoACargo: body.legajo_a_cargo,
      legajoPlanilla: body.legajo_planilla,
      qth: body.qth,
      seguridad: body.seguridad,
      direccionFull: `${body.qth}, ${body.localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    })
    .where(eq(operativos.idOp, body.id_op))

  await db
    .update(registros)
    .set({
      acta: body.acta,
      dominio: body.dominio,
      licencia: body.licencia,
      resolucion: body.resolucion,
      idLicencia: body.tipo_licencia?.idTipo,
      idZonaInfractor: body.zona_infractor?.idBarrio,
    })
    .where(eq(registros.id, Number(id)))

  await db.delete(motoMotivo).where(eq(motoMotivo.idRegistro, Number(id)))

  for (const motivo of body.motivos || []) {
    await db.insert(motoMotivo).values({
      idRegistro: Number(id),
      idMotivo: motivo?.idMotivo,
    })
  }

  return NextResponse.json('Exito')
}
