import { db } from '@/drizzle/db'
import { proveedor } from '@/drizzle/schema/logistica'
import { NextResponse } from 'next/server'

export async function GET() {
  const dependencias = await db.select().from(proveedor)

  return NextResponse.json(dependencias)
}
