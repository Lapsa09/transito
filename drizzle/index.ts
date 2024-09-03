import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/schema'
import * as _camiones from './schema/camiones'
import * as radio from './schema/radio'
import * as nuevo_control from './schema/nuevo_control'
import * as examen from './schema/examen'
import * as motos from './schema/motos'
import * as operativos from './schema/operativos'
import * as sueldos from './schema/sueldos'
import * as logistica from './schema/logistica'
import * as relations from './schema/relations'
import * as waze from './schema/waze'

const client = postgres(process.env.DATABASE_URL!, { max: 5 })

// { schema } is used for relational queries
export const riodb = drizzle(client, {
  schema: {
    ...schema,
    ...nuevo_control,
    ...relations,
  },
})

export const autosdb = drizzle(client, {
  schema: {
    ...schema,
    ...operativos,
    ...relations,
  },
})

export const camionesdb = drizzle(client, {
  schema: {
    ...schema,
    ..._camiones,
    ...relations,
  },
})

export const radiodb = drizzle(client, {
  schema: {
    ...schema,
    ...radio,
    ...relations,
  },
})

export const sueldosdb = drizzle(client, {
  schema: {
    ...schema,
    ...sueldos,
    ...relations,
  },
})

export const motosdb = drizzle(client, {
  schema: {
    ...schema,
    ...motos,
    ...relations,
  },
})

export const wazedb = drizzle(client, {
  schema: {
    ...schema,
    ...relations,
    ...waze,
  },
})

export const logisticadb = drizzle(client, {
  schema: {
    ...schema,
    ...logistica,
    ...relations,
  },
})

export const examendb = drizzle(client, {
  schema: {
    ...schema,
    ...examen,
    ...relations,
  },
})

export const db = drizzle(client)
