import prisma from '@/lib/prismadb'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const operarios = await prisma.operarios.findMany()

  return NextResponse.json(operarios)
}

export async function POST(req: NextRequest) {
  try {
    const { body } = await req.json()

    const nuevoOperario = await prisma.operarios.create({
      data: {
        nombre: body.nombre.toUpperCase(),
        legajo: +body.legajo,
      },
    })

    return NextResponse.json(nuevoOperario)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
