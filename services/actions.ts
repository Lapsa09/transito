'use server'

import prisma from '@/lib/prismadb'
import { revalidateTag } from 'next/cache'

export const habilitarExamen = async (id: number) => {
  const examen = await prisma.rinde_examen.findMany({
    where: {
      id_examen: id,
    },
  })
  if (!examen.every((e) => e.tipo_examenId))
    throw new Error('No todos los alumnos tienen un tipo de examen asignado')
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
      revalidateTag('examen')
    })
}

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
