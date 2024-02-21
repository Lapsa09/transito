'use client'
import { ChangeEvent } from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Input, InputProps } from '@nextui-org/input'
import { X } from 'lucide-react'

interface DateFieldProps
  extends UseControllerProps,
    Omit<InputProps, 'defaultValue' | 'name'> {
  className?: string
  persist?: (data: any) => void
  label?: string
}

export function DateField({
  name,
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
    defaultValue: null,
    rules: {
      ...rules,
      validate: {
        ...rules?.validate,
        validDate: (value) => {
          const date = new Date(value)
          return value
            ? date.toString() !== 'Invalid Date' || 'Fecha inválida'
            : true
        },
        minDate: (value) => {
          const date = new Date(value)
          const minDate = new Date(date.getMonth() - 6)
          return value
            ? date >= minDate ||
                'La fecha no debe ser mas de 6 meses anterior a la fecha actual'
            : true
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
      isRequired={!!rules?.required}
      labelPlacement="outside"
      size="md"
      radius="sm"
      type="date"
      placeholder="dd/mm/yyyy"
      validationState={invalid ? 'invalid' : 'valid'}
      className={twMerge(className, 'data-[has-helper=true]:pb-6 pb-6')}
      classNames={{
        inputWrapper: 'border border-gray-600',
      }}
      endContent={
        <X
          onClick={clear}
          className="h-10 w-6 text-gray-400 absolute inset-y-0 right-0 pr-2 cursor-pointer"
        />
      }
      errorMessage={error?.message}
    />
  )
}

export default DateField
