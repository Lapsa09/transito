import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { RioDTO } from '@/DTO/operativos/rio'
import { getLocalDate } from '@/utils/misc'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export function getColumns(): ColumnDef<RioDTO>[] {
  return [
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link href={`/operativos/rio/${row.getValue('id')}`}>Editar</Link>
      ),
    },
    {
      id: 'id',
      accessorFn: (registro) => registro.id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="id" />
      ),
      size: 100,
    },
    {
      accessorFn: (row) => row.fecha && getLocalDate(row.fecha),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha" />
      ),
      id: 'fecha',
    },
    {
      accessorFn: (registro) => registro.turno,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Turno" />
      ),
      id: 'turno',
    },
    {
      accessorFn: (registro) => registro.legajo,
      id: 'legajo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Legajo" />
      ),
    },
    {
      accessorFn: (registro) => registro.dominio?.toUpperCase(),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dominio" />
      ),
      id: 'dominio',
    },
    {
      accessorFn: (registro) => registro.zona_infractor,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Barrio" />
      ),
      id: 'zona_infractor',
    },
    {
      accessorFn: (registro) => registro.zona,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Zona" />
      ),
      id: 'zona',
    },
    {
      accessorFn: (row) => row.fecha_carga,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de carga" />
      ),
      id: 'fecha_carga',
    },
  ]
}
