import { db } from '@/drizzle/db'
import { permisos, users } from '@/drizzle/schema/schema'
import { NextRequest, NextResponse } from 'next/server'

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
    turno: (typeof users.$inferInsert)['turno']
  } = await req.json()

  await db.insert(users).values({
    idRol: rol.id,
    legajo: +legajo,
    nombre,
    apellido,
    turno,
  })

  return NextResponse.json('Success')
}
