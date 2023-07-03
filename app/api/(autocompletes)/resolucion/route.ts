import { NextResponse } from 'next/server'

enum resolucion {
  ACTA,
  PREVENCION,
  REMITIDO,
}

export function GET() {
  return NextResponse.json(resolucion)
}
