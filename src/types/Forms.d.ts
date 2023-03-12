import { DateTime } from 'luxon'
import { IBarrio, ILicencias, IZona } from '.'

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
}
