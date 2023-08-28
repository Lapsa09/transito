import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const precios = await prisma.precios.findMany()

  return NextResponse.json(precios)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  await prisma.precios.updateMany({
    data: body,
  })

  const precios = await prisma.precios.findMany()

  return NextResponse.json(precios)
}
