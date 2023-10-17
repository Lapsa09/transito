'use client'

import React, { InputHTMLAttributes, useRef } from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface Props
  extends UseControllerProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'name'> {
  label: string
  persist?: (data: any) => void
}

function FileInput({ name, rules, defaultValue, label, className }: Props) {
  const { control } = useFormContext()
  const {
    field: { value, ...field },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue ?? '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    field.onChange(file)
  }

  return (
    <div className={twMerge('pb-6', className)}>
      <label
        className={`block text-small font-medium text-foreground pb-1.5 ${
          rules?.required &&
          "after:content-['*'] after:text-danger after:ml-0.5"
        } will-change-auto origin-top-left transition-all !duration-200 !ease-[cubic-bezier(0,0,0.2,1)] motion-reduce:transition-none`}
        htmlFor={field.name}
      >
        {label}
      </label>
      <input
        type="file"
        {...field}
        onChange={handleChange}
        className={`w-full relative m-0 block min-w-0 flex-auto rounded-lg border border-solid  bg-clip-padding px-3 py-[0.32rem] text-base font-normal  transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit  file:px-3 file:py-[0.32rem]  file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem]  focus:border-primary  focus:shadow-primary focus:outline-none    dark:focus:border-primary h-unit-10 max-h-unit-10 file:h-unit-10 file:max-h-unit-10 ${
          invalid
            ? 'border-danger-600 text-danger-700 file:bg-danger-100 file:text-danger-700 hover:file:bg-danger-200 focus:text-danger-700 dark:border-danger-600 dark:text-danger-200 dark:file:bg-danger-700 dark:file:text-danger-100'
            : 'border-gray-600 text-gray-700 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:text-gray-700 dark:border-gray-600 dark:text-gray-200 dark:file:bg-gray-700 dark:file:text-gray-100'
        }`}
      />
      <span className="text-tiny text-danger left-1 pt-1 px-1">
        {error?.message}
      </span>
    </div>
  )
}

export default FileInput

export function InvisibleFileInput({
  name,
  rules,
  defaultValue,
  children,
}: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const { control } = useFormContext()
  const {
    field: { value, ...field },
  } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue ?? '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    field.onChange(file)
  }

  return (
    <>
      <input
        type="file"
        className="hidden"
        {...field}
        onChange={handleChange}
        ref={ref}
      />
      {children}
    </>
  )
}
