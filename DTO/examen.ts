import { db, examendb } from '@/drizzle'
import { examenes, rindeExamen, tipoExamen } from '@/drizzle/schema/examen'
import { invitados } from '@/drizzle/schema/schema'
import { SQL, eq, asc, desc } from 'drizzle-orm'

export const examenDTO = async (
  id: string,
  tipo_examen: string,
  id_invitado: string,
) => {
  const examen = await examendb.transaction(async (tx) => {
    return await tx
      .insert(rindeExamen)
      .values({
        idExamen: +id,
        tipoExamenId: +tipo_examen,
        idInvitado: id_invitado,
      })
      .then(async () => {
        return await tx.query.rindeExamen.findFirst({
          where: (examen, { eq }) => eq(examen.idExamen, +id),
          with: {
            examen: true,
            usuario: true,
            tipoExamen: true,
            preguntas: {
              with: {
                pregunta: {
                  with: {
                    opciones: true,
                  },
                },
              },
            },
          },
        })
      })
  })
  return examen!
}

export async function historialDTO<T>({
  page,
  per_page,
  orderBy,
  where,
}: {
  page: number
  per_page: number
  orderBy: { column: keyof T; order: 'asc' | 'desc' }
  where?: SQL
}) {
  return await db
    .select({
      id: rindeExamen.id,
      fecha: examenes.fecha,
      horaFinalizado: rindeExamen.horaFinalizado,
      nombre: invitados.nombre,
      apellido: invitados.apellido,
      dni: invitados.dni,
      tipoExamen: tipoExamen.tipo,
      nota: rindeExamen.nota,
    })
    .from(rindeExamen)
    .limit(per_page)
    .offset((page - 1) * per_page)
    .fullJoin(examenes, eq(examenes.id, rindeExamen.idExamen))
    .fullJoin(invitados, eq(invitados.id, rindeExamen.idInvitado))
    .fullJoin(tipoExamen, eq(tipoExamen.tipo, rindeExamen.tipoExamenId))
    .where(where)
    .orderBy(
      orderBy.column in rindeExamen
        ? orderBy.order === 'asc'
          ? asc(
              rindeExamen[
                orderBy.column as keyof typeof rindeExamen.$inferSelect
              ],
            )
          : desc(
              rindeExamen[
                orderBy.column as keyof typeof rindeExamen.$inferSelect
              ],
            )
        : rindeExamen.id,
    )
}
