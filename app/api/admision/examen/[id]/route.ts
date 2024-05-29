import prisma from '@/lib/prismadb'
import { shuffle } from '@/utils/misc'
import { revalidateTag } from 'next/cache'
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
          },
          orderBy: {
            apellido: 'asc',
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
    }: {
      nombre: string
      apellido: string
      email: string
      dni: string
      tipo_examen: string
    } = await req.json()

    const examen = await prisma.rinde_examen.create({
      data: {
        nombre,
        apellido,
        dni: +dni,
        examen: {
          connect: {
            id: parseInt(id),
          },
        },
        tipo_examen: {
          connect: {
            id: +tipo_examen,
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

    for (const pregunta of shuffle(preguntas).slice(
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
        include: {
          pregunta: {
            include: {
              opciones: true,
            },
          },
        },
      })
    }
    revalidateTag('examen')
    return NextResponse.json(examen)
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json('El alumno ya fue ingresado', { status: 403 })
    }
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
