import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function PUT(_: NextRequest, state: { params: { id: string } }) {
  const { id } = state.params

  const bache = await prisma?.baches.update({
    where: {
      id: +id,
    },
    data: {
      reparado: true,
      fecha_reparacion: new Date(),
    },
  })

  return NextResponse.json(bache)
}
