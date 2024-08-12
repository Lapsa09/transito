import { db } from '@/drizzle/db'
import { operativos, registros } from '@/drizzle/schema/camiones'
import { motivos, vicenteLopez } from '@/drizzle/schema/schema'
import { localidad_destino, localidad_origen } from '@/DTO/camiones'
import { EditCamionesProps } from '@/types'
import { getLocalTime } from '@/utils/misc'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

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
      fecha: operativos?.fecha.split('T')[0],
      hora: getLocalTime(operativos.fecha + 'T' + registros.hora + 'Z'),
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

  const body: EditCamionesProps = await req.json()

  await db
    .update(operativos)
    .set({
      fecha: sql`to_date(${body.fecha},'YYYY-MM-DD')`,
      idLocalidad: Number(body.localidad?.id_barrio),
      turno: body.turno,
      legajo: body.legajo,
      direccion: body.qth,
      direccionFull: `${body.qth}, ${body.localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    })
    .where(eq(operativos.idOp, Number(body.id_op)))

  const [camion] = await db
    .update(registros)
    .set({
      hora: sql<string>`to_timestamp(${body.hora}, 'HH24:MI:SS')`,
      acta: body.acta,
      dominio: body.dominio,
      licencia: body.licencia,
      resolucion: body.resolucion,
      idMotivo: body.motivo?.id_motivo,
      idLocalidadOrigen: body.localidad_origen?.id_barrio,
      idLocalidadDestino: body.localidad_destino?.id_barrio,
      idOperativo: body.id_op,
    })
    .where(eq(registros.id, Number(id)))
    .returning()

  return NextResponse.json(camion)
}
