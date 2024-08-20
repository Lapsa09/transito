import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/drizzle'
import { operariosServicios, servicios } from '@/drizzle/schema/sueldos'
import { eq, sql } from 'drizzle-orm'

export async function PUT(req: NextRequest, state: { params: { id: string } }) {
  const { id } = state.params
  const { cancelado } = await req.json()

  const [update] = await db
    .update(operariosServicios)
    .set({
      cancelado: !cancelado,
    })
    .where(eq(operariosServicios.id, +id))
    .returning()

  await db.update(servicios).set({
    importeServicio: !cancelado
      ? sql<number>`${servicios.importeServicio}-${update.aCobrar}`
      : sql<number>`${servicios.importeServicio}+${update.aCobrar}`,
  })

  return NextResponse.json('Exito')
}
