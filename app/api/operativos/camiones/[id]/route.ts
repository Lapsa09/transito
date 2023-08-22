import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET(req: Request, state: { params: { id: string } }) {
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
      fecha: operativo?.fecha?.toISOString().split('T')[0],
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

  const camion = await prisma.camiones_registros.update({
    where: { id: Number(id) },
    data: {
      hora: body.hora,
      acta: body.acta,
      dominio: body.dominio,
      licencia: body.licencia,
      resolucion: body.resolucion,
      motivo: {
        connect: {
          id_motivo: body.motivo?.id_motivo,
        },
      },
      localidad_origen: {
        connect: {
          id_barrio: body.localidad_origen.id_barrio,
        },
      },
      localidad_destino: {
        connect: {
          id_barrio: body.localidad_destino.id_barrio,
        },
      },
      operativo: {
        update: {
          fecha: body.fecha,
          legajo: body.legajo,
          direccion: body.qth,
          turno: body.turno,
          localidad: {
            connect: {
              id_barrio: body.localidad.id_barrio,
            },
          },
        },
      },
    },
    include: {
      motivo: true,
      operativo: { include: { localidad: true } },
      localidad_destino: true,
      localidad_origen: true,
    },
  })
  return NextResponse.json(
    JSON.parse(
      JSON.stringify(camion, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    )
  )
}
