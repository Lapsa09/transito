import { CustomOperativoLink } from '@/components/CustomLinks'
import { PropsWithChildren } from 'react'

export default function OperativosLayout(props: PropsWithChildren) {
  return (
    <section className="flex flex-col items-center gap-3">
      <CustomOperativoLink />
      {props.children}
    </section>
  )
}
