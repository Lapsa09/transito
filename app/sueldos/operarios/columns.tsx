import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Operario, Operarios } from '@/types/operarios.sueldos'

export const OperarioColumns: ColumnDef<Operario>[] = [
  {
    id: 'expander',
    size: 1450,
    cell: ({ row }) => {
      return (
        row.getCanExpand() && (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
          </button>
        )
      )
    },
  },
  {
    accessorFn: (row) => row.legajo,
    id: 'legajo',
    header: () => <span>Legajo</span>,
    cell: ({ getValue }) => getValue<number>(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.nombre,
    id: 'nombre',
    header: () => <span>Nombre</span>,
    cell: ({ getValue }) => getValue<string>(),
    footer: (props) => props.column.id,
  },
]

export const OperariosColumns: ColumnDef<Operarios>[] = [
  {
    accessorFn: (row) => row.servicio.cliente.cliente,
    id: 'cliente',
    header: () => <span>Cliente</span>,
    cell: ({ getValue }) => getValue<string>(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.servicio.fecha_servicio,
    id: 'fecha_servicio',
    header: () => 'Fecha Servicio',
    cell: ({ getValue }) => new Date(getValue<Date>()).toLocaleDateString(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.a_cobrar,
    id: 'a_cobrar',
    header: () => <span>A Cobrar</span>,
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.servicio.importe_servicio,
    id: 'importe_servicio',
    header: () => <span>Importe Servicio</span>,
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.servicio.memo,
    id: 'memo',
    header: () => <span>Memo</span>,
    cell: ({ getValue }) => getValue<string>(),
    footer: (props) => props.column.id,
  },
]