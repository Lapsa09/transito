import { db } from '@/drizzle/db'
import { barrios } from '@/drizzle/schema/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const zonas = await db.select().from(barrios).orderBy(asc(barrios.barrio))

  return NextResponse.json(zonas)
}
