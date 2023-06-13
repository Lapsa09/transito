import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function GET() {
  const motos = await prisma.motos_registros.findMany({
    include: {
      operativos: { include: { vicente_lopez: true } },
      moto_motivo: true,
      tipo_licencias: true,
      zona_infractor: true,
    },
  })

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(motos, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    )
  )
}
