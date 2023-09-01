import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params

  const acopio = await prisma.recibos.aggregate({
    _sum: {
      acopio: true,
    },
    where: {
      id_cliente: +id,
    },
  })

  return NextResponse.json(acopio._sum.acopio ?? 0)
}