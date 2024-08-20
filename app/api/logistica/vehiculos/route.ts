import { db } from '@/drizzle'
import { Movil, movil } from '@/drizzle/schema/logistica'
import { vehiculosDTO } from '@/DTO/logistica/vehiculos'
import { searchParamsSchema } from '@/schemas/form'
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
    const body: Movil = await req.json()

    await db.insert(movil).values({
      idUso: body.idUso,
      idDependencia: body.idDependencia,
      idTipoVehiculo: body.idTipoVehiculo,
      patente: body.patente,
      marca: body.marca,
      modelo: body.modelo,
      año: body.año,
      noChasis: body.noChasis,
      empresaSeguimiento: body.empresaSeguimiento,
      idMegatrans: body.idMegatrans,
      nroMovil: body.nroMovil,
      planRenovacion: body.planRenovacion,
      tipoCombustible: body.tipoCombustible,
      tipoMotor: body.tipoMotor,
    })

    revalidateTag('vehiculos')
    return NextResponse.json('Exito')
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
