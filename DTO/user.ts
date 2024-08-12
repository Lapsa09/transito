import bycript from 'bcrypt'
import { Roles } from '@/types'
import { db } from '@/drizzle/db'
import { invitados, permisos, users } from '@/drizzle/schema/schema'
import { and, desc, eq, sql } from 'drizzle-orm'
import { rindeExamen, tipoExamen } from '@/drizzle/schema/examen'

export const userDTO = async (body: { legajo: string; password: string }) => {
  const user = await db
    .select({
      id: users.id,
      legajo: users.legajo,
      nombre: users.nombre,
      apellido: users.apellido,
      user_password: users.userPassword,
      metaData: {
        turno: users.turno,
        rol: permisos.permiso,
        isAdmin: sql<boolean>`${permisos.permiso} = ${Roles.ADMIN}`,
      },
    })
    .from(users)
    .where(eq(users.legajo, +body.legajo))
    .leftJoin(permisos, eq(users.idRol, permisos.id))

  if (!user.length) return null
  const user_password = await bycript.compare(
    body.password,
    user[0].user_password || '',
  )
  if (!user_password) return null
  const { user_password: _, ...rest } = user[0]
  return rest
}

export const invitadoDTO = async (body: { dni: string }) => {
  const invitado = await db
    .select({
      id: invitados.id,
      dni: invitados.dni,
      nombre: invitados.nombre,
      apellido: invitados.apellido,
      metaData: {
        hora_ingresado: rindeExamen.horaIngresado,
        hora_finalizado: rindeExamen.horaFinalizado,
        id: rindeExamen.id,
        id_examen: rindeExamen.idExamen,
        nota: rindeExamen.nota,
        tipoExamen: tipoExamen.tipo,
      },
    })
    .from(invitados)
    .leftJoin(rindeExamen, eq(invitados.id, rindeExamen.idInvitado))
    .innerJoin(tipoExamen, eq(rindeExamen.tipoExamenId, tipoExamen.id))
    .where(and(eq(invitados.dni, +body.dni), eq(invitados.utilizado, false)))
    .orderBy(desc(invitados.fecha))

  if (!invitado.length) return null
  return invitado[0]
}

export async function inspectoresDTO() {
  return await db
    .select({
      legajo: users.legajo,
      nombre: users.nombre,
      apellido: users.apellido,
    })
    .from(users)
    .where(eq(users.idRol, 2))
}
