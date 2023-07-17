'use client'
import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

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
  } = useController({ name, control, rules, defaultValue: '' })
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option[inputLabel]
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  const removeSelected = () => {
    field.onChange(null)
    setQuery('')
  }

  const handleChange = (currentValue: any) => {
    field.onChange(currentValue)
    setQuery(currentValue[inputLabel])
    if (persist) persist({ [name]: currentValue })
  }

  return (
    <div className={twMerge('mb-6', className)}>
      <label
        className="text-sm text-gray-900 dark:text-gray-300 font-medium block"
        htmlFor={field.name}
      >
        {label}
        {rules?.required && (
          <span className="text-gray-900 dark:text-gray-300 ml-1">*</span>
        )}
      </label>
      <Combobox {...field} onChange={handleChange}>
        <div className="relative mt-2">
          <div className="relative w-full cursor-default bg-white/0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className={`w-full justify-between rounded-lg border bg-white/0 dark:bg-gray-700 p-2.5 text-sm outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                invalid
                  ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
                  : 'border-gray-600'
              }`}
              displayValue={(option: any) =>
                option ? option[inputLabel] : undefined
              }
              onChange={(event) => setQuery(event.target.value)}
            />
            {field.value ? (
              <X
                onClick={removeSelected}
                className="h-10 w-6 text-gray-400 absolute inset-y-0 right-0 pr-2 cursor-pointer"
                aria-hidden="true"
              />
            ) : (
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            )}
          </div>

          <Combobox.Options className="absolute mt-1 max-h-60 z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option[inputLabel]}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <Check
                            onClick={removeSelected}
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
      <p className="mt-2 text-xs text-red-400">{error?.message}</p>
    </div>
  )
}
