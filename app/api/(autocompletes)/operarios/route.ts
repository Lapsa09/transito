import { db } from '@/drizzle'
import { operarios } from '@/drizzle/schema/sueldos'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const _operarios = await db.select().from(operarios)

  return NextResponse.json(_operarios)
}

export async function POST(req: NextRequest) {
  const body: { legajo: string; nombre: string } = await req.json()
  const operario = await db
    .insert(operarios)
    .values({
      legajo: +body.legajo,
      nombre: body.nombre,
    })
    .returning()

  return NextResponse.json(operario)
}
