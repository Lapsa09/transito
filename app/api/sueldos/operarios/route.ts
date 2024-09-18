import { sueldosdb } from '@/drizzle'
import { operarios } from '@/drizzle/schema/sueldos'
import { searchParamsSchema } from '@/schemas/form'
import { count, ne } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { page, per_page } = searchParamsSchema.parse(
      req.nextUrl.searchParams,
    )
    const operariosList = await sueldosdb.query.operarios.findMany({
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
      limit: per_page,
      offset: (page - 1) * per_page,
    })

    const total = await sueldosdb
      .select({ count: count() })
      .from(operarios)
      .where(ne(operarios.legajo, 1))
      .execute()
      .then((res) => res[0].count)

    return NextResponse.json({
      data: operariosList,
      pages: Math.ceil(total / per_page),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
