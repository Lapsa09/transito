import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const precios = await prisma.precios.findMany()

  return NextResponse.json(precios)
}

export async function PUT(request: NextRequest) {
  try {
    const body: { precio_normal: string; precio_pico: string } =
      await request.json()
    await prisma.precios.update({
      where: {
        id: 'precio_normal',
      },
      data: {
        precio: Number(body.precio_normal),
      },
    })

    await prisma.precios.update({
      where: {
        id: 'precio_pico',
      },
      data: {
        precio: Number(body.precio_pico),
      },
    })

    const precios = await prisma.precios.findMany()

    return NextResponse.json(precios)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
