import React, { ChangeEvent } from 'react'
import {
  Control,
  FieldValues,
  RegisterOptions,
  useController,
  useFormContext,
} from 'react-hook-form'
import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { LEGAJO_PATTERN, DOMINIO_PATTERN } from '../../utils'

type TextFieldProps = {
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
  InputProps?: any
}

export function CustomTextField({
  control,
  name,
  defaultValue = '',
  rules = null,
  label,
  type = 'text',
  disabled = false,
  className = '',
  ...props
}: TextFieldProps) {
  const {
    field: { ref, ...field },
    fieldState: { error, invalid },
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
      error={invalid}
      label={label}
      fullWidth
      inputRef={ref}
      {...props}
    />
  )
}

export function DomainField({ control, name, className = '' }) {
  const { trigger } = useFormContext()

  const { field } = useController({
    name: 'extranjero',
    control,
    defaultValue: false,
  })

  const changeDomainStatus = () => {
    field.onChange(!field.value)
    setTimeout(() => {
      trigger('dominio')
    }, 100)
  }

  return (
    <CustomTextField
      control={control}
      label="Dominio"
      name={name}
      className={className}
      rules={{
        pattern: {
          value: !field.value ? DOMINIO_PATTERN : /./,
          message: 'Ingrese una patente valida',
        },
        required: 'Ingrese una patente',
      }}
      defaultValue=""
      InputProps={{
        endAdornment: (
          <FormControlLabel
            control={
              <Checkbox
                title="Extranjero"
                tabIndex={-1}
                name={field.name}
                checked={field.value}
                onChange={changeDomainStatus}
              />
            }
            label="Extranjero"
          />
        ),
      }}
    />
  )
}

export const FileNumberField = ({ control, name, className = '', label }) => (
  <CustomTextField
    className={className}
    label={label}
    name={name}
    control={control}
    defaultValue={0}
    type="number"
    rules={{
      required: 'Ingrese un legajo',
      pattern: {
        value: LEGAJO_PATTERN,
        message: 'Ingrese un legajo valido',
      },
    }}
  />
)
