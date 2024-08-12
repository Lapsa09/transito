import { db } from '@/drizzle/db'
import { calificacion, rindeExamen } from '@/drizzle/schema/examen'
import { invitados } from '@/drizzle/schema/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const examen = await db
    .select({
      calificacion: calificacion.resultado,
      nota: calificacion.nota,
      dni: invitados.dni,
      nombre: invitados.nombre,
      apellido: invitados.apellido,
    })
    .from(rindeExamen)
    .where(eq(rindeExamen.id, params.id))
    .innerJoin(invitados, eq(rindeExamen.id, invitados.id))
    .innerJoin(calificacion, eq(rindeExamen.nota, calificacion.nota))

  return NextResponse.json(examen)
}
