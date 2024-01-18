'use client'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  ColumnFiltersState,
  Row,
  SortingState,
  getSortedRowModel,
  RowSelectionState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { DataTablePagination } from './DataTablePagination'
import { ComponentType, Fragment, useState } from 'react'
import Filter from './DataTableFilters'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data?: TData[]
  getRowCanExpand?: (row: Row<TData>) => boolean
  expand?: ComponentType<{ data: TData }>
  rowClassName?: (row: Row<TData>) => string
  enableRowSelection?: boolean
}

export function DataTable<TData>({
  columns,
  data = [],
  getRowCanExpand,
  expand: Expand,
  rowClassName,
  enableRowSelection = false,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const table = useReactTable({
    data,
    columns,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange',
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      sorting,
      rowSelection,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    defaultColumn: {
      size: 200,
    },
  })
  return (
    <div className="w-full">
      <div className="rounded-md border overflow-x-auto">
        <Table style={{ width: table.getCenterTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="relative pl-4 py-1 font-bold h-[30px]"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    className={rowClassName ? rowClassName(row) : 'uppercase'}
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {Expand && (
                    <TableRow
                      className={`${row.getIsExpanded() ? '' : 'hidden'}`}
                    >
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <Expand data={row.original} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

export default DataTable
