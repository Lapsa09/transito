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
  primaryKey,
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

export const motos = pgSchema('motos')

export const operativos = motos.table('operativos', {
  idOp: serial('id_op').primaryKey().notNull(),
  fecha: date('fecha'),
  hora: time('hora', { precision: 6 }),
  qth: varchar('qth'),
  legajoACargo: integer('legajo_a_cargo'),
  legajoPlanilla: integer('legajo_planilla'),
  turno: turnos('turno'),
  seguridad: seguridad('seguridad'),
  idZona: integer('id_zona').references(() => vicenteLopez.idBarrio),
  direccionFull: varchar('direccion_full'),
  latitud: real('latitud'),
  longitud: real('longitud'),
})

export const registros = motos.table('registros', {
  dominio: varchar('dominio'),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  licencia: bigint('licencia', { mode: 'number' }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  acta: bigint('acta', { mode: 'number' }),
  resolucion: resolucion('resolucion'),
  fechacarga: timestamp('fechacarga', {
    precision: 6,
    mode: 'string',
  }).defaultNow(),
  lpcarga: integer('lpcarga'),
  mes: integer('mes'),
  graduacionAlcoholica: real('graduacion_alcoholica').default(0),
  semana: integer('semana'),
  id: serial('id').primaryKey().notNull(),
  idLicencia: integer('id_licencia').references(() => tipoLicencias.idTipo),
  idZonaInfractor: integer('id_zona_infractor').references(
    () => barrios.idBarrio,
  ),
  idOperativo: integer('id_operativo').references(() => operativos.idOp),
  idSustancias: integer('id_sustancias')
    .references(() => controlSustancias.id)
    .notNull()
    .default(1),
})

export const motoMotivo = motos.table(
  'moto_motivo',
  {
    idRegistro: integer('id_registro')
      .notNull()
      .references(() => registros.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    idMotivo: integer('id_motivo')
      .notNull()
      .references(() => motivos.idMotivo, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
  },
  (table) => {
    return {
      pkMotoMotivo: primaryKey({
        columns: [table.idRegistro, table.idMotivo],
        name: 'pk_moto_motivo',
      }),
    }
  },
)

export const operativosRelations = relations(operativos, ({ one }) => ({
  localidad: one(vicenteLopez, {
    fields: [operativos.idZona],
    references: [vicenteLopez.idBarrio],
  }),
}))

export const registrosRelations = relations(registros, ({ one, many }) => ({
  tipoLicencia: one(tipoLicencias, {
    fields: [registros.idLicencia],
    references: [tipoLicencias.idTipo],
  }),
  barrio: one(barrios, {
    fields: [registros.idZonaInfractor],
    references: [barrios.idBarrio],
  }),
  operativo: one(operativos, {
    fields: [registros.idOperativo],
    references: [operativos.idOp],
  }),
  motivos: many(motoMotivo),
}))

export const motoMotivoInMotosRelations = relations(motoMotivo, ({ one }) => ({
  motivo: one(motivos, {
    fields: [motoMotivo.idMotivo],
    references: [motivos.idMotivo],
  }),
  registro: one(registros, {
    fields: [motoMotivo.idRegistro],
    references: [registros.id],
  }),
}))

export type Operativo = typeof operativos.$inferSelect
export type Registro = typeof registros.$inferSelect
