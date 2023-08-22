import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { FormCamionesProps } from '@/types'
import { resolucion } from '@prisma/client'

const operativoCamiones = async (body: FormCamionesProps) => {
  const { fecha, qth, turno, legajo, localidad } = body

  const op = await prisma.camiones_operativos.findFirst({
    select: { id_op: true },
    where: {
      fecha: new Date(fecha),
      direccion: qth,
      turno,
      legajo: legajo.toString(),
      id_localidad: localidad.id_barrio,
      direccion_full: `${qth}, ${localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
    },
  })

  if (!op) {
    const { id_op } = await prisma.camiones_operativos.create({
      data: {
        fecha: new Date(fecha),
        direccion: qth,
        turno,
        legajo: legajo.toString(),
        id_localidad: localidad.id_barrio,
        direccion_full: `${qth}, ${localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`,
      },
      select: {
        id_op: true,
      },
    })

    return id_op
  } else {
    return op.id_op
  }
}

export async function GET() {
  const autos = await prisma.camiones_registros.findMany({
    include: {
      motivo: { select: { motivo: true } },
      localidad_destino: true,
      localidad_origen: true,
      operativo: {
        include: { localidad: { select: { barrio: true, cp: true } } },
      },
    },
    orderBy: { id: 'desc' },
  })

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(autos, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    )
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const data = {
      ...body,
      id_operativo: await operativoCamiones(body),
      fechacarga: new Date(),
      mes: new Date(body.fecha).getMonth() + 1,
      semana: Math.ceil(new Date(body.fecha).getDate() / 7),
    }

    const repetido = await prisma.operativos_registros.findFirst({
      where: {
        dominio: data.dominio,
        id_operativo: data.id_operativo,
      },
    })

    if (repetido) {
      return NextResponse.json('El dominio ya fue ingresado el mismo dia', {
        status: 401,
      })
    }

    const camion = await prisma.camiones_registros.create({
      data: {
        acta: data.acta,
        dominio: data.dominio.toUpperCase(),
        licencia: data.licencia,
        lpcarga: data.lpcarga,
        resolucion: data.resolucion || resolucion.PREVENCION,
        mes: new Date(data.fecha).getMonth() + 1,
        semana: Math.ceil(new Date(data.fecha).getDate() / 7),
        id_motivo: data.motivo?.id_motivo,
        id_operativo: data.id_operativo,
        origen: data.origen,
        destino: data.destino,
        id_localidad_origen: data.localidad_origen?.id_barrio,
        id_localidad_destino: data.localidad_destino?.id_barrio,
        remito: data.remito,
        carga: data.carga,
        hora: data.hora,
      },
      include: {
        operativo: {
          include: { localidad: { select: { barrio: true, cp: true } } },
        },
        motivo: { select: { motivo: true } },
        localidad_origen: { select: { barrio: true } },
        localidad_destino: { select: { barrio: true } },
      },
    })

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(camion, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      )
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
