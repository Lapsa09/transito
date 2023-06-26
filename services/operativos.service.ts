import { OperativoCamiones, OperativoMotos } from '@/types/operativos'
import { getter } from './main.service'
import { EditAutosProps } from '@/types'
import { Registro } from '@/types/autos'

export const getAutos = async () =>
  await getter<Registro[]>({ route: 'operativos/autos' })

export const getMotos = async () =>
  await getter<OperativoMotos[]>({ route: 'operativos/motos' })

export const getCamiones = async () =>
  await getter<OperativoCamiones[]>({
    route: 'operativos/camiones',
  })

export const getSingleAuto = async (id: number) =>
  await getter<EditAutosProps>({
    route: `operativos/autos/${id}`,
  })

export const getSingleMoto = async (id: number) =>
  await getter<EditAutosProps>({
    route: `operativos/motos/${id}`,
  })

export const getSingleCamion = async (id: number) => {
  return await getter<EditAutosProps>({
    route: `operativos/camiones/${id}`,
  })
}
