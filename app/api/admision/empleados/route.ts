import prisma from '@/lib/prismadb'
import { permisos, turnos } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const {
    legajo,
    rol,
    apellido,
    nombre,
    turno,
  }: {
    legajo: string
    rol: permisos
    nombre: string
    apellido: string
    turno?: turnos
  } = await req.json()

  await prisma.user.create({
    data: {
      legajo: +legajo,
      id_rol: rol.id,
      nombre,
      apellido,
      turno,
    },
  })

  return NextResponse.json('Success')
}
