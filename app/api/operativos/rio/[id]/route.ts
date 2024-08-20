import { riodb } from '@/drizzle'
import { registros } from '@/drizzle/schema/nuevo_control'
import { barrios } from '@/drizzle/schema/schema'
import { rioInputPropsSchema } from '@/schemas/rio'
import { load } from 'cheerio'
import { eq } from 'drizzle-orm'
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(_: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const auto = await riodb.query.registros.findFirst({
    where: (registro, { eq }) => eq(registro.id, Number(id)),
    with: {
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
    }

    return NextResponse.json(res)
  }
  return NextResponse.json(null)
}

const radicacion = async (body: z.infer<typeof rioInputPropsSchema>) => {
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
      const _res = await riodb.query.barrios.findFirst({
        where: (barrio, { like }) => like(barrio.barrio, provincia),
      })
      return _res!.idBarrio
    } else {
      if (localidad === 'CAPITAL FEDERAL') {
        return 51
      } else {
        const _res = await riodb.query.barrios.findFirst({
          where: (barrio, { like }) => like(barrio.barrio, localidad),
        })
        if (!_res) {
          const [nuevoBarrio] = await riodb
            .insert(barrios)
            .values({
              barrio: localidad,
            })
            .returning({ idBarrio: barrios.idBarrio })
          return nuevoBarrio.idBarrio
        } else {
          return _res.idBarrio
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

  const json = await req.json()
  const body = rioInputPropsSchema.parse(json)

  const id_barrio = await radicacion(body)

  await riodb
    .update(registros)
    .set({
      dominio: body.dominio,
      hora: body.hora,
      idZona: body.zona.idZona,
      idLocalidad: id_barrio,
    })
    .where(eq(registros.id, Number(id)))
  return NextResponse.json('Exito')
}
