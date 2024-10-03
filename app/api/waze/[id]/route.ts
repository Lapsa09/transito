import { NextRequest, NextResponse } from 'next/server'
import { wazedb } from '@/drizzle'
import { dia } from '@/drizzle/schema/waze'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    const reportes = await wazedb.query.reporte.findMany({
      where(fields, operators) {
        return operators.eq(fields.idDia, +id)
      },
      columns: {
        id: true,
      },
      with: {
        recorridos: {
          with: {
            calles: true,
            nivelTrafico: true,
          },
        },
        horarios: true,
        dia: true,
      },
      orderBy(_, operators) {
        return operators.desc(dia.fecha)
      },
    })
    return NextResponse.json(reportes)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
