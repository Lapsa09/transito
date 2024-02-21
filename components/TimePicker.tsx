'use client'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Input } from '@nextui-org/input'
import { X } from 'lucide-react'

interface TimeFieldProps extends UseControllerProps {
  className?: string
  persist?: (data: any) => void
  label?: string
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
    defaultValue: null,
    rules,
  })

  const onChange = (value: string) => {
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
      onValueChange={onChange}
      variant="bordered"
      label={label}
      labelPlacement="outside"
      isRequired={!!rules?.required}
      size="md"
      radius="sm"
      type="time"
      placeholder="hh:mm"
      validationState={invalid ? 'invalid' : 'valid'}
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
