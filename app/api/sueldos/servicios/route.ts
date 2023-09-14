import prisma from '@/lib/prismadb'
import { ServiciosFormProps } from '@/types'
import { DateTime } from 'luxon'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  try {
    const servicios = await prisma.servicios.findMany({
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
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body: ServiciosFormProps = await req.json()

  const nuevoServicio = await prisma.servicios.create({
    data: {
      clientes: {
        connect: {
          id_cliente: body.cliente.id_cliente,
        },
      },
      fecha_servicio: new Date(body.fecha_servicio),
      feriado: body.feriado,
      importe_servicio: body.importe_servicio,
    },
  })

  if (body.hay_recibo && body.recibo) {
    await prisma.recibos.create({
      data: {
        recibo: +body.recibo,
        acopio: +body.importe_recibo! - +body.importe_servicio,
        clientes: {
          connect: {
            id_cliente: body.cliente.id_cliente,
          },
        },
        fecha_recibo: new Date(body.fecha_recibo!),
        importe_recibo: +body.importe_recibo!,
      },
    })
  }

  for (const operario of body.operarios) {
    const hora_inicio = DateTime.fromISO(body.fecha_servicio)
      .setLocale('es-AR')
      .set({
        hour: +operario.hora_inicio.split(':')[0],
        minute: +operario.hora_inicio.split(':')[1],
      })
      .toJSDate()

    const hora_fin = DateTime.fromISO(body.fecha_servicio)
      .setLocale('es-AR')
      .set({
        hour: +operario.hora_fin.split(':')[0],
        minute: +operario.hora_fin.split(':')[1],
      })
      .toJSDate()

    await prisma.operarios_servicios.create({
      data: {
        hora_inicio,
        hora_fin,
        a_cobrar: operario.a_cobrar,
        cancelado: false,
        id_servicio: nuevoServicio.id_servicio,
        legajo: operario.operario?.legajo,
      },
    })
  }

  return NextResponse.json('Servicio creado', {
    status: 201,
  })
}
