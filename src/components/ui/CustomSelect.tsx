import { MenuItem, TextField } from '@mui/material'
import React, { ReactNode } from 'react'
import {
  Control,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form'

type ISelect = {
  control: Control<any, any>
  name: string
  rules?: Omit<
    RegisterOptions<FieldValues, any>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  options?: any[]
  label: string
  defaultValue?: string
  disabled?: boolean
}

function CustomSelect({
  control,
  name,
  rules,
  label,
  options,
  defaultValue = undefined,
  disabled,
}: ISelect) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules,
    defaultValue: '',
  })
  return (
    <TextField
      {...field}
      select
      sx={{ width: '100%' }}
      error={invalid}
      label={label}
      disabled={disabled}
      required={rules !== undefined}
      helperText={error?.message}
    >
      <MenuItem value="">ELIJA UNA OPCION</MenuItem>
      {options?.map((option) =>
        option.enumlabel ? (
          <MenuItem key={option.enumlabel} value={option.enumlabel}>
            {option.enumlabel}
          </MenuItem>
        ) : (
          <MenuItem
            key={Object.values(option)[0] as any}
            value={Object.values(option)[0] as any}
          >
            {Object.values(option)[1] as ReactNode}
          </MenuItem>
        )
      )}
    </TextField>
  )
}

export default CustomSelect
