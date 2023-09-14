import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { ServiciosFormProps } from '@/types'
import { DateTime } from 'luxon'
import { parseToISOTime } from '@/utils/misc'

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
    fecha_servicio: DateTime.fromJSDate(servicios?.fecha_servicio!)
      .toUTC()
      .toISODate(),
    ...servicios?.clientes?.recibos[0],
    fecha_recibo: DateTime.fromJSDate(
      servicios?.clientes?.recibos[0]?.fecha_recibo!,
    )
      .toUTC()
      .toISODate(),
    hay_recibo: servicios?.clientes?.recibos?.length! > 0,
    operarios: servicios?.operarios_servicios.map((operario) => ({
      ...operario,
      operario: operario.operarios,
      hora_inicio: DateTime.fromJSDate(operario.hora_inicio!)
        .toUTC()
        .toLocaleString(DateTime.TIME_24_SIMPLE),
      hora_fin: DateTime.fromJSDate(operario.hora_fin!)
        .toUTC()
        .toLocaleString(DateTime.TIME_24_SIMPLE),
    })),
  }

  delete res.clientes

  return NextResponse.json(res)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body: ServiciosFormProps = await req.json()

  await prisma.servicios.update({
    where: {
      id_servicio: +params.id,
    },
    data: {
      clientes: {
        connect: {
          id_cliente: body.cliente.id_cliente,
        },
      },
      fecha_servicio: DateTime.fromISO(body.fecha_servicio).toISO(),
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

  for (const operario of body.operarios) {
    const id = await prisma.operarios_servicios.findFirst({
      where: { legajo: operario.operario?.legajo, id_servicio: +params.id },
      select: { id: true },
    })
    if (id) {
      await prisma.operarios_servicios.update({
        where: {
          id: id.id,
        },
        data: {
          hora_fin: parseToISOTime(operario.hora_fin),
          hora_inicio: parseToISOTime(operario.hora_inicio),
          a_cobrar: operario.a_cobrar,
          cancelado: operario.cancelado,
          legajo: operario.operario?.legajo,
        },
      })
    } else {
      await prisma.operarios_servicios.create({
        data: {
          hora_fin: parseToISOTime(operario.hora_fin),
          hora_inicio: parseToISOTime(operario.hora_inicio),
          a_cobrar: operario.a_cobrar,
          cancelado: false,
          id_servicio: +params.id,
          legajo: operario.operario?.legajo,
        },
      })
    }
  }

  return NextResponse.json('Servicio editado')
}
