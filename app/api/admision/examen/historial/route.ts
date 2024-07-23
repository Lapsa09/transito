import { historialDTO } from '@/DTOs/examen'
import prisma from '@/lib/prismadb'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const filterParams: Record<string, string> = [
      ...searchParams.getAll('filter'),
    ].reduce((acc, curr) => {
      const [id, value] = curr.split('=')
      return { ...acc, [id]: value }
    }, {})

    const where: Prisma.rinde_examenWhereInput = {
      usuario: {
        OR: filterParams.nombre
          ? [
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
            ]
          : undefined,
        dni: filterParams.dni
          ? {
              equals: +filterParams.dni,
            }
          : undefined,
      },
      examen: filterParams.fecha
        ? {
            fecha: {
              equals: filterParams.fecha,
            },
          }
        : undefined,
      hora_finalizado: {
        not: null,
      },
    }

    const pageIndex = parseInt(searchParams.get('page') ?? '0')
    const examenesPromise = historialDTO({ where, pageIndex })

    const totalPromise = prisma.rinde_examen.count({
      where,
    })

    const [examenes, total] = await Promise.all([examenesPromise, totalPromise])

    return NextResponse.json({
      data: examenes,
      pages: Math.ceil(total / 10).toString(),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
