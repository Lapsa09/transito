import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const examen = await prisma.rinde_examen.findUnique({
    where: {
      id: params.id,
    },
    select: {
      apellido: true,
      nombre: true,
      dni: true,
      calificacion: true,
    },
  })

  return NextResponse.json(examen)
}
