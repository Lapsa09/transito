import { db } from '@/drizzle'
import { proveedor, tipoRepuesto } from '@/drizzle/schema/logistica'
import { filterColumn } from '@/lib/filter-column'
import { searchParamsSchema } from '@/schemas/form'
import { proveedorInputSchema } from '@/schemas/logistica'
import { SQL, and, count, eq, or } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const { page, per_page, nombre, tipo_repuesto, operator } = searchParamsSchema
    .merge(
      z.object({
        nombre: z.string().optional(),
        tipo_repuesto: z.string().optional(),
      }),
    )
    .parse(Object.fromEntries(new URLSearchParams(searchParams).entries()))

  const expressions: (SQL<unknown> | undefined)[] = [
    !!nombre
      ? filterColumn({
          column: proveedor.nombre,
          value: nombre,
        })
      : undefined,
    !!tipo_repuesto
      ? filterColumn({
          column: proveedor.tipo,
          value: tipo_repuesto,
          isSelectable: true,
        })
      : undefined,
  ]

  const where =
    !operator || operator === 'and' ? and(...expressions) : or(...expressions)

  const proveedores = await db
    .select()
    .from(proveedor)
    .where(where)
    .innerJoin(tipoRepuesto, eq(proveedor.tipo, tipoRepuesto.idTipoRepuesto))
    .limit(per_page)
    .offset((page - 1) * per_page)

  const total = await db
    .select({ count: count() })
    .from(proveedor)
    .where(where)
    .innerJoin(tipoRepuesto, eq(proveedor.tipo, tipoRepuesto.idTipoRepuesto))
    .execute()
    .then((res) => res[0].count)

  return NextResponse.json({
    data: proveedores,
    pages: Math.ceil(total / per_page).toString(),
  })
}

export async function POST(req: NextRequest) {
  const json = await req.json()

  const body = proveedorInputSchema.parse(json)

  await db.insert(proveedor).values(body)

  revalidateTag('proveedores')
  revalidatePath('/logistica/repuestos/pedidos/create')
  return NextResponse.json('Exito')
}
