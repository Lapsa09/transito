import { resultadoDTO } from '@/DTO/examen'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const examen = await resultadoDTO({ id: params.id })

  return NextResponse.json(examen)
}
