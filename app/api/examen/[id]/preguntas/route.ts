import prisma from '@/lib/prismadb'
import { examen, rinde_examen } from '@prisma/client'
import { jwtDecode } from 'jwt-decode'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const usuario = jwtDecode<rinde_examen & { examen: examen }>(params.id)

    const examen = await prisma.rinde_examen.findUnique({
      where: {
        id: usuario.id,
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
        examen: true,
      },
    })

    examen!.examen_preguntas = examen!.examen_preguntas.map((pregunta) => {
      const [preg, señal] = pregunta.pregunta.pregunta.split(/N° ([0-9]{1,3})/)

      return {
        ...pregunta,
        pregunta: {
          ...pregunta.pregunta,
          pregunta: señal
            ? preg + `: <img src="/setran/${señal}.png" alt="señal" />`
            : pregunta.pregunta.pregunta,
          opciones: pregunta.pregunta.opciones.map((opcion) => {
            return {
              ...opcion,
              respuesta: opcion.respuesta.match(/^[0-9]{1,3}$/)
                ? `<img src="/setran/${opcion.respuesta}.png" alt="señal" />`
                : opcion.respuesta,
            }
          }),
        },
      }
    })

    return NextResponse.json(examen)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
