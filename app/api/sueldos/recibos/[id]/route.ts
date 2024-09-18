import { db } from '@/drizzle'
import { clientes, recibos } from '@/drizzle/schema/sueldos'
import { searchParamsSchema } from '@/schemas/form'
import { count, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const { page, per_page } = searchParamsSchema.parse(req.nextUrl.searchParams)
  const recibosList = await db
    .select({
      recibo: recibos.recibo,
      fecha: recibos.fechaRecibo,
      acopio: recibos.acopio,
      importeRecibo: recibos.importeRecibo,
      idCliente: recibos.idCliente,
    })
    .from(clientes)
    .where(eq(recibos.idCliente, +id))
    .offset((page - 1) * per_page)
    .limit(per_page)

  const total = await db
    .select({ count: count() })
    .from(recibos)
    .where(eq(recibos.idCliente, +id))
    .execute()
    .then((res) => res[0].count)

  return NextResponse.json({
    data: recibosList,
    pages: Math.ceil(total / per_page),
  })
}
