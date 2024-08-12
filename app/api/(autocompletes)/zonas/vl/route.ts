import { db } from '@/drizzle/db'
import { vicenteLopez } from '@/drizzle/schema/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  const zonas = await db.select().from(vicenteLopez)

  return NextResponse.json(zonas)
}
