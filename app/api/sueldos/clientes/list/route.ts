import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const clientes = await prisma.clientes.findMany()

  return NextResponse.json(clientes)
}

export async function POST(req: NextRequest) {
  const { cliente } = await req.json()

  const clientes = await prisma.clientes.create({
    data: {
      cliente,
    },
  })

  return NextResponse.json(clientes)
}
