'use server'

import prisma from '@/lib/prismadb'
import { revalidatePath } from 'next/cache'

export const habilitarExamen = async (id: number) =>
  await prisma.examen
    .update({
      where: {
        id,
      },
      data: {
        habilitado: true,
        hora_iniciado: new Date(),
      },
    })
    .then(() => {
      revalidatePath('admision/examen/' + id)
    })

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
      revalidatePath('admision/examen')
    })
