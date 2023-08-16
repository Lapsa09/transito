import { NextResponse } from 'next/server'

const turnos = ['MAÑANA', 'TARDE', 'NOCHE']

export function GET() {
  return NextResponse.json(turnos)
}
