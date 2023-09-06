import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { ServiciosFormProps } from '@/types'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const servicios = await prisma.servicios.findFirst({
    where: {
      id_servicio: +params.id,
    },
    include: {
      clientes: {
        include: {
          recibos: true,
        },
      },
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })

  const res = {
    ...servicios,
    cliente: servicios?.clientes,
    fecha_servicio: servicios?.fecha_servicio?.toISOString().split('T')[0],
    ...servicios?.clientes?.recibos[0],
    fecha_recibo: servicios?.clientes?.recibos[0]?.fecha_recibo
      ?.toISOString()
      .split('T')[0],
    hay_recibo: servicios?.clientes?.recibos?.length! > 0,
  }

  delete res.clientes

  return NextResponse.json(res)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
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
