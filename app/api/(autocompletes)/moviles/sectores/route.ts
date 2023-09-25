import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const sectores = await prisma.sector.findMany()

  return NextResponse.json(sectores)
}
