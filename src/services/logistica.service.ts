import { Logistica } from '../types'
import { getter } from './mains'

export const getCompras = async () => await getter<Logistica[]>('/logistica')
