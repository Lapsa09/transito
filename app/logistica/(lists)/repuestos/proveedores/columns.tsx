import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { proveedor } from '@/drizzle/schema/logistica'
import { ColumnDef } from '@tanstack/react-table'

export function getColumns(): ColumnDef<typeof proveedor.$inferSelect>[] {
  return [
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      accessorKey: 'nombre',
    },
    {
      accessorKey: 'tipo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de repuestos" />
      ),
    },
    {
      accessorKey: 'marcas',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Marcas" />
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Direccion" />
      ),
      accessorKey: 'direccion',
    },
    {
      accessorKey: 'ciudad',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ciudad" />
      ),
    },
    {
      accessorKey: 'provincia',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Provincia" />
      ),
    },
    {
      accessorKey: 'horarios',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Horarios" />
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Telefono" />
      ),
      accessorKey: 'telefono',
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      accessorKey: 'email',
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contacto" />
      ),
      accessorKey: 'contacto',
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Observaciones" />
      ),
      accessorKey: 'observaciones',
    },
  ]
}
