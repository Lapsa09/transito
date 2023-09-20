import { KilometrajeVehiculo } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'

export const columnsVehiculos: ColumnDef<KilometrajeVehiculo>[] = [
  {
    accessorFn: (row) => row.kilometraje_vehiculos.interno,
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
    accessorFn: (row) => row.kilometraje_vehiculos.filtro_aceite,
    header: 'Filtro Aceite',
  },
  {
    accessorFn: (row) => row.kilometraje_vehiculos.proximo_cambio_filtro,
    header: 'Proximo Cambio Filtro',
  },
  {
    accessorFn: (row) => row.kilometraje_vehiculos.kit_distribucion,
    header: 'Kit Distribucion',
  },
  {
    accessorFn: (row) => row.kilometraje_vehiculos.proximo_cambio_distribucion,
    header: 'Proximo Cambio Kit Distribucion',
  },
  {
    accessorFn: (row) => row.kilometraje_vehiculos.kit_poly_v,
    header: 'Kit Poly V',
  },
  {
    accessorFn: (row) => row.kilometraje_vehiculos.proximo_cambio_poly_v,
    header: 'Proximo Cambio Kit Poly V',
  },
]
