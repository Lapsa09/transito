import prisma from '@/lib/prismadb'
import { tipo_repuesto } from '@prisma/client'
import { DateTime } from 'luxon'
import { NextResponse, NextRequest } from 'next/server'

const xprisma = prisma.$extends({
  result: {
    repuesto: {
      cantidad: {
        needs: {
          item: true,
          id_tipo_repuesto: true,
        },
        async compute(data) {
          return await prisma.repuesto.count({
            where: {
              AND: {
                item: data.item,
                tipo_repuesto: {
                  id_tipo_repuesto: data.id_tipo_repuesto,
                },
              },
            },
          })
        },
      },
    },
  },
})

export async function GET() {
  const pedidos = await xprisma.pedido_repuesto.findMany({
    include: {
      repuestos: {
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
  const body: {
    repuestos: {
      tipo_repuesto: tipo_repuesto
      item: string
      cantidad: number
    }[]
    proveedor: {
      id: number
    }
    cantidad: number
    fecha_entrega: string
    fecha_pedido: string
    orden_compra: number
  } = await req.json()
  const pedido = await prisma.pedido_repuesto.create({
    data: {
      proveedor: {
        connect: {
          id: body.proveedor.id,
        },
      },
      fecha_entrega: DateTime.fromFormat(
        String(body.fecha_entrega),
        'yyyy-MM-dd',
      ).toISO(),
      fecha_pedido: DateTime.fromFormat(
        String(body.fecha_pedido),
        'yyyy-MM-dd',
      ).toISO(),
      orden_compra: +body.orden_compra,
    },
    include: {
      repuestos: {
        include: {
          tipo_repuesto: true,
        },
      },
      proveedor: true,
    },
  })

  for (const repuesto of body.repuestos) {
    for (let i = 0; i < repuesto.cantidad; i++)
      await prisma.repuesto.create({
        data: {
          pedido_repuesto: {
            connect: {
              id: pedido.id,
            },
          },
          tipo_repuesto: {
            connect: {
              id_tipo_repuesto: repuesto.tipo_repuesto.id_tipo_repuesto,
            },
          },
          item: repuesto.item,
        },
      })
  }

  return NextResponse.json(pedido)
}
