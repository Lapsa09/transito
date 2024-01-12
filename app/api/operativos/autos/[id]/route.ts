import prisma from '@/lib/prismadb'
import { EditAutosProps } from '@/types'
import { DateTime } from 'luxon'
import { NextResponse } from 'next/server'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const auto = await prisma.operativos_registros.findUnique({
    where: { id: Number(id) },
    include: {
      motivo: true,
      operativo: { include: { localidad: true } },
      tipo_licencia: true,
      zona_infractor: true,
    },
  })

  if (auto) {
    const { operativo, ...rest } = auto

    const res = {
      ...rest,
      ...operativo,
      fecha: operativo?.fecha?.toISOString().split('T')[0],
      hora: DateTime.fromJSDate(operativo?.hora!)
        .toUTC()
        .toFormat('HH:mm'),
    }

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(res, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ),
    )
  }
  return NextResponse.json(null)
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const body: EditAutosProps = await req.json()

  const _hora = new Date(body.fecha)
  // @ts-ignore
  _hora.setUTCHours(...body.hora.split(':'))

  const auto = await prisma.operativos_registros.update({
    where: { id: Number(id) },
    data: {
      acta: Number(body.acta) || null,
      dominio: body.dominio,
      graduacion_alcoholica: Number(body.graduacion_alcoholica) || null,
      licencia: Number(body.licencia) || null,
      resolucion: body.resolucion,
      id_licencia: body.tipo_licencia?.id_tipo,
      id_zona_infractor: body.zona_infractor?.id_barrio,
      id_motivo: body.motivo?.id_motivo,
      id_operativo: body.id_op,
    },
    include: {
      motivo: true,
      operativo: { include: { localidad: true } },
      tipo_licencia: true,
      zona_infractor: true,
    },
  })

  const operativos = await prisma.operativos_operativos.update({
    where: { id_op: Number(body.id_op) },
    data: {
      fecha: new Date(body.fecha),
      hora: _hora,
      id_localidad: Number(body.localidad?.id_barrio),
      turno: body.turno,
      legajo_a_cargo: Number(body.legajo_a_cargo),
      legajo_planilla: Number(body.legajo_planilla),
      qth: body.qth,
      seguridad: body.seguridad,
      direccion_full: `${body.qth}, ${body.localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    },
    include: { localidad: true },
  })

  auto.operativo = operativos

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(auto, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ),
  )
}
