import { db } from '@/drizzle'
import { operativos, registros } from '@/drizzle/schema/operativos'
import { motivos } from '@/drizzle/schema/schema'
import { and, count, desc, eq, gte, isNull, not, or, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchParamsSchema = z.object({
  y: z.coerce.number().default(new Date().getFullYear()),
})

export async function GET(req: NextRequest) {
  const { y } = searchParamsSchema.parse(
    Object.fromEntries(req.nextUrl.searchParams.entries()),
  )
  const totales = await db
    .select({
      idSustancias: registros.idSustancias,
      idMotivo: registros.idMotivo,
    })
    .from(registros)
    .where(
      and(
        not(eq(registros.idSustancias, 1)),
        eq(sql`extract(year from ${operativos.fecha})`, y),
      ),
    )
    .innerJoin(operativos, eq(operativos.idOp, registros.idOperativo))

  const sustancias = await db
    .select({
      value: count(registros.id),
      label: motivos.motivo,
      id: motivos.idMotivo,
    })
    .from(motivos)
    .where(
      and(
        gte(motivos.idMotivo, 88),
        or(
          eq(sql`extract(year from ${operativos.fecha})`, y),
          isNull(operativos.fecha),
        ),
      ),
    )
    .fullJoin(registros, eq(registros.idMotivo, motivos.idMotivo))
    .leftJoin(operativos, eq(operativos.idOp, registros.idOperativo))
    .groupBy(motivos.motivo, motivos.idMotivo)
    .orderBy(desc(count(registros.id)))

  return NextResponse.json({
    sustancias,
    total: totales.length,
  })
}
