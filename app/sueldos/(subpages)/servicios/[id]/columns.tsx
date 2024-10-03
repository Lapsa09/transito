import { Button } from '@/components/ui/button'
import { cancelarOperario } from '@/services'
import { OperariosDTO } from '@/types/servicios.sueldos'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'

export const operarioColumns = (): ColumnDef<OperariosDTO>[] => [
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
    accessorFn: (row) => row.horaInicio,
    id: 'hora_inicio',
    cell: (info) =>
      DateTime.fromISO(info.getValue<string>(), {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
    header: () => <span>Hora Inicio</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.horaFin,
    id: 'hora_fin',
    cell: (info) =>
      DateTime.fromISO(info.getValue<string>(), {
        setZone: true,
      }).toLocaleString(DateTime.TIME_24_SIMPLE),
    header: () => <span>Hora Fin</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.aCobrar,
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
          await cancelarOperario({
            id_servicio: info.row.original.id,
            body: {
              cancelado: info.row.original.cancelado,
            },
          })
        }}
      >
        Cancelar
      </Button>
    ),
  },
]
