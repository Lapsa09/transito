import { db } from '@/drizzle'
import {
  Examen,
  examenes,
  RindeExamen,
  rindeExamen,
  TipoExamen,
  tipoExamen,
} from '@/drizzle/schema/examen'
import { invitados } from '@/drizzle/schema/schema'
import { historialDTO } from '@/DTO/examen'
import { filterColumn } from '@/lib/filter-column'
import { searchParamsSchema } from '@/schemas/form'
import { Historial } from '@/types/quiz'
import { and, count, desc, eq, isNotNull, or, SQL, asc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchHistorialParamsSchema = searchParamsSchema.merge(
  z.object({
    nombre: z.string().optional(),
    dni: z.coerce.number().optional(),
    fecha: z.string().optional(),
    operator: z.enum(['and', 'or']).optional(),
  }),
)

const orderFunctions = {
  asc,
  desc,
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const input = searchHistorialParamsSchema.parse(
      Object.fromEntries(searchParams.entries()),
    )

    const { page, per_page, sort, nombre, dni, fecha, operator } = input

    const [column, order] = (sort?.split('.').filter(Boolean) ?? [
      'fecha',
      'desc',
    ]) as [keyof Historial, 'asc' | 'desc']
    const expressions: (SQL<unknown> | undefined)[] = [
      nombre
        ? filterColumn({
            column: invitados.nombre || invitados.apellido,
            value: nombre,
          })
        : undefined,
      !!fecha
        ? filterColumn({
            column: examenes.fecha,
            value: fecha,
            isDate: true,
          })
        : undefined,
      !!dni
        ? filterColumn({
            column: invitados.dni,
            value: dni.toString(),
          })
        : undefined,
    ]

    const sortColumns = () => {
      if (!column) return desc(examenes.fecha)

      if (column in rindeExamen) {
        return orderFunctions[order](rindeExamen[column as keyof RindeExamen])
      } else if (column in invitados) {
        return orderFunctions[order](
          invitados[column as keyof typeof invitados.$inferSelect],
        )
      } else if (column in tipoExamen) {
        return orderFunctions[order](tipoExamen[column as keyof TipoExamen])
      }
      return orderFunctions[order](examenes[column as keyof Examen])
    }
    const where =
      !operator || operator === 'and'
        ? and(...expressions, isNotNull(rindeExamen.nota))
        : or(...expressions, isNotNull(rindeExamen.nota))

    const _examenes = await historialDTO({
      page,
      per_page,
      orderBy: sortColumns(),
      where,
    })

    const total = await db
      .select({ count: count() })
      .from(rindeExamen)
      .fullJoin(examenes, eq(examenes.id, rindeExamen.idExamen))
      .fullJoin(invitados, eq(invitados.id, rindeExamen.idInvitado))
      .fullJoin(tipoExamen, eq(tipoExamen.id, rindeExamen.tipoExamenId))
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0)

    return NextResponse.json({
      data: _examenes,
      pages: Math.ceil(total / per_page).toString(),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
