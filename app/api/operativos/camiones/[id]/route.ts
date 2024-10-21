import { camionesdb, db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/camiones'
import { camionesInputPropsSchema } from '@/schemas/camiones'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const camion = await camionesdb.query.registros.findFirst({
    where: (registro, { eq }) => eq(registro.id, Number(id)),
    with: {
      operativo: {
        with: {
          localidad: true,
        },
      },
      motivo: true,
      localidadDestino: true,
      localidadOrigen: true,
    },
  })

  if (camion) {
    const {
      operativo,
      localidadDestino: localidad_destino,
      localidadOrigen: localidad_origen,
      ...rest
    } = camion

    const res = {
      registro: {
        ...rest,
        localidad_origen,
        localidad_destino,
      },
      operativo: {
        ...operativos,
        qth: operativos.direccion,
      },
    }

    return NextResponse.json(res)
  }
  return NextResponse.redirect('operativos/camiones')
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const json = await req.json()
  const body = camionesInputPropsSchema
    .merge(
      z.object({
        idOp: z.coerce.number(),
      }),
    )
    .parse(json)

  await db
    .update(operativos)
    .set({
      fecha: sql`to_date(${body.fecha},'YYYY-MM-DD')`,
      idLocalidad: body.localidad?.idBarrio,
      turno: body.turno,
      legajo: body.legajo,
      direccion: body.qth,
      direccionFull: `${body.qth}, ${body.localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    })
    .where(eq(operativos.idOp, body.idOp))

  await db
    .update(registros)
    .set({
      hora: body.hora,
      acta: body.acta,
      dominio: body.dominio,
      licencia: body.licencia,
      resolucion: body.resolucion,
      idMotivo: body.motivo?.idMotivo,
      idLocalidadOrigen: body.localidad_origen?.idBarrio,
      idLocalidadDestino: body.localidad_destino?.idBarrio,
      idOperativo: body.idOp,
    })
    .where(eq(registros.id, Number(id)))

  return NextResponse.json('Exito')
}
