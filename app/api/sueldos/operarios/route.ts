import { sueldosdb } from '@/drizzle'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const operarios = await sueldosdb.query.operarios.findMany({
      with: {
        servicios: {
          with: {
            servicios: {
              with: {
                cliente: {
                  columns: {
                    cliente: true,
                  },
                },
              },
            },
          },
        },
      },
      where: (operario, { ne }) => ne(operario.legajo, 1),
    })

    return NextResponse.json(operarios)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
