import { turnos } from '@prisma/client'

export enum Roles {
  ADMIN = 'ADMIN',
  INSPECTOR = 'INSPECTOR',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  WAZE = 'TRAFICO',
  LOGISTICA = 'LOGISTICA',
}

export type User = {
  id: string
  legajo?: number
  nombre: string
  apellido: string
  user_password: string
  telefono: number
  role: Roles
  turno: turnos | null
}

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
