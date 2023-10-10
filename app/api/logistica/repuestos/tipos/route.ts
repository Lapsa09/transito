import prisma from '@/lib/prismadb'

import { NextResponse } from 'next/server'

export async function GET() {
  const tipos = await prisma.tipo_repuesto.findMany()

  return NextResponse.json(tipos)
}
