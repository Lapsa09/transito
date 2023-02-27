import { TextField } from '@mui/material'
import React, { ChangeEvent } from 'react'
import {
  Control,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form'

type ITextField = {
  control: Control<any, any>
  name: string
  rules?: Omit<
    RegisterOptions<FieldValues, any>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  options?: any[]
  label: string
  defaultValue?: string | number
  type?: 'text' | 'number' | 'password'
  disabled?: boolean
  className?: string
}

function CustomTextField({
  control,
  name,
  defaultValue = null,
  rules = null,
  label,
  type = 'text',
  disabled = false,
  className = '',
}: ITextField) {
  const {
    field: { ref, ...field },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.onChange(
      typeof e.target.value === 'string' && type !== 'password'
        ? e.target.value.toUpperCase()
        : e.target.value
    )
  }

  return (
    <TextField
      {...field}
      onChange={handleChange}
      type={type}
      helperText={error?.message}
      required={rules !== undefined}
      disabled={disabled}
      className={className}
      error={!!error}
      label={label}
      fullWidth
      inputRef={ref}
    />
  )
}

export default CustomTextField
