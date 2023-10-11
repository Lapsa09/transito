import prisma from '@/lib/prismadb'
import { tipo_repuesto } from '@prisma/client'
import { DateTime } from 'luxon'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const pedidos = await prisma.pedido_repuesto.findMany({
    include: {
      repuestos: {
        include: {
          tipo_repuesto: true,
        },
      },
      proveedor: true,
    },
  })
  const res = []
  for (const pedido of pedidos) {
    const repuestos = pedido.repuestos.reduce<any[]>((acc, repuesto) => {
      const item = acc.find(
        (r) =>
          r.item === repuesto.item &&
          r.tipo_repuesto.id_tipo_repuesto ===
            repuesto.tipo_repuesto.id_tipo_repuesto,
      )

      if (item) {
        item.cantidad++
      } else {
        acc.push({
          item: repuesto.item,
          cantidad: 1,
          tipo_repuesto: repuesto.tipo_repuesto,
        })
      }

      return acc
    }, [])
    res.push({ ...pedido, repuestos })
  }

  return NextResponse.json(res)
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
    orden_compra: string
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
      orden_compra: body.orden_compra,
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
