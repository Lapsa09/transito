import prisma from '@/lib/prismadb'
import { generatePassword } from '@/utils/misc'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { fecha, terminado }: { fecha?: string; terminado?: boolean } =
      await req.json()
    if (fecha && terminado !== undefined) {
      const repetido = await prisma.examen.findFirst({
        where: {
          fecha,
          hora: new Date(fecha),
          terminado,
        },
      })
      if (repetido) {
        return NextResponse.json(repetido)
      }
    }
    const clave = generatePassword()
    const examen = await prisma.examen.create({
      data: {
        clave,
        fecha,
        hora: fecha && new Date(fecha),
        terminado,
      },
    })

    return NextResponse.json(examen)
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json('Ya existen estos examenes', { status: 401 })
    }

    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
