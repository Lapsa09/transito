import { DateTime } from 'luxon'
import { seguridad, turnos } from '@prisma/client'
import {
  IBarrio,
  ILicencias,
  IMotivos,
  IResolucion,
  ISeguridad,
  ITurnos,
  IZona,
} from '.'

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
  zona: IZona
  fecha: DateTime
  turno: turnos
  lpcarga: number
  hora: string
  dominio: string
  zona_infractor: IBarrio
  licencia?: number
  tipo_licencia?: ILicencias
  resolucion?: IResolucion
  acta?: number
  extranjero?: boolean
}

export interface EditInputProps {
  id: number
  legajo_a_cargo: number
  legajo_planilla: number
  seguridad: ISeguridad
  qth: string
  zona: IZona
  fecha: DateTime
  turno: string
  lpcarga: number
  hora: DateTime
  dominio: string
  zona_infractor: IBarrio
  licencia?: number
  tipo_licencia?: ILicencias
  resolucion?: IResolucion
  acta?: number
  extranjero?: boolean
  motivo?: IMotivos
}

export interface FormAutosProps extends FormInputProps {
  graduacion_alcoholica: number
  motivo: IMotivos
}

export interface EditAutosProps extends EditInputProps {
  graduacion_alcoholica: number
  motivo: IMotivos
}

export interface FormMotosProps extends FormInputProps {
  motivos: IMotivos[]
}

export interface EditMotosProps extends EditInputProps {
  motivos: IMotivos[]
}

export interface FormCamionesProps extends FormInputProps {
  motivo: IMotivos
  remito: boolean
  carga: boolean
  lp: number
  origen?: string
  destino?: string
  localidad_origen: IBarrio
  localidad_destino: IBarrio
}

export interface EditCamionesProps extends FormInputProps {
  motivo: IMotivos
  remito: boolean
  carga: boolean
  lp: number
  origen?: string
  destino?: string
  localidad_origen: IBarrio
  localidad_destino: IBarrio
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
