import React from 'react'
import { MenuItem, TextField, BaseTextFieldProps } from '@mui/material'
import { useController, UseControllerProps } from 'react-hook-form'
import { Enums } from '../../types'
import { sxStyles } from '../../utils'

type Props<T, K> = Omit<UseControllerProps<T>, 'defaultValue'> &
  BaseTextFieldProps & {
    options?: Enums[] | K[]
    optionId?: string
    optionLabel?: string
    defaultValue?: any
  }

function CustomSelect<T, K>({
  control,
  name,
  rules,
  label,
  options,
  defaultValue = '',
  disabled,
  optionId = 'id',
  optionLabel = 'label',
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
      sx={sxStyles.fullWidth}
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
          <MenuItem key={option[optionId]} value={option[optionId]}>
            {option[optionLabel]}
          </MenuItem>
        )
      )}
    </TextField>
  )
}

export default CustomSelect
