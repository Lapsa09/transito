import prisma from '@/lib/prismadb'
import { shuffle } from '@/utils/misc'
import { examen_preguntas, opciones, preguntas } from '@prisma/client'

export async function GET({ params }: { params: { id: string } }) {
  const { id } = params
  const examen = await prisma.examen.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      alumnos: true,
    },
  })
  return examen
}

export async function POST({
  req,
  params,
}: {
  params: { id: string }
  req: Request
}) {
  const { id } = params
  const { nombre, apellido, email, dni, tipo_examen } = await req.json()
  const tema = Math.floor(Math.random() * 4) + 1
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
      dni,
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
  const examen_preguntas: Array<
    examen_preguntas & { pregunta: preguntas & { opciones: opciones[] } }
  > = []
  for (const pregunta of shuffle(preguntas).slice(0, 10)) {
    const res = await prisma.examen_preguntas.create({
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
    examen_preguntas.push(res)
  }

  examen.examen_preguntas = examen_preguntas

  return examen
}
