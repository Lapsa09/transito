'use client'
import React, { useMemo } from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { Listbox } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import { Input } from '@nextui-org/react'
import { ChevronsUpDown, CheckIcon } from 'lucide-react'

type Props = UseControllerProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string
    options: any[]
    inputLabel?: string
    inputId?: string
    persist?: (data: any) => void
  }

function CustomSelect({
  label,
  name,
  rules,
  options = [],
  inputId = name,
  inputLabel = name,
  className,
  persist,
}: Props) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, rules, defaultValue: '' })

  const onChange = (value: any) => {
    field.onChange(value)
    if (persist) persist({ [name]: value })
  }

  const displayValue = useMemo(() => {
    return field.value ? field.value[inputLabel] : ''
  }, [field.value])

  return (
    <Listbox
      as="div"
      className={twMerge('mb-6 relative', className)}
      {...field}
      onChange={onChange}
    >
      <Input
        readOnly
        endContent={
          <Listbox.Button>
            <ChevronsUpDown
              className="h-5 w-5 text-gray-400 cursor-pointer"
              aria-hidden="true"
            />
          </Listbox.Button>
        }
        {...field}
        value={displayValue}
        radius="sm"
        role="button"
        label={label}
        onChange={onChange}
        labelPlacement="outside"
        isRequired={!!rules?.required}
        placeholder="Elija una opcion"
        validationState={invalid ? 'invalid' : 'valid'}
        errorMessage={error?.message}
        variant="bordered"
        classNames={{
          inputWrapper: 'border border-gray-600',
          label: 'text-left',
        }}
      />
      <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {options.map((option) => (
          <Listbox.Option
            key={option[inputId]}
            value={option}
            className={({ active }) =>
              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                active ? 'bg-green-400 text-white' : 'text-gray-900'
              }`
            }
          >
            {({ selected }) => (
              <>
                <span
                  className={`block truncate ${
                    selected ? 'font-medium' : 'font-normal'
                  }`}
                >
                  {option[inputLabel]}
                </span>
                {selected ? (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}

export default CustomSelect
