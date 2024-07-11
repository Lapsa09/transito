import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function printablePartesDTO(filterParams: Record<string, string>) {
  const partesPromise = await prisma.parte.findMany({
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
          fecha: new Date(filterParams.fecha).toISOString(),
        }
      : undefined,
  })
  return partesPromise
}

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
  const partes = await printablePartesDTO(filterParams)

  return NextResponse.json(partes)
}
