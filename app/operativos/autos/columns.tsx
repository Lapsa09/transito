import { OperativoAutos } from '@/types/operativos'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<OperativoAutos>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 55,
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => new Date(row.getValue('fecha')).toLocaleDateString(),
  },
  {
    accessorKey: 'hora',
    header: 'Hora',
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
    size: 185,
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
    size: 230,
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
    accessorKey: 'graduacion_alcoholica',
    header: 'Graduación alcohólica',
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
    accessorKey: 'motivo',
    header: 'Motivo',
    size: 180,
  },
  {
    accessorKey: 'acta',
    header: 'Acta',
  },
]
