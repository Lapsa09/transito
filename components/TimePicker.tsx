'use client'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { TimeInput, TimeInputProps, TimeInputValue } from '@nextui-org/react'
import { X } from 'lucide-react'
import { parseTime } from '@internationalized/date'

interface TimeFieldProps
  extends UseControllerProps,
    Omit<TimeInputProps, 'defaultValue' | 'name'> {
  persist?: (data: any) => void
}

export function TimeField({
  name,
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
    defaultValue: props.defaultValue || '',
    rules,
  })

  const onChange = (value: TimeInputValue) => {
    field.onChange(value.toString())
    if (persist) persist({ [name]: value })
  }

  const clear = () => {
    field.onChange('')
    if (persist) persist({ [name]: '' })
  }
  return (
    <TimeInput
      {...props}
      {...field}
      value={field.value ? parseTime(field.value) : null}
      onChange={onChange}
      variant="bordered"
      label={label}
      labelPlacement="outside"
      isRequired={!!rules?.required}
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
        >
          X
        </X>
      }
      errorMessage={error?.message}
    />
  )
}

export default TimeField
