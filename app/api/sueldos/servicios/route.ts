import { db } from '@/drizzle'
import {
  clientes,
  operariosServicios,
  recibos,
  servicios,
} from '@/drizzle/schema/sueldos'
import { filterColumn } from '@/lib/filter-column'
import { searchParamsSchema } from '@/schemas/form'
import { ServiciosFormProps } from '@/types'
import { formatDate } from '@/utils/misc'
import { and, count, eq, gte, lte, or, sql, SQL } from 'drizzle-orm'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const { page, per_page, cliente, operator, operario, mes, año } =
      searchParamsSchema
        .merge(
          z.object({
            cliente: z.string().optional(),
            operario: z.string().optional(),
            mes: z.string().optional(),
            año: z.string().optional(),
          }),
        )
        .parse(
          Object.fromEntries(
            new URLSearchParams(req.nextUrl.searchParams).entries(),
          ),
        )

    const fromDay =
      mes && año
        ? sql`to_date(${año}-${mes}-01, 'yyyy-mm-dd')`.mapWith(formatDate)
        : undefined
    const toDay =
      mes && año
        ? sql`to_date(${año}-${mes}-31, 'yyyy-mm-dd')`.mapWith(formatDate)
        : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      fromDay && toDay
        ? and(
            gte(servicios.fechaServicio, fromDay),
            lte(servicios.fechaServicio, toDay),
          )
        : undefined,
      cliente
        ? filterColumn({
            column: clientes.cliente,
            value: cliente,
            isSelectable: true,
          })
        : undefined,
      operario
        ? filterColumn({
            column: operariosServicios.legajo,
            value: operario,
            isSelectable: true,
          })
        : undefined,
    ]

    const where =
      !operator || operator === 'and' ? and(...expressions) : or(...expressions)

    const serviciosList = await db
      .select({
        idServicio: servicios.idServicio,
        fechaServicio: servicios.fechaServicio,
        feriado: servicios.feriado,
        importeServicio: servicios.importeServicio,
        cliente: clientes.cliente,
        memo: servicios.memo,
      })
      .from(servicios)
      .where(where)
      .innerJoin(clientes, eq(servicios.idCliente, clientes.idCliente))
      .offset((page - 1) * per_page)
      .limit(per_page)

    const total = await db
      .select({ count: count() })
      .from(servicios)
      .where(where)
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

export async function POST(req: NextRequest) {
  const body: ServiciosFormProps = await req.json()

  const [{ idServicio }] = await db
    .insert(servicios)
    .values({
      fechaServicio: body.fecha_servicio,
      feriado: body.feriado,
      importeServicio: body.importe_servicio,
      idCliente: body.cliente.idCliente,
    })
    .returning({ idServicio: servicios.idServicio })

  if (body.hay_recibo && body.recibo) {
    await db.insert(recibos).values({
      recibo: body.recibo,
      acopio: body.importe_recibo! - body.importe_servicio,
      idCliente: body.cliente.idCliente,
      fechaRecibo: body.fecha_recibo!,
      importeRecibo: body.importe_recibo,
    })
  }

  for (const operario of body.operarios) {
    await db.insert(operariosServicios).values({
      horaInicio: operario.hora_inicio,
      horaFin: operario.hora_fin,
      aCobrar: operario.a_cobrar,
      cancelado: false,
      idServicio,
      legajo: operario.operario?.legajo,
    })
  }

  return NextResponse.json('Servicio creado', {
    status: 201,
  })
}
