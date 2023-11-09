import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { FormMotosProps } from '@/types'
import { resolucion, turnos } from '@prisma/client'
import { geoLocation } from '@/services'

const operativoMotos = async (body: FormMotosProps) => {
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

  try {
    const op = await prisma.motos_operativos.findFirst({
      where: {
        fecha: new Date(fecha),
        qth,
        turno: turno === 'MAÑANA' ? turnos.MA_ANA : turno,
        legajo_a_cargo: +legajo_a_cargo,
        legajo_planilla: +legajo_planilla,
        seguridad,
        hora: _hora,
        direccion_full,
      },
      select: {
        id_op: true,
      },
    })

    if (!op) {
      const geocodificado = await prisma.motos_operativos.findFirst({
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
        const { id_op } = await prisma.motos_operativos.create({
          data: {
            fecha: new Date(fecha),
            qth,
            turno: turno === 'MAÑANA' ? turnos.MA_ANA : turno,
            legajo_a_cargo: +legajo_a_cargo,
            legajo_planilla: +legajo_planilla,
            id_zona: localidad?.id_barrio,
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
        const { id_op } = await prisma.motos_operativos.create({
          data: {
            fecha: new Date(fecha),
            qth,
            turno: turno === 'MAÑANA' ? turnos.MA_ANA : turno,
            legajo_a_cargo: +legajo_a_cargo,
            legajo_planilla: +legajo_planilla,
            id_zona: localidad?.id_barrio,
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
  } catch (error) {
    console.log(error)
  }
}

export async function GET() {
  const motos = await prisma.motos_registros.findMany({
    include: {
      operativo: { include: { localidad: true } },
      motivos: true,
      tipo_licencias: true,
      zona_infractor: true,
    },
  })

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(motos, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ),
  )
}

export async function POST(req: Request) {
  const body: FormMotosProps = await req.json()

  const data = { ...body, id_operativo: await operativoMotos(body) }

  const repetido = await prisma.motos_registros.findFirst({
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

  const moto = await prisma.motos_registros.create({
    data: {
      acta: data.acta ? +data.acta : null,
      dominio: data.dominio,
      fechacarga: new Date(),
      licencia: data.licencia ? +data.licencia : null,
      lpcarga: data.lpcarga,
      resolucion: data.resolucion || resolucion.PREVENCION,
      id_operativo: data.id_operativo,
      mes: new Date(data.fecha).getMonth() + 1,
      semana: Math.ceil(new Date(data.fecha).getDate() / 7),
      id_licencia: data.tipo_licencia?.id_tipo,
      id_zona_infractor: data.zona_infractor?.id_barrio,
    },
    include: {
      operativo: {
        include: { localidad: true },
      },
      motivos: { include: { motivo: true } },
      tipo_licencias: true,
      zona_infractor: true,
    },
  })
  if (data.motivos) {
    const motivos = []
    for (const motivo of data.motivos) {
      const nuevo_motivo = await prisma.moto_motivo.create({
        data: {
          id_motivo: motivo.id_motivo,
          id_registro: moto.id,
        },
        include: {
          motivo: true,
        },
      })
      motivos.push(nuevo_motivo)
    }

    moto.motivos = motivos
  }

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(moto, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ),
  )
}
