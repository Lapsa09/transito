import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const roles = await prisma.permisos.findMany()
  return NextResponse.json(roles)
}
