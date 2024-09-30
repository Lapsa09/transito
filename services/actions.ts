'use server'

import { db } from '@/drizzle'
import { examenes, examenPreguntas, rindeExamen } from '@/drizzle/schema/examen'
import { invitados } from '@/drizzle/schema/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export const terminarExamen = async (id: number) => {
  await db
    .update(examenes)
    .set({ terminado: true })
    .where(eq(examenes.id, id))
    .execute()
    .then(() => revalidatePath('/admision/examen'))
    .then(() => redirect('/admision/examen'))
}
export const rehabilitarExamen = async (id: string) =>
  await db
    .transaction(async (tx) => {
      const [{ id_invitado }] = await tx
        .update(rindeExamen)
        .set({ horaFinalizado: null, nota: null })
        .where(eq(rindeExamen.id, id))
        .returning({
          idExamen: rindeExamen.id,
          id_invitado: rindeExamen.idInvitado,
        })
      await tx
        .update(invitados)
        .set({ utilizado: false })
        .where(eq(invitados.id, id_invitado))
      await tx
        .delete(examenPreguntas)
        .where(eq(examenPreguntas.examenId, id))
        .execute()
    })
    .then(() => {
      revalidateTag('examen')
    })

export const revalidar = async (tag: string) => {
  revalidateTag(tag)
}
