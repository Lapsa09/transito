'use server'

import prisma from '@/lib/prismadb'
import { revalidatePath, revalidateTag } from 'next/cache'

export const terminarExamen = async (id: number) => {
  await prisma.examen
    .update({
      where: {
        id,
      },
      data: {
        terminado: true,
      },
    })
    .then(() => revalidatePath('/admision/examen'))
}
export const rehabilitarExamen = async (id: string) =>
  await prisma.rinde_examen
    .update({
      where: {
        id_invitado: id,
      },
      data: {
        hora_finalizado: null,
        nota: null,
      },
    })
    .then(() => {
      prisma.invitado.update({
        where: {
          id,
        },
        data: {
          utilizado: false,
        },
      })
    })
    .then(() => {
      prisma.examen_preguntas.updateMany({
        where: {
          examen_id: id,
        },
        data: {
          elegida_id: null,
        },
      })
    })
    .then(() => {
      revalidateTag('examen')
    })

export const revalidar = (tag: string) => {
  revalidateTag(tag)
}
