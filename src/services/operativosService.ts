import {
  ILicencias,
  IMotivos,
  IZona,
  OperativoAutos,
  OperativoCamiones,
  OperativoMotos,
} from 'types/Operativos'
import { getEnums, getter, setter } from './index'

export const getLicencias = async (): Promise<ILicencias> =>
  await getter('/licencias')

export const getZonasVL = async () => await getter('/zonas/vl')

export const getAllZonas = async (): Promise<IZona> => await getter('/zonas')

export const getSeguridad = async () => await getEnums('seguridad')

export const getMotivos = async (): Promise<IMotivos> =>
  await getter('/motivos')

export const getMotivosCamion = async () => await getEnums('motivos_camion')

export const getMotivosMoto = async () =>
  await getter('/operativos/motos/motivos')

export const nuevoOperativoAuto = async (body) =>
  await setter('/operativos/autos', body)

export const getOperativosAutos = async (): Promise<OperativoAutos[]> =>
  await getter('/operativos/autos')

export const getOperativosMotos = async (): Promise<OperativoMotos[]> =>
  await getter('/operativos/motos')

export const nuevoOperativoMoto = async (body) =>
  await setter('/operativos/motos', body)

export const getOperativosCamiones = async (): Promise<OperativoCamiones[]> =>
  await getter('/operativos/camiones')

export const nuevoOperativoCamiones = async (body) =>
  await setter('/operativos/camiones', body)

const geocodingAutos = async () => {
  await setter('/operativos/autos/geocoding')
}

const geocodingMotos = async () => {
  await setter('/operativos/motos/geocoding')
}

const geocodingCamiones = async () => {
  await setter('/operativos/camiones/geocoding')
}

export const geocoding = async (type) => {
  const types = {
    Autos: geocodingAutos,
    Motos: geocodingMotos,
    Camiones: geocodingCamiones,
  }

  await types[type]()
}
