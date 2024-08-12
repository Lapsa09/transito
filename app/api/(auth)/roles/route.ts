import { db } from '@/drizzle/db'
import { permisos } from '@/drizzle/schema/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  const roles = await db.select().from(permisos)
  return NextResponse.json(roles)
}
