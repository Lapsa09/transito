export interface FormProps {
  handleClose: () => void | ((to: To) => void)
  afterCreate: (_data: any) => void
}

type User = {
  legajo: number
  nombre: string
  apellido: string
  telefono: number
  turno?: string
  rol?: string
  iat: number
}
