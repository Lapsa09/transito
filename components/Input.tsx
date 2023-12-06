'use client'
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from '@/utils/validations'
import { Input, InputProps } from '@nextui-org/react'
import React from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface Props
  extends UseControllerProps,
    Omit<InputProps, 'defaultValue' | 'name'> {
  label: string
  persist?: (data: any) => void
}

function CustomInput({
  name,
  placeholder,
  label,
  rules,
  type = 'text',
  className,
  persist,
  defaultValue,
  ...props
}: Props) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue ?? '',
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value)
    if (persist) persist({ [name]: e.target.value })
  }

  return (
    <Input
      {...props}
      {...field}
      onChange={onChange}
      type={type}
      id={name}
      placeholder={placeholder ?? ' '}
      label={label}
      className={twMerge('data-[has-helper=true]:pb-6 pb-6', className)}
      classNames={{
        inputWrapper: 'border border-gray-600',
        input: 'uppercase',
      }}
      isInvalid={invalid}
      errorMessage={error?.message}
      size="md"
      radius="sm"
      labelPlacement="outside"
      isRequired={!!rules?.required}
      variant="bordered"
    />
  )
}

function InputLegajo(props: Props) {
  return (
    <CustomInput
      {...props}
      rules={{
        ...props.rules,
        pattern: {
          value: LEGAJO_PATTERN,
          message: 'Ingrese un legajo valido',
        },
        required: 'Este campo es requerido',
      }}
      placeholder='Ej: "12345"'
    />
  )
}

function InputDominio(props: Props) {
  return (
    <CustomInput
      {...props}
      rules={{
        ...props.rules,
        pattern: {
          value: DOMINIO_PATTERN,
          message: 'Ingrese un dominio valido',
        },
        required: 'Este campo es requerido',
      }}
      placeholder='Ej: "ABC123"'
    />
  )
}

CustomInput.Legajo = InputLegajo
CustomInput.Dominio = InputDominio

export default CustomInput
