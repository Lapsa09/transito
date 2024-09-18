import { db } from '@/drizzle'
import {
  clientes,
  operarios,
  operariosServicios,
  servicios,
} from '@/drizzle/schema/sueldos'
import { searchParamsSchema } from '@/schemas/form'
import { count, eq } from 'drizzle-orm'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { page, per_page } = searchParamsSchema.parse(
      req.nextUrl.searchParams,
    )
    const serviciosList = await db
      .select({
        nombre: operarios.nombre,
        legajo: operarios.legajo,
        horaInicio: operariosServicios.horaInicio,
        horaFin: operariosServicios.horaFin,
        aCobrar: operariosServicios.aCobrar,
        cancelado: operariosServicios.cancelado,
      })
      .from(operariosServicios)
      .innerJoin(operarios, eq(operariosServicios.legajo, operarios.legajo))
      .offset((page - 1) * per_page)
      .limit(per_page)

    const total = await db
      .select({ count: count() })
      .from(servicios)
      .execute()
      .then((data) => data[0].count)

    return NextResponse.json({
      data: serviciosList,
      pages: Math.ceil(total / per_page),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
