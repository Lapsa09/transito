'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { Cliente, Historial } from '@/types'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { Fragment } from 'react'
import Servicio from './servicio'
import { HistorialColumns } from './columns'

type MesProps = {
  data: Cliente
}

function Mes({ data }: MesProps) {
  const table = useReactTable<Historial>({
    data: data.historial,
    columns: HistorialColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: (row) => row.original.servicios.length > 0,
    getExpandedRowModel: getExpandedRowModel(),
  })
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className="relative pl-4 py-1 font-bold h-[30px]"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none `}
                  >
                    <div
                      className={`h-1/2 absolute top-1/4 w-1/2 ${
                        header.column.getIsResizing()
                          ? 'bg-black/50 opacity-100'
                          : 'bg-gray-200'
                      }`}
                    />
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => {
          return (
            <Fragment key={row.id}>
              <TableRow>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
              {row.getIsExpanded() && (
                <TableRow>
                  <TableCell colSpan={row.getVisibleCells().length}>
                    <Servicio data={row.original.servicios} />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default Mes
