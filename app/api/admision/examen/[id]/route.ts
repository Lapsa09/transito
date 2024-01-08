import prisma from '@/lib/prismadb'
import { shuffle } from '@/utils/misc'
import { tipo_examen } from '@prisma/client'
import { revalidatePath } from 'next/cache'
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
        alumnos: true,
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
    tipo_examen: tipo_examen
  } = await req.json()
  const tema = Math.floor(Math.random() * tipo_examen.cantidad_temas) + 1
  const preguntas = await prisma.preguntas.findMany({
    where: {
      tema,
      tipo_examen,
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
          id: tipo_examen.id,
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
    },
  })

  for (const pregunta of shuffle(preguntas).slice(
    0,
    tipo_examen.cantidad_preguntas,
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

  revalidatePath('admision/examen/' + id)
  return NextResponse.json(examen)
}
