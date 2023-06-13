import { NextResponse } from 'next/server'

enum turnos {
  MAÑANA,
  TARDE,
  NOCHE,
}

export function GET() {
  return NextResponse.json(turnos)
}
