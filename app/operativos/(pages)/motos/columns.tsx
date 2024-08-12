import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { MotosDTO } from '@/DTO/motos'
import { getLocalDate } from '@/utils/misc'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export function getColumns(): ColumnDef<MotosDTO>[] {
  return [
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link href={`/operativos/motos/${row.getValue('id')}`}>Editar</Link>
      ),
      size: 100,
    },
    {
      accessorFn: (row) => row.id,
      id: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="id" />
      ),
    },
    {
      accessorFn: (row) => row.fecha && getLocalDate(row.fecha),
      id: 'fecha',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha" />
      ),
    },
    {
      accessorFn: (row) => row.hora,
      id: 'hora',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hora" />
      ),
    },
    {
      accessorFn: (row) => row.qth?.toLocaleUpperCase(),
      id: 'qth',
      size: 600,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="QTH" />
      ),
    },
    {
      accessorFn: (row) => row.localidad,
      id: 'localidad',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Localidad" />
      ),
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
      id: 'turno',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Turno" />
      ),
    },
    {
      accessorFn: (row) => row.legajo_a_cargo,
      id: 'legajo_a_cargo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Legajo a cargo" />
      ),
    },
    {
      accessorFn: (row) => row.legajo_planilla,
      id: 'legajo_planilla',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Legajo planilla" />
      ),
    },
    {
      accessorFn: (row) => row.seguridad,
      id: 'seguridad',
      size: 300,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Seguridad" />
      ),
    },
    {
      accessorFn: (row) => row.dominio?.toLocaleUpperCase(),
      id: 'dominio',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dominio" />
      ),
    },
    {
      accessorFn: (row) => row.licencia,
      id: 'licencia',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Licencia" />
      ),
    },
    {
      accessorFn: (row) => row.tipo_licencia,
      id: 'tipo_licencia',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de licencia" />
      ),
    },
    {
      accessorFn: (row) => row.vehiculo,
      id: 'tipo_vehiculo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de vehiculo" />
      ),
    },
    {
      accessorFn: (row) => row.zona_infractor,
      id: 'zona_infractor',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Localidad del infractor"
        />
      ),
    },
    {
      accessorFn: (row) => row.resolucion,
      id: 'resolucion',
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Resolucion" />
      ),
    },
    {
      accessorFn: (row) => row.acta,
      id: 'acta',
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Acta" />
      ),
    },
    {
      accessorFn: (row) => row.motivos.join(', '),
      id: 'motivos',
      size: 400,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motivos" />
      ),
    },
    {
      accessorFn: (row) => row.direccion_full?.toLocaleUpperCase(),
      id: 'direccion_full',
      size: 900,
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="direccion_full" />
      ),
    },
    {
      accessorFn: (row) => row.latitud,
      id: 'latitud',
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Latitud" />
      ),
    },
    {
      accessorFn: (row) => row.longitud,
      id: 'longitud',
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Longitud" />
      ),
    },
  ]
}
