import {
  Dependencia,
  Proveedor,
  Repuesto,
  TipoRepuesto,
  TipoVehiculo,
  Uso,
} from '@/drizzle/schema/logistica'
import { zonas } from '@/drizzle/schema/nuevo_control'
import {
  Barrio,
  Motivo,
  resolucionSchema,
  seguridadSchema,
  TipoLicencia,
  turnosSchema,
  VicenteLopez,
} from '@/drizzle/schema/schema'
import { Clientes, Operarios } from '@/drizzle/schema/sueldos'
import Axios, { AxiosRequestConfig } from 'axios'

type Props = {
  route: string
  body?: any
  config?: AxiosRequestConfig<any>
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

export const fetcher = (route: string, init?: RequestInit) =>
  fetch(new URL(route, process.env.NEXT_PUBLIC_SERVER_URL), init)

export const getter = async <T = any>({ route, config }: Props) => {
  const { data } = await axios.get<T>(route, config)

  return data
}

export const setter = async <T = any>({ route, body, config }: Props) => {
  const { data } = await axios.post<T>(route, body, config)

  return data
}

export const updater = async <T = any>({ route, body, config }: Props) => {
  const { data } = await axios.put<T>(route, body, config)
  return data
}

export const getVicenteLopez = async () => {
  const data = await getter<VicenteLopez[]>({
    route: 'zonas/vl',
  })
  return data
}

export const getTurnos = async () => {
  const data = await getter<
    { id: keyof typeof turnosSchema.enum; label: string }[]
  >({
    route: 'turnos',
  })
  return data
}

export const getSeguridad = async () => {
  const data = await getter<
    { id: keyof typeof seguridadSchema.enum; label: string }[]
  >({
    route: 'seguridad',
  })
  return data
}

export const getLicencias = async () => {
  const data = await getter<TipoLicencia[]>({
    route: 'licencias',
  })
  return data
}

export const getResolucion = async () => {
  const data = await getter<
    { id: keyof typeof resolucionSchema.enum; label: string }[]
  >({
    route: 'resolucion',
  })
  return data
}

export const getAllZonas = async () => {
  const data = await getter<Barrio[]>({
    route: 'zonas',
  })
  return data
}

export const getMotivos = async () => {
  const data = await getter<Motivo[]>({
    route: 'motivos',
  })
  return data
}
export const getZonasPaseo = async () => {
  const data = await getter<(typeof zonas.$inferSelect)[]>({
    route: 'zonas/paseo',
  })
  return data
}

export const getListaClientes = async () => {
  const data = await getter<Array<Clientes & { acopio: number }>>({
    route: 'clientes',
  })
  return data
}

export const getListaOperarios = async () => {
  const data = await getter<Operarios[]>({
    route: 'operarios',
  })
  return data
}

export const getTipoMoviles = async () => {
  const data = await getter<TipoVehiculo[]>({
    route: 'moviles/tipo',
  })
  return data
}

export const getSectoresLogistica = async () => {
  const data = await getter<Uso[]>({
    route: 'moviles/usos',
  })
  return data
}

export const getDependenciasLogistica = async () => {
  const data = await getter<Dependencia[]>({
    route: 'moviles/dependencias',
  })
  return data
}

export const getRepuestos = async () => {
  const data = await getter<Repuesto[]>({
    route: 'moviles/repuestos',
  })
  return data
}

export const getProveedores = async () => {
  const data = await getter<Proveedor[]>({
    route: 'moviles/proveedores',
  })
  return data
}

export const getTipoRepuestos = async () => {
  const data = await getter<TipoRepuesto[]>({
    route: 'moviles/repuestos/tipos',
  })
  return data
}

export const geoLocation = async (
  direccion: string,
): Promise<{ latitud: number; longitud: number }> => {
  const data = await getter({
    route: `http://dev.virtualearth.net/REST/v1/Locations/${direccion}?o=json&key=${process.env.NEXT_PUBLIC_MAPS_KEY}`,
  })

  const {
    coordinates: [latitud, longitud],
  } = data.resourceSets[0].resources[0].point

  return { latitud, longitud }
}

export const getSelects = async () => {
  const [
    zonas,
    turnos,
    seguridad,
    licencias,
    resolucion,
    motivos,
    vicenteLopez,
    zonasPaseo,
    clientes,
    operarios,
    tipoMoviles,
    dependencias,
    usos,
    repuestos,
    proveedores,
    tipoRepuestos,
  ] = await Promise.all([
    getAllZonas(),
    getTurnos(),
    getSeguridad(),
    getLicencias(),
    getResolucion(),
    getMotivos(),
    getVicenteLopez(),
    getZonasPaseo(),
    getListaClientes(),
    getListaOperarios(),
    getTipoMoviles(),
    getDependenciasLogistica(),
    getSectoresLogistica(),
    getRepuestos(),
    getProveedores(),
    getTipoRepuestos(),
  ])
  return {
    zonas,
    turnos,
    seguridad,
    licencias,
    resolucion,
    motivos,
    vicenteLopez,
    zonasPaseo,
    clientes,
    operarios,
    tipoMoviles,
    dependencias,
    usos,
    repuestos,
    proveedores,
    tipoRepuestos,
  }
}
