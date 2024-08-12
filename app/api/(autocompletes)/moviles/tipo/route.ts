import { db } from '@/drizzle/db'
import { tipoVehiculo } from '@/drizzle/schema/logistica'
import { NextResponse } from 'next/server'

export async function GET() {
  const moviles = await db.select().from(tipoVehiculo)

  return NextResponse.json(moviles)
}
