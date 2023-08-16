import { NextResponse } from 'next/server'

const resolucion = ['PREVENCION', 'ACTA', 'REMITIDO']

export function GET() {
  return NextResponse.json(resolucion)
}
