import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { FormMotosProps } from '@/types'
import { resolucion, Prisma } from '@prisma/client'
import { geoLocation } from '@/services'
import { revalidateTag } from 'next/cache'

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
        turno,
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
            turno,
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
            turno,
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filterParams: Record<string, string> = [
    ...searchParams.getAll('filter'),
  ].reduce((acc, curr) => {
    const [id, value] = curr.split('=')
    return { ...acc, [id]: value }
  }, {})
  const where: Prisma.motos_registrosWhereInput = {
    dominio: {
      contains: filterParams.dominio ?? '',
      mode: 'insensitive',
    },
    operativo: {
      qth: {
        contains: filterParams.qth ?? '',
        mode: 'insensitive',
      },
      localidad: {
        barrio: {
          contains: filterParams.localidad ?? '',
          mode: 'insensitive',
        },
      },
      fecha:
        filterParams.fecha && new Date(filterParams.fecha).getDate()
          ? {
              equals: new Date(filterParams.fecha),
            }
          : undefined,
    },
    motivos: {
      some: {
        motivo: {
          motivo: {
            contains: filterParams.motivo ?? '',
            mode: 'insensitive',
          },
        },
      },
    },
    tipo_licencias: {
      tipo: {
        contains: filterParams.tipo_licencias ?? '',
        mode: 'insensitive',
      },
    },
    zona_infractor: {
      barrio: {
        contains: filterParams.zona_infractor ?? '',
        mode: 'insensitive',
      },
    },
  }
  const pageIndex = parseInt(req.nextUrl.searchParams.get('page') || '0')

  const [sortBy, sort] = (searchParams.get('sortBy') ?? 'id=desc').split(
    '=',
  ) as [string, Prisma.SortOrder]
  const orderBy: Prisma.motos_registrosOrderByWithRelationInput =
    sortBy in prisma.operativos_operativos.fields
      ? {
          operativo: {
            [sortBy]: sort,
          },
        }
      : sortBy === 'zona_infractor'
      ? {
          zona_infractor: {
            barrio: sort,
          },
        }
      : sortBy === 'tipo_licencia'
      ? {
          tipo_licencias: {
            tipo: sort,
          },
        }
      : { [sortBy]: sort }

  const motosPromise = prisma.motos_registros.findMany({
    include: {
      operativo: { include: { localidad: true } },
      motivos: {
        include: {
          motivo: true,
        },
      },
      tipo_licencias: true,
      zona_infractor: true,
    },
    orderBy,
    skip: pageIndex * 10,
    take: 10,
    where: Object.keys(filterParams).length ? where : undefined,
  })

  const totalPromise = prisma.motos_registros.count({
    where: Object.keys(filterParams).length ? where : undefined,
  })

  const [motos, total] = await Promise.all([motosPromise, totalPromise])
  return NextResponse.json({
    data: motos,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(req: Request) {
  const body: FormMotosProps = await req.json()

  const id_operativo = await operativoMotos(body)

  const repetido = await prisma.motos_registros.findFirst({
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

  const moto = await prisma.motos_registros.create({
    data: {
      acta: Number(body.acta) || null,
      dominio: body.dominio,
      fechacarga: new Date(),
      licencia: Number(body.licencia) || null,
      lpcarga: body.lpcarga,
      resolucion: body.resolucion || resolucion.PREVENCION,
      id_operativo,
      id_licencia: body.tipo_licencia?.id_tipo,
      id_zona_infractor: body.zona_infractor?.id_barrio,
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
  if (body.motivos) {
    const motivos = []
    for (const motivo of body.motivos) {
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
  revalidateTag('motos')
  return NextResponse.json(moto)
}
