import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const moviles = await prisma.tipo_repuesto.findMany()

  return NextResponse.json(moviles)
}
