import prisma from '@/lib/prismadb'
import { QuizResponse } from '@/types/quiz'
import { NextResponse } from 'next/server'

export async function GET({ params }: { params: { id: string } }) {
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

export async function POST(req: Request) {
  const body: QuizResponse = await req.json()

  const respuestas = await prisma.preguntas.findMany({
    where: {
      tema: body.tema,
    },
    orderBy: {
      id: 'asc',
    },
    include: {
      correcta: true,
    },
  })

  const nota = body.preguntas.reduce((acc, pregunta) => {
    const respuesta = respuestas.find(
      (r) => r.id === pregunta.elegida?.id_pregunta,
    )
    if (pregunta.elegida?.id === respuesta?.correcta.id) acc++

    return acc
  }, 0)

  const examen = await prisma.rinde_examen.update({
    data: {
      nota,
    },
    where: {
      id: body.id,
    },
  })

  for (const pregunta of body.preguntas) {
    await prisma.examen_preguntas.update({
      data: {
        elegida_id: pregunta.elegida?.id,
      },
      where: {
        examen_id_preguntas_id: {
          examen_id: examen.id,
          preguntas_id: pregunta.elegida!.id_pregunta,
        },
      },
    })
  }

  return NextResponse.json(examen)
}
