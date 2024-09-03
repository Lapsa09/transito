import { rindeExamenDTO } from '@/DTO/examen'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const examen = await rindeExamenDTO({ id })

    return NextResponse.json(examen)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
