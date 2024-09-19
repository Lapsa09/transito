import {
  integer,
  uniqueIndex,
  varchar,
  text,
  pgSchema,
  serial,
  time,
  boolean,
  timestamp,
  date,
  type AnyPgColumn,
  primaryKey,
  uuid,
  alias,
} from 'drizzle-orm/pg-core'
import { invitados } from './schema'
import { relations } from 'drizzle-orm'

export const examen = pgSchema('examen')

export const calificacion = examen.table('calificacion', {
  nota: text('nota').primaryKey().notNull(),
  resultado: text('resultado').notNull(),
})

export const examenes = examen.table(
  'examen',
  {
    id: serial('id').primaryKey().notNull(),
    clave: varchar('clave'),
    fecha: date('fecha').defaultNow(),
    horaIniciado: time('hora_iniciado').defaultNow(),
    hora: timestamp('hora'),
    terminado: boolean('terminado').default(false),
  },
  (table) => {
    return {
      fechaHoraKey: uniqueIndex('examen_fecha_hora_key').using(
        'btree',
        table.fecha,
        table.horaIniciado,
      ),
    }
  },
)

export const opciones = examen.table('opciones', {
  id: serial('id').primaryKey().notNull(),
  respuesta: varchar('respuesta').notNull(),
  idPregunta: integer('id_pregunta')
    .notNull()
    .references((): AnyPgColumn => preguntas.id),
})

export const correcta = alias(opciones, 'correcta')

export const preguntas = examen.table('preguntas', {
  id: serial('id').primaryKey().notNull(),
  pregunta: varchar('pregunta').notNull(),
  idCorrecta: integer('id_correcta').references((): AnyPgColumn => opciones.id),
  tipoExamenId: integer('tipo_examenId')
    .notNull()
    .references(() => tipoExamen.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
})

export const tipoExamen = examen.table('tipo_examen', {
  id: serial('id').primaryKey().notNull(),
  tipo: varchar('tipo').notNull(),
  cantidadPreguntas: integer('cantidad_preguntas').notNull(),
  cantidadTemas: integer('cantidad_temas').notNull(),
})

export const rindeExamen = examen.table(
  'rinde_examen',
  {
    id: uuid('id').primaryKey().notNull(),
    idExamen: integer('id_examen')
      .notNull()
      .references(() => examenes.id),
    nota: text('nota').references(() => calificacion.nota),
    idInvitado: text('id_invitado')
      .notNull()
      .references(() => invitados.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    tipoExamenId: integer('tipo_examenId')
      .notNull()
      .references(() => tipoExamen.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    horaFinalizado: timestamp('hora_finalizado', { mode: 'string' }),
    horaIngresado: timestamp('hora_ingresado'),
  },
  (table) => {
    return {
      idInvitadoKey: uniqueIndex('rinde_examen_id_invitado_key').using(
        'btree',
        table.idInvitado,
      ),
    }
  },
)

export const examenPreguntas = examen.table(
  'examen_preguntas',
  {
    examenId: text('examen_id')
      .notNull()
      .references(() => rindeExamen.id),
    preguntaId: integer('preguntas_id')
      .notNull()
      .references(() => preguntas.id),
    elegidaId: integer('elegida_id').references(() => opciones.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  },
  (table) => {
    return {
      examenPreguntasPkey: primaryKey({
        columns: [table.examenId, table.preguntaId],
        name: 'examen_preguntas_pkey',
      }),
    }
  },
)

export const opcionesRelations = relations(opciones, ({ one, many }) => ({
  pregunta: one(preguntas, {
    fields: [opciones.idPregunta],
    references: [preguntas.id],
    relationName: 'opciones_idPregunta_preguntas_id',
  }),
  examenPreguntas: many(examenPreguntas),
}))

export const preguntasRelations = relations(preguntas, ({ one, many }) => ({
  opciones: many(opciones, {
    relationName: 'opciones_idPregunta_preguntas_id',
  }),
  correcta: one(opciones, {
    fields: [preguntas.idCorrecta],
    references: [opciones.id],
    relationName: 'preguntas_idCorrecta_opciones_id',
  }),
  tipoExamen: one(tipoExamen, {
    fields: [preguntas.tipoExamenId],
    references: [tipoExamen.id],
  }),
  examenPreguntas: many(examenPreguntas),
}))

export const tipoExamenRelations = relations(tipoExamen, ({ many }) => ({
  preguntas: many(preguntas),
  rindeExamen: many(rindeExamen),
}))

export const rindeExamenRelations = relations(rindeExamen, ({ one, many }) => ({
  examen: one(examenes, {
    fields: [rindeExamen.idExamen],
    references: [examenes.id],
  }),
  usuario: one(invitados, {
    fields: [rindeExamen.idInvitado],
    references: [invitados.id],
  }),
  calificacion: one(calificacion, {
    fields: [rindeExamen.nota],
    references: [calificacion.nota],
  }),
  tipoExamen: one(tipoExamen, {
    fields: [rindeExamen.tipoExamenId],
    references: [tipoExamen.id],
  }),
  preguntas: many(examenPreguntas),
}))

export const examenRelations = relations(examenes, ({ many }) => ({
  alumnos: many(rindeExamen),
}))

export const calificacionRelations = relations(calificacion, ({ many }) => ({
  rindeExamen: many(rindeExamen),
}))

export const examenPreguntasRelations = relations(
  examenPreguntas,
  ({ one }) => ({
    elegida: one(opciones, {
      fields: [examenPreguntas.elegidaId],
      references: [opciones.id],
    }),
    examen: one(rindeExamen, {
      fields: [examenPreguntas.examenId],
      references: [rindeExamen.id],
    }),
    pregunta: one(preguntas, {
      fields: [examenPreguntas.preguntaId],
      references: [preguntas.id],
    }),
  }),
)

export type Examen = typeof examenes.$inferSelect
export type Calificacion = typeof calificacion.$inferSelect
export type Opciones = typeof opciones.$inferSelect
export type Preguntas = typeof preguntas.$inferSelect
export type TipoExamen = typeof tipoExamen.$inferSelect
export type RindeExamen = typeof rindeExamen.$inferSelect
export type ExamenPreguntas = typeof examenPreguntas.$inferSelect
