import type { Cliente } from '@/types/clientes.sueldos'
import { getter, setter, updater } from './main.service'
import { Operario } from '@/types/operarios.sueldos'
import { Servicio } from '@/types/servicios.sueldos'
import { clientes, operarios } from '@prisma/client'
import { ServiciosFormProps } from '@/types'

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

export const getPrecios = async () => {
  const data = await getter<{ id: string; precio: number }[]>({
    route: 'sueldos/precios',
  })
  return data
}

export const updatePrecios = async (body: { id: string; precio: number }[]) => {
  const data = await updater<{ id: string; precio: number }[]>({
    route: 'sueldos/precios',
    body,
  })
  return data
}

export const getListaClientes = async () => {
  const data = await getter<clientes[]>({
    route: 'sueldos/clientes/list',
  })
  return data
}

export const getListaOperarios = async () => {
  const data = await getter<operarios[]>({
    route: 'sueldos/operarios/list',
  })
  return data
}

export const nuevoServicio = async ({ body }: { body: ServiciosFormProps }) => {
  const data = await setter<string>({
    route: 'sueldos/servicios',
    body,
  })
  return data
}
