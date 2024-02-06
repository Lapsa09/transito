import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { FormCamionesProps } from '@/types'
import { resolucion, turnos } from '@prisma/client'
import { geoLocation } from '@/services'

const operativoCamiones = async (body: FormCamionesProps) => {
  const { fecha, qth, turno, legajo, localidad } = body

  const direccion_full = `${qth}, ${localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`

  const op = await prisma.camiones_operativos.findFirst({
    select: { id_op: true },
    where: {
      fecha: new Date(fecha),
      direccion: qth,
      turno,
      legajo: legajo.toString(),
      id_localidad: localidad.id_barrio,
      direccion_full,
    },
  })

  if (!op) {
    const geocodificado = await prisma.camiones_operativos.findFirst({
      where: {
        direccion_full,
        latitud: {
          not: null,
        },
        longitud: {
          not: null,
        },
      },
      select: {
        direccion_full: true,
        latitud: true,
        longitud: true,
      },
    })
    if (!geocodificado) {
      const { latitud, longitud } = await geoLocation(direccion_full)
      const { id_op } = await prisma.camiones_operativos.create({
        data: {
          fecha: new Date(fecha),
          direccion: qth,
          turno,
          legajo: legajo.toString(),
          localidad: {
            connect: {
              id_barrio: localidad.id_barrio,
            },
          },
          direccion_full,
          latitud,
          longitud,
        },
        select: {
          id_op: true,
        },
      })

      return id_op
    } else {
      const { id_op } = await prisma.camiones_operativos.create({
        data: {
          fecha: new Date(fecha),
          direccion: qth,
          turno,
          legajo: legajo.toString(),
          localidad: {
            connect: {
              id_barrio: localidad.id_barrio,
            },
          },
          direccion_full,
          latitud: geocodificado.latitud,
          longitud: geocodificado.longitud,
        },
        select: {
          id_op: true,
        },
      })

      return id_op
    }
  } else {
    return op.id_op
  }
}

export async function GET(req: NextRequest) {
  const pageIndex = parseInt(req.nextUrl.searchParams.get('page') || '0')
  const total = await prisma.camiones_registros.count()
  const camiones = await prisma.camiones_registros.findMany({
    include: {
      motivo: { select: { motivo: true } },
      localidad_destino: true,
      localidad_origen: true,
      operativo: {
        include: { localidad: { select: { barrio: true, cp: true } } },
      },
    },
    orderBy: { id: 'desc' },
    skip: pageIndex * 10,
    take: 10,
  })

  return NextResponse.json({
    data: camiones,
    pages: Math.ceil(total / 10),
  })
}

export async function POST(req: Request) {
  try {
    const body: FormCamionesProps = await req.json()

    const id_operativo = await operativoCamiones(body)

    const repetido = await prisma.operativos_registros.findFirst({
      where: {
        dominio: body.dominio,
        id_operativo,
      },
    })

    if (repetido) {
      return NextResponse.json('El dominio ya fue ingresado el mismo dia', {
        status: 401,
      })
    }

    const _hora = new Date(body.fecha)
    // @ts-ignore
    _hora.setUTCHours(...body.hora.split(':'))

    const camion = await prisma.camiones_registros.create({
      data: {
        acta: body.acta,
        dominio: body.dominio.toUpperCase(),
        licencia: body.licencia,
        lpcarga: body.lpcarga,
        resolucion: body.resolucion || resolucion.PREVENCION,
        id_motivo: body.motivo?.id_motivo,
        id_operativo,
        origen: body.origen,
        destino: body.destino,
        id_localidad_origen: body.localidad_origen?.id_barrio,
        id_localidad_destino: body.localidad_destino?.id_barrio,
        remito: body.remito,
        carga: body.carga,
        hora: _hora,
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
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ),
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
