import prisma from '@/lib/prismadb'
import { EditAutosProps } from '@/types'
import { turnos } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(req: Request, state: { params: { id: string } }) {
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
      hora: operativo?.hora?.toLocaleTimeString(),
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
      acta: body.acta ? +body.acta : null,
      dominio: body.dominio,
      graduacion_alcoholica: body.graduacion_alcoholica,
      licencia: body.licencia ? +body.licencia : null,
      resolucion: body.resolucion,
      zona_infractor: {
        connect: {
          id_barrio: body.zona_infractor.id_barrio,
        },
      },
      motivo: {
        connect: {
          id_motivo: body.motivo?.id_motivo,
        },
      },
      tipo_licencia: {
        connect: {
          id_tipo: body.tipo_licencia?.id_tipo,
        },
      },
      operativo: {
        update: {
          fecha: body.fecha,
          hora: _hora,
          id_op: body.id_op,
          legajo_a_cargo: +body.legajo_a_cargo,
          legajo_planilla: +body.legajo_planilla,
          qth: body.qth,
          id_localidad: body.localidad.id_barrio,
          seguridad: body.seguridad,
          turno: body.turno === 'MAÑANA' ? turnos.MA_ANA : body.turno,
        },
      },
    },
    include: {
      motivo: true,
      operativo: { include: { localidad: true } },
      tipo_licencia: true,
      zona_infractor: true,
    },
  })
  return NextResponse.json(
    JSON.parse(
      JSON.stringify(auto, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ),
  )
}
