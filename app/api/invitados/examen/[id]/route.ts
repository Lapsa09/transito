import { db } from '@/drizzle/db'
import {
  examenes,
  examenPreguntas,
  preguntas,
  rindeExamen,
  tipoExamen,
} from '@/drizzle/schema/examen'
import { QuizResponse } from '@/types/quiz'
import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const examen = await db
    .select()
    .from(examenes)
    .where(eq(examenes.clave, params.id))

  return NextResponse.json(examen)
}

const notaFinal = (
  nota: number,
  tipo_examen: typeof tipoExamen.$inferSelect,
) => {
  if (tipo_examen.id <= 2) {
    return nota <= 24 ? 'C' : nota >= 25 && nota <= 31 ? 'B' : 'A'
  }
  return nota <= 49 ? 'C' : nota >= 50 && nota <= 63 ? 'B' : 'A'
}

export async function POST(req: Request) {
  try {
    const body: QuizResponse = await req.json()

    const [examen] = await db
      .select({
        id: rindeExamen.id,
        tipo_examen: tipoExamen,
      })
      .from(rindeExamen)
      .where(eq(rindeExamen.idInvitado, body.id))
      .innerJoin(tipoExamen, eq(rindeExamen.tipoExamenId, tipoExamen.id))

    const respuestas = await db.select().from(preguntas).orderBy(preguntas.id)

    const nota = body.preguntas.reduce((acc, pregunta) => {
      if (pregunta) {
        const respuesta = respuestas.find((r) => r.id === pregunta.id_pregunta)
        if (pregunta.id === respuesta?.idCorrecta) acc++
      }

      return acc
    }, 0)

    const [resultado] = await db
      .update(rindeExamen)
      .set({
        nota: notaFinal(nota, examen.tipo_examen),
        horaFinalizado: body.tiempo.toLocaleTimeString(),
      })
      .where(eq(rindeExamen.id, examen.id))
      .returning()

    for (const pregunta of body.preguntas.filter(Boolean)) {
      await db
        .update(examenPreguntas)
        .set({
          elegidaId: pregunta?.id,
        })
        .where(
          and(
            eq(examenPreguntas.examenId, resultado.id),
            eq(examenPreguntas.preguntaId, pregunta!.id_pregunta),
          ),
        )
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

    const [examen] = await db
      .update(rindeExamen)
      .set(body)
      .where(eq(rindeExamen.id, id))
      .returning()

    return NextResponse.json(examen)
  } catch (error) {
    console.log(error)

    return NextResponse.json('Server error', { status: 500 })
  }
}
