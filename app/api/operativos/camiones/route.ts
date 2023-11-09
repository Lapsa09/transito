import { NextResponse } from 'next/server'
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
      turno: turno === 'MAÑANA' ? turnos.MA_ANA : turno,
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
          turno: turno === 'MAÑANA' ? turnos.MA_ANA : turno,
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
          turno: turno === 'MAÑANA' ? turnos.MA_ANA : turno,
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
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ),
  )
}

export async function POST(req: Request) {
  try {
    const body: FormCamionesProps = await req.json()

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

    const _hora = new Date(data.fecha)
    // @ts-ignore
    _hora.setUTCHours(...data.hora.split(':'))

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
