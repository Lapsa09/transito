import Button from '@/components/Button'
import { NumeroMemo } from '@/components/MiniModals'
import { cancelarOperario } from '@/services'
import { Operarios, Servicio } from '@/types/servicios.sueldos'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { DateTime } from 'luxon'
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
    accessorFn: (row) => row.clientes?.cliente,
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
    accessorFn: (row) => row.importe_servicio,
    id: 'importe_servicio',
    cell: (info) => `$ ${info.getValue<number>()}`,
    header: () => <span>Importe Servicio</span>,
    footer: (props) => props.column.id,
  },
  {
    id: 'cantidad_operarios',
    cell: (info) =>
      info.row.original.operarios_servicios?.filter(
        (operario) => operario.legajo !== 1,
      ).length,
    header: () => <span>Cantidad de operarios</span>,
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
    accessorFn: (row) => row.operarios?.nombre,
    id: 'nombre',
    cell: (info) => info.getValue(),
    header: () => <span>Nombre</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.hora_inicio,
    id: 'hora_inicio',
    cell: (info) =>
      DateTime.fromISO(info.getValue<string>(), {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
    header: () => <span>Hora Inicio</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.hora_fin,
    id: 'hora_fin',
    cell: (info) =>
      DateTime.fromISO(info.getValue<string>(), {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
    header: () => <span>Hora Fin</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.a_cobrar,
    id: 'a_cobrar',
    cell: (info) => `$ ${info.getValue<number>()}`,
    header: () => <span>A Cobrar</span>,
    footer: (props) => props.column.id,
  },
  {
    id: 'actions',
    header: () => null,
    cell: (info) => (
      <Button
        onClick={async () => {
          await mutate<Servicio[]>(
            'servicios',
            async (data) => {
              const res = await cancelarOperario({
                id_servicio: info.row.original.id,
                body: {
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
            { revalidate: false },
          )
        }}
      >
        Cancelar
      </Button>
    ),
  },
]
