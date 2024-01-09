import prisma from '@/lib/prismadb'
import { shuffle } from '@/utils/misc'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
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

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const {
      nombre,
      apellido,
      email,
      dni,
      tipo_examen,
    }: {
      nombre: string
      apellido: string
      email: string
      dni: string
      tipo_examen: string
    } = await req.json()

    const tipo = await prisma.tipo_examen.findUnique({
      where: {
        id: +tipo_examen,
      },
    })
    const tema = Math.floor(Math.random() * tipo?.cantidad_temas!) + 1
    const preguntas = await prisma.preguntas.findMany({
      where: {
        tema,
        tipo_examen: {
          id: +tipo_examen,
        },
      },
      include: {
        opciones: true,
      },
    })

    const examen = await prisma.rinde_examen.create({
      data: {
        nombre,
        apellido,
        email,
        dni: +dni,
        tipo_examen: {
          connect: {
            id: +tipo_examen,
          },
        },
        examen: {
          connect: {
            id: parseInt(id),
          },
        },
        tema,
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
        tipo_examen: true,
        examen: true,
      },
    })

    for (const pregunta of shuffle(preguntas).slice(
      0,
      tipo?.cantidad_preguntas,
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
        include: {
          pregunta: {
            include: {
              opciones: true,
            },
          },
        },
      })
    }
    return NextResponse.json(examen)
  } catch (error: any) {
    console.log(error)
    if (error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json('El alumno ya fue ingresado', { status: 403 })
    }
    return NextResponse.json('Server error', { status: 500 })
  }
}
