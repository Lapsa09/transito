import { db } from '@/drizzle'
import { proveedor } from '@/drizzle/schema/logistica'
import { searchParamsSchema } from '@/schemas/form'
import { count } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const { page, per_page } = searchParamsSchema.parse(searchParams)

  const proveedores = await db
    .select()
    .from(proveedor)
    .limit(per_page)
    .offset((page - 1) * per_page)

  const total = await db
    .select({ count: count() })
    .from(proveedor)
    .execute()
    .then((res) => res[0].count)

  return NextResponse.json({
    data: proveedores,
    pages: Math.ceil(total / per_page).toString(),
  })
}

export async function POST(req: NextRequest) {
  const body: typeof proveedor.$inferInsert = await req.json()

  await db.insert(proveedor).values(body)

  revalidateTag('proveedores')
  revalidatePath('/logistica/repuestos/pedidos/create')
  return NextResponse.json('Exito')
}
