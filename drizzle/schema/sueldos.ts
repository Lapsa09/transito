import { relations } from 'drizzle-orm'
import {
  integer,
  varchar,
  serial,
  pgSchema,
  date,
  boolean,
  time,
} from 'drizzle-orm/pg-core'

export const sueldos = pgSchema('sueldos')

export const recibos = sueldos.table('recibos', {
  recibo: integer('recibo').primaryKey().notNull(),
  fechaRecibo: date('fecha_recibo').notNull(),
  importeRecibo: integer('importe_recibo').notNull().default(0),
  acopio: integer('acopio').notNull(),
  idCliente: integer('id_cliente').references(() => clientes.idCliente),
})

export const precios = sueldos.table('precios', {
  id: varchar('id').primaryKey().notNull(),
  precio: integer('precio').notNull(),
})

export const operarios = sueldos.table('operarios', {
  legajo: integer('legajo').primaryKey().notNull(),
  nombre: varchar('nombre'),
})

export const clientes = sueldos.table('clientes', {
  idCliente: serial('id_cliente').primaryKey().notNull(),
  cliente: varchar('cliente').notNull(),
})

export const servicios = sueldos.table('servicios', {
  idServicio: serial('id_servicio').primaryKey().notNull(),
  fechaServicio: date('fecha_servicio').notNull(),
  importeServicio: integer('importe_servicio').notNull(),
  memo: varchar('memo'),
  idCliente: integer('id_cliente')
    .notNull()
    .references(() => clientes.idCliente),
  feriado: boolean('feriado').notNull().default(false),
})

export const operariosServicios = sueldos.table('operarios_servicios', {
  legajo: integer('legajo').references(() => operarios.legajo),
  memo: varchar('memo'),
  recibo: integer('recibo'),
  idServicio: integer('id_servicio')
    .notNull()
    .references(() => servicios.idServicio),
  aCobrar: integer('a_cobrar').notNull().default(0),
  horaInicio: time('hora_inicio', { precision: 6 }),
  horaFin: time('hora_fin', { precision: 6 }),
  cancelado: boolean('cancelado').default(false),
  id: serial('id').primaryKey().notNull(),
})

export const recibosRelations = relations(recibos, ({ one }) => ({
  clientes: one(clientes, {
    fields: [recibos.idCliente],
    references: [clientes.idCliente],
  }),
}))

export const clientesRelations = relations(clientes, ({ many }) => ({
  recibos: many(recibos),
  servicios: many(servicios),
}))

export const serviciosRelations = relations(servicios, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [servicios.idCliente],
    references: [clientes.idCliente],
  }),
  servicios: many(operariosServicios),
}))

export const operariosServiciosRelations = relations(
  operariosServicios,
  ({ one }) => ({
    servicios: one(servicios, {
      fields: [operariosServicios.idServicio],
      references: [servicios.idServicio],
    }),
    operarios: one(operarios, {
      fields: [operariosServicios.legajo],
      references: [operarios.legajo],
    }),
  }),
)

export const operariosRelations = relations(operarios, ({ many }) => ({
  servicios: many(operariosServicios),
}))

export type Operarios = typeof operarios.$inferSelect
export type Clientes = typeof clientes.$inferSelect
export type Servicios = typeof servicios.$inferSelect
export type Recibos = typeof recibos.$inferSelect
export type OperariosServicios = typeof operariosServicios.$inferSelect
export type Precios = typeof precios.$inferSelect
