import Button from '@/components/Button'
import { Vehiculo } from '@/types/logistica'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const columns: ColumnDef<Vehiculo>[] = [
  {
    header: 'Dominio',
    accessorKey: 'patente',
  },

  {
    header: 'Marca',
    accessorKey: 'marca',
  },
  {
    header: 'Modelo',
    accessorKey: 'modelo',
  },
  {
    header: 'Año',
    accessorKey: 'a_o',
  },
  {
    accessorFn: (vehiculo) => vehiculo.tipo_vehiculo.tipo,
    header: 'Tipo de vehiculo',
  },
  {
    header: 'Tipo de combustible',
    accessorKey: 'tipo_combustible',
  },
  {
    accessorKey: 'tipo_motor',
    header: 'Tipo de motor',
  },
  {
    accessorKey: 'no_chasis',
    header: 'No. de chasis',
  },
  {
    accessorKey: 'km_dia',
    header: 'Km por dia',
  },
  {
    accessorFn: (vehiculo) => vehiculo.sector.sector,
    header: 'Sector',
  },
  {
    accessorFn: (vehiculo) => vehiculo.dependencia.dependencia,
    header: 'Dependencia',
  },
  {
    accessorKey: 'id_megatrans',
    header: 'ID Megatrans',
  },
  {
    accessorFn: (vehiculo) => (vehiculo.plan_renovacion ? 'Si' : 'No'),
    header: 'Plan de renovacion',
  },
  {
    accessorKey: 'empresa_seguimiento',
    header: 'Empresa de seguimiento',
  },
  {
    id: 'service',
    cell: ({ row }) => (
      <Link href={`/logistica/vehiculos/${row.original.patente}/service`}>
        <Button>Service</Button>
      </Link>
    ),
  },
  {
    id: 'reparaciones',
    cell: ({ row }) => (
      <Link href={`/logistica/vehiculos/${row.original.patente}/reparaciones`}>
        <Button>Reparaciones</Button>
      </Link>
    ),
  },
  {
    id: 'vtv',
    cell: ({ row }) => (
      <Link href={`/logistica/vehiculos/${row.original.patente}/vtv`}>
        <Button>VTV</Button>
      </Link>
    ),
  },
]
