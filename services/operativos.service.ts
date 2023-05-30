import {
  OperativoAutos,
  OperativoCamiones,
  OperativoMotos,
} from '@/types/operativos'
import { getter } from './main.service'

export const getAutos = async () =>
  await getter<OperativoAutos[]>({ route: 'operativos/autos', tag: 'autos' })

export const getMotos = async () =>
  await getter<OperativoMotos[]>({ route: 'operativos/motos', tag: 'motos' })

export const getCamiones = async () =>
  await getter<OperativoCamiones[]>({
    route: 'operativos/camiones',
    tag: 'camiones',
  })
