import prisma from '@/lib/prismadb'
import { EditCamionesProps } from '@/types'
import { turnos } from '@prisma/client'
import { DateTime } from 'luxon'
import { NextResponse } from 'next/server'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const camion = await prisma.camiones_registros.findUnique({
    where: { id: Number(id) },
    include: {
      motivo: true,
      operativo: { include: { localidad: true } },
      localidad_destino: true,
      localidad_origen: true,
    },
  })

  if (camion) {
    const { operativo, ...rest } = camion

    const res = {
      ...rest,
      ...operativo,
      qth: operativo?.direccion,
      fecha: operativo?.fecha?.toISOString().split('T')[0],
      hora: DateTime.fromJSDate(rest?.hora!)
        .toUTC()
        .toFormat('HH:mm'),
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

  await prisma.camiones_operativos.update({
    where: { id_op: Number(body.id_op) },
    data: {
      fecha: new Date(body.fecha),
      id_localidad: Number(body.localidad?.id_barrio),
      turno: body.turno,
      legajo: body.legajo,
      direccion: body.qth,
      direccion_full: `${body.qth}, ${body.localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    },
  })

  const _hora = new Date(body.fecha)
  // @ts-ignore
  _hora.setUTCHours(...body.hora.split(':'))

  const camion = await prisma.camiones_registros.update({
    where: { id: Number(id) },
    data: {
      hora: _hora,
      acta: body.acta,
      dominio: body.dominio,
      licencia: body.licencia,
      resolucion: body.resolucion,
      id_motivo: body.motivo?.id_motivo,
      id_localidad_origen: body.localidad_origen?.id_barrio,
      id_localidad_destino: body.localidad_destino?.id_barrio,
      id_operativo: body.id_op,
    },
    include: {
      motivo: true,
      operativo: { include: { localidad: true } },
      localidad_destino: true,
      localidad_origen: true,
    },
  })
  return NextResponse.json(camion)
}
