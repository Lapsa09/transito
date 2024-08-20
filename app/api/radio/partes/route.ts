import { partesDTO } from '@/DTO/radio'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/drizzle'
import { parte } from '@/drizzle/schema/radio'
import { count, eq, sql } from 'drizzle-orm'
import { turnosSchema } from '@/drizzle/schema/schema'
import { searchParamsSchema } from '@/schemas/form'
import { z } from 'zod'

const partesInputSchema = searchParamsSchema.merge(
  z.object({ fecha: z.string() }),
)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const { fecha, page, per_page } = partesInputSchema.parse(searchParams)

  const partesPromise = partesDTO({ fecha, page, per_page })

  const totalPromise = db
    .select({ count: count() })
    .from(parte)
    .where(
      fecha ? eq(parte.fecha, sql`to_date(${fecha},'YYYY-MM-DD')`) : undefined,
    )
    .execute()
    .then((res) => res[0].count)

  const [partes, total] = await Promise.all([partesPromise, totalPromise])

  return NextResponse.json({
    data: partes,
    pages: Math.ceil(total / 10).toString(),
  })
}

export async function POST(req: NextRequest) {
  const body: {
    fecha: string
    turno: keyof typeof turnosSchema.enum
    qth: string
    movil: string
    operario: { legajo: string }
    hora_inicio: string
    hora_fin: string
    hora_descanso: string
    hora_descanso_fin: string
  } = await req.json()

  await db.insert(parte).values({
    fecha: sql`to_date(${body.fecha}, 'YYYY-MM-DD')`,
    turno: body.turno,
    qth: body.qth,
    movil: body.movil,
    legajo: +body.operario.legajo,
    horaInicio: body.hora_inicio,
    horaFin: body.hora_fin,
    horaDescanso: body.hora_descanso,
    horaDescansoFin: body.hora_descanso_fin,
  })

  revalidateTag('radio/partes')

  return NextResponse.json('Exito')
}
