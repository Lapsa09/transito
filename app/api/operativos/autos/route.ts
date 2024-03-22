import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { FormAutosProps } from '@/types'
import { resolucion, Prisma } from '@prisma/client'
import { geoLocation } from '@/services'
import { revalidateTag } from 'next/cache'

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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filterParams: Record<string, string> = [
    ...searchParams.getAll('filter'),
  ].reduce((acc, curr) => {
    const [id, value] = curr.split('=')
    return { ...acc, [id]: value }
  }, {})

  const where: Prisma.operativos_registrosWhereInput = {
    dominio: filterParams.dominio
      ? {
          contains: filterParams.dominio,
          mode: 'insensitive',
        }
      : undefined,
    operativo:
      filterParams.qth || filterParams.localidad || filterParams.fecha
        ? {
            qth: filterParams.qth
              ? {
                  contains: filterParams.qth,
                  mode: 'insensitive',
                }
              : undefined,
            localidad: filterParams.barrio
              ? {
                  barrio: {
                    contains: filterParams.barrio,
                    mode: 'insensitive',
                  },
                }
              : undefined,
            fecha:
              filterParams.fecha && new Date(filterParams.fecha).getDate()
                ? {
                    equals: new Date(filterParams.fecha),
                  }
                : undefined,
          }
        : undefined,
    motivo: filterParams.motivo
      ? {
          motivo: {
            contains: filterParams.motivo,
            mode: 'insensitive',
          },
        }
      : undefined,
    tipo_licencia: filterParams.tipo_licencia
      ? {
          tipo: {
            contains: filterParams.tipo_licencia,
            mode: 'insensitive',
          },
        }
      : undefined,
    zona_infractor: filterParams.zona_infractor
      ? {
          barrio: {
            contains: filterParams.zona_infractor,
            mode: 'insensitive',
          },
        }
      : undefined,
  }
  const pageIndex = parseInt(searchParams.get('page') ?? '0')

  const [sortBy, sort] = (searchParams.get('sortBy') ?? 'id=desc').split(
    '=',
  ) as [string, Prisma.SortOrder]
  const orderBy: Prisma.operativos_registrosOrderByWithRelationInput =
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
        : sortBy === 'motivo'
          ? {
              motivo: {
                motivo: sort,
              },
            }
          : sortBy === 'tipo_licencia'
            ? {
                tipo_licencia: {
                  tipo: sort,
                },
              }
            : { [sortBy]: sort }

  const autosPromise = prisma.operativos_registros.findMany({
    include: {
      motivo: { select: { motivo: true } },
      tipo_licencia: { select: { tipo: true, vehiculo: true } },
      zona_infractor: { select: { barrio: true } },
      operativo: {
        include: { localidad: { select: { barrio: true, cp: true } } },
      },
    },
    where: Object.keys(filterParams).length ? where : undefined,
    orderBy,
    skip: pageIndex * 10,
    take: 10,
  })

  const totalPromise = prisma.operativos_registros.count({
    where: Object.keys(filterParams).length ? where : undefined,
  })

  const [autos, total] = await Promise.all([autosPromise, totalPromise])

  return NextResponse.json({
    data: autos,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(req: NextRequest) {
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
    revalidateTag('autos')
    return NextResponse.json(auto)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
