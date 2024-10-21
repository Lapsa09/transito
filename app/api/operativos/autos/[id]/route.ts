import { autosdb, db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/operativos'
import { autosInputPropsSchema } from '@/schemas/autos'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const auto = await autosdb.query.registros.findFirst({
    where: (registro, { eq }) => eq(registro.id, Number(id)),
    with: {
      operativo: {
        with: {
          localidad: true,
        },
      },
      tipoLicencia: true,
      barrio: true,
      motivo: true,
    },
  })

  if (auto) {
    const { operativo, ...rest } = auto
    return NextResponse.json({
      operativo,
      registro: {
        ...rest,
        zona_infractor: rest.barrio,
        tipo_licencia: rest.tipoLicencia,
        graduacion_alcoholica: rest.graduacionAlcoholica,
      },
    })
  }
  return NextResponse.redirect('operativos/autos')
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const json = await req.json()

  const body = autosInputPropsSchema
    .merge(z.object({ idOp: z.number() }))
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
      idOperativo: body.idOp,
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
    .where(eq(operativos.idOp, body.idOp))

  return NextResponse.json('Exito')
}
