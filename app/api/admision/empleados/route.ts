import { turnosSchema } from '@/drizzle/schema/schema'
import { db } from '@/drizzle'
import { permisos, users } from '@/drizzle/schema/schema'
import { NextRequest, NextResponse } from 'next/server'
import { v4 } from 'uuid'

export async function POST(req: NextRequest) {
  const {
    legajo,
    rol,
    apellido,
    nombre,
    turno,
  }: {
    legajo: string
    rol: typeof permisos.$inferSelect
    nombre: string
    apellido: string
    turno: keyof typeof turnosSchema.Enum | null
  } = await req.json()

  await db.insert(users).values({
    idRol: rol.id,
    legajo: +legajo,
    nombre,
    apellido,
    turno,
    id: v4(),
  })

  return NextResponse.json('Success')
}
