import React from 'react'
import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import {
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form'
import { Enums } from '../../types'
import { sxStyles } from '../../utils'

type Props<T, K> = Omit<UseControllerProps<T>, 'defaultValue'> &
  Omit<TextFieldProps, 'name' | 'defaultValue' | 'variant'> & {
    options?: Enums[] | K[]
    optionId?: string
    optionLabel?: string
    defaultValue?: any
  }

function CustomSelect<T, K>({
  name,
  rules,
  options,
  defaultValue = '',
  optionId = 'id',
  optionLabel = 'label',
  ...props
}: Props<T, K>) {
  const { control } = useFormContext<T>()
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
      required={Boolean(rules?.required)}
      helperText={error?.message}
      {...props}
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
