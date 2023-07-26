import { Registro } from '@/types/camiones'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const columns: ColumnDef<Registro>[] = [
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/operativos/edit/camiones/${row.getValue('id')}`}>
        Editar
      </Link>
    ),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
  {
    accessorKey: 'legajo_carga',
    header: 'Legajo Carga',
  },
  {
    accessorKey: 'direccion',
    header: 'Direccion',
  },
  {
    accessorKey: 'localidad',
    header: 'Localidad',
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
    accessorKey: 'hora_carga',
    header: 'Hora',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleTimeString(),
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
    accessorKey: 'origen',
    header: 'Origen',
  },
  {
    accessorKey: 'localidad_origen',
    header: 'Localidad Origen',
  },
  {
    accessorKey: 'destino',
    header: 'Destino',
  },
  {
    accessorKey: 'localidad_destino',
    header: 'Localidad Destino',
  },
  {
    accessorKey: 'remito',
    header: 'Remito',
    cell: ({ row }) => (row.getValue('remito') ? 'Si' : 'No'),
  },
  {
    accessorKey: 'carga',
    header: 'Carga',
    cell: ({ row }) => (row.getValue('carga') ? 'Si' : 'No'),
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
  },
  {
    accessorKey: 'motivo',
    header: 'Motivo',
  },
  {
    accessorKey: 'resolucion',
    header: 'Resolucion',
  },
]
