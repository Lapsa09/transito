'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import Button from './Button'
import { mutate } from 'swr'
import { baches } from '@prisma/client'
import { updater } from '@/services'

export function CustomOperativoLink() {
  const createSegment = useSelectedLayoutSegments()
  return (
    <Link href={`/operativos/create/${createSegment}`}>Nuevo Operativo</Link>
  )
}

export function CustomRepararBacheButton({ id }: { id: string }) {
  const reparar = async () => {
    await mutate<baches[]>({ route: '/waze/baches' }, async (data) => {
      const res = await updater<baches>({
        route: `/waze/baches/reparacion/${id}`,
      })
      return data?.map((bache) => {
        if (bache.id === +id) {
          return res
        }
        return bache
      })
    })
  }

  return <Button onClick={reparar}>Reparar</Button>
}
