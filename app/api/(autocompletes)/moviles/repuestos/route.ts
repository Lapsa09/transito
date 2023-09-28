import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const repuestos = await prisma.repuesto.findMany()

  return NextResponse.json(repuestos)
}
