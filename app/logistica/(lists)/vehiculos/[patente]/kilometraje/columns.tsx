import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { KilometrajeDTO } from '@/DTO/logistica/kilometraje'
import { ColumnDef } from '@tanstack/react-table'

export function getColumns(): ColumnDef<KilometrajeDTO>[] {
  return [
    {
      accessorFn: (row) => row.fecha,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha" />
      ),
      id: 'fecha',
    },
    {
      accessorKey: 'km',
      id: 'km',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kilometros" />
      ),
    },
    {
      accessorFn: (row) => row.filtro_aceite,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Filtro de aceite" />
      ),
      id: 'filtro_aceite',
    },
    {
      accessorFn: (row) => row.proximo_cambio_filtro,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Proximo cambio de filtro"
        />
      ),
      id: 'proximo_cambio_filtro',
    },
    {
      accessorFn: (row) => row.kit_distribucion,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kit de distribucion" />
      ),
      id: 'kit_distribucion',
    },
    {
      accessorFn: (row) => row.proximo_cambio_distribucion,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Proximo cambio de distribucion"
        />
      ),
      id: 'proximo_cambio_distribucion',
    },
    {
      accessorFn: (row) => row.kit_poly_v,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kit Poly V" />
      ),
      id: 'kit_poly_v',
    },
    {
      accessorFn: (row) => row.proximo_cambio_poly_v,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Proximo cambio Kit Poly V"
        />
      ),
      id: 'proximo_cambio_poly_v',
    },
  ]
}
