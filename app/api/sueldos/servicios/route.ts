import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const servicios = await prisma.servicios.findMany({
      include: {
        clientes: { select: { cliente: true } },
        operarios_servicios: {
          include: {
            operarios: true,
          },
        },
      },
    })

    return NextResponse.json(servicios)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
