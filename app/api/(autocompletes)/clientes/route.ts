import { db } from '@/drizzle'
import { clientes, recibos } from '@/drizzle/schema/sueldos'
import { eq, sum } from 'drizzle-orm'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const clientesList = await db
    .select({
      idCliente: clientes.idCliente,
      cliente: clientes.cliente,
      acopio: sum(recibos.acopio).mapWith(Number).as('acopio'),
    })
    .from(clientes)
    .leftJoin(recibos, eq(clientes.idCliente, recibos.idCliente))
    .groupBy(clientes.idCliente, clientes.cliente)

  return NextResponse.json(clientesList)
}

export async function POST(req: NextRequest) {
  const body: { cliente: string } = await req.json()

  const cliente = await db
    .insert(clientes)
    .values({
      cliente: body.cliente,
    })
    .returning()

  return NextResponse.json(cliente)
}
