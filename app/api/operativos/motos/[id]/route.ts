import { db, motosdb } from '@/drizzle'
import { motoMotivo, operativos, registros } from '@/drizzle/schema/motos'
import { motivos } from '@/drizzle/schema/schema'
import { motosInputPropsSchema } from '@/schemas/motos'
import { eq, sql } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const moto = await motosdb.query.registros.findFirst({
    where: (registro, { eq }) => eq(registro.id, Number(id)),
    with: {
      operativo: {
        with: {
          localidad: true,
        },
      },
      tipoLicencia: true,
      barrio: true,
      motivos: {
        with: {
          motivo: true,
        },
      },
    },
  })

  if (moto) {
    const { operativo, ...rest } = moto
    return NextResponse.json({
      registro: {
        ...rest,
        zona_infractor: moto.barrio,
        tipo_licencia: moto.tipoLicencia,
      },
      operativo,
    })
  }
  return NextResponse.redirect('operativos/motos')
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state
  const json = await req.json()

  const body = motosInputPropsSchema
    .merge(
      z.object({
        idOp: z.number(),
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
    .where(eq(operativos.idOp, body.idOp))

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
