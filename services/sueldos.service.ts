import type { Cliente } from '@/types/clientes.sueldos'
import { getter } from './main.service'
import { Operario } from '@/types/operarios.sueldos'
import { Servicio } from '@/types/servicios.sueldos'

export const getClientes = async () => {
  const data = await getter<Cliente[]>({
    route: 'sueldos/clientes',
  })
  return data
}

export const getServicios = async () => {
  const data = await getter<Servicio[]>({
    route: 'sueldos/servicios',
  })
  return data
}

export const getOperarios = async () => {
  const data = await getter<Operario[]>({
    route: 'sueldos/operarios',
  })
  return data
}
