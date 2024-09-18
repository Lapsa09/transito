import {
  integer,
  varchar,
  pgSchema,
  serial,
  time,
  date,
} from 'drizzle-orm/pg-core'
import { turnos, users } from './schema'

export const radio = pgSchema('radio')

export const parte = radio.table('parte', {
  id: serial('id').primaryKey().notNull(),
  qth: varchar('qth').notNull(),
  fecha: date('fecha').notNull(),
  legajo: integer('legajo')
    .notNull()
    .references(() => users.legajo),
  movil: varchar('movil').notNull(),
  horaInicio: time('hora_inicio').notNull(),
  horaFin: time('hora_fin').notNull(),
  horaDescanso: time('hora_descanso').notNull(),
  horaDescansoFin: time('hora_descanso_fin').notNull(),
  turno: turnos('turno'),
})
