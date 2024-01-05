'use server'

import prisma from '@/lib/prismadb'
import { revalidatePath } from 'next/cache'

export const habilitarExamen = async (id: string) =>
  await prisma.examen
    .update({
      where: {
        id: parseInt(id),
      },
      data: {
        habilitado: true,
      },
    })
    .then(() => {
      revalidatePath('admision/examen/' + id)
    })

export const terminarExamen = async (id: string) =>
  await prisma.examen
    .update({
      where: {
        id: parseInt(id),
      },
      data: {
        terminado: true,
      },
    })
    .then(() => {
      revalidatePath('admision/examen/' + id)
    })
