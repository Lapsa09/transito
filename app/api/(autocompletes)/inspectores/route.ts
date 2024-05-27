import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const inspectores = await prisma.legajos.findMany({
    where: {
      permisos: {
        permiso: 'INSPECTOR',
      },
    },
    select: {
      legajo: true,
      usuario: {
        select: {
          nombre: true,
          apellido: true,
        },
      },
    },
  })
  return NextResponse.json(inspectores)
}
