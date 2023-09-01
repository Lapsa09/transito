import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const liquidaciones =
      await prisma.$queryRaw`select extract(month from fecha_servicio) as mes, extract(year from fecha_servicio) as año, count(*) as total from sueldos.servicios group by mes, año order by año desc, mes desc`

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(liquidaciones, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      )
    )
  } catch (error: any) {
    console.log(error.message)
    NextResponse.json('Server error', { status: 500 })
  }
}
