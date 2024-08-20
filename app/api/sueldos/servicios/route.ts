import { db } from '@/drizzle'
import {
  clientes,
  operarios,
  operariosServicios,
  recibos,
  servicios,
} from '@/drizzle/schema/sueldos'
import { ServiciosFormProps } from '@/types'
import { eq, sql } from 'drizzle-orm'
import { NextResponse, NextRequest } from 'next/server'

type Operario = {
  nombre: string
  legajo: number
  horaInicio: string
  horaFin: string
  aCobrar: number
}

export async function GET() {
  try {
    const serviciosList = await db
      .select({
        idServicio: servicios.idServicio,
        fechaServicio: servicios.fechaServicio,
        feriado: servicios.feriado,
        importeServicio: servicios.importeServicio,
        cliente: clientes.cliente,
        memo: servicios.memo,
        operarios: sql<
          Operario[]
        >`json_agg(json_build_object('nombre', ${operarios.nombre}, 'legajo', ${operarios.legajo}, 'horaInicio', ${operariosServicios.horaInicio}, 'horaFin', ${operariosServicios.horaFin}, 'aCobrar', ${operariosServicios.aCobrar}, 'cancelado', ${operariosServicios.cancelado}))`.as(
          'operarios',
        ),
      })
      .from(servicios)
      .innerJoin(clientes, eq(servicios.idCliente, clientes.idCliente))
      .innerJoin(
        operariosServicios,
        eq(servicios.idServicio, operariosServicios.idServicio),
      )
      .innerJoin(operarios, eq(operariosServicios.legajo, operarios.legajo))
      .groupBy(
        servicios.idServicio,
        servicios.fechaServicio,
        servicios.feriado,
        servicios.importeServicio,
        clientes.cliente,
        servicios.memo,
      )

    return NextResponse.json(serviciosList)
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
