import { searchParamsSchema } from '@/schemas/form'
import { db } from '@/drizzle'
import { servicios } from '@/drizzle/schema/sueldos'
import { count, desc, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { page, per_page } = searchParamsSchema.parse(
      req.nextUrl.searchParams,
    )
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
      .offset((page - 1) * per_page)
      .limit(per_page)
      .orderBy(desc(año), desc(mes))

    const total = await db
      .select({ count: count() })
      .from(servicios)
      .groupBy(mes, año)
      .execute()
      .then((data) => data[0].count)

    return NextResponse.json({
      data: liquidaciones,
      pages: Math.ceil(total / per_page),
    })
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json('Server error', { status: 500 })
  }
}
