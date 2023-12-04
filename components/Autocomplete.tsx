'use client'
import { Key, useEffect, useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
  FieldValues,
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { cn } from '@/lib/utils'
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from '@nextui-org/react'

interface Props<T extends FieldValues>
  extends UseControllerProps,
    Omit<AutocompleteProps, 'name' | 'children'> {
  options?: T[]
  label: string
  inputLabel?: string
  inputId?: string
  className?: string
  persist?: (data: any) => void
}

export default function MyCombobox<T extends FieldValues>({
  label,
  name,
  options = [],
  inputId = name,
  inputLabel = name,
  className,
  persist,
  rules,
}: Props<T>) {
  const { control } = useFormContext()
  const {
    field: { value, onChange, ...field },
    fieldState: { invalid, error },
  } = useController({ name, control, rules })

  const handleChange = (item: Key) => {
    const option = options.find((o) => o[inputId] == item)
    onChange(option)
    if (persist) persist({ [name]: option })
  }

  return (
    <Autocomplete
      selectedKey={value?.[inputId]}
      {...field}
      onSelectionChange={handleChange}
      label={label}
      variant="bordered"
      size="md"
      isRequired={!!rules?.required}
      labelPlacement="outside"
      placeholder="Elija una opcion..."
      errorMessage={error?.message}
      inputValue={value?.[inputLabel]}
      isInvalid={invalid}
      radius="sm"
      className={cn(className, 'w-full')}
      inputProps={{
        classNames: {
          inputWrapper: 'border border-gray-600',
          base: 'mb-6',
        },
      }}
      selectorIcon={
        <ChevronsUpDown
          className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
          aria-hidden="true"
        />
      }
    >
      {options.map((option) => (
        <AutocompleteItem key={option[inputId]} value={option[inputId]}>
          {option[inputLabel]}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}
