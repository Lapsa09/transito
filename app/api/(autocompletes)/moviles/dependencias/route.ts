import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const dependencias = await prisma.dependencia.findMany()

  return NextResponse.json(dependencias)
}
