import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/drizzle'
import {
  clientes,
  operarios,
  operariosServicios,
  servicios,
} from '@/drizzle/schema/sueldos'
import { eq, sql } from 'drizzle-orm'

type Operario = {
  legajo: number
  nombre: string
  horaInicio: Date
  horaFin: Date
  aCobrar: number
  cancelado: boolean
  memo: string
  recibo: number
  id: number
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const agenda = await db
    .select({
      fechaServicio: servicios.fechaServicio,
      idCliente: clientes.idCliente,
      cliente: clientes.cliente,
      memo: servicios.memo,
      feriado: servicios.feriado,
      idServicio: servicios.idServicio,
      importeServicio: servicios.importeServicio,
      operarios: sql<
        Operario[]
      >`json_agg(json_build_object('legajo',${operarios.legajo},'nombre',${operarios.nombre},
      'horaInicio',${operariosServicios.horaInicio},'horaFin',${operariosServicios.horaFin},'aCobrar',${operariosServicios.aCobrar},'cancelado',${operariosServicios.cancelado},'memo',${operariosServicios.memo},'recibo',${operariosServicios.recibo},'id',${operariosServicios.id}
    ))`.as('operarios'),
    })
    .from(servicios)
    .where(eq(servicios.fechaServicio, body.fecha))
    .innerJoin(clientes, eq(servicios.idCliente, clientes.idCliente))
    .leftJoin(
      operariosServicios,
      eq(servicios.idServicio, operariosServicios.idServicio),
    )
    .leftJoin(operarios, eq(operariosServicios.legajo, operarios.legajo))

  return NextResponse.json(agenda)
}
