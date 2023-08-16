'use client'
import { useEffect, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Input } from '@nextui-org/react'

interface Props extends UseControllerProps {
  options: any[]
  label: string
  inputLabel?: string
  inputId?: string
  className?: string
  persist?: (data: any) => void
}

export default function MyCombobox({
  label,
  name,
  options,
  inputId = name,
  inputLabel = name,
  className,
  persist,
  rules,
}: Props) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, rules })
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option[inputLabel].toLowerCase().includes(query.toLowerCase())
        )

  const removeSelected = () => {
    field.onChange(undefined)
    if (persist) persist({ [name]: null })
    setQuery('')
  }

  const handleChange = (currentValue: any) => {
    field.onChange(currentValue)
    if (persist) persist({ [name]: currentValue })
  }

  useEffect(() => {
    if (!field.value) {
      setQuery('')
    }
  }, [field.value])

  return (
    <Combobox
      as="div"
      className={twMerge(
        'data-[has-helper=true]:pb-6 pb-6 relative',
        className
      )}
      {...field}
      onChange={handleChange}
    >
      <Combobox.Input
        required={!!rules?.required}
        as={Input}
        classNames={{
          inputWrapper: 'border border-gray-600',
          errorMessage: 'mt-2',
        }}
        radius="sm"
        label={label}
        isRequired={!!rules?.required}
        labelPlacement="outside"
        validationState={invalid ? 'invalid' : 'valid'}
        errorMessage={error?.message}
        variant="bordered"
        value={field.value ? field.value[inputLabel] : query}
        placeholder="Elija una opcion"
        onChange={(event) => setQuery(event.target.value)}
        endContent={
          field.value ? (
            <X
              onClick={removeSelected}
              className="h-10 w-6 text-gray-400 cursor-pointer"
              aria-hidden="true"
            />
          ) : (
            <Combobox.Button className="flex items-center">
              <ChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          )
        }
      />

      <Combobox.Options className="absolute z-50 max-h-20 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {filteredOptions.length === 0 ? (
          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
            Vacio
          </div>
        ) : (
          filteredOptions.map((option) => (
            <Combobox.Option
              key={option[inputId]}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-teal-600 text-white' : 'text-gray-900'
                }`
              }
              value={option}
            >
              {option[inputLabel]}
            </Combobox.Option>
          ))
        )}
      </Combobox.Options>
    </Combobox>
  )
}
