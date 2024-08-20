import { db } from '@/drizzle'
import {
  movil,
  reparaciones,
  repuesto,
  tipoRepuesto,
} from '@/drizzle/schema/logistica'
import { searchParamsSchema } from '@/schemas/form'
import { count, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const { page, per_page } = searchParamsSchema.parse(searchParams)

  const listaReparaciones = await db
    .select()
    .from(reparaciones)
    .innerJoin(movil, eq(reparaciones.patente, movil.patente))
    .innerJoin(repuesto, eq(reparaciones.articulo, repuesto.id))
    .innerJoin(
      tipoRepuesto,
      eq(repuesto.idTipoRepuesto, tipoRepuesto.idTipoRepuesto),
    )
    .offset((page - 1) * per_page)
    .limit(per_page)

  const total = await db
    .select({ count: count() })
    .from(reparaciones)
    .execute()
    .then((res) => res[0].count)

  return NextResponse.json({
    data: listaReparaciones,
    pages: Math.ceil(total / per_page).toString(),
  })
}
