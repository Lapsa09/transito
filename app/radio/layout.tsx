import CustomOperativoLink from './CustomLinks'
import LayoutClient from './layout.client'

interface OperativosLayoutProps {
  modal: React.ReactNode
  children: React.ReactNode
}

export default function OperativosLayout(props: OperativosLayoutProps) {
  return (
    <LayoutClient>
      <CustomOperativoLink />
      {props.children}
      {props.modal}
    </LayoutClient>
  )
}
