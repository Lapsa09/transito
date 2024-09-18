import { db } from '@/drizzle'
import { examenes } from '@/drizzle/schema/examen'
import { generatePassword } from '@/utils/misc'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const clave = generatePassword()
    const [examen] = await db
      .insert(examenes)
      .values({
        clave,
        hora: new Date(),
      })
      .returning()
    revalidateTag('examenes')
    return NextResponse.json(examen)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
