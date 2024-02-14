import { Header, flexRender } from '@tanstack/react-table'
import React from 'react'

function DataTableSorter<T, K>({ header }: { header: Header<T, K> }) {
  return (
    <div
      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
      onClick={header.column.getToggleSortingHandler()}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: ' 🔼',
        desc: ' 🔽',
      }[header.column.getIsSorted() as string] ?? null}
    </div>
  )
}

export default DataTableSorter
