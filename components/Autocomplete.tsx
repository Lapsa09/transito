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
    field,
    fieldState: { invalid, error },
    formState: { isSubmitSuccessful, isSubmitted },
  } = useController({ name, control, rules })

  const [key, setKey] = useState<Key | null>(null)

  const handleChange = (item: Key) => {
    const option = options.find((o) => o[inputId] == item)
    setKey(item)
    field.onChange(option)
    if (persist) persist({ [name]: option })
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      if (!persist) field.onChange(null)
    }
  }, [isSubmitted])

  return (
    <Autocomplete
      selectedKey={key}
      {...field}
      onSelectionChange={handleChange}
      label={label}
      variant="bordered"
      size="md"
      isRequired={!!rules?.required}
      labelPlacement="outside"
      placeholder="Elija una opcion..."
      errorMessage={error?.message}
      inputValue={field.value?.[inputLabel]}
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
          className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
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
