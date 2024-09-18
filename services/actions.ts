'use server'

import { db } from '@/drizzle'
import { examenes, examenPreguntas, rindeExamen } from '@/drizzle/schema/examen'
import { invitados } from '@/drizzle/schema/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'

export const terminarExamen = async (id: number) => {
  await db
    .update(examenes)
    .set({ terminado: true })
    .where(eq(examenes.id, id))
    .execute()
    .then(() => revalidatePath('/admision/examen'))
}
export const rehabilitarExamen = async (id: string) =>
  await db
    .transaction(async (tx) => {
      const [{ idExamen }] = await tx
        .update(rindeExamen)
        .set({ horaFinalizado: null, nota: null })
        .where(eq(rindeExamen.idInvitado, id))
        .returning({ idExamen: rindeExamen.id })
      await tx
        .update(invitados)
        .set({ utilizado: false })
        .where(eq(invitados.id, id))
      await tx
        .update(examenPreguntas)
        .set({ elegidaId: null })
        .where(eq(examenPreguntas.examenId, idExamen))
        .execute()
    })
    .then(() => {
      revalidateTag('examen')
    })

export const revalidar = (tag: string) => {
  revalidateTag(tag)
}
