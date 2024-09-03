import { Button } from '@/components/ui/button'
import { NumeroMemo } from '@/components/MiniModals'
import { Servicio } from '@/types/servicios.sueldos'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import Link from 'next/link'

export const servicioColumns = (): ColumnDef<Servicio>[] => [
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
        <NumeroMemo id_servicio={info.row.original.idServicio} />
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
    accessorFn: (row) => row.importeServicio,
    id: 'importe_servicio',
    cell: (info) => `$ ${info.getValue<number>()}`,
    header: () => <span>Importe Servicio</span>,
    footer: (props) => props.column.id,
  },
  {
    id: 'cantidad_operarios',
    accessorFn: (row) => row.cantidad_operarios,
    header: () => <span>Cantidad de operarios</span>,
  },
  {
    id: 'operarios',
    cell: ({ row }) => (
      <Link href={`/sueldos/servicios/operarios/${row.original.idServicio}`}>
        <Button>Operarios</Button>
      </Link>
    ),
  },
  {
    id: 'edit',
    header: () => null,
    cell: ({ row }) => (
      <Link href={`/sueldos/servicios/edit/${row.original.idServicio}`}>
        <Button>Editar</Button>
      </Link>
    ),
  },
]
