import prisma from '@/lib/prismadb'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const clientes = await prisma.clientes.findMany()

  return NextResponse.json(clientes)
}

export async function POST(req: NextRequest) {
  const body: { cliente: string } = await req.json()
  const cliente = await prisma.clientes.create({
    data: {
      cliente: body.cliente,
    },
  })

  return NextResponse.json(cliente)
}
