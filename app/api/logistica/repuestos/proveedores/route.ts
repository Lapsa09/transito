import prisma from '@/lib/prismadb'
import { proveedor } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const pedidos = await prisma.proveedor.findMany({})

  return NextResponse.json(pedidos)
}

export async function POST(req: NextRequest) {
  const body: proveedor = await req.json()

  const pedido = await prisma.proveedor.create({
    data: body,
  })

  return NextResponse.json(pedido)
}
