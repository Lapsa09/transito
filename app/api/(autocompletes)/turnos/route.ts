import { NextResponse } from 'next/server'

const turnos = [{ turno: 'MAÑANA' }, { turno: 'TARDE' }, { turno: 'NOCHE' }]

export function GET() {
  return NextResponse.json(turnos)
}
