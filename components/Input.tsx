'use client'
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from '@/utils/validations'
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

function Input({
  name,
  placeholder,
  label,
  rules,
  type = 'text',
  className,
  persist,
}: Props) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: '',
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value)
    if (persist) persist({ [name]: e.target.value })
  }

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
        onChange={onChange}
        type={type}
        id={name}
        placeholder={placeholder}
        className={`flex w-full uppercase items-center justify-center rounded-lg border bg-white/0 dark:bg-gray-700 p-2.5 text-sm outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
          invalid
            ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
            : 'border-gray-600'
        }`}
      />
      <p className="mt-2 text-xs text-red-400">{error?.message}</p>
    </div>
  )
}

function InputLegajo(props: Props) {
  return (
    <Input
      {...props}
      rules={{
        ...props.rules,
        pattern: {
          value: LEGAJO_PATTERN,
          message: 'Ingrese un legajo valido',
        },
        required: 'Este campo es requerido',
      }}
    />
  )
}

function InputDominio(props: Props) {
  return (
    <Input
      {...props}
      rules={{
        ...props.rules,
        pattern: {
          value: DOMINIO_PATTERN,
          message: 'Ingrese un dominio valido',
        },
        required: 'Este campo es requerido',
      }}
    />
  )
}

Input.Legajo = InputLegajo
Input.Dominio = InputDominio

export default Input
