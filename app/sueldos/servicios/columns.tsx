import Button from '@/components/Button'
import IndeterminateCheckbox from '@/components/Checkbox'
import { NumeroMemo } from '@/components/MiniModals'
import { cancelarOperario } from '@/services'
import { Operarios, Servicio } from '@/types/servicios.sueldos'
import { servicios } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { mutate } from 'swr'

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
    accessorFn: (row) => row.cliente?.cliente,
    id: 'cliente',
    cell: (info) => info.getValue(),
    header: () => <span>Cliente</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.memo,
    id: 'memo',
    cell: (info) =>
      info.getValue() || (
        <NumeroMemo id_servicio={info.row.original.id_servicio} />
      ),
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
    accessorFn: (row) => row.importe_servicio,
    id: 'importe_servicio',
    cell: (info) => `$ ${info.getValue<number>()}`,
    header: () => <span>Importe Servicio</span>,
    footer: (props) => props.column.id,
  },
  {
    id: 'edit',
    header: () => null,
    cell: ({ row }) => (
      <Link href={`/sueldos/servicios/edit/${row.original.id_servicio}`}>
        <Button>Editar</Button>
      </Link>
    ),
  },
]

export const OperarioColumns: ColumnDef<Operarios>[] = [
  {
    accessorFn: (row) => row.legajo,
    id: 'legajo',
    cell: (info) => info.getValue(),
    header: () => <span>Legajo</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.operario.nombre,
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
  {
    id: 'actions',
    header: () => null,
    cell: (info) => (
      <Button
        onClick={() => {
          mutate<servicios[]>(
            'servicios',
            async (data) => {
              const res = await cancelarOperario({
                id_servicio: info.row.original.id,
                body: {
                  legajo: info.row.original.legajo,
                  cancelado: info.row.original.cancelado,
                },
              })
              if (data) {
                return data.map((servicio) => {
                  if (servicio.id_servicio === res.id_servicio) {
                    return res
                  }
                  return servicio
                })
              }
              return [res]
            },
            { revalidate: false }
          )
        }}
      >
        Cancelar
      </Button>
    ),
  },
]
