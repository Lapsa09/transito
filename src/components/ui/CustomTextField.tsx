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
  Omit<TextFieldProps, 'name' | 'defaultValue'>

function CustomTextField<T>({
  name,
  rules,
  label,
  type = 'text',
  variant = 'outlined',
  ...props
}: Props<T>) {
  const { control } = useFormContext<T>()
  const {
    field: { ref, ...field },
    fieldState: { error, invalid },
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue: '' as any,
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
      helperText={error?.message}
      required={rules?.required != null}
      error={invalid}
      label={label}
      fullWidth
      type={type}
      inputRef={ref}
      variant={variant}
      {...props}
    />
  )
}

function DomainField<T>({ control, name, className = '' }: Props<T>) {
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
  );
}

function FileNumberField<T>({
  control,
  name,
  className = '',
  label,
  ...props
}: Props<T>) {
  return (
    <CustomTextField
      className={className}
      label={label}
      name={name}
      control={control}
      type="number"
      {...props}
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

function PasswordField<T>({ control, name, label }: Props<T>) {
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

CustomTextField.DOMINIO = DomainField
CustomTextField.LEGAJO = FileNumberField
CustomTextField.PASSWORD = PasswordField

export default CustomTextField
