import { proveedor } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<proveedor>[] = [
  {
    header: 'Nombre',
    accessorKey: 'nombre',
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo de Repuestos',
  },
  {
    accessorKey: 'marcas',
    header: 'Marcas',
  },
  {
    header: 'Direccion',
    accessorKey: 'direccion',
  },
  {
    accessorKey: 'ciudad',
    header: 'Ciudad',
  },
  {
    accessorKey: 'provincia',
    header: 'Provincia',
  },
  {
    accessorKey: 'horarios',
    header: 'Horarios',
  },
  {
    header: 'Telefono',
    accessorKey: 'telefono',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Contacto',
    accessorKey: 'contacto',
  },
  {
    header: 'Observaciones',
    accessorKey: 'observaciones',
  },
]
