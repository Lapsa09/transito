import { parte } from '@prisma/client'

export interface Parte extends parte {
  operario: {
    legajo: number
    usuario: {
      nombre: string
      apellido: string
    }
  }
}
