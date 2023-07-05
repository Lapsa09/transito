'use client'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

interface OperativosLayoutProps {
  modal: React.ReactNode
  children: React.ReactNode
}

export default function OperativosLayout(props: OperativosLayoutProps) {
  const createSegment = useSelectedLayoutSegments()

  return (
    <section>
      {!createSegment.includes('create') && (
        <Link href={`/operativos/create/${createSegment}`}>
          Nuevo Operativo
        </Link>
      )}
      {props.children}
      {props.modal}
    </section>
  )
}
