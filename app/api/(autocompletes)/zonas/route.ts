import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const zonas = await prisma.barrios.findMany({ orderBy: { id_barrio: 'asc' } })

  return NextResponse.json(zonas)
}
