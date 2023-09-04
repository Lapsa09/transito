import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { ServiciosFormProps } from '@/types'

export async function GET({ params }: { params: { id: string } }) {
  console.log(params.id)
  const servicios = await prisma.servicios.findFirst({
    where: {
      id_servicio: +params.id,
    },
    include: {
      clientes: { select: { cliente: true } },
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })
  return NextResponse.json(servicios)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body: ServiciosFormProps = await req.json()

  for (const operario of body.operarios) {
    await prisma.operarios_servicios.upsert({
      where: {
        legajo: operario.operario?.legajo,
        id_servicio: +params.id,
        id: +params.id,
      },
      update: {
        servicios: {
          connect: {
            id_servicio: +params.id,
          },
        },
        operarios: {
          connect: {
            legajo: operario.operario?.legajo,
          },
        },
        hora_fin: operario.hora_fin,
        hora_inicio: operario.hora_inicio,
        a_cobrar: operario.a_cobrar,
        cancelado: operario.cancelado,
      },
      create: {
        servicios: {
          connect: {
            id_servicio: +params.id,
          },
        },
        operarios: {
          connect: {
            legajo: operario.operario?.legajo,
          },
        },
        hora_fin: operario.hora_fin,
        hora_inicio: operario.hora_inicio,
        a_cobrar: operario.a_cobrar,
        cancelado: operario.cancelado,
      },
    })
  }

  const servicio = await prisma.servicios.update({
    where: {
      id_servicio: +params.id,
    },
    data: {
      clientes: {
        connect: {
          id_cliente: body.cliente.id_cliente,
        },
      },
      fecha_servicio: body.fecha_servicio,
      feriado: body.feriado,
      importe_servicio: body.importe_servicio,
      memo: body.memo,
    },
    include: {
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })

  return NextResponse.json(servicio)
}
