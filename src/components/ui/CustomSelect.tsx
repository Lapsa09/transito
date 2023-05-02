import React from 'react'
import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useController, UseControllerProps } from 'react-hook-form'
import { Enums } from '../../types'
import { sxStyles } from '../../utils'

type Props<T, K> = Omit<UseControllerProps<T>, 'defaultValue'> &
  Omit<TextFieldProps, 'name' | 'defaultValue' | 'variant'> & {
    options?: Enums[] & K[]
    optionId?: string
    optionLabel?: string
    defaultValue?: any
  }

function CustomSelect<T, K>({
  control,
  name,
  rules,
  options,
  defaultValue = null,
  optionId = 'id',
  optionLabel = 'label',
  ...props
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

  function generateOptionItem(option: Enums): JSX.Element
  function generateOptionItem(option: K): JSX.Element
  function generateOptionItem(option: any): JSX.Element {
    if (option.enumlabel) {
      return (
        <MenuItem key={option.enumlabel} value={option.enumlabel}>
          {option.enumlabel}
        </MenuItem>
      )
    }
    return (
      <MenuItem key={option[optionId]} value={option[optionId]}>
        {option[optionLabel]}
      </MenuItem>
    )
  }

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
      {options?.map((option) => generateOptionItem(option))}
    </TextField>
  )
}

export default CustomSelect
