import {
  integer,
  varchar,
  pgSchema,
  serial,
  time,
  timestamp,
  date,
  real,
  bigint,
} from 'drizzle-orm/pg-core'
import {
  barrios,
  controlSustancias,
  motivos,
  resolucion,
  seguridad,
  tipoLicencias,
  turnos,
  vicenteLopez,
} from './schema'
import { relations } from 'drizzle-orm'

export const autos = pgSchema('operativos')

export const del = autos.enum('del', ['VILO', 'FUERA DEL MUNICIPIO'])
export const resultado = autos.enum('resultado', [
  'NEGATIVA',
  'PUNITIVA',
  'NO PUNITIVA',
])

export const operativos = autos.table('operativos', {
  idOp: serial('id_op').primaryKey().notNull(),
  fecha: date('fecha'),
  qth: varchar('qth'),
  turno: turnos('turno'),
  legajoACargo: integer('legajo_a_cargo'),
  legajoPlanilla: integer('legajo_planilla'),
  idLocalidad: integer('id_localidad').references(() => vicenteLopez.idBarrio),
  seguridad: seguridad('seguridad'),
  hora: time('hora', { precision: 6 }),
  direccionFull: varchar('direccion_full'),
  latitud: real('latitud'),
  longitud: real('longitud'),
})

export const registros = autos.table('registros', {
  dominio: varchar('dominio').notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  licencia: bigint('licencia', { mode: 'number' }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  acta: bigint('acta', { mode: 'number' }),
  graduacionAlcoholica: real('graduacion_alcoholica'),
  resolucion: resolucion('resolucion').default('PREVENCION'),
  fechacarga: timestamp('fechacarga', {
    precision: 6,
    mode: 'string',
  }).defaultNow(),
  lpcarga: integer('lpcarga'),
  mes: integer('mes'),
  semana: integer('semana'),
  esDel: del('es_del'),
  resultado: resultado('resultado'),
  id: serial('id').primaryKey().notNull(),
  idLicencia: integer('id_licencia').references(() => tipoLicencias.idTipo),
  idZonaInfractor: integer('id_zona_infractor')
    .notNull()
    .references(() => barrios.idBarrio),
  idOperativo: integer('id_operativo')
    .notNull()
    .references(() => operativos.idOp),
  idMotivo: integer('id_motivo').references(() => motivos.idMotivo),
  idSustancias: integer('id_sustancias')
    .references(() => controlSustancias.id)
    .notNull()
    .default(1),
})

export const operativosRelations = relations(operativos, ({ one }) => ({
  localidad: one(vicenteLopez, {
    fields: [operativos.idLocalidad],
    references: [vicenteLopez.idBarrio],
  }),
}))

export const registrosRelations = relations(registros, ({ one }) => ({
  tipoLicencia: one(tipoLicencias, {
    fields: [registros.idLicencia],
    references: [tipoLicencias.idTipo],
  }),
  barrio: one(barrios, {
    fields: [registros.idZonaInfractor],
    references: [barrios.idBarrio],
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

export type Registro = typeof registros.$inferSelect
export type Operativo = typeof operativos.$inferSelect

export type RegistroKeys = keyof Registro
export type OperativoKeys = keyof Operativo
