import {
  Autocomplete,
  AutocompleteItem,
  Input,
  TimeInput,
} from '@nextui-org/react'
import { Column, RowData } from '@tanstack/react-table'
import { Key, useEffect, useMemo, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { DateInput } from '@nextui-org/react'
import { parseDate, parseTime } from '@internationalized/date'

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'date' | 'time' | 'select'
    filterTag?: string
  }
}

function Filter<T, K>({ column }: { column: Column<T, K> }) {
  const columnsFilterValue = column.getFilterValue() as string | undefined
  const [filter, setFilter] = useState(columnsFilterValue)

  const debouncedSetFilterValue = useDebounceCallback(
    column.setFilterValue,
    1000,
  )

  const { filterVariant } = column.columnDef.meta ?? {}

  useEffect(() => {
    debouncedSetFilterValue(filter)
  }, [filter])

  const sortedUniqueValues = useMemo(
    () =>
      filterVariant !== 'select'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant],
  )

  if (filterVariant === 'date')
    return (
      <DateInput
        className="mb-1"
        aria-label={column.id}
        size="sm"
        value={filter ? parseDate(filter) : null}
        onChange={(date) => setFilter(date?.toString())}
      />
    )

  if (filterVariant === 'time')
    return (
      <TimeInput
        className="mb-1"
        aria-label={column.id}
        size="sm"
        value={filter ? parseTime(filter) : null}
        onChange={(time) => setFilter(time?.toString())}
      />
    )

  if (filterVariant === 'select' && sortedUniqueValues.length > 0) {
    return (
      <Autocomplete
        value={filter}
        defaultInputValue={filter}
        onSelectionChange={(value) => setFilter(value?.toString() ?? '')}
        placeholder="Buscar..."
        aria-label={column.id}
        size="sm"
        className="mb-1"
      >
        {sortedUniqueValues.map((value) => (
          <AutocompleteItem key={value.value}>{value.value}</AutocompleteItem>
        ))}
      </Autocomplete>
    )
  }
  return (
    <Input
      value={filter}
      onValueChange={setFilter}
      aria-label={column.id}
      placeholder={`Buscar...`}
      size="sm"
      isClearable
      className="mb-1"
    />
  )
}

export default Filter
