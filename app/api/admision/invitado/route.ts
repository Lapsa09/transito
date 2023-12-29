import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdef', 7)

export async function POST(req: Request) {
  try {
    const { dni }: { dni: number } = await req.json()

    const invitado = await prisma.invitado.create({
      data: {
        dni,
        clave: nanoid(),
      },
    })

    return NextResponse.json(invitado.clave)
  } catch (error) {
    return NextResponse.json('Server error', { status: 500 })
  }
}
