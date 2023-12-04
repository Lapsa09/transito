import { NextResponse } from 'next/server'

const seguridad = [
  {
    id: 'POLICIA',
    label: 'POLICIA',
  },
  {
    id: 'PREFECTURA',
    label: 'PREFECTURA',
  },
  {
    id: 'SECRETARIA_DE_SEGURIDAD',
    label: 'SECRETARIA DE SEGURIDAD',
  },
  {
    id: 'NO',
    label: 'NO',
  },
]

export function GET() {
  return NextResponse.json(seguridad)
}
