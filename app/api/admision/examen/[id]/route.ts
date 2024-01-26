import prisma from '@/lib/prismadb'
import { shuffle } from '@/utils/misc'
import { NextRequest, NextResponse } from 'next/server'

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
    }: {
      nombre: string
      apellido: string
      email: string
      dni: string
    } = await req.json()

    const examen = await prisma.rinde_examen.create({
      data: {
        nombre,
        apellido,
        email,
        dni: +dni,
        examen: {
          connect: {
            id: parseInt(id),
          },
        },
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

    return NextResponse.json(examen)
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json('El alumno ya fue ingresado', { status: 403 })
    }
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    const { tipo_examen } = await req.json()
    const tipo = await prisma.tipo_examen.findUniqueOrThrow({
      where: {
        id: +tipo_examen,
      },
    })
    const examinado = await prisma.rinde_examen.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        examen: true,
      },
    })

    const rindioAlgunaVez = await prisma.rinde_examen.findFirst({
      where: {
        dni: examinado.dni,
        examen: {
          fecha: examinado.examen.fecha,
        },
      },
    })

    let tema = Math.floor(Math.random() * tipo.cantidad_temas) + 1

    while (rindioAlgunaVez && rindioAlgunaVez.tema === tema) {
      tema = Math.floor(Math.random() * tipo.cantidad_temas) + 1
    }

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

    const examen = await prisma.rinde_examen.update({
      where: {
        id,
      },
      data: {
        tipo_examen: {
          connect: {
            id: +tipo_examen,
          },
        },
        tema,
      },
    })

    for (const pregunta of preguntas) {
      await prisma.examen_preguntas.create({
        data: {
          examen: {
            connect: {
              id,
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
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
