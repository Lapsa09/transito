import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const operarios = await prisma.operarios.findMany()

  return NextResponse.json(operarios)
}
