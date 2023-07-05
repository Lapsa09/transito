import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function GET() {
  const autos = await prisma.operativos_registros.findMany({
    include: {
      motivo: { select: { motivo: true } },
      tipo_licencia: { select: { tipo: true, vehiculo: true } },
      zona_infractor: { select: { barrio: true } },
      operativo: {
        include: { localidad: { select: { barrio: true, cp: true } } },
      },
    },
    orderBy: { id: 'desc' },
  })

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(autos, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    )
  )
}

export async function POST(req: Request) {
  const body = await req.json()

  const repetido = await prisma.operativos_registros.findFirst({
    where: {
      dominio: body.dominio,
      id_operativo: body.id_operativo,
    },
  })

  if (repetido) {
    return NextResponse.json('El dominio ya fue ingresado el mismo dia', {
      status: 401,
    })
  }

  const auto = await prisma.operativos_registros.create({
    data: {
      id_licencia: body.id_licencia,
      id_zona_infractor: body.zona_infractor.id_zona,
      id_motivo: body.id_motivo,
      acta: body.acta,
      dominio: body.dominio,
      graduacion_alcoholica: body.graduacion_alcoholica,
      fechacarga: new Date(),
      licencia: body.licencia,
      lpcarga: body.lpcarga,
      resolucion: body.resolucion,
      es_del: body.es_del,
      resultado: body.resultado,
      id_operativo: body.id_operativo,
      mes: new Date(body.fecha).getMonth() + 1,
      semana: Math.ceil(new Date(body.fecha).getDate() / 7),
    },
    include: {
      operativo: {
        include: { localidad: { select: { barrio: true, cp: true } } },
      },
    },
  })

  return NextResponse.json(auto)
}
