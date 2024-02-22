import prisma from '@/lib/prismadb'
import { proveedor } from '@prisma/client'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const pageIndex = parseInt(searchParams.get('page') ?? '0')
  const pedidos = await prisma.proveedor.findMany({
    skip: pageIndex * 10,
    take: 10,
  })

  const total = await prisma.proveedor.count()

  return NextResponse.json({
    data: pedidos,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(req: NextRequest) {
  const body: proveedor = await req.json()

  const pedido = await prisma.proveedor.create({
    data: body,
  })
  revalidateTag('proveedores')
  revalidatePath('/logistica/repuestos/pedidos/create')
  return NextResponse.json(pedido)
}
