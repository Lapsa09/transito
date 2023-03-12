import React from 'react'
import { MenuItem, TextField, BaseTextFieldProps } from '@mui/material'
import { useController, UseControllerProps } from 'react-hook-form'
import { Enums } from '../../types'

type Props<T, K> = UseControllerProps<T> &
  BaseTextFieldProps & {
    options?: Enums[] | K[]
  }

function CustomSelect<T, K>({
  control,
  name,
  rules,
  label,
  options,
  defaultValue = null,
  disabled,
}: Props<T, K>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  })
  return (
    <TextField
      {...field}
      select
      sx={{ width: '100%' }}
      error={invalid}
      label={label}
      disabled={disabled}
      required={rules?.required != null}
      helperText={error?.message}
    >
      <MenuItem value="">ELIJA UNA OPCION</MenuItem>
      {options?.map((option) =>
        'enumlabel' in option ? (
          <MenuItem key={option.enumlabel} value={option.enumlabel}>
            {option.enumlabel}
          </MenuItem>
        ) : (
          <MenuItem
            key={Object.values(option)[0] as number}
            value={Object.values(option)[0] as number}
          >
            {Object.values(option)[1] as string}
          </MenuItem>
        )
      )}
    </TextField>
  )
}

export default CustomSelect
