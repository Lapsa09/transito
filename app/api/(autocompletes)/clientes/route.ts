import { db } from '@/drizzle/db'
import { clientes } from '@/drizzle/schema/sueldos'
import prisma from '@/lib/prismadb'
import { NextResponse, NextRequest } from 'next/server'

const prismaSueldo = prisma.$extends({
  name: 'sueldo',
  result: {
    clientes: {
      acopioPromise: {
        needs: {
          id_cliente: true,
        },
        compute: async ({ id_cliente }) => {
          const recibos = await prisma.recibos.aggregate({
            where: {
              id_cliente,
            },
            _sum: {
              acopio: true,
            },
          })
          return recibos._sum.acopio ?? 0
        },
      },
      acopio: {
        compute: () => {
          return 0
        },
      },
    },
  },
})

export async function GET() {
  const clientes = await prismaSueldo.clientes.findMany()

  for (const cliente of clientes) {
    cliente.acopio = await cliente.acopioPromise
  }

  return NextResponse.json(clientes)
}

export async function POST(req: NextRequest) {
  const body: { cliente: string } = await req.json()

  const cliente = await db
    .insert(clientes)
    .values({
      cliente: body.cliente,
    })
    .returning()

  return NextResponse.json(cliente)
}
