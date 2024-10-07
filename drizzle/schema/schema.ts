import {
  pgTable,
  pgEnum,
  integer,
  uniqueIndex,
  varchar,
  text,
  serial,
  boolean,
  timestamp,
  date,
  bigint,
  doublePrecision,
  uuid,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const resolucionSchema = z.enum(['ACTA', 'PREVENCION', 'REMITIDO'])

export const turnosSchema = z.enum(['MAÑANA', 'TARDE', 'NOCHE'])

export const seguridadSchema = z.enum([
  'POLICIA',
  'PREFECTURA',
  'SECRETARIA DE SEGURIDAD',
  'NO',
])

export const resolucion = pgEnum('resolucion', resolucionSchema.options)
export const seguridad = pgEnum('seguridad', seguridadSchema.options)
export const turnos = pgEnum('turnos', turnosSchema.options)

export const users = pgTable('users', {
  legajo: integer('legajo').notNull().unique(),
  nombre: varchar('nombre').notNull(),
  apellido: varchar('apellido').notNull(),
  turno: turnos('turno'),
  userPassword: varchar('user_password', { length: 255 }),
  id: uuid('id').primaryKey(),
  idRol: integer('id_rol')
    .notNull()
    .references(() => permisos.id),
})

export const prismaMigrations = pgTable('_prisma_migrations', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  checksum: varchar('checksum', { length: 64 }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
  migrationName: varchar('migration_name', { length: 255 }).notNull(),
  logs: text('logs'),
  rolledBackAt: timestamp('rolled_back_at', {
    withTimezone: true,
    mode: 'string',
  }),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer('applied_steps_count').default(0).notNull(),
})

export const asd = pgTable('asd', {
  id: serial('id').primaryKey().notNull(),
  zona: varchar('zona'),
  idZona: integer('id_zona'),
})

export const primeros = pgTable('primeros', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  count: bigint('count', { mode: 'number' }),
})

export const barrios = pgTable('barrios', {
  idBarrio: serial('id_barrio').primaryKey().notNull(),
  barrio: varchar('barrio').notNull(),
})

export const motivos = pgTable('motivos', {
  idMotivo: serial('id_motivo').primaryKey().notNull(),
  motivo: varchar('motivo').notNull(),
})

export const tipoLicencias = pgTable('tipo_licencias', {
  idTipo: serial('id_tipo').primaryKey().notNull(),
  tipo: varchar('tipo'),
  vehiculo: varchar('vehiculo'),
})

export const vicenteLopez = pgTable('vicente_lopez', {
  idBarrio: serial('id_barrio').primaryKey().notNull(),
  barrio: varchar('barrio').notNull(),
  cp: varchar('cp').notNull(),
})

export const mensual = pgTable('mensual', {
  id: serial('id').primaryKey().notNull(),
  mes: varchar('mes'),
  año: integer('año'),
  monto: integer('monto'),
})

export const puntajes = pgTable('puntajes', {
  id: serial('id').primaryKey().notNull(),
  interaccionPublico: integer('interaccion_publico'),
  jerarquicos: integer('jerarquicos'),
  erroresActas: integer('errores_actas'),
  destacado: integer('destacado'),
  llamadosAtencion: integer('llamados_atencion'),
  asistencia: integer('asistencia'),
  aPercibir: doublePrecision('a_percibir'),
  legajo: integer('legajo').references(() => operario.legajo),
  idMes: integer('id_mes').references(() => mensual.id),
})

export const operario = pgTable('operario', {
  legajo: integer('legajo').primaryKey().notNull(),
  nombre: varchar('nombre'),
})

export const permisos = pgTable('permisos', {
  id: serial('id').primaryKey().notNull(),
  permiso: varchar('permiso').notNull(),
  url: varchar('url').notNull(),
})

export const accounts = pgTable(
  'accounts',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').notNull(),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
  },
  (table) => {
    return {
      providerProviderAccountIdKey: uniqueIndex(
        'accounts_provider_provider_account_id_key',
      ).using('btree', table.provider, table.providerAccountId),
    }
  },
)

export const grupoEtario = pgTable('grupo_etario', {
  id: serial('id').primaryKey().notNull(),
  grupoEtario: varchar('grupo_etario'),
})

export const verificationtokens = pgTable(
  'verificationtokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { precision: 3, mode: 'string' }).notNull(),
  },
  (table) => {
    return {
      identifierTokenKey: uniqueIndex(
        'verificationtokens_identifier_token_key',
      ).using('btree', table.identifier, table.token),
      tokenKey: uniqueIndex('verificationtokens_token_key').using(
        'btree',
        table.token,
      ),
    }
  },
)

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey().notNull(),
    sessionToken: text('session_token').notNull(),
    userId: text('user_id').notNull(),
    expires: timestamp('expires', { precision: 3, mode: 'string' }).notNull(),
  },
  (table) => {
    return {
      sessionTokenKey: uniqueIndex('sessions_session_token_key').using(
        'btree',
        table.sessionToken,
      ),
    }
  },
)

export const invitados = pgTable('invitados', {
  id: uuid('id').primaryKey().notNull(),
  nombre: varchar('nombre').notNull(),
  apellido: varchar('apellido').notNull(),
  dni: integer('dni').notNull(),
  utilizado: boolean('utilizado').default(false).notNull(),
  fecha: date('fecha').defaultNow().notNull(),
  sexo: varchar('sexo'),
  edad: integer('edad'),
  idEdad: integer('id_edad').references(() => grupoEtario.id),
})

export const controlSustancias = pgTable('control_sustancias', {
  id: serial('id').primaryKey().notNull(),
  resultado: varchar('resultado').notNull(),
})

export type Motivo = typeof motivos.$inferSelect
export type Barrio = typeof barrios.$inferSelect
export type TipoLicencia = typeof tipoLicencias.$inferSelect
export type VicenteLopez = typeof vicenteLopez.$inferSelect
export type Permiso = typeof permisos.$inferSelect
export type Turno = keyof typeof turnos.enumValues
export type Resolucion = keyof typeof resolucion.enumValues
export type ControlSustancias = typeof controlSustancias.$inferSelect
