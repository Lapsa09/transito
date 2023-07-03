import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function GET() {
  const motos = await prisma.motos_registros.findMany({
    include: {
      operativo: { include: { localidad: true } },
      motivos: true,
      tipo_licencias: true,
      barrio: true,
    },
  })

  return NextResponse.json(motos)
}

export async function POST(req: Request) {
  const body = await req.json()

  const repetido = await prisma.motos_registros.findFirst({
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

  const moto = await prisma.motos_registros.create({
    data: {
      id_licencia: body.id_licencia,
      id_zona_infractor: body.zona_infractor.id_zona,
      acta: body.acta,
      dominio: body.dominio,
      fechacarga: new Date(),
      licencia: body.licencia,
      lpcarga: body.lpcarga,
      resolucion: body.resolucion,
      id_operativo: body.id_operativo,
      mes: new Date(body.fecha).getMonth() + 1,
      semana: Math.ceil(new Date(body.fecha).getDate() / 7),
      motivos: {
        createMany: {
          data: body.motivos.map((motivo: any) => ({
            id_motivo: motivo.id_motivo,
            id_operativo: body.id_operativo,
          })),
        },
      },
    },
    include: {
      operativo: {
        include: { localidad: { select: { barrio: true, cp: true } } },
      },
      motivos: true,
    },
  })

  return NextResponse.json(moto)
}
