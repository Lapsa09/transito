import prisma from '@/lib/prismadb'
import { QuizResponse } from '@/types/quiz'
import { NextResponse } from 'next/server'

export async function GET() {
  const examen = await prisma.preguntas.findMany({
    take: 10,
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

  const examen = await prisma.examen.create({
    data: {
      nota,
      email: body.email,
      tema: body.tema,
      dni: body.dni,
    },
  })

  for (const pregunta of body.preguntas) {
    await prisma.examen_preguntas.create({
      data: {
        preguntas_id: pregunta.elegida!.id_pregunta,
        examen_id: examen.id,
        elegida_id: pregunta.elegida?.id,
      },
    })
  }
}
