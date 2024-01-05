import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdef', 7)

export async function POST() {
  try {
    const examen = await prisma.examen.create({
      data: {
        clave: nanoid(),
      },
    })

    return NextResponse.json(examen.clave)
  } catch (error) {
    return NextResponse.json('Server error', { status: 500 })
  }
}
