'use client'
import { Key, useEffect, useMemo, useState } from 'react'
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
    Omit<AutocompleteProps, 'name' | 'children' | 'items'> {
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
  defaultValue,
  ...props
}: Props<T>) {
  const { control } = useFormContext()
  const {
    field: { value, onChange, ...field },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue ?? null,
  })

  const [inputValue, setInputValue] = useState('')

  const handleChange = (item: Key | null) => {
    const option = options.find((o) => o[inputId] == item)
    onChange(option || null)
    if (persist) persist({ [name]: option })
  }

  useEffect(() => {
    const option = options.find((o) => o[inputId] == value?.[inputId])
    setInputValue(option?.[inputLabel] || '')
  }, [value])

  const selected = useMemo(() => {
    return value?.[inputId]?.toString() || null
  }, [value])

  return (
    <Autocomplete
      {...field}
      {...props}
      selectedKey={selected}
      allowsCustomValue
      onSelectionChange={handleChange}
      label={label}
      variant="bordered"
      size="md"
      isRequired={!!rules?.required}
      defaultItems={options}
      onInputChange={setInputValue}
      labelPlacement="outside"
      placeholder="Elija una opcion..."
      errorMessage={error?.message}
      clearButtonProps={{
        onClick: () => {
          handleChange(null)
        },
      }}
      id={field.name}
      inputValue={inputValue}
      isInvalid={invalid}
      radius="sm"
      className={cn(className)}
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
      {(option) => (
        <AutocompleteItem key={option[inputId]}>
          {option[inputLabel]}
        </AutocompleteItem>
      )}
    </Autocomplete>
  )
}
