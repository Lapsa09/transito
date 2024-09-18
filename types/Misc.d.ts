import { invitadoDTO, userDTO } from '@/DTO/user'
import { SQL } from 'drizzle-orm'

export enum Roles {
  ADMIN = 'ADMIN',
  INSPECTOR = 'INSPECTOR',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  WAZE = 'TRAFICO',
  LOGISTICA = 'LOGISTICA',
  PROFESOR = 'PROFESOR',
  DASHBOARD = 'DASHBOARD',
  RADIO = 'RADIO',
}

export type User = {
  id: string
  nombre: string
  legajo?: number
  dni?: number
  apellido: string
  metaData: Record<string, any>
}

export type Empleado = User & {
  metadata: NonNullable<Awaited<ReturnType<typeof userDTO>>>['metaData']
}
export type Invitado = User &
  NonNullable<Awaited<ReturnType<typeof invitadoDTO>>>

export interface Links {
  link: string
  name: string
  permission?: Roles
  links?: Links[]
}

export enum Meses {
  1 = 'ENERO',
  2 = 'FEBRERO',
  3 = 'MARZO',
  4 = 'ABRIL',
  5 = 'MAYO',
  6 = 'JUNIO',
  7 = 'JULIO',
  8 = 'AGOSTO',
  9 = 'SEPTIEMBRE',
  10 = 'OCTUBRE',
  11 = 'NOVIEMBRE',
  12 = 'DICIEMBRE',
}

export type DrizzleWhere<T> =
  | SQL<unknown>
  | ((aliases: T) => SQL<T> | undefined)
  | undefined

export type Fetched<T> = { data: T[]; pages: number }
