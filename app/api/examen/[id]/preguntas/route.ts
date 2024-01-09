import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const examen = await prisma.examen_preguntas.findMany({
    where: {
      examen_id: params.id,
    },
    include: {
      pregunta: {
        include: {
          opciones: true,
        },
      },
      examen: true,
    },
  })

  return NextResponse.json(examen)
}
