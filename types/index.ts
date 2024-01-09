export * from './Forms.d'
export * from './Misc.d'
export * from './clientes.sueldos.d'
export * from './operativos.d'

// Redecalare forwardRef
declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}
