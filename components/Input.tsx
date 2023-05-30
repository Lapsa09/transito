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
}

function Input({
  name,
  placeholder,
  label,
  rules,
  type = 'text',
  className,
}: Props) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
  })
  return (
    <div className={twMerge('mb-6', className)}>
      <label
        htmlFor={name}
        className="text-sm text-gray-900 dark:text-gray-300 font-medium block mb-2"
      >
        {label}
        {rules?.required && (
          <span className="text-gray-900 dark:text-gray-300 ml-1">*</span>
        )}
      </label>
      <input
        {...field}
        type={type}
        id={name}
        placeholder={placeholder}
        className={`flex w-full items-center justify-center rounded-lg border bg-white/0 dark:bg-gray-700 p-2.5 text-sm outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
          invalid
            ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
            : 'border-gray-600'
        }`}
      />
      <p className="mt-2 text-xs text-red-400">{error?.message}</p>
    </div>
  )
}

export default Input
