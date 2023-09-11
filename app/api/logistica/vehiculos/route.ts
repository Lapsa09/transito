import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const vehiculos = await prisma.movil.findMany({
    include: {
      sector: true,
      dependencia: true,
    },
  })

  return NextResponse.json(vehiculos)
}
