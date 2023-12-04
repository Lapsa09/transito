import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { FormAutosProps } from '@/types'
import { del, resolucion, resultado, turnos, seguridad } from '@prisma/client'
import { geoLocation } from '@/services'

const es_del = async (zona_infractor: string) => {
  try {
    await prisma.vicente_lopez.findFirstOrThrow({
      select: { barrio: true },
      where: { barrio: zona_infractor },
    })
    return del.VILO
  } catch (error) {
    return del.FUERA_DEL_MUNICIPIO
  }
}

const alcoholemia = (graduacion_alcoholica: string): resultado => {
  if (
    +graduacion_alcoholica === 0 ||
    !graduacion_alcoholica ||
    +graduacion_alcoholica === 0.0
  )
    return resultado.NEGATIVA
  else if (+graduacion_alcoholica > 0.05 && +graduacion_alcoholica < 0.5)
    return resultado.NO_PUNITIVA
  else return resultado.PUNITIVA
}

const operativoAlcoholemia = async (body: FormAutosProps) => {
  const {
    fecha,
    qth,
    turno,
    legajo_a_cargo,
    legajo_planilla,
    localidad,
    seguridad,
    hora,
  } = body

  const _hora = new Date(fecha)
  // @ts-ignore
  _hora.setUTCHours(...hora.split(':'))
  const direccion_full = `${qth}, ${localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`

  const op = await prisma.operativos_operativos.findFirst({
    select: { id_op: true },
    where: {
      fecha: new Date(fecha),
      qth,
      turno,
      legajo_a_cargo: +legajo_a_cargo,
      legajo_planilla: +legajo_planilla,
      id_localidad: localidad.id_barrio,
      seguridad,
      hora: _hora,
      direccion_full,
    },
  })

  if (!op) {
    const geocodificado = await prisma.operativos_operativos.findFirst({
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
      const { id_op } = await prisma.operativos_operativos.create({
        data: {
          fecha: new Date(fecha),
          qth,
          turno,
          legajo_a_cargo: +legajo_a_cargo,
          legajo_planilla: +legajo_planilla,
          id_localidad: localidad.id_barrio,
          seguridad,
          hora: _hora,
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
      const { id_op } = await prisma.operativos_operativos.create({
        data: {
          fecha: new Date(fecha),
          qth,
          turno,
          legajo_a_cargo: +legajo_a_cargo,
          legajo_planilla: +legajo_planilla,
          id_localidad: localidad.id_barrio,
          seguridad,
          hora: _hora,
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
  const autos = await prisma.operativos_registros.findMany({
    include: {
      motivo: { select: { motivo: true } },
      tipo_licencia: { select: { tipo: true, vehiculo: true } },
      zona_infractor: { select: { barrio: true } },
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
    const body: FormAutosProps = await req.json()

    const id_operativo = await operativoAlcoholemia(body)

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

    const auto = await prisma.operativos_registros.create({
      data: {
        acta: Number(body.acta) || null,
        dominio: body.dominio.toUpperCase(),
        graduacion_alcoholica: Number(body.graduacion_alcoholica),
        licencia: Number(body.licencia) || null,
        lpcarga: body.lpcarga,
        resolucion: body.resolucion || resolucion.PREVENCION,
        id_licencia: body.tipo_licencia?.id_tipo,
        id_zona_infractor: body.zona_infractor?.id_barrio,
        id_motivo: body.motivo?.id_motivo,
        id_operativo,
      },
      include: {
        operativo: {
          include: { localidad: { select: { barrio: true, cp: true } } },
        },
        motivo: { select: { motivo: true } },
        tipo_licencia: { select: { tipo: true, vehiculo: true } },
        zona_infractor: { select: { barrio: true } },
      },
    })

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(auto, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ),
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
