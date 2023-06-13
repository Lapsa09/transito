import { OperativoCamiones, OperativoMotos } from '@/types/operativos'
import { getter } from './main.service'
import { EditAutosProps } from '@/types'
import { Registro } from '@/types/autos'

export const getAutos = async () =>
  await getter<Registro[]>({ route: 'operativos/autos', tag: 'autos' })

export const getMotos = async () =>
  await getter<OperativoMotos[]>({ route: 'operativos/motos', tag: 'motos' })

export const getCamiones = async () =>
  await getter<OperativoCamiones[]>({
    route: 'operativos/camiones',
    tag: 'camiones',
  })

export const getSingleAuto = async (id: number) =>
  await getter<EditAutosProps>({
    route: `operativos/autos/${id}`,
    tag: 'autos',
  })

export const getSingleMoto = async (id: number) =>
  await getter<EditAutosProps>({
    route: `operativos/motos/${id}`,
    tag: 'motos',
  })

export const getSingleCamion = async (id: number) => {
  return await getter<EditAutosProps>({
    route: `operativos/camiones/${id}`,
    tag: 'camiones',
  })
}
