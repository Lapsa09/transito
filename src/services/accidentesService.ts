import { getter } from '.'

export const provincias = async () => await getter('/provincias')

export const departamentos = async () => await getter('/deptos')
