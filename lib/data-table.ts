import { RxMix, RxSquare } from 'react-icons/rx'

export type DataTableConfig = typeof dataTableConfig

export const dataTableConfig = {
  comparisonOperators: [
    { label: 'Contiene', value: 'ilike' as const },
    { label: 'No contiene', value: 'notIlike' as const },
    { label: 'Es', value: 'eq' as const },
    { label: 'No es', value: 'notEq' as const },
    { label: 'Empieza con', value: 'startsWith' as const },
    { label: 'Termina con', value: 'endsWith' as const },
    { label: 'Esta vacio', value: 'isNull' as const },
    { label: 'No esta vacio', value: 'isNotNull' as const },
  ],
  selectableOperators: [
    { label: 'Es', value: 'eq' as const },
    { label: 'No es', value: 'notEq' as const },
    { label: 'Esta vacio', value: 'isNull' as const },
    { label: 'No esta vacio', value: 'isNotNull' as const },
  ],
  logicalOperators: [
    {
      label: 'Y',
      value: 'and' as const,
      description: 'Todas las condiciones se cumplen',
    },
    {
      label: 'O',
      value: 'or' as const,
      description: 'Al menos una condicion se cumple',
    },
  ],
  featureFlags: [
    {
      label: 'Filtro avanzado',
      value: 'advancedFilter' as const,
      icon: RxMix,
      tooltipTitle: 'Toggle advanced filter',
      tooltipDescription: 'A notion like query builder to filter rows.',
    },
    {
      label: 'Floating bar',
      value: 'floatingBar' as const,
      icon: RxSquare,
      tooltipTitle: 'Toggle floating bar',
      tooltipDescription: 'A floating bar that sticks to the top of the table.',
    },
  ],
}
