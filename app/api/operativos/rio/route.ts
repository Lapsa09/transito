import prisma from '@/lib/prismadb'
import { RioFormProps } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { DateTime } from 'luxon'
import { turnos } from '@prisma/client'
import { load } from 'cheerio'

const operativoPaseo = async (body: RioFormProps) => {
  const { fecha, turno, lp } = body

  const op = await prisma.nuevo_control_operativos.findFirst({
    where: {
      fecha: new Date(fecha),
      turno: turno === 'MAÑANA' ? turnos.MA_ANA : turno,
      lp: +lp,
    },
  })

  if (!op) {
    const { id_op } = await prisma.nuevo_control_operativos.create({
      data: {
        fecha: new Date(fecha),
        turno: turno === 'MAÑANA' ? turnos.MA_ANA : turno,
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

export async function GET() {
  const res = await prisma.nuevo_control_registros.findMany({
    include: {
      operativo: true,
      zona: true,
      barrio: true,
    },
    orderBy: {
      id: 'desc',
    },
  })

  return NextResponse.json(res)
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
  _hora.setHours(...data.hora.split(':'))

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

  return NextResponse.json(res)
}
