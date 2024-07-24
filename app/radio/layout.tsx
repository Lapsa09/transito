import Link from 'next/link'

interface OperativosLayoutProps {
  modal: React.ReactNode
  children: React.ReactNode
}

export default function OperativosLayout(props: OperativosLayoutProps) {
  return (
    <main className="flex flex-col items-center gap-3">
      <Link href="/radio/partes/create">Nuevo Parte</Link>
      {props.children}
      {props.modal}
    </main>
  )
}
