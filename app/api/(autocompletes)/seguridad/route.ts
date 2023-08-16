import { NextResponse } from 'next/server'

const seguridad = ['POLICIA', 'PREFECTURA', 'SECRETARIA DE SEGURIDAD', 'NO']

export function GET() {
  return NextResponse.json(seguridad)
}
