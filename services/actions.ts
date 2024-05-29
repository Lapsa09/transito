'use server'

import prisma from '@/lib/prismadb'
import { revalidatePath, revalidateTag } from 'next/cache'

export const terminarExamen = async (id: number) =>
  await prisma.examen
    .update({
      where: {
        id,
      },
      data: {
        terminado: true,
      },
    })
    .then(() => {
      revalidateTag('examen')
    })
    .then(() => revalidatePath('/admision/examen'))

export const rehabilitarExamen = async (id: string) =>
  await prisma.rinde_examen
    .update({
      where: {
        id,
      },
      data: {
        utilizado: false,
        hora_finalizado: null,
        nota: null,
      },
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
