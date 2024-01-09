import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const examenes = await prisma.examen.findMany({
      where: {
        terminado: false,
      },
    })

    return NextResponse.json(examenes)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const examen = await prisma.rinde_examen.findFirst({
      where: {
        dni: +body.dni,
        utilizado: false,
        examen: {
          clave: body.clave,
        },
      },
      include: {
        examen: true,
      },
    })

    if (examen) {
      await prisma.rinde_examen.update({
        where: { id: examen.id },
        data: { utilizado: true },
      })
    }

    return NextResponse.json(examen)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
