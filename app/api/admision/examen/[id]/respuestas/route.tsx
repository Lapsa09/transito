import { db } from '@/drizzle/db'
import { examenPreguntas, opciones, preguntas } from '@/drizzle/schema/examen'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { NextResponse } from 'next/server'

const correcta = alias(opciones, 'correcta')

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const examen = await db
      .select({
        examenId: examenPreguntas.examenId,
        pregunta: preguntas.pregunta,
        correcta: opciones,
        elegida: correcta,
      })
      .from(examenPreguntas)
      .innerJoin(preguntas, eq(preguntas.id, examenPreguntas.preguntaId))
      .leftJoin(opciones, eq(opciones.id, examenPreguntas.elegidaId))
      .innerJoin(correcta, eq(correcta.id, preguntas.idCorrecta))
      .where(eq(examenPreguntas.examenId, id))
      .orderBy(preguntas.id)

    const _examen = examen.map((pregunta) => {
      const [preg, señal] = pregunta.pregunta?.split(/N° ([0-9]{1,3})/) || []

      return {
        ...pregunta,
        pregunta: señal
          ? preg + `: <img src="/setran/${señal}.png" alt="señal" />`
          : pregunta.pregunta,
        correcta: {
          ...pregunta.correcta,
          respuesta: pregunta.correcta?.respuesta.match(/^[0-9]{1,3}$/)
            ? `<img src="/setran/${pregunta.correcta.respuesta}.png" alt="señal" />`
            : pregunta.correcta?.respuesta,
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
