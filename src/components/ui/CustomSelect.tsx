import { MenuItem, TextField } from '@mui/material'
import React, { ReactNode } from 'react'
import { useController } from 'react-hook-form'

function CustomSelect({
  control,
  name,
  rules = null,
  label,
  options,
  defaultValue = '',
  disabled = false,
}) {
  const {
    field,
    fieldState: { error },
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
      error={!!error}
      label={label}
      disabled={disabled}
      required={rules !== undefined}
      helperText={error?.message}
    >
      <MenuItem value="">ELIJA UNA OPCION</MenuItem>
      {options?.map((option) =>
        option.enumlabel ? (
          <MenuItem value={option.enumlabel}>{option.enumlabel}</MenuItem>
        ) : (
          <MenuItem value={Object.values(option)[0] as any}>
            {Object.values(option)[1] as ReactNode}
          </MenuItem>
        )
      )}
    </TextField>
  )
}

export default CustomSelect
