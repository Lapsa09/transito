'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

export function CustomOperativoLink() {
  const createSegment = useSelectedLayoutSegments()
  return createSegment.includes('create') ? null : (
    <Link href={`/operativos/create/${createSegment}`}>Nuevo Operativo</Link>
  )
}
