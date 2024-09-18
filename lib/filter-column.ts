import {
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  not,
  notLike,
  type Column,
  type ColumnBaseConfig,
  type ColumnDataType,
  sql,
  gt,
  gte,
  lt,
  lte,
} from 'drizzle-orm'

import { type DataTableConfig } from '@/lib/data-table'

export function filterColumn({
  column,
  value,
  isSelectable,
  isDate,
}: {
  column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>
  value: string
  isSelectable?: boolean
  isDate?: boolean
}) {
  const [filterValue, filterOperator] = (value?.split('~').filter(Boolean) ??
    []) as [
    string,
    DataTableConfig[keyof DataTableConfig][number]['value'] | undefined,
  ]

  if (!filterValue) return

  if (isSelectable) {
    switch (filterOperator) {
      case 'eq':
        return inArray(column, filterValue?.split('.').filter(Boolean) ?? [])
      case 'notEq':
        return not(
          inArray(column, filterValue?.split('.').filter(Boolean) ?? []),
        )
      case 'isNull':
        return isNull(column)
      case 'isNotNull':
        return isNotNull(column)
      default:
        return inArray(column, filterValue?.split('.') ?? [])
    }
  }

  if (isDate) {
    switch (filterOperator) {
      case 'eq':
        return eq(column, sql<Date>`to_date(${filterValue}, 'yyyy-mm-dd')`)
      case 'notEq':
        return not(eq(column, sql<Date>`to_date(${filterValue}, 'yyyy-mm-dd')`))
      case 'gt':
        return gt(column, sql<Date>`to_date(${filterValue}, 'yyyy-mm-dd')`)
      case 'gte':
        return gte(column, sql<Date>`to_date(${filterValue}, 'yyyy-mm-dd')`)
      case 'lt':
        return lt(column, sql<Date>`to_date(${filterValue}, 'yyyy-mm-dd')`)
      case 'lte':
        return lte(column, sql<Date>`to_date(${filterValue}, 'yyyy-mm-dd')`)
      default:
        return eq(column, sql<Date>`to_date(${filterValue}, 'yyyy-mm-dd')`)
    }
  }

  switch (filterOperator) {
    case 'ilike':
      return ilike(column, `%${filterValue}%`)
    case 'notIlike':
      return notLike(column, `%${filterValue}%`)
    case 'startsWith':
      return ilike(column, `${filterValue}%`)
    case 'endsWith':
      return ilike(column, `%${filterValue}`)
    case 'eq':
      return eq(column, filterValue)
    case 'notEq':
      return not(eq(column, filterValue))
    case 'isNull':
      return isNull(column)
    case 'isNotNull':
      return isNotNull(column)
    default:
      return ilike(column, `%${filterValue}%`)
  }
}
