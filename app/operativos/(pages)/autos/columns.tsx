import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { AutosDTO } from '@/DTO/autos'
import { getLocalDate } from '@/utils/misc'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export function getColumns(): ColumnDef<AutosDTO>[] {
  return [
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link href={`/operativos/autos/${row.getValue('id')}`}>Editar</Link>
      ),
      size: 100,
    },
    {
      accessorFn: (row) => row.id,
      id: 'id',
      enableColumnFilter: false,
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
      enableColumnFilter: false,
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
      enableColumnFilter: false,
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
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Legajo a cargo" />
      ),
    },
    {
      accessorFn: (row) => row.legajo_planilla,
      id: 'legajo_planilla',
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Legajo planilla" />
      ),
    },
    {
      accessorFn: (row) => row.seguridad,
      id: 'seguridad',
      enableColumnFilter: false,
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
      enableColumnFilter: false,
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
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de vehiculo" />
      ),
    },
    {
      accessorFn: (row) => row.graduacion_alcoholica,
      id: 'graduacion_alcoholica',
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Graduacion alcoholica" />
      ),
    },
    {
      accessorFn: (row) => row.resultado,
      id: 'resultado_alcoholemia',
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Resultado de alcoholemia"
        />
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
      accessorFn: (row) => row.es_del,
      id: 'vecino',
      cell: ({ getValue }) => (getValue() === 'VILO' ? 'SI' : 'NO'),
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vecino?" />
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
      accessorFn: (row) => row.motivo,
      id: 'motivo',
      size: 400,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motivo" />
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
