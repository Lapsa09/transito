import { db } from '@/drizzle'
import { controlSustancias } from '@/drizzle/schema/schema'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const control = await db
    .select({
      id: controlSustancias.id,
      label: controlSustancias.resultado,
    })
    .from(controlSustancias)

  return NextResponse.json(control)
}
