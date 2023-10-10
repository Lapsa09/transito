import prisma from '@/lib/prismadb'
import { Vehiculo } from '@/types/logistica'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
  const vehiculos = await prisma.movil.findMany({
    include: {
      uso: true,
      dependencia: true,
      tipo_vehiculo: true,
    },
  })

  return NextResponse.json(vehiculos)
}

export async function POST(req: NextRequest) {
  const body: Vehiculo = await req.json()

  const vehiculo = await prisma.movil.create({
    data: {
      uso: {
        connect: {
          id_uso: body.uso.id_uso,
        },
      },
      dependencia: {
        connect: {
          id_dependencia: body.dependencia.id_dependencia,
        },
      },
      tipo_vehiculo: {
        connect: {
          id_tipo: body.tipo_vehiculo.id_tipo,
        },
      },
      patente: body.patente,
      marca: body.marca,
      modelo: body.modelo,
      a_o: +body.a_o,
      no_chasis: body.no_chasis,
      empresa_seguimiento: body.empresa_seguimiento,
      id_megatrans: body.id_megatrans,
      nro_movil: body.nro_movil,
      plan_renovacion: body.plan_renovacion,
      tipo_combustible: body.tipo_combustible,
      tipo_motor: body.tipo_motor ? +body.tipo_motor : null,
    },
    include: {
      uso: true,
      dependencia: true,
      tipo_vehiculo: true,
    },
  })

  return NextResponse.json(vehiculo)
}
