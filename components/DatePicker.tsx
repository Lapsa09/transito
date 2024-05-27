'use client'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { DateInput, DateInputProps, DateValue } from '@nextui-org/react'
import { X } from 'lucide-react'
import { parseDate } from '@internationalized/date'

interface DateFieldProps
  extends UseControllerProps,
    Omit<DateInputProps, 'defaultValue' | 'name'> {
  persist?: (data: any) => void
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
    defaultValue: '',
    rules,
  })

  const onChange = (value: DateValue) => {
    field.onChange(value.toString())
    if (persist) persist({ [name]: value })
  }

  const clear = () => {
    field.onChange('')
    if (persist) persist({ [name]: '' })
  }

  return (
    <DateInput
      {...props}
      {...field}
      value={field.value ? parseDate(field.value) : null}
      onChange={onChange}
      variant="bordered"
      label={label}
      isRequired={!!rules?.required}
      labelPlacement="outside"
      size="md"
      radius="sm"
      isInvalid={invalid}
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
