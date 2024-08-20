import { db } from '@/drizzle'
import { parte } from '@/drizzle/schema/radio'
import { users } from '@/drizzle/schema/schema'
import { eq, sql } from 'drizzle-orm'

export async function partesDTO({
  fecha,
  page,
  per_page,
}: {
  fecha: string
  page: number
  per_page: number
}) {
  const partesPromise = await db
    .select({
      fecha: parte.fecha,
      turno: parte.turno,
      qth: parte.qth,
      movil: parte.movil,
      legajo: parte.legajo,
      hora_inicio: parte.horaInicio,
      hora_fin: parte.horaFin,
      hora_descanso: parte.horaDescanso,
      hora_descanso_fin: parte.horaDescansoFin,
      nombre: users.nombre,
      apellido: users.apellido,
      id: parte.id,
    })
    .from(parte)
    .where(
      fecha ? eq(parte.fecha, sql`to_date(${fecha},'YYYY-MM-DD')`) : undefined,
    )
    .limit(per_page)
    .offset((page - 1) * per_page)
    .innerJoin(users, eq(parte.legajo, users.legajo))

  return partesPromise
}
