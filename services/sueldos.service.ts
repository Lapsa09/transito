import { Cliente } from '@/types'
import { getter } from './main.service'

export const getClientes = async () => {
  const data = await getter<Cliente[]>({
    route: 'sueldos/clientes',
    tag: 'clientes',
  })
  return data
}
