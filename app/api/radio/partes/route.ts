import { partesDTO } from '@/DTO/radio'
import { turnos } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

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

  const partesPromise = partesDTO(filterParams)

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
  const body: {
    fecha: string
    turno: turnos
    qth: string
    movil: string
    operario: { legajo: string }
    hora_inicio: string
    hora_fin: string
    hora_descanso: string
    hora_descanso_fin: string
  } = await req.json()
  const hora_inicio = new Date(body.fecha)
  hora_inicio.setUTCHours(
    ...(body.hora_inicio.split(':') as unknown as [number, number]),
  )
  const hora_fin = new Date(body.fecha)
  hora_fin.setUTCHours(
    ...(body.hora_fin.split(':') as unknown as [number, number]),
  )
  const hora_descanso = new Date(body.fecha)
  hora_descanso.setUTCHours(
    ...(body.hora_descanso.split(':') as unknown as [number, number]),
  )
  const hora_descanso_fin = new Date(body.fecha)
  hora_descanso_fin.setUTCHours(
    ...(body.hora_descanso_fin.split(':') as unknown as [number, number]),
  )

  const parte = await prisma.parte.create({
    data: {
      fecha: new Date(body.fecha),
      turno: body.turno,
      qth: body.qth,
      movil: body.movil,
      legajo: +body.operario.legajo,
      hora_inicio,
      hora_fin,
      hora_descanso,
      hora_descanso_fin,
    },
  })

  revalidateTag('radio/partes')

  return NextResponse.json(parte)
}
