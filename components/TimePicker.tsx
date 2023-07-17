'use client'
import React from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface Props
  extends UseControllerProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'name'> {
  label: string
  persist?: (data: any) => void
}

function TimePicker({ name, label, className, rules, persist }: Props) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, rules, defaultValue: '' })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value)
    if (persist) persist({ [name]: e.target.value })
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
      <input
        className={`w-full rounded-lg p-2.5 text-sm border bg-white/0 dark:bg-gray-700 outline-none ${
          invalid
            ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
            : 'border-gray-600 text-gray-400'
        }`}
        type="time"
        {...field}
        onChange={onChange}
      />
      <p className="mt-2 text-xs text-red-400">{error?.message}</p>
    </div>
  )
}

export default TimePicker
