import { KilometrajeVehiculo } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<KilometrajeVehiculo>[] = [
  {
    accessorFn: (row) => row.interno,
    header: 'Interno',
  },
  {
    header: 'Fecha',
    accessorKey: 'fecha',
  },
  {
    header: 'Kilometros',
    accessorKey: 'km',
  },
  {
    accessorFn: (row) => row.filtro_aceite,
    header: 'Filtro Aceite',
  },
  {
    accessorFn: (row) => row.proximo_cambio_filtro,
    header: 'Proximo Cambio Filtro',
  },
  {
    accessorFn: (row) => row.kit_distribucion,
    header: 'Kit Distribucion',
  },
  {
    accessorFn: (row) => row.proximo_cambio_distribucion,
    header: 'Proximo Cambio Kit Distribucion',
  },
  {
    accessorFn: (row) => row.kit_poly_v,
    header: 'Kit Poly V',
  },
  {
    accessorFn: (row) => row.proximo_cambio_poly_v,
    header: 'Proximo Cambio Kit Poly V',
  },
]
