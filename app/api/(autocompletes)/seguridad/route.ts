import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

enum seguridad {
  POLICIA,
  PREFECTURA,
  SECRETARIA_DE_SEGURIDAD = 'SECRETARIA DE SEGURIDAD',
  NO = 'NO',
}

export async function GET() {
  const zonas = await prisma.vicente_lopez.findMany()

  return NextResponse.json(seguridad)
}
