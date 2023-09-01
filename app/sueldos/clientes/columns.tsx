import { Cliente, Historial, IOperario, Servicio, Meses } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'

export const ClientesColumns: ColumnDef<Cliente>[] = [
  {
    id: 'expander',
    header: () => null,
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
    accessorKey: 'cliente',
    header: 'Cliente',
    cell: ({ row, getValue }) => (
      <div
        style={{
          // Since rows are flattened by default,
          // we can use the row.depth property
          // and paddingLeft to visually indicate the depth
          // of the row
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        {getValue<string>()}
      </div>
    ),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.a_favor,
    id: 'a_favor',
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    header: 'A Favor',
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.a_deudor,
    id: 'a_deudor',
    header: 'A Deudor',
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
]

export const HistorialColumns: ColumnDef<Historial>[] = [
  {
    id: 'expander',
    header: () => null,
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
    accessorFn: (row) => Meses[row.mes as keyof typeof Meses],
    header: 'Mes',
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.año,
    id: 'año',
    cell: (info) => info.getValue(),
    header: 'Año',
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.gastos,
    id: 'gastos',
    header: 'Gastos',
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.acopio,
    id: 'acopio',
    header: 'Acopio',
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
    footer: (props) => props.column.id,
  },
]

export const ServicioColumns: ColumnDef<Servicio>[] = [
  {
    id: 'expander',
    header: () => null,
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
    accessorFn: (row) => row.memo,
    id: 'memo',
    cell: (info) => info.getValue(),
    header: () => <span>Memo</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'fecha_servicio',
    header: () => 'Fecha Servicio',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    footer: (props) => props.column.id,
  },
  {
    id: 'importe_servicio',
    accessorFn: (row) => row.importe_servicio,
    header: () => <span>Importe Servicio</span>,
    cell: ({ getValue }) => `$ ${getValue<number>()}`,
  },
]

export const OperarioColumns: ColumnDef<IOperario>[] = [
  {
    accessorFn: (row) => row.legajo,
    id: 'legajo',
    cell: (info) => info.getValue(),
    header: () => <span>Legajo</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.operarios?.nombre,
    id: 'nombre',
    cell: (info) => info.getValue(),
    header: () => <span>Nombre</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.hora_inicio,
    id: 'hora_inicio',
    cell: (info) => info.getValue(),
    header: () => <span>Hora Inicio</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.hora_fin,
    id: 'hora_fin',
    cell: (info) => info.getValue(),
    header: () => <span>Hora Fin</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.a_cobrar,
    id: 'a_cobrar',
    cell: (info) => info.getValue(),
    header: () => <span>A Cobrar</span>,
    footer: (props) => props.column.id,
  },
]
