import prisma from '@/lib/prismadb'
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
  const res = { ...auto, ...auto?.operativo }
  return NextResponse.json(
    JSON.parse(
      JSON.stringify(res, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    )
  )
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const body = await req.json()

  const auto = await prisma.operativos_registros.update({
    where: { id: Number(id) },
    data: {
      id_motivo: body.motivo.id_motivo,
      id_licencia: body.tipo_licencia.id_tipo,
      id_zona_infractor: body.zona_infractor.id_zona,
      id_operativo: body.id_operativo,
      acta: body.acta,
      dominio: body.dominio,
      graduacion_alcoholica: body.graduacion_alcoholica,
      licencia: body.licencia,
      resolucion: body.resolucion,
      operativo: {
        update: {
          id_localidad: body.localidad.id_barrio,
          fecha: body.fecha,
          hora: body.hora,
          legajo_a_cargo: body.legajo_a_cargo,
          legajo_planilla: body.legajo_planilla,
          qth: body.qth,
          seguridad: body.seguridad,
          turno: body.turno,
        },
      },
    },
  })

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(auto, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    )
  )
}
