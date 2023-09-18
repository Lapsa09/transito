import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const clientes = await prisma.clientes.findMany()

  return NextResponse.json(clientes)
}

export async function POST(req: NextRequest) {
  try {
    const { cliente } = await req.json()
    console.log(cliente)
    const clientes = await prisma.clientes.create({
      data: {
        cliente: cliente.toUpperCase(),
      },
    })

    return NextResponse.json(clientes)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
