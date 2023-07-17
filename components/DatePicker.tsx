'use client'
import React from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import Datepicker from 'react-tailwindcss-datepicker'
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types'

interface Props
  extends UseControllerProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'name'> {
  label: string
  persist?: (data: any) => void
}

function DatePicker({ name, label, className, rules, persist }: Props) {
  const { control, trigger } = useFormContext()
  const {
    field: { ref, ...field },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      validate: {
        validDate: (value) => {
          return !isNaN(Date.parse(value)) || 'Fecha inválida'
        },
        disableFarPast: (value) => {
          const date = new Date(value)
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(new Date().getMonth() - 6)
          return (
            date > sixMonthsAgo || 'La fecha no puede ser menor a 6 meses atras'
          )
        },
        disableFuture: (value) => {
          const date = new Date(value)
          const newDate = new Date()
          return date < newDate || 'La fecha no puede ser mayor a la actual'
        },
      },
    },
    defaultValue: '',
  })

  const onChange = (value: DateValueType) => {
    field.onChange(value!.startDate)
    if (persist) persist({ [name]: value!.startDate })
    trigger(name)
  }

  return (
    <div className={twMerge('mb-6', className)}>
      <label
        htmlFor={field.name}
        className="text-sm text-gray-900 dark:text-gray-300 font-medium block mb-2"
      >
        {label}
        {rules?.required && (
          <span className="text-gray-900 dark:text-gray-300 ml-1">*</span>
        )}
      </label>
      <Datepicker
        asSingle
        containerClassName={(className) =>
          twMerge(
            className,
            `border rounded-lg bg-white/0 dark:bg-gray-700 text-sm ${
              invalid
                ? 'border-red-500 dark:!border-red-400'
                : 'border-gray-600'
            }`
          )
        }
        inputClassName={(className) =>
          twMerge(
            className,
            `${
              invalid &&
              'text-red-500 placeholder:text-red-500 dark:!text-red-400 dark:placeholder:!text-red-400'
            }`
          )
        }
        toggleClassName={(className) =>
          twMerge(
            className,
            `${invalid ? 'text-red-500 dark:text-red-400' : 'text-gray-600'}`
          )
        }
        primaryColor="blue"
        useRange={false}
        placeholder="DD/MM/YYYY"
        inputName={field.name}
        displayFormat="DD/MM/YYYY"
        {...field}
        value={{ startDate: field.value, endDate: field.value }}
        onChange={onChange}
        i18n="es"
        showShortcuts={false}
      />
      <p className="mt-2 text-xs text-red-400">{error?.message}</p>
    </div>
  )
}

export default DatePicker
