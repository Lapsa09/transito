import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/drizzle'
import { recibos } from '@/drizzle/schema/sueldos'
import { eq, sum } from 'drizzle-orm'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  const [acopio] = await db
    .select({
      acopio: sum(recibos.acopio).mapWith(Number).as('acopio'),
    })
    .from(recibos)
    .where(eq(recibos.idCliente, +id))

  return NextResponse.json(acopio.acopio ?? 0)
}
