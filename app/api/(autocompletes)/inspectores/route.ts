import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function inspectoresDTO() {
  return await prisma.legajos.findMany({
    where: {
      id_rol: 2,
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
}

export async function GET() {
  const inspectores = await inspectoresDTO()

  return NextResponse.json(inspectores)
}
