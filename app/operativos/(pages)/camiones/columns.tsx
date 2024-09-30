import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { CamionesDTO } from '@/DTO/operativos/camiones'
import { getLocalDate, getLocalTime } from '@/utils/misc'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const getColumns: () => ColumnDef<CamionesDTO>[] = () => {
  return [
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link href={`/operativos/camiones/${row.getValue('id')}`}>Editar</Link>
      ),
    },
    {
      accessorKey: 'id',
      size: 100,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="id" />
      ),
    },
    {
      accessorFn: (operativo) =>
        operativo.fecha && getLocalDate(operativo.fecha),
      id: 'fecha',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha" />
      ),
    },
    {
      accessorFn: (row) => row.legajo,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Legajo" />
      ),
      id: 'legajo',
    },
    {
      accessorFn: (row) => row.qth,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Direccion" />
      ),
      id: 'qth',
      size: 500,
    },
    {
      accessorFn: (row) => row.localidad,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Localidad" />
      ),
      id: 'localidad',
    },
    {
      accessorFn: (row) => row.cp,
      id: 'cp',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CP" />
      ),
    },
    {
      accessorFn: (row) => row.turno,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Turno" />
      ),
      id: 'turno',
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hora" />
      ),
      id: 'hora',
      accessorFn: ({ hora, fecha }) => getLocalTime(fecha + 'T' + hora),
    },
    {
      id: 'dominio',
      accessorFn: (row) => row.dominio,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dominio" />
      ),
    },
    {
      id: 'licencia',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Licencia" />
      ),
      accessorFn: (row) => row.licencia,
    },
    {
      id: 'origen',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Origen" />
      ),
      accessorFn: (row) => row.origen,
      size: 500,
    },
    {
      accessorFn: (row) => row.localidad_origen,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Localidad de Origen" />
      ),
      id: 'localidad_origen',
    },
    {
      id: 'destino',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Destino" />
      ),
      accessorFn: (row) => row.destino,
      size: 500,
    },
    {
      accessorFn: (row) => row.localidad_destino,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Localidad de Destino" />
      ),
      id: 'localidad_destino',
    },
    {
      id: 'remito',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remito?" />
      ),
      cell: ({ row }) => (row.getValue('remito') ? 'Si' : 'No'),
      accessorFn: (row) => row.remito,
    },
    {
      id: 'carga',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Carga?" />
      ),
      cell: ({ row }) => (row.getValue('carga') ? 'Si' : 'No'),
      accessorFn: (row) => row.carga,
    },
    {
      id: 'acta',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Acta" />
      ),
      accessorFn: (row) => row.acta,
    },
    {
      accessorFn: (row) => row.motivo,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motivo" />
      ),
      id: 'motivo',
    },
    {
      id: 'resolucion',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Resolucion" />
      ),
      accessorFn: (row) => row.resolucion,
    },
  ]
}
