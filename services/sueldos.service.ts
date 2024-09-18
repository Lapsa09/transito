import type { Cliente } from '@/types/clientes.sueldos'
import { getter, setter, updater } from './main.service'
import { Operario } from '@/types/operarios.sueldos'
import { Servicio } from '@/types/servicios.sueldos'
import { ServiciosFormProps } from '@/types'
import { FieldValues } from 'react-hook-form'
import { Clientes, Operarios } from '@/drizzle/schema/sueldos'

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
  const data = await getter<{ data: Operario[]; pages: number }>({
    route: 'sueldos/operarios',
  })
  return data
}

export const getPrecios = async () => {
  const data = await getter<
    { id: 'precio_normal' | 'precio_pico'; precio: number }[]
  >({
    route: 'sueldos/precios',
  })
  return data
}

export const updatePrecios = async (body: {
  precio_normal: number
  precio_pico: number
}) => {
  const data = await updater<
    { id: 'precio_normal' | 'precio_pico'; precio: number }[]
  >({
    route: 'sueldos/precios',
    body,
  })
  return data
}

export const getAcopioFromCliente = async (id_cliente: number) => {
  const data = await getter<number>({
    route: 'sueldos/clientes/acopio/' + id_cliente,
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

export const createCliente = async ({ body }: { body: FieldValues }) => {
  const data = await setter<Clientes>({
    route: 'clientes',
    body,
  })
  return data
}

export const createOperario = async (body: { body: FieldValues }) => {
  const data = await setter<Operarios>({
    route: 'operarios',
    body,
  })
  return data
}

export const updateMemo = async ({
  body,
  id_servicio: id,
}: {
  body: FieldValues
  id_servicio: number
}) => {
  const data = await updater<Servicio>({
    route: 'sueldos/servicios/memo/' + id,
    body,
  })
  return data
}

export const cancelarOperario = async ({
  id_servicio: id,
  body,
}: {
  body: FieldValues
  id_servicio: number
}) => {
  const data = await updater<Servicio>({
    route: 'sueldos/operarios/servicio/' + id,
    body,
  })
  return data
}

export const getServicioForEdit = async (id: string) => {
  const data = await getter<ServiciosFormProps>({
    route: 'sueldos/servicios/edit/' + id,
  })
  return data
}

export const updateServicio = async ({
  body,
  id_servicio: id,
}: {
  body: ServiciosFormProps
  id_servicio: string
}) => {
  const data = await updater<Servicio>({
    route: 'sueldos/servicios/' + id,
    body,
  })
  return data
}

export const getForExport = async ({
  mes,
  año,
}: {
  mes: number
  año: number
}) => {
  const data = await getter<Servicio[]>({
    route: 'sueldos/servicios/liqui',
    config: {
      params: {
        mes,
        año,
      },
    },
  })
  return data
}

export const getExportables = async () => {
  const data = await getter<{
    data: {
      mes: number
      año: number
      total: number
    }[]
    pages: number
  }>({
    route: 'sueldos/servicios/liqui/list',
  })
  return data
}

export const exportAgenda = async ({ body }: { body: { fecha: string } }) => {
  const data = await setter({
    route: 'sueldos/servicios/export',
    body,
  })
  return data
}
