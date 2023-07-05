import { NextResponse } from 'next/server'

const seguridad = [
  { seguridad: 'POLICIA' },
  { seguridad: 'PREFECTURA' },
  { seguridad: 'SECRETARIA DE SEGURIDAD' },
  { seguridad: 'NO' },
]

export function GET() {
  return NextResponse.json(seguridad)
}
