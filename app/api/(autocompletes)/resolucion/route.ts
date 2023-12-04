import { NextResponse } from 'next/server'

const resolucion = [
  {
    id: 'PREVENCION',
    label: 'PREVENCION',
  },
  {
    id: 'ACTA',
    label: 'ACTA',
  },
  {
    id: 'REMITIDO',
    label: 'REMITIDO',
  },
]

export function GET() {
  return NextResponse.json(resolucion)
}
