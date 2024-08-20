import { db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/operativos'
import {
  barrios,
  motivos,
  tipoLicencias,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { autosInputPropsSchema } from '@/schemas/autos'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const [auto] = await db
    .select({
      id: registros.id,
      acta: registros.acta,
      dominio: registros.dominio,
      graduacion_alcoholica: registros.graduacionAlcoholica,
      licencia: registros.licencia,
      resolucion: registros.resolucion,
      tipo_licencia: tipoLicencias,
      zona_infractor: barrios,
      motivo: motivos,
      id_operativo: registros.idOperativo,
      fecha: operativos.fecha,
      hora: operativos.hora,
      localidad: vicenteLopez,
      turno: operativos.turno,
      legajo_a_cargo: operativos.legajoACargo,
      legajo_planilla: operativos.legajoPlanilla,
      qth: operativos.qth,
      seguridad: operativos.seguridad,
    })
    .from(registros)
    .innerJoin(operativos, eq(operativos.idOp, registros.idOperativo))
    .innerJoin(vicenteLopez, eq(operativos.idLocalidad, vicenteLopez.idBarrio))
    .leftJoin(tipoLicencias, eq(registros.idLicencia, tipoLicencias.idTipo))
    .innerJoin(barrios, eq(registros.idZonaInfractor, barrios.idBarrio))
    .innerJoin(motivos, eq(registros.idMotivo, motivos.idMotivo))
    .where(eq(registros.id, Number(id)))

  if (auto) {
    return NextResponse.json(auto)
  }
  return NextResponse.json(null)
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const json = await req.json()

  const body = autosInputPropsSchema
    .merge(z.object({ id_operativo: z.number() }))
    .parse(json)

  await db
    .update(registros)
    .set({
      acta: body.acta,
      dominio: body.dominio,
      graduacionAlcoholica: body.graduacion_alcoholica,
      licencia: body.licencia,
      resolucion: body.resolucion,
      idLicencia: body.tipo_licencia?.idTipo,
      idZonaInfractor: body.zona_infractor?.idBarrio,
      idMotivo: body.motivo?.idMotivo,
      idOperativo: body.id_operativo,
    })
    .where(eq(registros.id, Number(id)))

  await db
    .update(operativos)
    .set({
      fecha: sql`to_date(${body.fecha},'YYYY-MM-DD')`,
      hora: body.hora,
      idLocalidad: body.localidad?.idBarrio,
      turno: body.turno,
      legajoACargo: body.legajo_a_cargo,
      legajoPlanilla: body.legajo_planilla,
      qth: body.qth,
      seguridad: body.seguridad,
      direccionFull: `${body.qth}, ${body.localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    })
    .where(eq(operativos.idOp, body.id_operativo))

  return NextResponse.json('Exito')
}
