import {
  integer,
  varchar,
  pgSchema,
  serial,
  time,
  date,
  timestamp,
} from 'drizzle-orm/pg-core'
import { barrios, turnos } from './schema'
import { relations } from 'drizzle-orm'

export const rio = pgSchema('nuevo_control')

export const motivo = rio.enum('motivo', ['VELOCIDAD', 'ESTACIONAMIENTO'])

export const registros = rio.table('registros', {
  id: serial('id').primaryKey().notNull(),
  hora: time('hora', { precision: 6 }).notNull(),
  dominio: varchar('dominio').notNull(),
  fechacarga: timestamp('fechacarga').defaultNow(),
  lpcarga: integer('lpcarga'),
  mes: integer('mes'),
  idLocalidad: integer('id_localidad')
    .references(() => barrios.idBarrio)
    .notNull(),
  idOperativo: integer('id_operativo')
    .references(() => operativos.idOp)
    .notNull(),
  idZona: integer('id_zona')
    .references(() => zonas.idZona)
    .notNull(),
})

export const zonas = rio.table('zonas', {
  idZona: serial('id_zona').primaryKey().notNull(),
  zona: varchar('zona').notNull(),
})

export const operativos = rio.table('operativos', {
  idOp: serial('id_op').primaryKey().notNull(),
  fecha: date('fecha').notNull(),
  motivo: motivo('motivo'),
  lp: integer('lp'),
  turno: turnos('turno').notNull(),
})

export const operativosRelations = relations(operativos, ({ many }) => ({
  registros: many(registros),
}))

export const registrosRelations = relations(registros, ({ one }) => ({
  operativo: one(operativos, {
    fields: [registros.idOperativo],
    references: [operativos.idOp],
  }),
  zona: one(zonas, {
    fields: [registros.idZona],
    references: [zonas.idZona],
  }),
  barrio: one(barrios, {
    fields: [registros.idLocalidad],
    references: [barrios.idBarrio],
  }),
}))

export const zonasRelations = relations(zonas, ({ many }) => ({
  registros: many(registros),
}))

export type Operativo = typeof operativos.$inferSelect
export type Registro = typeof registros.$inferSelect
