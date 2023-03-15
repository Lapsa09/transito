import React, { ChangeEvent } from 'react'
import {
  useController,
  useFormContext,
  Path,
  PathValue,
  UseControllerProps,
} from 'react-hook-form'
import {
  Checkbox,
  FormControlLabel,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { LEGAJO_PATTERN, DOMINIO_PATTERN } from '../../utils'

type Props<T> = UseControllerProps<T> &
  Omit<TextFieldProps, 'name' | 'defaultValue' | 'variant'>

export function CustomTextField<T>({
  control,
  name,
  rules = null,
  label,
  type = 'text',
  disabled = false,
  className = '',
  ...props
}: Props<T>) {
  const {
    field: { ref, ...field },
    fieldState: { error, invalid },
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue: '' as PathValue<T, Path<T>>,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.onChange(
      type === 'text' ? e.target.value.toUpperCase() : e.target.value
    )
  }

  return (
    <TextField
      {...field}
      onChange={handleChange}
      type={type}
      helperText={error?.message}
      required={rules?.required != null}
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

export function DomainField<T>({ control, name, className = '' }: Props<T>) {
  const { trigger } = useFormContext()

  const { field } = useController<T>({
    name: 'extranjero' as Path<T>,
    control,
    defaultValue: false as PathValue<T, Path<T>>,
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
      InputProps={{
        endAdornment: (
          <FormControlLabel
            control={
              <Checkbox
                title="Extranjero"
                tabIndex={-1}
                name={field.name}
                checked={field.value as boolean}
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

export function FileNumberField<T>({
  control,
  name,
  className = '',
  label,
}: Props<T>) {
  return (
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
}

export function PasswordField<T>({ control, name, label }: Props<T>) {
  return (
    <CustomTextField
      type="password"
      control={control}
      name={name}
      rules={{ required: 'Campo requerido' }}
      label={label}
    />
  )
}

export function ConfirmPasswordField<T>({ name, control, label }: Props<T>) {
  const { getValues } = useFormContext()
  return (
    <CustomTextField
      type="password"
      control={control}
      name={name}
      rules={{
        validate: {
          confirmPassword: (value) => value === getValues('password'),
        },
      }}
      label={label}
    />
  )
}
