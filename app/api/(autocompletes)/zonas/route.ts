import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const zonas = await prisma.barrios.findMany()

  return NextResponse.json(zonas)
}
