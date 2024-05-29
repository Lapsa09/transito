import prisma from '@/lib/prismadb'
import { QuizResponse } from '@/types/quiz'
import { tipo_examen } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

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
    const examen = await prisma.rinde_examen.findUniqueOrThrow({
      where: {
        id: body.id,
      },
      include: {
        tipo_examen: true,
      },
    })

    const respuestas = await prisma.preguntas.findMany({
      orderBy: {
        id: 'asc',
      },
    })

    const nota = body.preguntas.reduce((acc, pregunta) => {
      if (pregunta) {
        const respuesta = respuestas.find((r) => r.id === pregunta.id_pregunta)
        if (pregunta.id === respuesta?.id_correcta) acc++
      }

      return acc
    }, 0)
    const resultado = await prisma.rinde_examen.update({
      data: {
        nota: notaFinal(nota, examen.tipo_examen!),
        hora_finalizado: body.tiempo,
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json()

    const { id } = params

    const examen = await prisma.rinde_examen.update({
      where: {
        id,
      },
      data: body,
    })

    return NextResponse.json(examen)
  } catch (error) {
    console.log(error)

    return NextResponse.json('Server error', { status: 500 })
  }
}
