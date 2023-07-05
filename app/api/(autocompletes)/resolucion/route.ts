import { NextResponse } from 'next/server'

const resolucion = [
  { resolucion: 'PREVENCION' },
  { resolucion: 'ACTA' },
  { resolucion: 'REMITIDO' },
]

export function GET() {
  return NextResponse.json(resolucion)
}
