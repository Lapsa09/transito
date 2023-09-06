import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const zonas = await prisma.zonas.findMany()

  return NextResponse.json(zonas)
}
