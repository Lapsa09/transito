import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import { Column } from '@tanstack/react-table'
import { Key, useEffect, useMemo, useState } from 'react'

function Filter<T, K>({ column }: { column: Column<T, K> }) {
  const columnsFilterValue = column.getFilterValue() as Key
  const [value, setValue] = useState(columnsFilterValue ?? '')

  const sortedUniqueValues = useMemo(
    () =>
      Array.from(column.getFacetedUniqueValues().keys()).sort((a, b) => {
        if (Number(a) || new Date(a)) {
          return a - b
        }
        return a.localeCompare(b)
      }),
    [column.getFacetedUniqueValues()],
  )

  useEffect(() => {
    setValue(columnsFilterValue)
  }, [columnsFilterValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      column.setFilterValue(value)
    }, 500)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Autocomplete
      selectedKey={columnsFilterValue}
      onSelectionChange={setValue}
      inputValue={value?.toString()}
      onInputChange={setValue}
      placeholder={`Buscar... (${column.getFacetedUniqueValues().size})`}
      clearButtonProps={{
        onClick: () => {
          setValue('')
        },
      }}
      size="sm"
      isClearable
      className="mb-1"
    >
      {sortedUniqueValues.slice(0, 5000).map((value, index) => (
        <AutocompleteItem key={value ?? index}>{value}</AutocompleteItem>
      ))}
    </Autocomplete>
  )
}

export default Filter
