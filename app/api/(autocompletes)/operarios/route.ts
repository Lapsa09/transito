import prisma from '@/lib/prismadb'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const operarios = await prisma.operario.findMany()

  return NextResponse.json(operarios)
}

export async function POST(req: NextRequest) {
  const body: { legajo: string; nombre: string } = await req.json()
  const operario = await prisma.operario.create({
    data: {
      legajo: +body.legajo,
      nombre: body.nombre,
    },
  })

  return NextResponse.json(operario)
}
