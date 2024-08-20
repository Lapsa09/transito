import { db, examendb } from '@/drizzle'
import { examenPreguntas, tipoExamen } from '@/drizzle/schema/examen'
import { invitados } from '@/drizzle/schema/schema'
import { examenDTO } from '@/DTO/examen'
import { shuffle } from '@/utils/misc'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    const examen = await examendb.query.examenes.findFirst({
      where: (examenes, { eq }) => eq(examenes.clave, id),
      with: {
        alumnos: {
          with: {
            tipoExamen: true,
            usuario: true,
          },
          orderBy: (usuario, { desc }) => [desc(usuario.horaIngresado)],
        },
      },
    })
    return NextResponse.json(examen)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}

function categorizeAge(dni: number, edad: number | null) {
  if (!edad) {
    if (dni < 16000000) {
      return 5
    } else if (dni < 31000000) {
      return 4
    } else if (dni < 38000000) {
      return 3
    } else if (dni < 45000000) {
      return 2
    } else if (dni < 90000000) {
      return 1
    } else {
      return undefined
    }
  } else {
    if (edad <= 17) {
      return 1
    } else if (edad <= 25) {
      return 2
    } else if (edad <= 35) {
      return 3
    } else if (edad <= 59) {
      return 4
    } else if (edad >= 60) {
      return 5
    } else {
      return undefined
    }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const {
      nombre,
      apellido,
      dni,
      tipo_examen,
      edad,
      sexo,
    }: {
      nombre: string
      apellido: string
      dni: string
      tipo_examen: string
      edad: string
      sexo: string
    } = await req.json()

    const [invitado] = await db
      .insert(invitados)
      .values({
        dni: +dni,
        apellido,
        nombre,
        idEdad: categorizeAge(+dni, +edad),
        sexo,
        edad: +edad,
      })
      .returning()

    const examen = await examenDTO(id, tipo_examen, invitado.id)

    const [tipo] = await db
      .select()
      .from(tipoExamen)
      .where(eq(tipoExamen.id, +tipo_examen))

    const preguntas = await examendb.query.preguntas.findMany({
      where: (tipo, { eq }) => eq(tipo.id, +tipo_examen),
      with: {
        opciones: true,
      },
    })

    for (const pregunta of shuffle(preguntas).slice(
      0,
      tipo.cantidadPreguntas,
    )) {
      await db.insert(examenPreguntas).values({
        examenId: examen.id,
        preguntaId: pregunta.id,
      })
    }
    return NextResponse.json(examen)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
