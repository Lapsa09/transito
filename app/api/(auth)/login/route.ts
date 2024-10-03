import { db } from '@/drizzle'
import { rindeExamen } from '@/drizzle/schema/examen'
import { invitados } from '@/drizzle/schema/schema'
import { invitadoDTO, userDTO } from '@/DTO/user'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  if (body.legajo) {
    const user = await userDTO(body)
    return NextResponse.json(user)
  }

  const invitado = await invitadoDTO(body)

  if (invitado)
    await db.transaction(async (tx) => {
      await tx
        .update(invitados)
        .set({ utilizado: true })
        .where(eq(invitados.id, invitado.id))
      await tx
        .update(rindeExamen)
        .set({ horaIngresado: new Date() })
        .where(eq(rindeExamen.idInvitado, invitado.id))
    })

  return NextResponse.json(invitado)
}
