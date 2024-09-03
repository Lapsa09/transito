import React from 'react'

export type SearchParams =
  | string
  | string[][]
  | URLSearchParams
  | Record<string, string>
  | undefined

export interface Option {
  label: string
  value: string | number | null
  icon?: React.ComponentType<{ className?: string }>
  withCount?: boolean
}

type NestedKeys<T> = {
  [K in keyof T]: K extends string
    ? T[K] extends object
      ? `${K}` | `${NestedKeys<T[K]>}`
      : `${K}`
    : never
}[keyof T]

export interface DataTableFilterField<TData> {
  label: string
  value: NestedKeys<TData>
  placeholder?: string
  options?: Option[]
}

export interface DataTableFilterOption<TData> {
  id: string
  label: string
  value: NestedKeys<TData>
  options: Option[]
  filterValues?: string[]
  filterOperator?: string
  isMulti?: boolean
}

export type IndexPageProps<T = unknown> = T & {
  searchParams: SearchParams
}
