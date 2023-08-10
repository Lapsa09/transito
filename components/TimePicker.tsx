'use client'
import { ChangeEvent } from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Input } from '@nextui-org/input'

interface TimeFieldProps extends UseControllerProps {
  className?: string
  persist?: (data: any) => void
  label?: string
}

export function TimeField({
  name,
  defaultValue,
  rules,
  label,
  className,
  persist,
  ...props
}: TimeFieldProps) {
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
        validTime: (value) => {
          const date = new Date(value)
          return date.toString() !== 'Invalid Date' || 'Fecha inválida'
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
      type="time"
      placeholder="hh:mm"
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

export default TimeField
