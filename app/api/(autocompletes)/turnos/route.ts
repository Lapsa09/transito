import { NextResponse } from 'next/server'

const turnos = ['MA_ANA', 'TARDE', 'NOCHE']

export function GET() {
  return NextResponse.json(turnos)
}
