import {
  integer,
  varchar,
  pgSchema,
  serial,
  time,
  boolean,
  date,
  real,
  alias,
} from 'drizzle-orm/pg-core'
import {
  barrios,
  controlSustancias,
  motivos,
  turnos,
  vicenteLopez,
} from './schema'
import { relations } from 'drizzle-orm'

export const localidad_origen = alias(barrios, 'localidad_origen')
export const localidad_destino = alias(barrios, 'localidad_destino')

export const camiones = pgSchema('camiones')

export const registros = camiones.table('registros', {
  id: serial('id').primaryKey().notNull(),
  hora: time('hora', { precision: 6 }).notNull(),
  dominio: varchar('dominio'),
  origen: varchar('origen'),
  destino: varchar('destino'),
  licencia: integer('licencia'),
  remito: boolean('remito'),
  carga: boolean('carga'),
  resolucion: varchar('resolucion'),
  acta: integer('acta'),
  horaCarga: time('hora_carga', { precision: 6 }),
  lpcarga: integer('lpcarga'),
  mes: integer('mes'),
  semana: integer('semana'),
  idLocalidadOrigen: integer('id_localidad_origen').references(
    () => localidad_origen.idBarrio,
  ),
  idLocalidadDestino: integer('id_localidad_destino').references(
    () => localidad_destino.idBarrio,
  ),
  idMotivo: integer('id_motivo').references(() => motivos.idMotivo),
  idOperativo: integer('id_operativo').references(() => operativos.idOp),
  idSustancias: integer('id_sustancias')
    .references(() => controlSustancias.id)
    .notNull()
    .default(1),
})

export const operativos = camiones.table('operativos', {
  idOp: serial('id_op').primaryKey().notNull(),
  fecha: date('fecha').notNull(),
  turno: turnos('turno').notNull(),
  legajo: integer('legajo').notNull(),
  direccion: varchar('direccion').notNull(),
  idLocalidad: integer('id_localidad')
    .references(() => vicenteLopez.idBarrio)
    .notNull(),
  direccionFull: varchar('direccion_full'),
  latitud: real('latitud'),
  longitud: real('longitud'),
})

export const registrosRelations = relations(registros, ({ one }) => ({
  localidadDestino: one(barrios, {
    fields: [registros.idLocalidadDestino],
    references: [barrios.idBarrio],
    relationName: 'registros_idLocalidadDestino_barrios_idBarrio',
  }),
  localidadOrigen: one(barrios, {
    fields: [registros.idLocalidadOrigen],
    references: [barrios.idBarrio],
    relationName: 'registros_idLocalidadOrigen_barrios_idBarrio',
  }),
  motivo: one(motivos, {
    fields: [registros.idMotivo],
    references: [motivos.idMotivo],
  }),
  operativo: one(operativos, {
    fields: [registros.idOperativo],
    references: [operativos.idOp],
  }),
}))

export const operativosRelations = relations(operativos, ({ one, many }) => ({
  registros: many(registros),
  localidad: one(vicenteLopez, {
    fields: [operativos.idLocalidad],
    references: [vicenteLopez.idBarrio],
  }),
}))

export type Registro = typeof registros.$inferSelect
export type Operativo = typeof operativos.$inferSelect
