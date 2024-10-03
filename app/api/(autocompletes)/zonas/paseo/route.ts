import { db } from '@/drizzle'
import { zonas } from '@/drizzle/schema/nuevo_control'
import { NextResponse } from 'next/server'

export async function GET() {
  const _zonas = await db.select().from(zonas)

  return NextResponse.json(_zonas)
}
