'use client'
import React, { useMemo } from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Select, SelectItem, SelectProps } from '@nextui-org/react'
import { ChevronsUpDown } from 'lucide-react'

type Props = UseControllerProps &
  Omit<SelectProps, 'children'> & {
    label: string
    options: { id: any; label: string }[]
    persist?: (data: any) => void
  }

function CustomSelect({
  label,
  name,
  rules,
  options = [],
  className,
  persist,
  defaultValue,
}: Props) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, rules, defaultValue })

  const onChange = (value: any) => {
    field.onChange(value.currentKey)
    if (persist) persist({ [name]: value.currentKey })
  }

  const displayValue = useMemo(() => {
    return field.value ? new Set([field.value]) : []
  }, [field.value])

  return (
    <Select
      label={label}
      variant="bordered"
      size="md"
      name={field.name}
      isRequired={!!rules?.required}
      selectedKeys={displayValue}
      onSelectionChange={onChange}
      labelPlacement="outside"
      placeholder="Elija una opcion..."
      errorMessage={error?.message}
      isInvalid={invalid}
      radius="sm"
      className={twMerge(className, 'mb-6')}
      classNames={{
        trigger: 'border border-gray-600',
        label: invalid && 'pb-3',
        mainWrapper: !invalid && 'pb-3',
      }}
      selectorIcon={
        <ChevronsUpDown
          className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
          aria-hidden="true"
        />
      }
    >
      {options.map((option) => (
        <SelectItem key={option.id} value={option.id}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  )
}

export default CustomSelect
