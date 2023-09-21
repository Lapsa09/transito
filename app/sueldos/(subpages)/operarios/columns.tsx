import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Operario, Operarios } from '@/types/operarios.sueldos'
import { DateTime } from 'luxon'

export const OperarioColumns: ColumnDef<Operario>[] = [
  {
    id: 'expander',
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
    accessorFn: (row) => row.servicios?.clientes?.cliente,
    id: 'cliente',
    header: () => <span>Cliente</span>,
    cell: ({ getValue }) => getValue<string>(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.servicios?.fecha_servicio,
    id: 'fecha_servicio',
    header: () => 'Fecha Servicio',
    cell: ({ getValue }) =>
      DateTime.fromISO(getValue<string>(), {
        setZone: true,
      }).toLocaleString(DateTime.DATE_SHORT),
    footer: (props) => props.column.id,
    filterFn: (row, id, filter) =>
      DateTime.fromISO(row.getValue<string>(id), {
        setZone: true,
      })
        .toLocaleString(DateTime.DATE_SHORT)
        .includes(filter),
  },
  {
    accessorFn: (row) => row.a_cobrar,
    id: 'a_cobrar',
    header: () => <span>A Cobrar</span>,
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.servicios?.importe_servicio,
    id: 'importe_servicio',
    header: () => <span>Importe Servicio</span>,
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.servicios?.memo,
    id: 'memo',
    header: () => <span>Memo</span>,
    cell: ({ getValue }) => getValue<string>(),
    footer: (props) => props.column.id,
  },
]
