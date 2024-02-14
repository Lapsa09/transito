import { Input } from '@nextui-org/react'
import { Column } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

function Filter<T, K>({ column }: { column: Column<T, K> }) {
  const columnsFilterValue = column.getFilterValue() as string
  const [filter, setFilter] = useState(columnsFilterValue)
  const debouncedSetFilterValue = useDebounceCallback(
    column.setFilterValue,
    1000,
  )

  useEffect(() => {
    debouncedSetFilterValue(filter)
  }, [filter])

  if (column.id === 'fecha')
    return (
      <Input
        type="date"
        value={filter}
        onValueChange={setFilter}
        size="sm"
        isClearable
        className="mb-1"
      />
    )

  return (
    <Input
      value={filter}
      onValueChange={setFilter}
      placeholder={`Buscar...`}
      size="sm"
      isClearable
      className="mb-1"
    />
  )
}

export default Filter
