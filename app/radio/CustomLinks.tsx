'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function CustomOperativoLink() {
  const createSegment = useSelectedLayoutSegment()
  return <Link href={`/radio/${createSegment}/create`}>Nuevo Parte</Link>
}
