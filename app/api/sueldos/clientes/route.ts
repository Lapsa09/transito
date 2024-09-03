import { db } from '@/drizzle'
import { clientes, recibos, servicios } from '@/drizzle/schema/sueldos'
import { searchParamsSchema } from '@/schemas/form'
import { count, sum } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const { page, per_page } = searchParamsSchema.parse(searchParams)
  try {
    const clientesList = await db
      .select({
        id_cliente: clientes.idCliente,
        cliente: clientes.cliente,
        a_favor: sum(recibos.acopio),
        gastos: sum(servicios.importeServicio),
      })
      .from(clientes)
      .offset((page - 1) * per_page)
      .limit(per_page)
      .groupBy(clientes.idCliente, clientes.cliente)

    const total = await db
      .select({ count: count() })
      .from(clientes)
      .execute()
      .then((res) => res[0].count)

    return NextResponse.json({
      data: clientesList,
      pages: Math.ceil(total / per_page),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
