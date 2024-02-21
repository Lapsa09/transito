import prisma from '@/lib/prismadb'
import { proveedor } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const pageIndex = parseInt(searchParams.get('page') ?? '0')
  const pedidos = await prisma.proveedor.findMany({
    skip: pageIndex * 10,
    take: 10,
  })

  return NextResponse.json({
    data: pedidos,
    pages: pedidos.length.toString(),
  })
}

export async function POST(req: NextRequest) {
  const body: proveedor = await req.json()

  const pedido = await prisma.proveedor.create({
    data: body,
  })
  revalidateTag('proveedores')
  return NextResponse.json(pedido)
}
