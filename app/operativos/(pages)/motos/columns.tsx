import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Registro } from '@/types/motos'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/edit/motos/${row.getValue('id')}`}>Editar</Link>
    ),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => new Date(row.getValue('fecha')).toLocaleDateString(),
  },
  {
    accessorKey: 'hora',
    header: 'Hora',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleTimeString(),
  },
  {
    accessorKey: 'legajo_a_cargo',
    header: 'Legajo a cargo',
  },
  {
    accessorKey: 'legajo_planilla',
    header: 'Legajo planilla',
  },
  {
    accessorKey: 'qth',
    header: 'QTH',
  },
  {
    accessorKey: 'barrio',
    header: 'Barrio',
  },
  {
    accessorKey: 'cp',
    header: 'CP',
  },
  {
    accessorKey: 'turno',
    header: 'Turno',
  },
  {
    accessorKey: 'seguridad',
    header: 'Seguridad',
  },
  {
    accessorKey: 'dominio',
    header: 'Dominio',
  },
  {
    accessorKey: 'licencia',
    header: 'Licencia',
  },
  {
    accessorKey: 'tipo_licencia',
    header: 'Tipo de licencia',
  },
  {
    accessorKey: 'tipo_vehiculo',
    header: 'Tipo de vehículo',
  },
  {
    accessorKey: 'zona_infractor',
    header: 'Zona infractor',
  },
  {
    accessorKey: 'resolucion',
    header: 'Resolución',
  },
  {
    accessorKey: 'motivos',
    header: 'Motivos',
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
  },
]
