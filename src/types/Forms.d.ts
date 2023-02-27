interface FormInputProps {
  legajo_a_cargo: number
  legajo_planilla: number
  seguridad: string
  direccion: string
  zona: { id: number; zona: string }
  fecha: string
  turno: string
  lpcarga: number
  hora: string
  dominio: string
  zona_infractor: { id: number; zona_infractor: string }
  licencia?: number
  tipo_licencia?: { id_tipo: number; tipo: string }
  zona_infractor: { id: number; zona_infractor: string }
  resolucion?: string
  acta?: number
}
