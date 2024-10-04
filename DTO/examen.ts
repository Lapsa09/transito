import { db, examendb } from '@/drizzle'
import { invitados } from '@/drizzle/schema/schema'
import { SQL, eq, asc, desc } from 'drizzle-orm'
import {
  calificacion,
  correcta,
  examenes,
  examenPreguntas,
  opciones,
  preguntas,
  rindeExamen,
  tipoExamen,
} from '@/drizzle/schema/examen'
import { jsonAgg } from '@/utils/misc'
import { v4 } from 'uuid'

export async function examenDTO({
  id,
  tipo_examen,
  id_invitado,
}: {
  id: string
  tipo_examen: string
  id_invitado: string
}) {
  const examen = await examendb.transaction(async (tx) => {
    return await tx
      .insert(rindeExamen)
      .values({
        idExamen: +id,
        tipoExamenId: +tipo_examen,
        idInvitado: id_invitado,
        id: v4(),
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
  orderBy: SQL<unknown>
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
    .fullJoin(tipoExamen, eq(tipoExamen.id, rindeExamen.tipoExamenId))
    .where(where)
    .orderBy(orderBy)
}

export async function rindeExamenDTO({ id }: { id: string }) {
  function getRandomNumberWithMargin(
    upperLimit: number,
    margin: number,
  ): number {
    const adjustedUpperLimit = upperLimit - margin

    return Math.floor(Math.random() * adjustedUpperLimit)
  }

  const [invitado] = await db
    .select()
    .from(invitados)
    .where(eq(invitados.id, id))
    .innerJoin(rindeExamen, eq(invitados.id, rindeExamen.idInvitado))
  const [tipo] = await db
    .select()
    .from(tipoExamen)
    .where(eq(tipoExamen.id, invitado.rinde_examen.tipoExamenId))

  const preguntas = await examendb.query.preguntas.findMany({
    where: (row, { eq }) => eq(row.tipoExamenId, tipo.id),
    with: {
      opciones: true,
    },
  })
  const init =
    preguntas.length >= tipo.cantidadPreguntas
      ? getRandomNumberWithMargin(preguntas.length, tipo.cantidadPreguntas)
      : 0
  const finish = init ? init + tipo.cantidadPreguntas : undefined

  for (const pregunta of preguntas.slice(init, finish)) {
    console.log('pregunta', pregunta.id, invitado.invitados.dni)
    await db.insert(examenPreguntas).values({
      examenId: invitado.rinde_examen.id,
      preguntaId: pregunta.id,
    })
  }
  return await examendb.query.rindeExamen
    .findFirst({
      where: (examen, { eq }) => eq(examen.idInvitado, id),
      with: {
        preguntas: {
          with: {
            pregunta: {
              columns: {
                id: true,
                pregunta: true,
              },
              with: {
                opciones: {
                  columns: {
                    id: true,
                    respuesta: true,
                    idPregunta: true,
                  },
                },
              },
            },
          },
          columns: {},
        },
      },
      columns: {
        id: true,
      },
    })
    .then((examen) => {
      const preguntas = examen?.preguntas.map((pregunta) => {
        const [preg, señal] =
          pregunta.pregunta.pregunta.split(/N° ([0-9]{1,3})/)

        return {
          ...pregunta,
          ...pregunta.pregunta,
          pregunta: señal
            ? preg + `: <img src="/setran/${señal}.png" alt="señal" />`
            : pregunta.pregunta.pregunta,
          opciones: pregunta.pregunta.opciones.map((opcion) => {
            return {
              ...opcion,
              respuesta: opcion.respuesta.match(/^[0-9]{1,3}$/)
                ? `<img src="/setran/${opcion.respuesta}.png" alt="señal" />`
                : opcion.respuesta,
            }
          }),
        }
      })

      return { ...examen, preguntas }
    })
}

export async function resultadoDTO({ id }: { id: string }) {
  const [examen] = await db
    .select({
      calificacion: calificacion.resultado,
      nota: calificacion.nota,
      dni: invitados.dni,
      nombre: invitados.nombre,
      apellido: invitados.apellido,
      preguntas: jsonAgg({
        id: preguntas.id,
        pregunta: preguntas.pregunta,
        elegida: opciones.respuesta,
        correcta: correcta.respuesta,
        id_elegida: opciones.id,
        id_correcta: correcta.id,
      }).as('preguntas'),
    })
    .from(rindeExamen)
    .where(eq(rindeExamen.id, id))
    .rightJoin(invitados, eq(rindeExamen.idInvitado, invitados.id))
    .leftJoin(calificacion, eq(rindeExamen.nota, calificacion.nota))
    .leftJoin(examenPreguntas, eq(rindeExamen.id, examenPreguntas.examenId))
    .innerJoin(preguntas, eq(examenPreguntas.preguntaId, preguntas.id))
    .leftJoin(opciones, eq(examenPreguntas.elegidaId, opciones.id))
    .innerJoin(correcta, eq(preguntas.idCorrecta, correcta.id))
    .groupBy(
      calificacion.resultado,
      calificacion.nota,
      invitados.dni,
      invitados.nombre,
      invitados.apellido,
    )

  const _examen = {
    ...examen,
    preguntas: examen.preguntas.map((pregunta) => {
      const [preg, señal] = pregunta.pregunta?.split(/N° ([0-9]{1,3})/) || []

      return {
        ...pregunta,
        pregunta: señal
          ? preg + `: <img src="/setran/${señal}.png" alt="señal" />`
          : pregunta.pregunta,
        correcta: pregunta.correcta.match(/^[0-9]{1,3}$/)
          ? `<img src="/setran/${pregunta.correcta}.png" alt="señal" />`
          : pregunta.correcta,
        elegida: pregunta.elegida
          ? pregunta.elegida.match(/^[0-9]{1,3}$/)
            ? `<img src="/setran/${pregunta.elegida}.png" alt="señal" />`
            : pregunta.elegida
          : undefined,
      }
    }),
  }

  return _examen
}
