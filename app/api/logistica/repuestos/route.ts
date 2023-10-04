import prisma from '@/lib/prismadb'
import { Repuesto } from '@/types/logistica'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const repuestos = await prisma.repuesto.findMany({
    include: {
      tipo_repuesto: true,
    },
  })

  return NextResponse.json(repuestos)
}

export async function POST(request: NextRequest) {
  const body: Repuesto = await request.json()
  const repuesto = await prisma.repuesto.create({
    data: {
      tipo_repuesto: {
        connect: {
          id_tipo_repuesto: body.id_tipo_repuesto,
        },
      },
      item: body.item,
    },
    include: {
      tipo_repuesto: true,
    },
  })

  return NextResponse.json(repuesto)
}
