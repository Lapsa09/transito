import Button from '@/components/Button'
import SeguroForm from '@/components/forms/logistica/seguro.form'
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
    accessorFn: (vehiculo) => vehiculo.uso.uso,
    header: 'Uso',
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
    id: 'kilometraje',
    cell: ({ row }) => (
      <Link href={`/logistica/vehiculos/${row.original.patente}/kilometraje`}>
        <Button>Ver</Button>
      </Link>
    ),
    header: 'Kilometraje',
  },
  {
    id: 'reparaciones',
    cell: ({ row }) => (
      <Link href={`/logistica/vehiculos/${row.original.patente}/reparaciones`}>
        <Button>Ver</Button>
      </Link>
    ),
    header: 'Reparaciones',
  },
  {
    id: 'vtv',
    cell: ({ row }) => (
      <Link href={`/logistica/vehiculos/${row.original.patente}/vtv`}>
        <Button>Ver</Button>
      </Link>
    ),
    header: 'VTV',
  },
  {
    id: 'seguro',
    cell: ({ row }) => <SeguroForm movil={row.original} />,
    header: 'Seguro',
  },
]
