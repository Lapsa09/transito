import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'

function CustomSwitch({ control, name, label }) {
  const { field } = useController({
    name,
    control,
    defaultValue: false,
  })
  return (
    <FormControlLabel
      control={<Switch {...field} checked={field.value} />}
      label={label}
    />
  )
}

export default CustomSwitch
