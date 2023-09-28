import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    const reportes = await prisma.reporte.findMany({
      where: {
        id_dia: +id,
      },
      select: {
        id: true,
        recorrido: {
          include: {
            calles: true,
            nivel_trafico: true,
          },
        },
        dia: true,
        horarios: true,
      },
      orderBy: {
        dia: {
          fecha: 'desc',
        },
      },
    })
    return NextResponse.json(reportes)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
