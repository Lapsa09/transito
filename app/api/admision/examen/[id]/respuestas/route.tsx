import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const examen = await prisma.examen_preguntas.findMany({
      where: {
        examen_id: id,
      },

      include: {
        pregunta: {
          include: {
            correcta: true,
          },
        },
        elegida: true,
      },
      orderBy: {
        preguntas_id: 'asc',
      },
    })

    const _examen = examen.map((pregunta) => {
      const [preg, señal] = pregunta.pregunta.pregunta.split(/N° ([0-9]{1,3})/)

      return {
        ...pregunta,
        pregunta: {
          ...pregunta.pregunta,
          pregunta: señal
            ? preg + `: <img src="/setran/${señal}.png" alt="señal" />`
            : pregunta.pregunta.pregunta,
          correcta: {
            ...pregunta.pregunta.correcta,
            respuesta: pregunta.pregunta.correcta?.respuesta.match(
              /^[0-9]{1,3}$/,
            )
              ? `<img src="/setran/${pregunta.pregunta.correcta.respuesta}.png" alt="señal" />`
              : pregunta.pregunta.correcta?.respuesta,
          },
        },
        elegida: pregunta.elegida
          ? {
              ...pregunta.elegida,
              respuesta: pregunta.elegida.respuesta.match(/^[0-9]{1,3}$/)
                ? `<img src="/setran/${pregunta.elegida.respuesta}.png" alt="señal" />`
                : pregunta.elegida.respuesta,
            }
          : undefined,
      }
    })

    return NextResponse.json(_examen)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
