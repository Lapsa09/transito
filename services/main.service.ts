import {
  barrios,
  clientes,
  dependencia,
  logistica_tipo_vehiculo,
  motivos,
  operarios,
  repuesto,
  resolucion,
  sector,
  seguridad,
  tipo_licencias,
  turnos,
  vicente_lopez,
  zonas,
} from '@prisma/client'
import Axios, { AxiosRequestConfig } from 'axios'

type Props = {
  route: string
  body?: any
  config?: AxiosRequestConfig<any>
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

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
  const data = await getter<vicente_lopez[]>({
    route: 'zonas/vl',
  })
  return data
}

export const getTurnos = async () => {
  const data = await getter<turnos[]>({
    route: 'turnos',
  })
  return data
}

export const getSeguridad = async () => {
  const data = await getter<seguridad[]>({
    route: 'seguridad',
  })
  return data
}

export const getLicencias = async () => {
  const data = await getter<tipo_licencias[]>({
    route: 'licencias',
  })
  return data
}

export const getResolucion = async () => {
  const data = await getter<resolucion[]>({
    route: 'resolucion',
  })
  return data
}

export const getAllZonas = async () => {
  const data = await getter<barrios[]>({
    route: 'zonas',
  })
  return data
}

export const getMotivos = async () => {
  const data = await getter<motivos[]>({
    route: 'motivos',
  })
  return data
}
export const getZonasPaseo = async () => {
  const data = await getter<zonas[]>({
    route: 'zonas/paseo',
  })
  return data
}

export const getListaClientes = async () => {
  const data = await getter<clientes[]>({
    route: 'clientes',
  })
  return data
}

export const getListaOperarios = async () => {
  const data = await getter<operarios[]>({
    route: 'operarios',
  })
  return data
}

export const getTipoMoviles = async () => {
  const data = await getter<logistica_tipo_vehiculo[]>({
    route: 'moviles/tipo',
  })
  return data
}

export const getSectoresLogistica = async () => {
  const data = await getter<sector[]>({
    route: 'moviles/sectores',
  })
  return data
}

export const getDependenciasLogistica = async () => {
  const data = await getter<dependencia[]>({
    route: 'moviles/dependencias',
  })
  return data
}

export const getRepuestos = async () => {
  const data = await getter<repuesto[]>({
    route: 'moviles/repuestos',
  })
  return data
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
    sectores,
    repuestos,
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
    sectores,
    repuestos,
  }
}
