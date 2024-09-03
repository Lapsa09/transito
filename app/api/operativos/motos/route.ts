import { MotosDTO, motosDTO } from '@/DTO/operativos/motos'
import { autosdb, db } from '@/drizzle'
import {
  motoMotivo,
  Operativo,
  operativos,
  Registro,
  registros,
} from '@/drizzle/schema/motos'
import {
  Barrio,
  barrios,
  Motivo,
  motivos,
  resolucion,
  resolucionSchema,
  TipoLicencia,
  tipoLicencias,
  turnos,
  VicenteLopez,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { authOptions } from '@/lib/auth'
import { filterColumn } from '@/lib/filter-column'
import { searchParamsSchema } from '@/schemas/form'
import { motosInputPropsSchema } from '@/schemas/motos'
import { geoLocation } from '@/services'
import { and, asc, count, desc, eq, isNotNull, or, sql, SQL } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { getServerSession } from 'next-auth'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const operativoMotos = async (body: z.infer<typeof motosInputPropsSchema>) => {
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

  const direccion_full = `${qth}, ${localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`

  const [op] = await db
    .select({ id_op: operativos.idOp })
    .from(operativos)
    .where(
      and(
        eq(operativos.fecha, sql<Date>`to_date(${fecha}, 'yyyy-mm-dd')`),
        eq(operativos.qth, qth),
        eq(operativos.turno, turno),
        eq(operativos.legajoACargo, +legajo_a_cargo),
        eq(operativos.legajoPlanilla, +legajo_planilla),
        eq(operativos.idZona, localidad.idBarrio),
        eq(operativos.seguridad, seguridad),
        eq(operativos.hora, hora),
        eq(operativos.direccionFull, direccion_full),
      ),
    )

  if (!op) {
    const geocodificado = await db
      .select({
        direccion_full: operativos.direccionFull,
        latitud: operativos.latitud,
        longitud: operativos.longitud,
      })
      .from(operativos)
      .where(
        and(
          eq(operativos.direccionFull, direccion_full),
          isNotNull(operativos.latitud),
          isNotNull(operativos.longitud),
        ),
      )
    if (!geocodificado.length) {
      const { latitud, longitud } = await geoLocation(direccion_full)

      const [{ id_op }] = await db
        .insert(operativos)
        .values({
          fecha: sql<Date>`to_date(${fecha}, 'yyyy-mm-dd')`,
          qth,
          turno,
          legajoACargo: +legajo_a_cargo,
          legajoPlanilla: +legajo_planilla,
          idZona: localidad.idBarrio,
          seguridad,
          hora,
          direccionFull: direccion_full,
          latitud,
          longitud,
        })
        .returning({ id_op: operativos.idOp })

      return id_op
    } else {
      const [{ id_op }] = await db
        .insert(operativos)
        .values({
          fecha: sql<Date>`to_date(${fecha}, 'yyyy-mm-dd')`,
          qth,
          turno,
          legajoACargo: +legajo_a_cargo,
          legajoPlanilla: +legajo_planilla,
          idZona: localidad.idBarrio,
          seguridad,
          hora,
          direccionFull: direccion_full,
          latitud: geocodificado[0].latitud,
          longitud: geocodificado[0].longitud,
        })
        .returning({ id_op: operativos.idOp })

      return id_op
    }
  } else {
    return op.id_op
  }
}

const searchMotosParamsSchema = searchParamsSchema.merge(
  z.object({
    fecha: z.string().date().optional(),
    dominio: z.string().optional(),
    turno: z.enum(turnos.enumValues).optional(),
    motivo: z.string().optional(),
    zona_infractor: z.string().optional(),
    localidad: z.string().optional(),
    tipo_licencia: z.string().optional(),
    resolucion: z.enum(resolucion.enumValues).optional(),
  }),
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const input = searchMotosParamsSchema.parse(
      Object.fromEntries(new URLSearchParams(searchParams).entries()),
    )

    const {
      page,
      per_page,
      sort,
      dominio,
      fecha,
      turno,
      motivo,
      zona_infractor,
      localidad,
      tipo_licencia,
      operator,
      resolucion,
    } = input

    const expressions: (SQL<unknown> | undefined)[] = [
      !!fecha
        ? eq(operativos.fecha, sql<Date>`to_date(${fecha}, 'yyyy-mm-dd')`)
        : undefined,
      turno
        ? filterColumn({
            column: operativos.turno,
            value: turno,
            isSelectable: true,
          })
        : undefined,
      localidad
        ? filterColumn({
            column: operativos.idZona,
            value: localidad,
            isSelectable: true,
          })
        : undefined,
      dominio
        ? filterColumn({ column: registros.dominio, value: dominio })
        : undefined,
      motivo
        ? filterColumn({
            column: motoMotivo.idMotivo,
            value: motivo,
            isSelectable: true,
          })
        : undefined,
      zona_infractor
        ? filterColumn({
            column: registros.idZonaInfractor,
            value: zona_infractor,
            isSelectable: true,
          })
        : undefined,
      tipo_licencia
        ? filterColumn({
            column: registros.idLicencia,
            value: tipo_licencia,
            isSelectable: true,
          })
        : undefined,
      resolucion
        ? filterColumn({
            column: registros.resolucion,
            value: resolucion,
            isSelectable: true,
          })
        : undefined,
    ]

    const where =
      !operator || operator === 'and' ? and(...expressions) : or(...expressions)

    const [column, order] = (sort?.split('.').filter(Boolean) ?? [
      'id',
      'desc',
    ]) as [keyof MotosDTO, 'asc' | 'desc']

    const sortColumns = () => {
      if (!column) return desc(registros.id)

      if (column in registros) {
        return order === 'asc'
          ? asc(registros[column as keyof Registro])
          : desc(registros[column as keyof Registro])
      } else if (column in operativos) {
        return order === 'asc'
          ? asc(operativos[column as keyof Operativo])
          : desc(operativos[column as keyof Operativo])
      } else if (column in motivos) {
        return order === 'asc'
          ? asc(motivos[column as keyof Motivo])
          : desc(motivos[column as keyof Motivo])
      } else if (column in tipoLicencias) {
        return order === 'asc'
          ? asc(tipoLicencias[column as keyof TipoLicencia])
          : desc(tipoLicencias[column as keyof TipoLicencia])
      } else if (column in vicenteLopez) {
        return order === 'asc'
          ? asc(vicenteLopez[column as keyof VicenteLopez])
          : desc(vicenteLopez[column as keyof VicenteLopez])
      }
      return order === 'asc'
        ? asc(barrios[column as keyof Barrio])
        : desc(barrios[column as keyof Barrio])
    }
    const autosPromise = motosDTO({
      page,
      per_page,
      orderBy: sortColumns(),
      where,
    })

    const totalPromise = db
      .select({ count: count() })
      .from(registros)
      .where(where)
      .execute()
      .then(([{ count }]) => count)

    const [autos, total] = await Promise.all([autosPromise, totalPromise])

    return NextResponse.json({
      data: autos,
      pages: Math.ceil(total / per_page).toString(),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const json = await req.json()
  const body = motosInputPropsSchema
    .merge(
      z.object({
        motivos: z.array(createSelectSchema(motivos)).optional(),
      }),
    )
    .safeParse(json)

  if (!body.success) {
    return NextResponse.json('Campos requeridos', { status: 400 })
  }
  const id_operativo = await operativoMotos(body.data)

  const repetido = await autosdb.query.registros.findFirst({
    where: (registro, { eq }) =>
      and(
        eq(registro.dominio, body.data?.dominio),
        eq(registro.idOperativo, id_operativo),
      ),
  })
  if (repetido) {
    return NextResponse.json('El dominio ya fue ingresado el mismo dia', {
      status: 401,
    })
  }

  const user = await getServerSession(authOptions)

  const [moto] = await db
    .insert(registros)
    .values({
      acta: body.data.acta,
      dominio: body.data.dominio.toUpperCase(),
      licencia: body.data.licencia,
      lpcarga: user?.user?.legajo,
      resolucion: body.data.resolucion || resolucionSchema.enum.PREVENCION,
      idLicencia: body.data.tipo_licencia?.idTipo,
      idZonaInfractor: body.data.zona_infractor?.idBarrio,
      idOperativo: id_operativo,
    })
    .returning({
      id: registros.id,
    })

  for (const motivo of body.data.motivos || []) {
    await db.insert(motoMotivo).values({
      idRegistro: moto.id,
      idMotivo: motivo.idMotivo,
    })
  }

  revalidateTag('motos')
  return NextResponse.json('Exito')
}
