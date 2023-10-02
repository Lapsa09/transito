import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

const xprisma = prisma.$extends({
  result: {
    dia: {
      mes: {
        needs: { fecha: true },
        compute({ fecha }) {
          return new Date(fecha).getMonth()
        },
      },
    },
  },
})

export async function GET() {
  try {
    const dias =
      await prisma.$executeRaw`select extract(month from fecha)as mes,json_agg(json_build_object('id',id,'fecha',fecha)) as fechas from waze.dia group by mes order by mes asc`

    return NextResponse.json(dias)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
