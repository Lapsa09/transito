import { partesDTO } from '@/DTO/radio'
import { inspectoresDTO } from '@/DTO/user'

export type Parte = Awaited<ReturnType<typeof partesDTO>>[0]

export type Inspector = Awaited<ReturnType<typeof inspectoresDTO>>[0]
