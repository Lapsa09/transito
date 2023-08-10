'use client'
import { ChangeEvent } from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Input } from '@nextui-org/input'

interface DateFieldProps extends UseControllerProps {
  className?: string
  persist?: (data: any) => void
  label?: string
}

export function DateField({
  name,
  defaultValue,
  rules,
  className,
  label,
  persist,
  ...props
}: DateFieldProps) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
    defaultValue,
    rules: {
      ...rules,
      validate: {
        ...rules?.validate,
        validDate: (value) => {
          const date = new Date(value)
          return date.toString() !== 'Invalid Date' || 'Fecha inválida'
        },
        minDate: (value) => {
          const date = new Date(value)
          const minDate = new Date(date.getMonth() - 6)
          return (
            date >= minDate ||
            'La fecha no debe ser mas de 6 meses anterior a la fecha actual'
          )
        },
        maxDate: (value) => {
          const date = new Date(value)
          const maxDate = new Date()
          return (
            date <= maxDate ||
            'La fecha no debe ser posterior a la fecha actual'
          )
        },
      },
    },
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    field.onChange(value)
    if (persist) persist({ [name]: value })
  }

  const clear = () => {
    field.onChange('')
    if (persist) persist({ [name]: '' })
  }

  return (
    <Input
      {...props}
      {...field}
      onChange={onChange}
      variant="bordered"
      label={label}
      labelPlacement="outside"
      size="md"
      radius="sm"
      type="date"
      placeholder="dd/mm/yyyy"
      validationState={invalid ? 'invalid' : 'valid'}
      className={twMerge(className, 'mb-6')}
      classNames={{
        inputWrapper: 'border border-gray-600',
      }}
      endContent={
        <span
          onClick={clear}
          className="absolute right-4 cursor-pointer text-gray-300 hover:text-gray-800 dark:text-gray-800 dark:hover:text-gray-300"
        >
          X
        </span>
      }
      errorMessage={error?.message}
    />
  )
}

export default DateField
