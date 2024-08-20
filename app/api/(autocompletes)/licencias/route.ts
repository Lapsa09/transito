import { db } from '@/drizzle'
import { tipoLicencias } from '@/drizzle/schema/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  const licencias = await db.select().from(tipoLicencias)

  return NextResponse.json(licencias)
}
