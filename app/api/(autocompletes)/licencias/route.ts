import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const licencias = await prisma.tipo_licencias.findMany()

  return NextResponse.json(licencias)
}
