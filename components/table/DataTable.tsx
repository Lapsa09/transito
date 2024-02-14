'use client'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  Row,
  SortingState,
  getSortedRowModel,
  RowSelectionState,
  TableOptions,
  PaginationState,
  OnChangeFn,
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
import { useRouter, useSearchParams } from 'next/navigation'
import DataTableSorter from './DataTableSorter'

interface DataTableProps<TData> extends Partial<TableOptions<TData>> {
  columns: ColumnDef<TData>[]
  expand?: ComponentType<{ data: TData }>
  rowClassName?: (row: Row<TData>) => string
}

export function DataTable<TData>({
  columns,
  data = [],
  getRowCanExpand,
  expand: Expand,
  rowClassName,
  enableRowSelection = false,
  ...props
}: DataTableProps<TData>) {
  const router = useRouter()
  const queryParams = useSearchParams()
  const pageIndex = parseInt(queryParams.get('page') ?? '0')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const findFilter = (id: string) =>
    queryParams.getAll('filter').find((f) => f.startsWith(id))
  const findSort = (id: string) =>
    queryParams.getAll('sortBy').find((f) => f.startsWith(id))

  const columnFilters: ColumnFiltersState = [
    ...queryParams.getAll('filter'),
  ].map((param) => {
    const [id, value] = param.split('=')
    return {
      id,
      value,
    }
  })
  const sorting: SortingState = [...queryParams.getAll('sortBy')].map(
    (param) => {
      const [id, value] = param.split('=')
      return {
        id,
        desc: value === 'desc',
      }
    },
  )

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const newPage =
      typeof updater === 'function'
        ? updater({ pageIndex, pageSize: 10 })
        : updater
    const newSearchParams = new URLSearchParams(queryParams)
    newSearchParams.set('page', newPage.pageIndex.toString())
    router.replace(`?${newSearchParams.toString()}`)
  }

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const newColumnFilters =
      typeof updater === 'function' ? updater(columnFilters) : updater
    const newSearchParams = new URLSearchParams(queryParams)
    if (newColumnFilters.length === 0) newSearchParams.delete('filter')
    newColumnFilters.forEach((filter) => {
      newSearchParams.delete('filter', findFilter(filter.id))
      newSearchParams.append('filter', `${filter.id}=${filter.value}`)
    })
    router.replace(`?${newSearchParams.toString()}`)
  }

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting =
      typeof updater === 'function' ? updater(sorting) : updater
    const newSearchParams = new URLSearchParams(queryParams)
    if (newSorting.length === 0) newSearchParams.delete('sortBy')
    newSorting.forEach((sort) => {
      newSearchParams.delete('sortBy', findSort(sort.id))
      newSearchParams.set('sortBy', `${sort.id}=${sort.desc ? 'desc' : 'asc'}`)
    })
    router.replace(`?${newSearchParams.toString()}`)
  }

  const table = useReactTable({
    data,
    columns,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange',
    onColumnFiltersChange,
    onSortingChange,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    defaultColumn: {
      size: 200,
    },
    onPaginationChange,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    ...props,
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
                        <DataTableSorter header={header} />
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
