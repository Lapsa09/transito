import { db } from '@/drizzle/db'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const examen = await db.query.rindeExamen.findFirst({
      where: (examen, { eq }) => eq(examen.idInvitado, id),
      with: {
        preguntas: {
          with: {
            pregunta: {
              columns: {
                id: true,
                pregunta: true,
              },
              with: {
                opciones: {
                  columns: {
                    id: true,
                    respuesta: true,
                    idPregunta: true,
                  },
                },
              },
            },
          },
        },
        examen: true,
      },
    })

    if (examen?.preguntas)
      examen.preguntas = examen.preguntas.map((pregunta) => {
        const [preg, señal] =
          pregunta.pregunta.pregunta.split(/N° ([0-9]{1,3})/)

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
