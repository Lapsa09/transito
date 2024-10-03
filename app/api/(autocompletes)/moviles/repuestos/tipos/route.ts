import { db } from '@/drizzle'
import { tipoRepuesto } from '@/drizzle/schema/logistica'
import { NextResponse } from 'next/server'

export async function GET() {
  const moviles = await db.select().from(tipoRepuesto)

  return NextResponse.json(moviles)
}
