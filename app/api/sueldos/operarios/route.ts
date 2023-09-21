import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const operarios = await prisma.operarios.findMany({
      where: {
        NOT: {
          legajo: 1,
        },
      },
      include: {
        servicios: {
          include: {
            servicios: {
              include: {
                clientes: { select: { cliente: true } },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(operarios)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
