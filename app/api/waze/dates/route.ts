import { db } from '@/drizzle'
import { dia } from '@/drizzle/schema/waze'
import { sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const mes = sql<number>`extract(month from fecha) as mes`
    const dias = await db
      .select({
        mes,
        fechas: sql<string>`json_agg(json_build_object('id',id,'fecha',fecha)) as fechas`,
      })
      .from(dia)
      .groupBy(mes)
      .orderBy(mes)

    return NextResponse.json(dias)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
