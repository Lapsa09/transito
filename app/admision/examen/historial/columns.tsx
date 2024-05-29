import { ColumnDef } from '@tanstack/react-table'
import { Examen } from './page'
import RespuestasAlumnoCard from '../RespuestasAlumno'

export const columns: ColumnDef<Examen>[] = [
  {
    accessorFn: (row) => `${row.nombre} - ${row.apellido}`,
    header: 'Nombre y apellido',
  },
  {
    accessorFn: (row) => row.dni,
    header: 'DNI',
  },
  {
    accessorFn: (row) => row.tipo_examen.tipo,
    header: 'Tipo de examen',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.examen.fecha,
    header: 'Fecha',
  },
  {
    accessorFn: (row) => row.nota,
    header: 'Nota',
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => <RespuestasAlumnoCard id={row.id} />,
    header: 'Respuestas',
    enableColumnFilter: false,
  },
]
