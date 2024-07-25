import prisma from '@/lib/prismadb'

export async function partesDTO(filterParams: Record<string, string>) {
  const partesPromise = await prisma.parte.findMany({
    include: {
      operario: {
        select: {
          legajo: true,
          nombre: true,
          apellido: true,
        },
      },
    },
    where: filterParams.fecha
      ? {
          fecha: new Date(filterParams.fecha),
        }
      : undefined,
  })
  return partesPromise
}

export async function printablePartesDTO(filterParams: Record<string, string>) {
  const partesPromise = await prisma.parte.findMany({
    include: {
      operario: {
        select: {
          legajo: true,
          nombre: true,
          apellido: true,
        },
      },
    },
    where: filterParams.fecha
      ? {
          fecha: new Date(filterParams.fecha).toISOString(),
        }
      : undefined,
  })
  return partesPromise
}
