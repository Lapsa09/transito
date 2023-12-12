import prisma from '@/lib/prismadb'
import { EditMotosProps } from '@/types'
import { DateTime } from 'luxon'
import { NextResponse } from 'next/server'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const auto = await prisma.motos_registros.findUnique({
    where: { id: Number(id) },
    include: {
      motivos: true,
      operativo: { include: { localidad: true } },
      tipo_licencias: true,
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
      tipo_licencia: rest.tipo_licencias,
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

  const body: EditMotosProps = await req.json()

  const _hora = new Date(body.fecha)
  // @ts-ignore
  _hora.setUTCHours(...body.hora.split(':'))

  await prisma.motos_operativos.update({
    where: { id_op: Number(body.id_op) },
    data: {
      fecha: new Date(body.fecha),
      hora: _hora,
      id_zona: Number(body.localidad?.id_barrio),
      turno: body.turno,
      legajo_a_cargo: Number(body.legajo_a_cargo),
      legajo_planilla: Number(body.legajo_planilla),
      qth: body.qth,
      seguridad: body.seguridad,
      direccion_full: `${body.qth}, ${body.localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    },
  })

  await prisma.moto_motivo.deleteMany({
    where: { id_registro: Number(id) },
  })
  for (const motivo of body.motivos) {
    await prisma.moto_motivo.create({
      data: {
        id_registro: Number(id),
        id_motivo: Number(motivo.id_motivo),
      },
    })
  }

  const moto = await prisma.motos_registros.update({
    where: { id: Number(id) },
    data: {
      acta: Number(body.acta) || null,
      dominio: body.dominio,
      licencia: Number(body.licencia) || null,
      resolucion: body.resolucion,
      id_licencia: Number(body.tipo_licencia?.id_tipo) || null,
      id_zona_infractor: Number(body.zona_infractor?.id_barrio) || null,
    },
    include: {
      motivos: true,
      operativo: { include: { localidad: true } },
      tipo_licencias: true,
      zona_infractor: true,
    },
  })

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(moto, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ),
  )
}
