import { NextResponse } from 'next/server'

const turnos = [
  {
    id: 'MA_ANA',
    label: 'MAÑANA',
  },
  {
    id: 'TARDE',
    label: 'TARDE',
  },
  {
    id: 'NOCHE',
    label: 'NOCHE',
  },
]

export function GET() {
  return NextResponse.json(turnos)
}
