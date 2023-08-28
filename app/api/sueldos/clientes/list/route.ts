import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const clientes = await prisma.clientes.findMany()

  return NextResponse.json(clientes)
}
