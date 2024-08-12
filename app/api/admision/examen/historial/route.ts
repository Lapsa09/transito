import { db } from '@/drizzle/db'
import { examenes, rindeExamen, tipoExamen } from '@/drizzle/schema/examen'
import { invitados } from '@/drizzle/schema/schema'
import { historialDTO } from '@/DTO/examen'
import { filterColumn } from '@/lib/filter-column'
import prisma from '@/lib/prismadb'
import { DrizzleWhere } from '@/types'
import { Historial } from '@/types/quiz'
import { and, asc, count, desc, eq, or, SQL } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  nombre: z.string().optional(),
  dni: z.number().optional(),
  fecha: z.string().optional(),
  hora_finalizado: z.string().time().optional(),
  operator: z.enum(['and', 'or']).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const {
      page,
      per_page,
      sort,
      nombre,
      fecha,
      dni,
      operator,
      hora_finalizado,
    } = searchParamsSchema.parse(searchParams)

    const [column, order] = (sort?.split('.').filter(Boolean) ?? [
      'id',
      'desc',
    ]) as [keyof Historial, 'asc' | 'desc']

    const expressions: (SQL<unknown> | undefined)[] = [
      nombre
        ? filterColumn({
            column: invitados.nombre || invitados.apellido,
            value: nombre,
          })
        : undefined,
      // Filter tasks by status
      !!fecha ? eq(examenes.fecha, fecha) : undefined,
      // Filter tasks by priority
      !!dni
        ? filterColumn({
            column: invitados.dni,
            value: dni.toString(),
          })
        : undefined,
      // Filter by createdAt
      !!hora_finalizado
        ? eq(rindeExamen.horaFinalizado, hora_finalizado)
        : undefined,
    ]

    const where =
      !operator || operator === 'and' ? and(...expressions) : or(...expressions)

    const _examenes = await historialDTO({
      page,
      per_page,
      orderBy: { column, order },
      where,
    })

    const total = await db
      .select({ count: count() })
      .from(rindeExamen)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0)

    return NextResponse.json({
      data: _examenes,
      pages: Math.ceil(total / 10).toString(),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
