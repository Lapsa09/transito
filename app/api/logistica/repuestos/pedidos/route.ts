import prisma from '@/lib/prismadb'
import { PedidoRepuesto } from '@/types/logistica'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const pedidos = await prisma.pedido_repuesto.findMany({
    include: {
      repuesto: {
        include: {
          tipo_repuesto: true,
        },
      },
      proveedor: true,
    },
  })

  return NextResponse.json(pedidos)
}

export async function POST(req: NextRequest) {
  const body: PedidoRepuesto = await req.json()
  const pedido = await prisma.pedido_repuesto.create({
    data: {
      repuesto: {
        connect: {
          id: body.repuesto.id,
        },
      },
      proveedor: {
        connect: {
          id: body.id_proveedor,
        },
      },
      cantidad: body.cantidad,
      fecha_entrega: body.fecha_entrega,
      fecha_pedido: body.fecha_pedido,
      orden_compra: body.orden_compra,
    },
    include: {
      repuesto: {
        include: {
          tipo_repuesto: true,
        },
      },
      proveedor: true,
    },
  })

  return NextResponse.json(pedido)
}
