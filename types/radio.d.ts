import { inspectoresDTO } from '@/app/api/(autocompletes)/inspectores/route'
import { partesDTO } from '@/app/api/radio/partes/route'
import { parte } from '@prisma/client'

export type Parte = Awaited<ReturnType<typeof partesDTO>>[0]

export type Inspector = Awaited<ReturnType<typeof inspectoresDTO>>[0]
