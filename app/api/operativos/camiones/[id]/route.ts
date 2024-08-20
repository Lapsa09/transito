import { db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/camiones'
import { motivos, vicenteLopez } from '@/drizzle/schema/schema'
import { localidad_destino, localidad_origen } from '@/DTO/operativos/camiones'
import { camionesInputPropsSchema } from '@/schemas/camiones'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const [camion] = await db
    .select()
    .from(registros)
    .where(eq(registros.id, Number(id)))
    .leftJoin(motivos, eq(registros.idMotivo, motivos.idMotivo))
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(
      localidad_destino,
      eq(registros.idLocalidadDestino, localidad_destino.idBarrio),
    )
    .innerJoin(
      localidad_origen,
      eq(registros.idLocalidadOrigen, localidad_origen.idBarrio),
    )
    .innerJoin(vicenteLopez, eq(operativos.idLocalidad, vicenteLopez.idBarrio))

  if (camion) {
    const {
      operativos,
      vicente_lopez: localidad,
      motivos: motivo,
      localidad_destino,
      localidad_origen,
      registros,
    } = camion

    const res = {
      ...registros,
      ...operativos,
      qth: operativos.direccion,
      motivo,
      localidad,
      localidad_destino,
      localidad_origen,
    }

    return NextResponse.json(res)
  }
  return NextResponse.json(null)
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const json = await req.json()
  const body = camionesInputPropsSchema
    .merge(
      z.object({
        id_op: z.coerce.number(),
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
    .where(eq(operativos.idOp, body.id_op))

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
      idOperativo: body.id_op,
    })
    .where(eq(registros.id, Number(id)))

  return NextResponse.json('Exito')
}
