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
          typeof value === 'bigint' ? value.toString() : value
        )
      )
    )
  }
  return NextResponse.json(null)
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const body = await req.json()

  const auto = await prisma.operativos_registros.update({
    where: { id: Number(id) },
    data: {
      id_motivo: body.motivo?.id_motivo,
      id_licencia: body.tipo_licencia?.id_tipo,
      zona_infractor: {
        connect: {
          id_barrio: body.zona_infractor.id_barrio,
        },
      },
      acta: body.acta,
      dominio: body.dominio,
      graduacion_alcoholica: body.graduacion_alcoholica,
      licencia: body.licencia,
      resolucion: body.resolucion,
      operativo: {
        update: {
          fecha: body.fecha,
          hora: body.hora,
          id_op: body.id_op,
          latitud: body.latitud,
          longitud: body.longitud,
          direccion_full: body.direccion_full,
          legajo_a_cargo: body.legajo_a_cargo,
          legajo_planilla: body.legajo_planilla,
          qth: body.qth,
          localidad: {
            connect: {
              id_barrio: body.localidad.id_barrio,
            },
          },
          seguridad: body.seguridad,
          turno: body.turno,
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
        typeof value === 'bigint' ? value.toString() : value
      )
    )
  )
}
