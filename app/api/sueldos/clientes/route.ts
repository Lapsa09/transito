import { db } from '@/drizzle'
import {
  clientes,
  operarios,
  operariosServicios,
  recibos,
  servicios,
} from '@/drizzle/schema/sueldos'
import { eq, sql, sum } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

type Operario = {
  legajo: number
  nombre: string
}

type Servicio = {
  idServicio: number
  fechaServicio: string
  importeServicio: number
  idCliente: number
  operarios: Operario[]
}

type Historial = {
  mes: number
  año: number
  acopio: number
  gastos: number
  servicios: Servicio[]
}

const operariosInServicio = db
  .select({
    idServicio: operariosServicios.idServicio,
    fechaServicio: servicios.fechaServicio,
    importeServicio: servicios.importeServicio,
    idCliente: servicios.idCliente,
    operarios: sql<Operario[]>`json_agg(json_build_object(
    'legajo', ${operarios.legajo},
    'nombre', ${operarios.nombre}
    ))`.as('operarios'),
  })
  .from(operariosServicios)
  .innerJoin(operarios, eq(operarios.legajo, operariosServicios.legajo))
  .innerJoin(servicios, eq(servicios.idServicio, operariosServicios.idServicio))
  .groupBy(
    operariosServicios.idServicio,
    servicios.fechaServicio,
    servicios.importeServicio,
    servicios.idCliente,
  )
  .as('operariosInServicio')

const historial = db
  .select({
    acopio: sum(recibos.acopio).mapWith(Number).as('acopio_historial'),
    gastos: sum(servicios.importeServicio).mapWith(Number).as('gastos'),
    mes: sql<number>`extract(month from ${servicios.fechaServicio})`.as('mes'),
    año: sql<number>`extract(year from ${servicios.fechaServicio})`.as('año'),
    idCliente: servicios.idCliente,
    servicios: sql<Servicio[]>`json_agg(json_build_object(
    'idServicio', ${operariosInServicio.idServicio},
    'fechaServicio', ${operariosInServicio.fechaServicio},
    'importeServicio', ${operariosInServicio.importeServicio},
    'idCliente', ${operariosInServicio.idCliente},
    'operarios', ${operariosInServicio.operarios}
  )) as servicios
    `.as('servicios'),
  })
  .from(servicios)
  .innerJoin(clientes, eq(clientes.idCliente, servicios.idCliente))
  .innerJoin(recibos, eq(recibos.idCliente, clientes.idCliente))
  .innerJoin(
    operariosInServicio,
    eq(operariosInServicio.idServicio, servicios.idServicio),
  )
  .groupBy(
    servicios.idCliente,
    sql`extract(year from ${servicios.fechaServicio})`,
    sql`extract(month from ${servicios.fechaServicio})`,
  )
  .as('historial')

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  if (searchParams.has('id_cliente')) {
  }
  try {
    const clientesList = await db
      .select({
        id_cliente: clientes.idCliente,
        cliente: clientes.cliente,
        recibos: sql`json_agg(json_build_object(
          recibo, ${recibos.recibo},
          fecha, ${recibos.fechaRecibo},
          acopio,${recibos.acopio},
          importeRecibo, ${recibos.importeRecibo},
          idCliente, ${recibos.idCliente}
      ))`,
        // historial: jsonAgg({
        //   mes: historial.mes,
        //   año: historial.año,
        //   acopio: historial.acopio,
        //   gastos: historial.gastos,
        //   servicios: historial.servicios,
        // }),
        historial: sql<Historial[]>`json_agg(json_build_object(
          'mes', ${historial.mes},
          'año', ${historial.año},
          'acopio', ${historial.acopio},
          'gastos', ${historial.gastos},
          'servicios', ${historial.servicios}))`.as('historial'),
      })
      .from(clientes)
      .leftJoin(recibos, eq(clientes.idCliente, recibos.idCliente))
      .leftJoin(servicios, eq(servicios.idCliente, clientes.idCliente))
      .innerJoin(historial, eq(clientes.idCliente, historial.idCliente))
      .groupBy(clientes.cliente, clientes.idCliente)

    return NextResponse.json(clientesList)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
