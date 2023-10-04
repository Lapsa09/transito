import prisma from '@/lib/prismadb'
import { KilometrajeVehiculo } from '@/types/logistica'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params

  const vehiculo = await prisma.kilometraje_vehiculos.findMany({
    where: {
      patente,
    },
    include: {
      movil: true,
    },
  })

  return NextResponse.json(vehiculo)
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
      fecha: body.fecha,
      filtro_aceite: body.filtro_aceite,
      interno: body.interno,
      kit_distribucion: body.kit_distribucion,
      kit_poly_v: body.kit_poly_v,
      km: body.km,
      proximo_cambio_distribucion: body.proximo_cambio_distribucion,
      proximo_cambio_filtro: body.proximo_cambio_filtro,
      proximo_cambio_poly_v: body.proximo_cambio_poly_v,
    },
    include: {
      movil: true,
    },
  })

  return NextResponse.json(vehiculo)
}
