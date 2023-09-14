import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { DateTime } from 'luxon'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const fecha = DateTime.fromFormat(body.fecha, 'yyyy-MM-dd').toISO()

  const agenda = await prisma.servicios.findMany({
    where: {
      fecha_servicio: fecha,
    },
    include: {
      clientes: true,
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })

  return NextResponse.json(
    agenda.map((servicio) => {
      return {
        ...servicio,
        fecha_servicio: DateTime.fromJSDate(servicio.fecha_servicio!).toFormat(
          'dd/MM/yyyy',
        ),
        operarios_servicios: servicio.operarios_servicios.map((operario) => {
          return {
            ...operario,
            hora_inicio: DateTime.fromJSDate(operario.hora_inicio!).toFormat(
              'HH:mm',
            ),
            hora_fin: DateTime.fromJSDate(operario.hora_fin!).toFormat('HH:mm'),
          }
        }),
      }
    }),
  )
}
