import { db } from '@/drizzle'
import {
  reparaciones,
  repuesto,
  tipoRepuesto,
} from '@/drizzle/schema/logistica'
import { RepuestosDTO, repuestosDTO } from '@/DTO/logistica/repuestos'
import { asc, count, desc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
})

const sortColumns = (column: keyof RepuestosDTO) => {
  switch (column) {
    case 'id':
      return repuesto.id
    case 'tipoRepuesto':
      return tipoRepuesto.tipo
    case 'item':
      return repuesto.item
    case 'ubicacion':
      return reparaciones.patente
    case 'estado':
      return reparaciones.articulo
    default:
      return repuesto.id
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const { page, per_page, sort } = searchParamsSchema.parse(
    Object.fromEntries(new URLSearchParams(searchParams).entries()),
  )

  const [column, order] = (sort?.split('.').filter(Boolean) ?? [
    'id',
    'desc',
  ]) as [keyof RepuestosDTO, 'asc' | 'desc']

  const repuestos = await repuestosDTO({
    page,
    per_page,
    order:
      order === 'asc' ? asc(sortColumns(column)) : desc(sortColumns(column)),
  })

  const total = await db
    .select({ count: count() })
    .from(repuesto)
    .execute()
    .then(([{ count }]) => count)

  return NextResponse.json({
    data: repuestos,
    pages: Math.ceil(total / per_page).toString(),
  })
}
