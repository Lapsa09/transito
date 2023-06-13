import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const motivos = await prisma.motivos.findMany()

  return NextResponse.json(motivos)
}
