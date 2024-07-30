import { examenDTO } from '@/DTO/examen'
import prisma from '@/lib/prismadb'
import { shuffle } from '@/utils/misc'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const examen = await prisma.examen.findFirst({
      where: {
        clave: id,
        terminado: false,
      },
      include: {
        alumnos: {
          include: {
            tipo_examen: true,
            usuario: true,
          },
          orderBy: {
            usuario: {
              apellido: 'asc',
            },
          },
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
    const invitado = await prisma.invitado.create({
      data: {
        dni: +dni,
        apellido,
        nombre,
        id_edad: categorizeAge(+dni, +edad),
        sexo,
        edad: +edad,
      },
    })
    const examen = await examenDTO(id, tipo_examen, invitado.id)

    const tipo = await prisma.tipo_examen.findUniqueOrThrow({
      where: {
        id: +tipo_examen,
      },
    })

    const preguntas = await prisma.preguntas.findMany({
      where: {
        tipo_examen: {
          id: +tipo_examen,
        },
      },
      include: {
        opciones: true,
      },
    })

    for (const pregunta of shuffle([...preguntas]).slice(
      0,
      tipo.cantidad_preguntas,
    )) {
      await prisma.examen_preguntas.create({
        data: {
          examen: {
            connect: {
              id: examen.id,
            },
          },
          pregunta: {
            connect: {
              id: pregunta.id,
            },
          },
        },
      })
    }
    return NextResponse.json(examen)
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json('El alumno ya fue ingresado', { status: 403 })
    }
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
