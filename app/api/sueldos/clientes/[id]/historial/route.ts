import { db } from '@/drizzle'
import { NextRequest, NextResponse } from 'next/server'
import { clientes, recibos, servicios } from '@/drizzle/schema/sueldos'
import { searchParamsSchema } from '@/schemas/form'
import { count, eq, sql, sum } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const { page, per_page } = searchParamsSchema.parse(req.nextUrl.searchParams)
  const mes = sql<number>`extract(month from ${servicios.fechaServicio})`
  const año = sql<number>`extract(year from ${servicios.fechaServicio})`
  const historial = await db
    .select({
      acopio: sum(recibos.acopio).mapWith(Number).as('acopio_historial'),
      gastos: sum(servicios.importeServicio).mapWith(Number).as('gastos'),
      mes: mes.as('mes'),
      año: año.as('año'),
    })
    .from(servicios)
    .where(eq(servicios.idCliente, +id))
    .innerJoin(clientes, eq(clientes.idCliente, servicios.idCliente))
    .innerJoin(recibos, eq(recibos.idCliente, clientes.idCliente))
    .offset((page - 1) * per_page)
    .limit(per_page)
    .groupBy(servicios.idCliente, mes, año)

  const total = await db
    .select({ count: count() })
    .from(servicios)
    .where(eq(servicios.idCliente, +id))
    .groupBy(servicios.idCliente, mes, año)
    .execute()
    .then((res) => res[0].count)

  return NextResponse.json({
    data: historial,
    pages: Math.ceil(total / per_page),
  })
}
