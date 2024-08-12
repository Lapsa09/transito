import { db } from '@/drizzle/db'
import { operativos, registros } from '@/drizzle/schema/operativos'
import {
  barrios,
  motivos,
  tipoLicencias,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import prisma from '@/lib/prismadb'
import { EditAutosProps } from '@/types'
import { eq, sql } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { NextResponse } from 'next/server'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  // const auto=await db.query.registrosAutos.findFirst({
  //   where:(registro,{eq})=>eq(registro.id,Number(id)),
  //   with:{
  //     motivo:true,
  //     operativo:{
  //       with:{
  //         localidad:true
  //       },
  //     },tipoLicencia:true,
  //     barrio:true
  //   }
  // })

  const auto = await db
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

  if (auto.length) {
    return NextResponse.json(
      // JSON.parse(
      //   JSON.stringify(res, (_, value) =>
      //     typeof value === 'bigint' ? value.toString() : value,
      //   ),
      // ),
      auto[0],
    )
  }
  return NextResponse.json(null)
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const body: EditAutosProps = await req.json()

  const auto = await db
    .update(registros)
    .set({
      acta: Number(body.acta) || null,
      dominio: body.dominio,
      graduacionAlcoholica: Number(body.graduacion_alcoholica) || null,
      licencia: Number(body.licencia) || null,
      resolucion: body.resolucion,
      idLicencia: body.tipo_licencia?.id_tipo,
      idZonaInfractor: body.zona_infractor?.id_barrio,
      idMotivo: body.motivo?.id_motivo,
      idOperativo: body.id_op,
    })
    .where(eq(registros.id, Number(id)))
    .returning()

  const operativo = await db
    .update(operativos)
    .set({
      fecha: sql`to_date(${body.fecha},'YYYY-MM-DD')`,
      hora: body.hora,
      idLocalidad: Number(body.localidad?.id_barrio),
      turno: body.turno,
      legajoACargo: Number(body.legajo_a_cargo),
      legajoPlanilla: Number(body.legajo_planilla),
      qth: body.qth,
      seguridad: body.seguridad,
      direccionFull: `${body.qth}, ${body.localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    })
    .where(eq(operativos.idOp, Number(body.id_op)))
    .returning()

  return NextResponse.json(
    // JSON.parse(
    //   JSON.stringify(auto, (_, value) =>
    //     typeof value === 'bigint' ? value.toString() : value,
    //   ),
    // ),
    { ...auto[0], ...operativo[0] },
  )
}
