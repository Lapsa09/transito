import CustomOperativoLink from './CustomLinks'

interface OperativosLayoutProps {
  modal: React.ReactNode
  children: React.ReactNode
}

export default function OperativosLayout(props: OperativosLayoutProps) {
  return (
    <main className="flex flex-col items-center gap-3">
      <CustomOperativoLink />
      {props.children}
      {props.modal}
    </main>
  )
}
