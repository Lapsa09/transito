import { db, riodb } from '@/drizzle'
import { operativos, registros, zonas } from '@/drizzle/schema/nuevo_control'
import { Barrio, barrios, turnos } from '@/drizzle/schema/schema'
import { RioDTO, rioDTO } from '@/DTO/operativos/rio'
import { authOptions } from '@/lib/auth'
import { filterColumn } from '@/lib/filter-column'
import { searchParamsSchema } from '@/schemas/form'
import { rioInputPropsSchema } from '@/schemas/rio'
import { load } from 'cheerio'
import { and, asc, count, desc, eq, like, or, SQL, sql } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const operativoPaseo = async (body: z.infer<typeof rioInputPropsSchema>) => {
  const { fecha, turno, lp } = body

  const [op] = await db
    .select()
    .from(operativos)
    .where(
      and(
        eq(operativos.fecha, sql`to_date(${fecha},YYYY-MM-DD)`),
        eq(operativos.turno, turno),
        eq(operativos.lp, +lp),
      ),
    )

  if (!op) {
    const [{ id_op }] = await db
      .insert(operativos)
      .values({
        fecha: sql`to_date(${fecha},'YYYY-MM-DD')`,
        turno,
        lp: +lp,
      })
      .returning({ id_op: operativos.idOp })

    return id_op
  } else {
    return op.idOp
  }
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
      const [_res] = await db
        .select()
        .from(barrios)
        .where(eq(barrios.barrio, provincia))
      return _res.idBarrio
    } else {
      if (localidad === 'CAPITAL FEDERAL') {
        return 51
      } else {
        const [_res] = await db
          .select()
          .from(barrios)
          .where(like(barrios.barrio, localidad))
        if (!_res) {
          const [nuevoBarrio] = await db
            .insert(barrios)
            .values({ barrio: localidad })
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

const searchRioParamsSchema = searchParamsSchema.merge(
  z.object({
    fecha: z.string().optional(),
    dominio: z.string().optional(),
    turno: z.enum(turnos.enumValues).optional(),
    zona_infractor: z.string().optional(),
    zona: z.string().optional(),
  }),
)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const input = searchRioParamsSchema.parse(
    Object.fromEntries(new URLSearchParams(searchParams).entries()),
  )
  const {
    fecha,
    turno,
    dominio,
    zona_infractor,
    operator,
    page,
    sort,
    per_page,
    zona,
  } = input

  const expressions: (SQL<unknown> | undefined)[] = [
    !!fecha
      ? filterColumn({
          column: operativos.fecha,
          value: fecha,
          isDate: true,
        })
      : undefined,
    turno
      ? filterColumn({
          column: operativos.turno,
          value: turno,
          isSelectable: true,
        })
      : undefined,
    dominio
      ? filterColumn({ column: registros.dominio, value: dominio })
      : undefined,
    zona_infractor
      ? filterColumn({
          column: registros.idLocalidad,
          value: zona_infractor,
          isSelectable: true,
        })
      : undefined,
    zona
      ? filterColumn({
          column: registros.idZona,
          value: zona,
          isSelectable: true,
        })
      : undefined,
  ]

  const where =
    !operator || operator === 'and' ? and(...expressions) : or(...expressions)

  const [column, order] = (sort?.split('.').filter(Boolean) ?? [
    'id',
    'desc',
  ]) as [keyof RioDTO, 'asc' | 'desc']

  const sortColumns = () => {
    if (!column) return desc(registros.id)
    if (column in registros) {
      return order === 'asc'
        ? asc(registros[column as keyof typeof registros.$inferSelect])
        : desc(registros[column as keyof typeof registros.$inferSelect])
    }
    if (column in operativos) {
      return order === 'asc'
        ? asc(operativos[column as keyof typeof operativos.$inferSelect])
        : desc(operativos[column as keyof typeof operativos.$inferSelect])
    }
    if (column in zonas) {
      return order === 'asc'
        ? asc(zonas[column as keyof typeof zonas.$inferSelect])
        : desc(zonas[column as keyof typeof zonas.$inferSelect])
    }
    return order === 'asc'
      ? asc(barrios[column as keyof Barrio])
      : desc(barrios[column as keyof Barrio])
  }

  const rioPromise = rioDTO({
    page,
    per_page,
    orderBy: sortColumns(),
    where,
  })

  const totalPromise = db
    .select({ count: count() })
    .from(registros)
    .where(where)
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(barrios, eq(registros.idLocalidad, barrios.idBarrio))
    .innerJoin(zonas, eq(registros.idZona, zonas.idZona))
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(barrios, eq(registros.idLocalidad, barrios.idBarrio))
    .innerJoin(zonas, eq(registros.idZona, zonas.idZona))
    .innerJoin(operativos, eq(registros.idOperativo, operativos.idOp))
    .innerJoin(barrios, eq(registros.idLocalidad, barrios.idBarrio))
    .execute()
    .then(([{ count }]) => count)

  const [data, total] = await Promise.all([rioPromise, totalPromise])

  return NextResponse.json({
    data,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const data = rioInputPropsSchema.parse(json)
  const id_operativo = await operativoPaseo(data)

  const repetido = await riodb.query.registros.findFirst({
    where: (registro, { eq }) =>
      and(
        eq(registro.dominio, data.dominio),
        eq(registro.idOperativo, id_operativo),
      ),
  })

  if (repetido) {
    return NextResponse.json('El dominio ya fue cargado', { status: 400 })
  }

  const id_localidad = await radicacion(data)
  const user = await getServerSession(authOptions)

  await db.insert(registros).values({
    hora: data.hora,
    dominio: data.dominio,
    idOperativo: id_operativo,
    idZona: data.zona.idZona,
    idLocalidad: id_localidad,
    lpcarga: user?.user?.legajo,
  })
  revalidateTag('rio')
  return NextResponse.json('Exito')
}
