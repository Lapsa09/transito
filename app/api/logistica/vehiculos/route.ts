import { db } from '@/drizzle'
import { Movil, movil } from '@/drizzle/schema/logistica'
import { vehiculosDTO } from '@/DTO/logistica/vehiculos'
import { searchParamsSchema } from '@/schemas/form'
import { vehiculoInputSchema } from '@/schemas/logistica'
import { count } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const { page, per_page } = searchParamsSchema.parse(searchParams)
  const vehiculosPromise = vehiculosDTO({ page, per_page })

  const totalPromise = db
    .select({ count: count() })
    .from(movil)
    .execute()
    .then((res) => res[0].count)

  const [vehiculos, total] = await Promise.all([vehiculosPromise, totalPromise])

  return NextResponse.json({
    data: vehiculos,
    pages: Math.ceil(total / per_page).toString(),
  })
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()

    const body = vehiculoInputSchema.parse(json)

    await db.insert(movil).values({
      patente: body.patente,
      idUso: body.uso.idUso,
      idDependencia: body.dependencia.idDependencia,
      idTipoVehiculo: body.tipo_vehiculo.idTipo,
      marca: body.marca,
      modelo: body.modelo,
      año: body.año,
      noChasis: body.nro_chasis,
      empresaSeguimiento: body.empresa_seguimiento,
      idMegatrans: body.id_megatrans,
      nroMovil: body.nro_movil,
      planRenovacion: body.plan_renovacion,
      tipoCombustible: body.tipo_combustible,
      tipoMotor: body.tipo_motor,
    })

    revalidateTag('vehiculos')
    return NextResponse.json('Exito')
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
