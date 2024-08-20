import { relations } from 'drizzle-orm'
import {
  integer,
  uniqueIndex,
  varchar,
  text,
  pgSchema,
  serial,
  boolean,
  date,
  doublePrecision,
} from 'drizzle-orm/pg-core'

export const logistica = pgSchema('logistica')

export const reparaciones = logistica.table(
  'reparaciones',
  {
    id: serial('id').primaryKey().notNull(),
    fecha: date('fecha'),
    concepto: varchar('concepto'),
    estado: varchar('estado'),
    articulo: integer('articulo')
      .notNull()
      .references(() => repuesto.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    patente: varchar('patente')
      .notNull()
      .references(() => movil.patente, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    retira: varchar('retira'),
    observacion: varchar('observacion'),
  },
  (table) => {
    return {
      articuloKey: uniqueIndex('reparaciones_articulo_key').using(
        'btree',
        table.articulo,
      ),
    }
  },
)

export const movil = logistica.table('movil', {
  patente: varchar('patente').primaryKey().notNull(),
  marca: varchar('marca').notNull(),
  nroMovil: varchar('nro_movil').notNull(),
  modelo: varchar('modelo').notNull(),
  año: integer('año').notNull(),
  tipoCombustible: varchar('tipo_combustible'),
  idUso: integer('id_uso').references(() => uso.idUso, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  tipoMotor: doublePrecision('tipo_motor'),
  empresaSeguimiento: varchar('empresa_seguimiento'),
  planRenovacion: boolean('plan_renovacion').default(false).notNull(),
  idTipoVehiculo: integer('id_tipo_vehiculo')
    .notNull()
    .references(() => tipoVehiculo.idTipo, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  idDependencia: integer('id_dependencia')
    .notNull()
    .references(() => dependencia.idDependencia, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  noChasis: varchar('no_chasis'),
  idMegatrans: varchar('id_megatrans'),
  seguro: varchar('seguro'),
})

export const dependencia = logistica.table('dependencia', {
  idDependencia: serial('id_dependencia').primaryKey().notNull(),
  dependencia: varchar('dependencia'),
})

export const repuesto = logistica.table('repuesto', {
  id: serial('id').primaryKey().notNull(),
  idTipoRepuesto: integer('id_tipo_repuesto')
    .notNull()
    .references(() => tipoRepuesto.idTipoRepuesto, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  item: varchar('item').notNull(),
  idPedido: integer('id_pedido')
    .notNull()
    .references(() => pedidoRepuesto.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
})

export const tipoRepuesto = logistica.table('tipo_repuesto', {
  idTipoRepuesto: serial('id_tipo_repuesto').primaryKey().notNull(),
  tipo: varchar('tipo').notNull(),
})

export const proveedor = logistica.table('proveedor', {
  id: serial('id').primaryKey().notNull(),
  nombre: varchar('nombre'),
  tipo: varchar('tipo'),
  marcas: varchar('marcas'),
  ciudad: varchar('ciudad'),
  provincia: varchar('provincia'),
  email: varchar('email'),
  emailAlternativo: varchar('email_alternativo'),
  direccion: varchar('direccion'),
  telefono: varchar('telefono'),
  horarios: varchar('horarios'),
})

export const tipoVehiculo = logistica.table('tipo_vehiculo', {
  idTipo: serial('id_tipo').primaryKey().notNull(),
  tipo: varchar('tipo'),
})

export const uso = logistica.table('uso', {
  idUso: serial('id_uso').primaryKey().notNull(),
  uso: varchar('uso'),
  idDependencia: integer('id_dependencia')
    .notNull()
    .references(() => dependencia.idDependencia, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
})

export const kilometrajeVehiculos = logistica.table('kilometraje_vehiculos', {
  id: serial('id').primaryKey().notNull(),
  patente: text('patente')
    .notNull()
    .references(() => movil.patente, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  fecha: date('fecha'),
  km: integer('km'),
  kitPolyV: integer('kit_poly_v'),
  proximoCambioPolyV: integer('proximo_cambio_poly_v'),
  kitDistribucion: integer('kit_distribucion'),
  proximoCambioDistribucion: integer('proximo_cambio_distribucion'),
  filtroAceite: integer('filtro_aceite'),
  proximoCambioFiltro: integer('proximo_cambio_filtro'),
})

export const vtv = logistica.table('vtv', {
  id: serial('id').primaryKey().notNull(),
  patente: varchar('patente')
    .notNull()
    .references(() => movil.patente),
  nroMovil: varchar('nro_movil'),
  fechaEmision: date('fecha_emision'),
  observacion: varchar('observacion'),
  vencimiento: date('vencimiento'),
  condicion: varchar('condicion'),
  estado: varchar('estado'),
})

export const pedidoRepuesto = logistica.table('pedido_repuesto', {
  id: serial('id').primaryKey().notNull(),
  fechaPedido: date('fecha_pedido'),
  fechaEntrega: date('fecha_entrega'),
  idProveedor: integer('id_proveedor')
    .notNull()
    .references(() => proveedor.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  ordenCompra: varchar('orden_compra').notNull(),
})

export const reparacionesRelations = relations(reparaciones, ({ one }) => ({
  repuesto: one(repuesto, {
    fields: [reparaciones.articulo],
    references: [repuesto.id],
  }),
  movil: one(movil, {
    fields: [reparaciones.patente],
    references: [movil.patente],
  }),
}))

export const repuestoRelations = relations(repuesto, ({ one, many }) => ({
  reparacioness: many(reparaciones),
  pedidoRepuesto: one(pedidoRepuesto, {
    fields: [repuesto.idPedido],
    references: [pedidoRepuesto.id],
  }),
  tipoRepuesto: one(tipoRepuesto, {
    fields: [repuesto.idTipoRepuesto],
    references: [tipoRepuesto.idTipoRepuesto],
  }),
}))

export const movilRelations = relations(movil, ({ one, many }) => ({
  reparacioness: many(reparaciones),
  dependencia: one(dependencia, {
    fields: [movil.idDependencia],
    references: [dependencia.idDependencia],
  }),
  tipoVehiculo: one(tipoVehiculo, {
    fields: [movil.idTipoVehiculo],
    references: [tipoVehiculo.idTipo],
  }),
  uso: one(uso, {
    fields: [movil.idUso],
    references: [uso.idUso],
  }),
  kilometrajeVehiculos: many(kilometrajeVehiculos),
  vtvs: many(vtv),
}))

export const dependenciaRelations = relations(dependencia, ({ many }) => ({
  moviles: many(movil),
  usos: many(uso),
}))

export const tipoVehiculoRelations = relations(tipoVehiculo, ({ many }) => ({
  moviles: many(movil),
}))

export const usoRelations = relations(uso, ({ one, many }) => ({
  moviles: many(movil),
  dependencia: one(dependencia, {
    fields: [uso.idDependencia],
    references: [dependencia.idDependencia],
  }),
}))

export const pedidoRepuestoRelations = relations(
  pedidoRepuesto,
  ({ one, many }) => ({
    repuestos: many(repuesto),
    proveedor: one(proveedor, {
      fields: [pedidoRepuesto.idProveedor],
      references: [proveedor.id],
    }),
  }),
)

export const tipoRepuestoRelations = relations(tipoRepuesto, ({ many }) => ({
  repuestos: many(repuesto),
}))

export const kilometrajeVehiculosRelations = relations(
  kilometrajeVehiculos,
  ({ one }) => ({
    movil: one(movil, {
      fields: [kilometrajeVehiculos.patente],
      references: [movil.patente],
    }),
  }),
)

export const vtvRelations = relations(vtv, ({ one }) => ({
  movil: one(movil, {
    fields: [vtv.patente],
    references: [movil.patente],
  }),
}))

export const proveedorRelations = relations(proveedor, ({ many }) => ({
  pedidoRepuestos: many(pedidoRepuesto),
}))

export type Reparaciones = typeof reparaciones.$inferSelect
export type Movil = typeof movil.$inferSelect
export type Dependencia = typeof dependencia.$inferSelect
export type Repuestos = typeof repuesto.$inferSelect
export type TipoRepuesto = typeof tipoRepuesto.$inferSelect
export type Proveedor = typeof proveedor.$inferSelect
export type TipoVehiculo = typeof tipoVehiculo.$inferSelect
export type Uso = typeof uso.$inferSelect
export type PedidoRepuesto = typeof pedidoRepuesto.$inferSelect
export type KilometrajeVehiculos = typeof kilometrajeVehiculos.$inferSelect
export type Vtv = typeof vtv.$inferSelect
export type Repuesto = typeof repuesto.$inferSelect
