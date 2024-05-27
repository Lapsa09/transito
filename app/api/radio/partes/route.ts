import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filterParams: Record<string, string> =
    searchParams
      .get('filter')
      ?.split(',')
      ?.reduce((acc, curr) => {
        const [id, value] = curr.split('=')

        return { ...acc, [id]: value }
      }, {}) ?? {}
  const partesPromise = prisma.parte.findMany({
    include: {
      operario: {
        select: {
          legajo: true,
          usuario: {
            select: {
              nombre: true,
              apellido: true,
            },
          },
        },
      },
    },
    where: filterParams.fecha
      ? {
          fecha: new Date(filterParams.fecha),
        }
      : undefined,
  })

  const totalPromise = prisma.parte.count({
    where: filterParams.fecha
      ? {
          fecha: new Date(filterParams.fecha),
        }
      : undefined,
  })

  const [partes, total] = await Promise.all([partesPromise, totalPromise])

  return NextResponse.json({
    data: partes,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parte = await prisma.parte.create({
    data: {
      fecha: body.fecha,
      turno: body.turno,
      qth: body.qth,
      movil: body.movil,
      legajo: body.operario.legajo,
      hora_inicio: body.hora_inicio,
      hora_fin: body.hora_fin,
      hora_descanso: body.hora_descanso,
      hora_descanso_fin: body.hora_descanso_fin,
    },
  })

  return NextResponse.json(parte)
}
