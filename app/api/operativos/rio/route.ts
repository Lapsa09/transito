import prisma from '@/lib/prismadb'
import { RioFormProps } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { DateTime } from 'luxon'
import { load } from 'cheerio'
import { Prisma } from '@prisma/client'
import { revalidateTag } from 'next/cache'

const operativoPaseo = async (body: RioFormProps) => {
  const { fecha, turno, lp } = body

  const op = await prisma.nuevo_control_operativos.findFirst({
    where: {
      fecha: new Date(fecha),
      turno,
      lp: +lp,
    },
  })

  if (!op) {
    const { id_op } = await prisma.nuevo_control_operativos.create({
      data: {
        fecha: new Date(fecha),
        turno,
        lp: +lp,
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

const radicacion = async (body: RioFormProps) => {
  try {
    const { dominio } = body

    const data = await fetch(
      'https://www.dnrpa.gov.ar/portal_dnrpa/radicacion/consinve_amq.php',
      {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'es-ES,es;q=0.9',
          'cache-control': 'max-age=0',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua':
            '"Chromium";v="116", "Not)A;Brand";v="24", "Opera";v="102"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
        },
        referrer: 'https://www.dnrpa.gov.ar/portal_dnrpa/radicacion2.php',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `dominio=${dominio}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
      },
    )

    const html = await data.text()
    const $ = load(html)

    const secs = $('table').eq(3)
    const fonts = secs.find('font')
    const localidad = fonts.eq(1).text().trim()
    const provincia = fonts.eq(3).text().trim()

    if (provincia !== 'BUENOS AIRES' && provincia !== 'CAPITAL FEDERAL') {
      const _res = await prisma.barrios.findFirst({
        where: {
          barrio: provincia,
        },
      })
      return _res!.id_barrio
    } else {
      if (localidad === 'CAPITAL FEDERAL') {
        return 51
      } else {
        const _res = await prisma.barrios.findFirst({
          where: {
            barrio: {
              contains: localidad,
            },
          },
        })
        if (!_res) {
          const nuevoBarrio = await prisma.barrios.create({
            data: {
              barrio: localidad,
            },
          })
          return nuevoBarrio.id_barrio
        } else {
          return _res.id_barrio
        }
      }
    }
  } catch (error) {
    console.log(error)
    throw new Error('Server error')
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
  const where: Prisma.nuevo_control_registrosWhereInput = {
    dominio: {
      contains: filterParams.dominio ?? '',
      mode: 'insensitive',
    },
    operativo: {
      fecha:
        filterParams.fecha && new Date(filterParams.fecha).getDate()
          ? {
              equals: new Date(filterParams.fecha),
            }
          : undefined,
    },
    zona: {
      zona: {
        contains: filterParams.zona ?? '',
        mode: 'insensitive',
      },
    },
    barrio: {
      barrio: {
        contains: filterParams.barrio ?? '',
        mode: 'insensitive',
      },
    },
  }
  const pageIndex = parseInt(req.nextUrl.searchParams.get('page') ?? '0')

  const [sortBy, sort] = (searchParams.get('sortBy') ?? 'id=desc').split(
    '=',
  ) as [string, Prisma.SortOrder]
  const orderBy: Prisma.nuevo_control_registrosOrderByWithRelationInput =
    sortBy in prisma.operativos_operativos.fields
      ? {
          operativo: {
            [sortBy]: sort,
          },
        }
      : sortBy === 'zona_infractor'
      ? {
          barrio: {
            barrio: sort,
          },
        }
      : sortBy === 'zona'
      ? {
          zona: {
            zona: sort,
          },
        }
      : { [sortBy]: sort }
  const rioPromise = prisma.nuevo_control_registros.findMany({
    include: {
      operativo: true,
      zona: true,
      barrio: true,
    },
    orderBy,
    skip: pageIndex * 10,
    take: 10,
    where: Object.keys(filterParams).length ? where : undefined,
  })

  const totalPromise = prisma.nuevo_control_registros.count({
    where: Object.keys(filterParams).length ? where : undefined,
  })

  const [data, total] = await Promise.all([rioPromise, totalPromise])

  return NextResponse.json({
    data,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(req: NextRequest) {
  const data: RioFormProps = await req.json()

  const id_operativo = await operativoPaseo(data)
  const repetido = await prisma.nuevo_control_registros.findFirst({
    where: {
      dominio: data.dominio,
      id_operativo: id_operativo,
    },
  })

  if (repetido) {
    return NextResponse.json('El dominio ya fue cargado', { status: 400 })
  }

  const id_localidad = await radicacion(data)

  const _hora = new Date(data.fecha)
  // @ts-ignore
  _hora.setUTCHours(...data.hora.split(':'))

  const res = await prisma.nuevo_control_registros.create({
    data: {
      hora: _hora,
      dominio: data.dominio,
      id_operativo,
      id_zona: data.zona.id_zona,
      id_localidad,
      fechacarga: DateTime.now().toSQL(),
    },
    include: {
      zona: true,
      barrio: true,
      operativo: true,
    },
  })
  revalidateTag('rio')
  return NextResponse.json(res)
}
