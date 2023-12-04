import prisma from '@/lib/prismadb'
import { RioFormProps } from '@/types'
import { turnos } from '@prisma/client'
import { load } from 'cheerio'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const auto = await prisma.nuevo_control_registros.findUnique({
    where: { id: Number(id) },
    include: {
      operativo: true,
      barrio: true,
      zona: true,
    },
  })

  if (auto) {
    const { operativo, ...rest } = auto

    const res = {
      ...rest,
      ...operativo,
      fecha: operativo?.fecha?.toISOString().split('T')[0],
      hora: rest?.hora?.toLocaleTimeString(),
    }

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(res, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ),
    )
  }
  return NextResponse.json(null)
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

export async function PUT(req: NextRequest, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const body: RioFormProps = await req.json()

  const id_barrio = await radicacion(body)

  const moto = await prisma.nuevo_control_registros.update({
    where: { id: Number(id) },
    data: {
      dominio: body.dominio,
      hora: body.hora,
      zona: {
        connect: {
          id_zona: body.zona.id_zona,
        },
      },
      barrio: {
        connect: {
          id_barrio,
        },
      },
      operativo: {
        update: {
          fecha: body.fecha,
          lp: +body.lp,
          turno: body.turno,
        },
      },
    },
    include: {
      operativo: true,
      barrio: true,
      zona: true,
    },
  })
  return NextResponse.json(
    JSON.parse(
      JSON.stringify(moto, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ),
  )
}
