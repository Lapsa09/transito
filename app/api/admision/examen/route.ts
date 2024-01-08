import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdef', 7)

export async function GET() {
  try {
    const examen = await prisma.examen.create({
      data: {
        clave: nanoid(),
      },
    })

    return NextResponse.json(examen)
  } catch (error) {
    return NextResponse.json('Server error', { status: 500 })
  }
}
