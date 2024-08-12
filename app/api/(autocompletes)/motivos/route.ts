import { db } from '@/drizzle/db'
import { motivos } from '@/drizzle/schema/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  const _motivos = await db.select().from(motivos)

  return NextResponse.json(_motivos)
}
