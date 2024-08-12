import { db } from '@/drizzle/db'
import { examenes } from '@/drizzle/schema/examen'
import { generatePassword } from '@/utils/misc'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const clave = generatePassword()
    const examen = await db.insert(examenes).values({
      clave,
      hora: new Date(),
    })
    revalidateTag('examenes')
    return NextResponse.json(examen)
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json('Ya existen estos examenes', { status: 401 })
    }

    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
