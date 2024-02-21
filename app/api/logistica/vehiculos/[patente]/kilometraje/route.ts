import prisma from '@/lib/prismadb'
import { KilometrajeVehiculo } from '@/types/logistica'
import { DateTime } from 'luxon'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params
  const { searchParams } = req.nextUrl
  const pageIndex = parseInt(searchParams.get('page') ?? '0')

  const vehiculo = await prisma.kilometraje_vehiculos.findMany({
    where: {
      patente,
    },
    include: {
      movil: true,
    },
    skip: pageIndex * 10,
    take: 10,
  })

  const total = await prisma.kilometraje_vehiculos.count({ where: { patente } })

  return NextResponse.json({
    data: vehiculo,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const body: KilometrajeVehiculo = await req.json()
  const { patente } = params
  const vehiculo = await prisma.kilometraje_vehiculos.create({
    data: {
      movil: {
        connect: {
          patente,
        },
      },
      fecha: DateTime.fromFormat(String(body.fecha), 'yyyy-MM-dd').toISO(),
      filtro_aceite: body.filtro_aceite ? +body.filtro_aceite : null,
      kit_distribucion: body.kit_distribucion ? +body.kit_distribucion : null,
      kit_poly_v: body.kit_poly_v ? +body.kit_poly_v : null,
      km: body.km ? +body.km : null,
      proximo_cambio_distribucion: body.proximo_cambio_distribucion
        ? +body.proximo_cambio_distribucion
        : null,
      proximo_cambio_filtro: body.proximo_cambio_filtro
        ? +body.proximo_cambio_filtro
        : null,
      proximo_cambio_poly_v: body.proximo_cambio_poly_v
        ? +body.proximo_cambio_poly_v
        : null,
    },
    include: {
      movil: true,
    },
  })

  return NextResponse.json(vehiculo)
}
