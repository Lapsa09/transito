import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'

function CustomSwitch({ control, name, label, rules }) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules,
    defaultValue: false,
  })
  return (
    <FormControlLabel
      control={
        <Switch
          {...field}
          error={invalid}
          helperText={error?.message}
          checked={field.value}
        />
      }
      label={label}
    />
  )
}

export default CustomSwitch
