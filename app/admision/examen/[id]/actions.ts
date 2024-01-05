'use server'

import prisma from '@/lib/prismadb'
import { revalidateTag } from 'next/cache'

export const habilitarExamen = async (id: string) =>
  prisma.examen
    .update({
      where: {
        id: parseInt(id),
      },
      data: {
        habilitado: true,
      },
    })
    .then(() => {
      revalidateTag('examen/' + id)
    })

export const terminarExamen = async (id: string) => {
  await prisma.examen.update({
    where: {
      id: parseInt(id),
    },
    data: {
      terminado: true,
    },
  })
}
