interface OperativosLayoutProps {
  modal: React.ReactNode
  children: React.ReactNode
}

export default function OperativosLayout(props: OperativosLayoutProps) {
  return (
    <main>
      {props.children}
      {props.modal}
    </main>
  )
}
