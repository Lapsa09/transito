import prisma from '@/lib/prismadb'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filterParams: Record<string, string> = [
    ...searchParams.getAll('filter'),
  ].reduce((acc, curr) => {
    const [id, value] = curr.split('=')
    return { ...acc, [id]: value }
  }, {})

  const where: Prisma.rinde_examenWhereInput = {
    OR: [
      {
        nombre: {
          contains: filterParams.nombre,
        },
      },
      {
        apellido: {
          contains: filterParams.nombre,
        },
      },
    ],
    dni: {
      equals: +filterParams.dni,
    },
    examen: {
      fecha: {
        equals: filterParams.fecha,
      },
    },
  }

  const pageIndex = parseInt(searchParams.get('page') ?? '0')
  const examenes = await prisma.rinde_examen.findMany({
    include: {
      examen: true,
      tipo_examen: true,
    },
    skip: pageIndex * 10,
    take: 10,
    where,
  })

  const total = await prisma.rinde_examen.count()

  return NextResponse.json({
    data: examenes,
    pages: Math.ceil(total / 10).toString(),
  })
}
