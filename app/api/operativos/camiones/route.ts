import { NextRequest, NextResponse } from 'next/server'
import { FormCamionesProps } from '@/types'
import { geoLocation } from '@/services'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import {
  Barrio,
  Motivo,
  motivos,
  resolucion,
  turnos,
  VicenteLopez,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { and, asc, count, desc, eq, isNotNull, or, sql, SQL } from 'drizzle-orm'
import {
  Operativo,
  operativos,
  Registro,
  registros,
} from '@/drizzle/schema/camiones'
import { filterColumn } from '@/lib/filter-column'
import {
  camionesDTO,
  CamionesDTO,
  localidad_destino,
  localidad_origen,
} from '@/DTO/camiones'
import { db } from '@/drizzle/db'

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  fecha: z.string().date().optional(),
  operator: z.enum(['and', 'or']).default('and'),
  dominio: z.string().optional(),
  turno: z.enum(turnos.enumValues).optional(),
  motivo: z.string().optional(),
  localidad_origen: z.string().optional(),
  localidad_destino: z.string().optional(),
  remito: z.boolean().optional(),
  carga: z.boolean().optional(),
  localidad: z.string().optional(),
  resolucion: z.enum(resolucion.enumValues).optional(),
})

const operativoCamiones = async (body: FormCamionesProps) => {
  const { fecha, qth, turno, legajo, localidad } = body

  const direccion_full = `${qth}, ${localidad.cp}, Vicente Lopez, Buenos Aires, Argentina`

  const op = await db
    .select({ id_op: operativos.idOp })
    .from(operativos)
    .where(
      and(
        eq(operativos.fecha, sql<Date>`to_date(${fecha}, 'yyyy-mm-dd')`),
        eq(operativos.direccionFull, direccion_full),
        eq(operativos.turno, turno),
        eq(operativos.legajo, legajo.toString()),
        eq(operativos.idLocalidad, localidad.id_barrio),
      ),
    )

  if (!op.length) {
    const geocodificado = await db
      .select({
        latitud: operativos.latitud,
        longitud: operativos.longitud,
        direccion_full: operativos.direccionFull,
      })
      .from(registros)
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
          direccion: qth,
          turno,
          legajo: legajo.toString(),
          idLocalidad: localidad.id_barrio,
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
          direccion: qth,
          turno,
          legajo: legajo.toString(),
          idLocalidad: localidad.id_barrio,
          direccionFull: direccion_full,
          latitud: geocodificado[0].latitud,
          longitud: geocodificado[0].longitud,
        })
        .returning({ id_op: operativos.idOp })

      return id_op
    }
  } else {
    return op[0].id_op
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const input = searchParamsSchema.parse(
      Object.fromEntries(new URLSearchParams(searchParams).entries()),
    )

    const expressions: (SQL<unknown> | undefined)[] = [
      !!input.fecha
        ? eq(operativos.fecha, sql<Date>`to_date(${input.fecha}, 'yyyy-mm-dd')`)
        : undefined,
      input.turno
        ? filterColumn({
            column: operativos.turno,
            value: input.turno,
            isSelectable: true,
          })
        : undefined,
      input.localidad
        ? filterColumn({
            column: operativos.idLocalidad,
            value: input.localidad,
            isSelectable: true,
          })
        : undefined,
      input.dominio
        ? filterColumn({ column: registros.dominio, value: input.dominio })
        : undefined,
      input.motivo
        ? filterColumn({
            column: registros.idMotivo,
            value: input.motivo,
            isSelectable: true,
          })
        : undefined,
      input.localidad_origen
        ? filterColumn({
            column: registros.idLocalidadOrigen,
            value: input.localidad_origen,
            isSelectable: true,
          })
        : undefined,
      input.localidad_destino
        ? filterColumn({
            column: registros.idLocalidadDestino,
            value: input.localidad_destino,
            isSelectable: true,
          })
        : undefined,
      input.remito
        ? filterColumn({
            column: registros.remito,
            value: String(input.remito),
            isSelectable: true,
          })
        : undefined,
      input.carga
        ? filterColumn({
            column: registros.carga,
            value: String(input.carga),
            isSelectable: true,
          })
        : undefined,
      input.resolucion
        ? filterColumn({
            column: registros.resolucion,
            value: input.resolucion,
            isSelectable: true,
          })
        : undefined,
    ]

    const where =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions)

    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'id',
      'desc',
    ]) as [keyof CamionesDTO, 'asc' | 'desc']

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
      } else if (column in vicenteLopez) {
        return order === 'asc'
          ? asc(vicenteLopez[column as keyof VicenteLopez])
          : desc(vicenteLopez[column as keyof VicenteLopez])
      } else if (column in localidad_destino) {
        return order === 'asc'
          ? asc(localidad_destino[column as keyof Barrio])
          : desc(localidad_destino[column as keyof Barrio])
      }
      return order === 'asc'
        ? asc(localidad_origen[column as keyof Barrio])
        : desc(localidad_origen[column as keyof Barrio])
    }

    const camionesPromise = camionesDTO({
      page: input.page,
      per_page: input.per_page,
      orderBy: sortColumns(),
      where,
    })

    const totalPromise = db
      .select({ count: count() })
      .from(registros)
      .where(where)
      .execute()
      .then(([{ count }]) => count)

    const [camiones, total] = await Promise.all([camionesPromise, totalPromise])

    return NextResponse.json({
      data: camiones,
      pages: Math.ceil(total / 10).toString(),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body: FormCamionesProps = await req.json()

    const id_operativo = await operativoCamiones(body)

    const repetido = await db.query.registrosAutos.findFirst({
      where: (registro, { eq }) => (
        eq(registro.dominio, body.dominio),
        eq(registro.idOperativo, id_operativo)
      ),
    })

    if (repetido) {
      return NextResponse.json('El dominio ya fue ingresado el mismo dia', {
        status: 401,
      })
    }
    const [camion] = await db
      .insert(registros)
      .values({
        acta: body.acta,
        dominio: body.dominio,
        resolucion: body.resolucion,
        lpcarga: body.lpcarga,
        idOperativo: id_operativo,
        idLocalidadOrigen: body.localidad_origen?.id_barrio,
        idLocalidadDestino: body.localidad_destino?.id_barrio,
        idMotivo: body.motivo?.id_motivo,
        hora: body.hora,
        remito: body.remito,
        carga: body.carga,
        destino: body.destino,
        origen: body.origen,
        licencia: body.licencia,
      })
      .returning({
        id: registros.id,
        acta: registros.acta,
        dominio: registros.dominio,
        resolucion: registros.resolucion,
        lpcarga: registros.lpcarga,
        idOperativo: registros.idOperativo,
        localidadOrigen: localidad_origen.barrio,
        localidadDestino: localidad_destino.barrio,
        idMotivo: registros.idMotivo,
        hora: registros.hora,
        remito: registros.remito,
        carga: registros.carga,
        destino: registros.destino,
        origen: registros.origen,
        licencia: registros.licencia,
        legajo: operativos.legajo,
        fecha: operativos.fecha,
        direccionFull: operativos.direccionFull,
        latitud: operativos.latitud,
        longitud: operativos.longitud,
        cp: vicenteLopez.cp,
        localidad: vicenteLopez.barrio,
        turno: operativos.turno,
        qth: operativos.direccion,
      })

    revalidateTag('camiones')
    return NextResponse.json(camion)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
