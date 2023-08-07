import prisma from '@/lib/prismadb'
import { Historial } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

const sueldosPrisma = prisma.$extends({
  query: {
    clientes: {
      async findMany({ args }) {
        const { select, ...rest } = args
        const clientes = await prisma.clientes.findMany({
          ...rest,
          include: {
            ...rest.include,
            servicios: {
              include: {
                recibos: true,
                operarios_servicios: { include: { operarios: true } },
              },
            },
          },
        })

        const response = clientes.map((cliente) => {
          const historial = cliente.servicios.reduce<Historial[]>(
            (acc, servicio) => {
              const mes = servicio.fecha_servicio?.getMonth()
              const año = servicio.fecha_servicio?.getFullYear()

              const recibo = acc.find(
                (row) => row.mes === mes && row.año === año
              )
              if (recibo) {
                recibo.servicios.push(servicio)
                recibo.gastos += servicio.importe_servicio!
                recibo.acopio += servicio.recibos?.acopio || 0
              } else {
                acc.push({
                  mes,
                  año,
                  servicios: [servicio],
                  gastos: servicio.importe_servicio!,
                  acopio: servicio.recibos?.acopio || 0,
                })
              }

              return acc
            },
            []
          )

          const { servicios, ...rest } = cliente
          return {
            ...rest,
            historial,
            a_favor: historial.reduce((acc, row) => acc + row.acopio, 0),
            a_deudor: historial.reduce((acc, row) => acc + row.gastos, 0),
          }
        })

        return response
      },
    },
  },
})

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  if (searchParams.has('id_cliente')) {
  }
  try {
    const servicios = await sueldosPrisma.clientes.findMany()

    return NextResponse.json(servicios)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
