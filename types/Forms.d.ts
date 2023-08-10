import {
  barrios,
  motivos,
  resolucion,
  seguridad,
  tipo_licencias,
  turnos,
  vicente_lopez,
} from '@prisma/client'
import { Operativo } from './operativos'

export interface LocalOperativo extends Partial<Operativo> {
  expiresAt: number
}

export interface RegisterUserProps {
  legajo: number
  nombre: string
  apellido: string
  telefono: number
  password: string
  confirmPassword: string
}

export interface LoginUserProps {
  legajo: string
  password: string
}

export interface FormInputProps {
  legajo_a_cargo: string
  legajo_planilla: string
  seguridad: seguridad
  direccion: string
  zona: vicente_lopez
  fecha: Date
  turno: turnos
  lpcarga: number
  hora: string
  dominio: string
  zona_infractor: barrios
  licencia?: number
  tipo_licencia?: tipo_licencias
  resolucion?: resolucion
  acta?: number
  extranjero?: boolean
}

export interface EditInputProps {
  id: number
  legajo_a_cargo: number
  legajo_planilla: number
  seguridad: seguridad
  qth: string
  zona: vicente_lopez
  fecha: Date
  turno: string
  lpcarga: number
  hora: Date
  dominio: string
  zona_infractor: barrios
  licencia?: number
  tipo_licencia?: tipo_licencias
  resolucion?: resolucion
  acta?: number
  extranjero?: boolean
  motivo?: motivos
}

export interface FormAutosProps extends FormInputProps {
  graduacion_alcoholica: number
  motivo: motivos
}

export interface EditAutosProps extends EditInputProps {
  graduacion_alcoholica: number
  motivo: motivos
}

export interface FormMotosProps extends FormInputProps {
  motivos: motivos[]
}

export interface EditMotosProps extends EditInputProps {
  motivos: motivos[]
}

export interface FormCamionesProps extends FormInputProps {
  motivo: motivos
  remito: boolean
  carga: boolean
  lp: number
  origen?: string
  destino?: string
  localidad_origen: barrios
  localidad_destino: barrios
}

export interface EditCamionesProps extends FormInputProps {
  motivo: motivos
  remito: boolean
  carga: boolean
  lp: number
  origen?: string
  destino?: string
  localidad_origen: barrios
  localidad_destino: barrios
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
