import {
  pgSchema,
  serial,
  timestamp,
  varchar,
  real,
  boolean,
  integer,
  date,
  time,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const waze = pgSchema('waze')

export const baches = waze.table('baches', {
  id: serial('id').primaryKey().notNull(),
  fecha: timestamp('fecha', { mode: 'string' }).notNull(),
  qth: varchar('qth').notNull(),
  latitud: real('latitud').notNull(),
  longitud: real('longitud').notNull(),
  reparado: boolean('reparado').default(false).notNull(),
  fechaReparacion: timestamp('fecha_reparacion', { mode: 'string' }),
})

export const calles = waze.table('calles', {
  id: serial('id').primaryKey().notNull(),
  calles: varchar('calles').notNull(),
})

export const reporte = waze.table('reporte', {
  id: serial('id').primaryKey().notNull(),
  idHorario: integer('id_horario')
    .notNull()
    .references(() => horarios.id),
  idDia: integer('id_dia')
    .notNull()
    .references(() => dia.id),
})

export const dia = waze.table('dia', {
  id: serial('id').primaryKey().notNull(),
  fecha: date('fecha').notNull(),
})

export const nivelTrafico = waze.table('nivel_trafico', {
  id: serial('id').primaryKey().notNull(),
  nivel: varchar('nivel').notNull(),
})

export const horarios = waze.table('horarios', {
  id: serial('id').primaryKey().notNull(),
  horario: time('horario').notNull(),
})

export const recorrido = waze.table('recorrido', {
  id: serial('id').primaryKey().notNull(),
  idCalles: integer('id_calles')
    .notNull()
    .references(() => calles.id),
  idReporte: integer('id_reporte')
    .notNull()
    .references(() => reporte.id),
  tiempo: integer('tiempo').notNull(),
  tiempoHist: integer('tiempo_hist').notNull(),
  velocidad: integer('velocidad').notNull(),
  velocidadHist: integer('velocidad_hist').notNull(),
  idTrafico: integer('id_trafico')
    .notNull()
    .references(() => nivelTrafico.id),
})

export const reporteRelations = relations(reporte, ({ one, many }) => ({
  dia: one(dia, {
    fields: [reporte.idDia],
    references: [dia.id],
  }),
  horarios: one(horarios, {
    fields: [reporte.idHorario],
    references: [horarios.id],
  }),
  recorridos: many(recorrido),
}))

export const diaRelations = relations(dia, ({ many }) => ({
  reportes: many(reporte),
}))

export const horariosRelations = relations(horarios, ({ many }) => ({
  reportes: many(reporte),
}))

export const recorridoRelations = relations(recorrido, ({ one }) => ({
  calles: one(calles, {
    fields: [recorrido.idCalles],
    references: [calles.id],
  }),
  reporte: one(reporte, {
    fields: [recorrido.idReporte],
    references: [reporte.id],
  }),
  nivelTrafico: one(nivelTrafico, {
    fields: [recorrido.idTrafico],
    references: [nivelTrafico.id],
  }),
}))

export const callesRelations = relations(calles, ({ many }) => ({
  recorridos: many(recorrido),
}))

export const nivelTraficoRelations = relations(nivelTrafico, ({ many }) => ({
  recorridos: many(recorrido),
}))
