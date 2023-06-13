'use client'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

interface OperativosLayoutProps {
  modal: React.ReactNode
  children: React.ReactNode
}

export default function OperativosLayout(props: OperativosLayoutProps) {
  const createSegment = useSelectedLayoutSegment()
  return (
    <section>
      {createSegment !== 'create' && (
        <Link href={`/operativos/create/${createSegment}`}>
          Nuevo Operativo
        </Link>
      )}
      {props.children}
      {props.modal}
    </section>
  )
}
