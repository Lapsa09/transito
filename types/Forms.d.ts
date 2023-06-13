import { DateTime } from 'luxon'
import { IBarrio, ILicencias, IZona } from '.'

export interface RegisterUserProps {
  legajo: number
  nombre: string
  apellido: string
  telefono: number
  password: string
  confirmPassword: string
}

export interface LoginUserProps {
  legajo: number
  password: string
}

export interface FormInputProps {
  legajo_a_cargo: number
  legajo_planilla: number
  seguridad: string
  direccion: string
  zona: IZona
  fecha: DateTime
  turno: string
  lpcarga: number
  hora: DateTime
  dominio: string
  zona_infractor: IBarrio
  licencia?: number
  tipo_licencia?: ILicencias
  resolucion?: string
  acta?: number
  extranjero?: boolean
}

export interface EditInputProps {
  id: number
  legajo_a_cargo: number
  legajo_planilla: number
  seguridad: string
  direccion: string
  zona: number
  fecha: DateTime
  turno: string
  lpcarga: number
  hora: DateTime
  dominio: string
  zona_infractor: number
  licencia?: number
  tipo_licencia?: number
  resolucion?: string
  acta?: number
  extranjero?: boolean
  motivo?: number
}

export interface EditAutosProps extends EditInputProps {
  graduacion_alcoholica: number
}

export type RadioOPForm = {
  id: number
  legajo: number
  nombre: string
  ht: string
  puntaje: number
  asistencia: boolean
  estado: string
  movil: number
  qth: string
  novedades?: string
}

export type RadioMovilForm = {
  movil: number
  estado: string
  novedades?: string
}

export type EstadoMovil = {
  id_estado: number
  estado: string
}

export type EstadoOperario = {
  id_estado: number
  estado: string
}
