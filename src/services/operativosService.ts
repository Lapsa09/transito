import {
  ILicencias,
  IMotivos,
  IZona,
  OperativoAutos,
  OperativoCamiones,
  OperativoMotos,
} from 'types/Operativos'
import { getEnums, getter, setter } from './index'

export const getLicencias = async () => await getter<ILicencias[]>('/licencias')

export const getZonasVL = async () => await getter<IZona[]>('/zonas/vl')

export const getAllZonas = async () => await getter<IZona[]>('/zonas')

export const getSeguridad = async () => await getEnums('seguridad')

export const getMotivos = async () => await getter<IMotivos[]>('/motivos')

export const getMotivosCamion = async () =>
  await getEnums<IMotivos[]>('motivos_camion')

export const getMotivosMoto = async () =>
  await getter<IMotivos[]>('/operativos/motos/motivos')

export const nuevoOperativoAuto = async (body) =>
  await setter<OperativoAutos>('/operativos/autos', body)

export const getOperativosAutos = async () =>
  await getter<OperativoAutos[]>('/operativos/autos')

export const getOperativosMotos = async () =>
  await getter<OperativoMotos[]>('/operativos/motos')

export const nuevoOperativoMoto = async (body) =>
  await setter<OperativoMotos>('/operativos/motos', body)

export const getOperativosCamiones = async () =>
  await getter<OperativoCamiones[]>('/operativos/camiones')

export const nuevoOperativoCamiones = async (body) =>
  await setter<OperativoCamiones>('/operativos/camiones', body)

const geocodingAutos = async () => {
  await setter('/operativos/autos/geocoding')
}

const geocodingMotos = async () => {
  await setter('/operativos/motos/geocoding')
}

const geocodingCamiones = async () => {
  await setter('/operativos/camiones/geocoding')
}

export const geocoding = async (type: string) => {
  const types = {
    Autos: geocodingAutos,
    Motos: geocodingMotos,
    Camiones: geocodingCamiones,
  }

  await types[type]()
}
