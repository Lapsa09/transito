'use client'

import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  className: string
}

export default function Autocomplete({
  options,
  label,
  inputLabel = 'label',
  inputId = 'id',
  name,
  className,
  rules,
}: Props) {
  const { control } = useFormContext()
  const {
    field: { value, ...field },
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
    rules,
    defaultValue: {
      [inputLabel]: '',
      [inputId]: '',
    },
  })
  const [open, setOpen] = useState(false)

  const handleChange = (currentValue: string) => {
    const selectedOption = options?.find(
      (option) => option[inputLabel] === currentValue.toUpperCase()
    )
    field.onChange(selectedOption)
    setOpen(false)
  }

  return (
    <div className={twMerge('mb-6 flex flex-col', className)}>
      <label
        className="text-sm text-gray-900 dark:text-gray-300 font-medium block mb-2"
        htmlFor={name}
      >
        {label}
        {rules?.required && (
          <span className="text-gray-900 dark:text-gray-300 ml-1">*</span>
        )}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between border bg-white/0 dark:bg-gray-700 p-2.5 text-sm outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
              invalid
                ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
                : 'border-gray-600'
            }`}
          >
            {value[inputLabel] || 'Selecciona una opcion...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Selecciona una opcion..." />
            <CommandEmpty>Vacio.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem key={option[inputId]} onSelect={handleChange}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value[inputLabel] === option[inputLabel]
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option[inputLabel]}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="mt-2 text-xs text-red-400">{error?.message}</p>
    </div>
  )
}
