import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

function generatePassword() {
  var length = 7,
    charset = 'abcdefghijklmnopqrstuvwxyz0123456789',
    retVal = ''
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}

export async function POST() {
  try {
    const clave = generatePassword()
    const examen = await prisma.examen.create({
      data: {
        clave,
      },
    })

    return NextResponse.json(examen)
  } catch (error) {
    return NextResponse.json('Server error', { status: 500 })
  }
}
