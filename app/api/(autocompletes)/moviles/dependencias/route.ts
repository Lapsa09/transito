import { db } from '@/drizzle/db'
import { dependencia } from '@/drizzle/schema/logistica'
import { NextResponse } from 'next/server'

export async function GET() {
  const dependencias = await db.select().from(dependencia)

  return NextResponse.json(dependencias)
}
