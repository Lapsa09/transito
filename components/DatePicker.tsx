'use client'
import React, { useState } from 'react'
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
}

function DatePicker({ name, label, className, rules }: Props) {
  const [date, setDate] = useState<DateValueType>(null)
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
  })

  const onChange = (value: DateValueType) => {
    setDate(value)
    field.onChange(value!.startDate)
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
        containerClassName={`relative rounded-lg border bg-white/0 dark:bg-gray-700 text-sm outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
          invalid
            ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
            : 'border-gray-600'
        } `}
        primaryColor="blue"
        useRange={false}
        placeholder="DD/MM/YYYY"
        displayFormat="DD/MM/YYYY"
        {...field}
        value={date}
        onChange={onChange}
        i18n="es"
        showShortcuts={false}
      />
      <p className="mt-2 text-xs text-red-400">{error?.message}</p>
    </div>
  )
}

export default DatePicker
