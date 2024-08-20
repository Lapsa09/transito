import { NextRequest, NextResponse } from 'next/server'
import { ServiciosFormProps } from '@/types'
import { db } from '@/drizzle'
import {
  clientes,
  operarios,
  operariosServicios,
  recibos,
  servicios,
} from '@/drizzle/schema/sueldos'
import { and, eq, sql } from 'drizzle-orm'

type Operario = {
  nombre: string
  legajo: number
  horaInicio: string
  horaFin: string
  aCobrar: number
}

type Recibo = {
  recibo: number
  fechaRecibo: Date
  importe: number
  acopio: number
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const [_servicios] = await db
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
      recibos: sql<
        Recibo[]
      >`json_agg(json_build_object('recibo', ${recibos.recibo}, 'fechaRecibo', ${recibos.fechaRecibo}, 'importe', ${recibos.importeRecibo},'acopio',${recibos.acopio}))`.as(
        'recibos',
      ),
    })
    .from(servicios)
    .where(eq(servicios.idServicio, +params.id))
    .innerJoin(clientes, eq(servicios.idCliente, clientes.idCliente))
    .leftJoin(recibos, eq(clientes.idCliente, recibos.idCliente))
    .leftJoin(
      operariosServicios,
      eq(servicios.idServicio, operariosServicios.idServicio),
    )
    .leftJoin(operarios, eq(operariosServicios.legajo, operarios.legajo))

  return NextResponse.json(_servicios)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body: ServiciosFormProps = await req.json()

  await db
    .update(servicios)
    .set({
      idCliente: body.cliente.idCliente,
      fechaServicio: body.fecha_servicio,
      feriado: body.feriado,
      importeServicio: body.importe_servicio,
      memo: body.memo,
    })
    .where(eq(servicios.idServicio, +params.id))

  for (const operario of body.operarios) {
    const [id] = await db
      .select({
        id: operariosServicios.id,
      })
      .from(operariosServicios)
      .where(
        and(
          eq(operariosServicios.id, +params.id),
          eq(operariosServicios.legajo, operario.operario!.legajo),
        ),
      )
    if (id) {
      await db
        .update(operariosServicios)
        .set({
          horaInicio: operario.hora_inicio,
          horaFin: operario.hora_fin,
          aCobrar: operario.a_cobrar,
          cancelado: operario.cancelado,
          legajo: operario.operario?.legajo,
        })
        .where(and(eq(operariosServicios.id, id.id)))
    } else {
      await db.insert(operariosServicios).values({
        idServicio: +params.id,
        legajo: operario.operario?.legajo,
        horaInicio: operario.hora_inicio,
        horaFin: operario.hora_fin,
        aCobrar: operario.a_cobrar,
        cancelado: false,
      })
    }
  }

  return NextResponse.json('Servicio editado')
}
