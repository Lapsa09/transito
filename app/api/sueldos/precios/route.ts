import { db } from '@/drizzle'
import { precios } from '@/drizzle/schema/sueldos'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const preciosList = await db.select().from(precios)

  return NextResponse.json(preciosList)
}

export async function PUT(request: NextRequest) {
  try {
    const body: { precio_normal: string; precio_pico: string } =
      await request.json()

    await db
      .update(precios)
      .set({
        precio: Number(body.precio_normal),
      })
      .where(eq(precios.id, 'precio_normal'))

    await db
      .update(precios)
      .set({
        precio: Number(body.precio_pico),
      })
      .where(eq(precios.id, 'precio_pico'))

    const preciosList = await db.select().from(precios)

    return NextResponse.json(preciosList)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
