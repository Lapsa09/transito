'use client'
import React from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    field: { ref, ...field },
    fieldState: { invalid, error },
  } = useController({ name, control, rules, defaultValue: '' })

  const onChange = (value: string) => {
    field.onChange(value)
    if (persist) persist({ [name]: value })
  }

  return (
    <div className={twMerge('mb-6', className)}>
      <label
        className="text-sm text-gray-900 dark:text-gray-300 font-medium block mb-2"
        htmlFor={field.name}
      >
        {label}
        {rules?.required && (
          <span className="text-gray-900 dark:text-gray-300 ml-1">*</span>
        )}
      </label>
      <Select {...field} onValueChange={onChange}>
        <SelectTrigger
          className={`w-full justify-between border bg-white/0 dark:bg-gray-700 p-2.5 text-sm outline-none ${
            invalid
              ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
              : 'border-gray-600'
          }`}
        >
          <SelectValue placeholder="Seleccione una opcion" />
        </SelectTrigger>
        <SelectContent>
          {options.length > 0 &&
            options?.map((option) => (
              <SelectItem key={option[inputId]} value={option[inputId]}>
                {option[inputLabel]}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <p className="mt-2 text-xs text-red-400">{error?.message}</p>
    </div>
  )
}

export default CustomSelect
