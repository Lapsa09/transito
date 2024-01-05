import prisma from '@/lib/prismadb'
import { shuffle } from '@/utils/misc'
import {
  examen_preguntas,
  opciones,
  preguntas,
  tipo_examen,
} from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const examen = await prisma.examen.findUnique({
      where: {
        id: Number(id),
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

const getTema = (tipo_examen: tipo_examen) => {
  switch (tipo_examen) {
    case 'autos':
      return 7
    case 'motos':
      return 3
    case 'prof1':
      return 1
    case 'prof2':
      return 2
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const { nombre, apellido, email, dni, tipo_examen } = await req.json()
  const tema = Math.floor(Math.random() * getTema(tipo_examen)) + 1
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
      tipo_examen,
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
  const cantidadPreguntas =
    examen.tipo_examen === 'prof1' || examen.tipo_examen === 'prof2' ? 80 : 40
  for (const pregunta of shuffle(preguntas).slice(0, cantidadPreguntas)) {
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
