import { Button } from '@/components/ui/button'
import SeguroForm from '@/components/forms/logistica/seguro.form'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { VehiculoDTO } from '@/DTO/logistica/vehiculos'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

export function getColumns(): ColumnDef<VehiculoDTO>[] {
  return [
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Patente" />
      ),
      accessorKey: 'patente',
    },

    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Marca" />
      ),
      accessorKey: 'marca',
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Modelo" />
      ),
      accessorKey: 'modelo',
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Año" />
      ),
      accessorKey: 'año',
    },
    {
      accessorFn: (vehiculo) => vehiculo.tipo,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de vehiculo" />
      ),
      id: 'tipo',
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de combustible" />
      ),
      accessorKey: 'tipo_combustible',
    },
    {
      accessorKey: 'tipo_motor',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de motor" />
      ),
    },
    {
      accessorKey: 'no_chasis',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nº de chasis" />
      ),
    },
    {
      accessorFn: (vehiculo) => vehiculo.uso,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Uso" />
      ),
      id: 'uso',
    },
    {
      accessorFn: (vehiculo) => vehiculo.dependencia,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dependencia" />
      ),
      id: 'dependencia',
    },
    {
      accessorKey: 'id_megatrans',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID Megatrans" />
      ),
    },
    {
      accessorFn: (vehiculo) => (vehiculo.plan_renovacion ? 'Si' : 'No'),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Plan de renovacion" />
      ),
      id: 'plan_renovacion',
    },
    {
      accessorKey: 'empresa_seguimiento',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Empresa de seguimiento" />
      ),
    },
    {
      id: 'kilometraje',
      cell: ({ row }) => (
        <Link href={`/logistica/vehiculos/${row.original.patente}/kilometraje`}>
          <Button>Ver</Button>
        </Link>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kilometraje" />
      ),
    },
    {
      id: 'reparaciones',
      cell: ({ row }) => (
        <Link
          href={`/logistica/vehiculos/${row.original.patente}/reparaciones`}
        >
          <Button>Ver</Button>
        </Link>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reparaciones" />
      ),
    },
    {
      id: 'vtv',
      cell: ({ row }) => (
        <Link href={`/logistica/vehiculos/${row.original.patente}/vtv`}>
          <Button>Ver</Button>
        </Link>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="VTV" />
      ),
    },
    {
      id: 'seguro',
      cell: ({ row }) => <SeguroForm movil={row.original} />,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Seguro" />
      ),
    },
  ]
}
