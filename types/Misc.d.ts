import { invitadoDTO, userDTO } from '@/DTO/user'
import { examen, rinde_examen } from '@prisma/client'

export enum Roles {
  ADMIN = 'ADMIN',
  INSPECTOR = 'INSPECTOR',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  WAZE = 'TRAFICO',
  LOGISTICA = 'LOGISTICA',
  PROFESOR = 'PROFESOR',
  DASHBOARD = 'DASHBOARD',
}

export type User = {
  id: string
  nombre: string
  legajo?: number
  dni?: number
  apellido: string
  metaData: Record<string, any>
}

export type Empleado = User & NonNullable<Awaited<ReturnType<typeof userDTO>>>
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
