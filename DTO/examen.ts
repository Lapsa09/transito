import prisma from '@/lib/prismadb'
import { Prisma } from '@prisma/client'

export const examenDTO = async (
  id: string,
  tipo_examen: string,
  id_invitado: string,
) =>
  await prisma.rinde_examen.create({
    data: {
      examen: {
        connect: {
          id: parseInt(id),
        },
      },
      tipo_examen: {
        connect: {
          id: +tipo_examen,
        },
      },
      usuario: {
        connect: {
          id: id_invitado,
        },
      },
    },
    include: {
      examen_preguntas: {
        include: {
          pregunta: {
            include: {
              opciones: true,
            },
          },
        },
      },
      tipo_examen: true,
      examen: true,
      usuario: true,
    },
  })

export const historialDTO = async ({
  where,
  pageIndex,
}: {
  where: Prisma.rinde_examenWhereInput
  pageIndex: number
}) => {
  return await prisma.rinde_examen.findMany({
    include: {
      examen: true,
      tipo_examen: true,
      usuario: {
        select: {
          apellido: true,
          nombre: true,
          dni: true,
          id: true,
        },
      },
    },
    where,
    orderBy: {
      id_examen: 'desc',
    },
    skip: pageIndex * 10,
    take: 10,
  })
}
