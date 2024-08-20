import { Operativo, Registro } from '@/drizzle/schema/operativos'
import { autosdb, db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/operativos'
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
import { AutosDTO, autosDTO } from '@/DTO/operativos/autos'
import { filterColumn } from '@/lib/filter-column'
import { geoLocation } from '@/services'
import { and, asc, count, desc, eq, isNotNull, or, sql, SQL } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { autosInputPropsSchema } from '@/schemas/autos'

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  fecha: z.string().date().optional(),
  operator: z.enum(['and', 'or']).default('and'),
  dominio: z.string().optional(),
  turno: z.enum(turnos.enumValues).optional(),
  motivo: z.string().optional(),
  zona_infractor: z.string().optional(),
  localidad: z.string().optional(),
  tipo_licencia: z.string().optional(),
  resolucion: z.enum(resolucion.enumValues).optional(),
})

const operativoAlcoholemia = async (
  body: z.infer<typeof autosInputPropsSchema>,
) => {
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
        eq(operativos.idLocalidad, localidad.idBarrio),
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
          idLocalidad: localidad.idBarrio,
          seguridad,
          hora: sql<Date>`to_timestamp(${hora}, 'HH24:MI')`,
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
          idLocalidad: localidad.idBarrio,
          seguridad,
          hora: sql<Date>`to_timestamp(${hora}, 'HH24:MI')`,
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const input = searchParamsSchema.parse(
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
            column: operativos.idLocalidad,
            value: localidad,
            isSelectable: true,
          })
        : undefined,
      dominio
        ? filterColumn({ column: registros.dominio, value: dominio })
        : undefined,
      motivo
        ? filterColumn({ column: registros.idMotivo, value: motivo })
        : undefined,
      zona_infractor
        ? filterColumn({
            column: registros.idZonaInfractor,
            value: zona_infractor,
          })
        : undefined,
      tipo_licencia
        ? filterColumn({ column: registros.idLicencia, value: tipo_licencia })
        : undefined,
      resolucion
        ? filterColumn({ column: registros.resolucion, value: resolucion })
        : undefined,
    ]

    const where =
      !operator || operator === 'and' ? and(...expressions) : or(...expressions)

    const [column, order] = (sort?.split('.').filter(Boolean) ?? [
      'id',
      'desc',
    ]) as [keyof AutosDTO, 'asc' | 'desc']

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
    const autosPromise = autosDTO({
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

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const body = autosInputPropsSchema.safeParse(json)

    if (!body.success) {
      return NextResponse.json('Campos requeridos', { status: 400 })
    }

    const id_operativo = await operativoAlcoholemia(body.data)

    const repetido = await autosdb.query.registros.findFirst({
      where: (registro, { eq }) =>
        and(
          eq(registro.dominio, body.data.dominio),
          eq(registro.idOperativo, id_operativo),
        ),
    })

    if (repetido) {
      return NextResponse.json('El dominio ya fue ingresado el mismo dia', {
        status: 401,
      })
    }

    await db.insert(registros).values({
      acta: body.data.acta ? +body.data.acta : null,
      dominio: body.data.dominio.toUpperCase(),
      graduacionAlcoholica: body.data.graduacion_alcoholica,
      licencia: Number(body.data.licencia) || null,
      lpcarga: body.data.lpcarga,
      resolucion: body.data.resolucion || resolucionSchema.enum.PREVENCION,
      idLicencia: body.data.tipo_licencia?.idTipo,
      idZonaInfractor: body.data.zona_infractor?.idBarrio,
      idMotivo: body.data.motivo?.idMotivo,
      idOperativo: id_operativo,
    })

    revalidateTag('autos')
    return NextResponse.json('Exito')
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
