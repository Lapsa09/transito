import prisma from '@/lib/prismadb'
import { QuizResponse } from '@/types/quiz'
import { tipo_examen } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const examen = await prisma.examen.findFirst({
    where: {
      clave: params.id,
    },
  })

  return NextResponse.json(examen)
}

const notaFinal = (nota: number, tipo_examen: tipo_examen) => {
  if (tipo_examen.id <= 2) {
    return nota <= 24 ? 'C' : nota >= 25 && nota <= 31 ? 'B' : 'A'
  }
  return nota <= 49 ? 'C' : nota >= 50 && nota <= 63 ? 'B' : 'A'
}

export async function POST(req: Request) {
  try {
    const body: QuizResponse = await req.json()
    const examen = await prisma.rinde_examen.findUnique({
      where: {
        id: body.id,
      },
      include: {
        tipo_examen: true,
      },
    })

    const respuestas = await prisma.preguntas.findMany({
      where: {
        tema: examen?.tema!,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        correcta: true,
      },
    })

    const nota = body.preguntas.filter(Boolean).reduce((acc, pregunta) => {
      const respuesta = respuestas.find((r) => r.id === pregunta?.id_pregunta)
      if (pregunta?.id === respuesta?.correcta?.id) acc++

      return acc
    }, 0)
    const resultado = await prisma.rinde_examen.update({
      data: {
        nota: notaFinal(nota, examen!.tipo_examen),
      },
      where: {
        id: body.id,
      },
    })

    for (const pregunta of body.preguntas.filter(Boolean)) {
      await prisma.examen_preguntas.update({
        data: {
          elegida_id: pregunta?.id,
        },
        where: {
          examen_id_preguntas_id: {
            examen_id: resultado.id,
            preguntas_id: pregunta!.id_pregunta,
          },
        },
      })
    }

    return NextResponse.json(resultado)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
