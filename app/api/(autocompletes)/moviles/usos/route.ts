import { db } from '@/drizzle'
import { uso } from '@/drizzle/schema/logistica'
import { NextResponse } from 'next/server'

export async function GET() {
  const sectores = await db.select().from(uso)

  return NextResponse.json(sectores)
}
