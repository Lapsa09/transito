import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from '../../utils'

export function CustomTextField({
  control,
  name,
  defaultValue = '',
  rules,
  label,
  type = 'text',
  disabled = false,
  className,
  ...props
}) {
  const {
    field: { ref, ...field },
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  })

  const handleChange = (e) => {
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

export function DomainField({ control, name, className }) {
  const [extranjero, setExtranjero] = useState(false)
  const { trigger } = useFormContext()

  const changeDomainStatus = () => {
    setExtranjero((e) => !e)
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
          value: !extranjero ? DOMINIO_PATTERN : /./,
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
                tabIndex="-1"
                checked={extranjero}
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

export const FileNumberField = ({ control, name, className, label }) => (
  <CustomTextField
    className={className}
    label={label}
    name={name}
    control={control}
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
