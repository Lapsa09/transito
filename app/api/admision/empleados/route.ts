import prisma from '@/lib/prismadb'
import { permisos } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { legajo, rol }: { legajo: string; rol: permisos } = await req.json()

  await prisma.legajos.create({
    data: {
      legajo: +legajo,
      id_rol: rol.id,
    },
  })

  return NextResponse.json('Success')
}
