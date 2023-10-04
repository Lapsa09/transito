import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const moviles = await prisma.logistica_tipo_vehiculo.findMany()

  return NextResponse.json(moviles)
}
