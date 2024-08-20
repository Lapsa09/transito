import { db } from '@/drizzle'
import { servicios } from '@/drizzle/schema/sueldos'
import { count, desc, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const mes = sql<number>`extract(month from ${servicios.fechaServicio})`
    const año = sql<number>`extract(year from ${servicios.fechaServicio})`
    const liquidaciones = await db
      .select({
        mes,
        año,
        total: count(),
      })
      .from(servicios)
      .groupBy(mes, año)
      .orderBy(desc(año), desc(mes))

    return NextResponse.json(liquidaciones)
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json('Server error', { status: 500 })
  }
}
