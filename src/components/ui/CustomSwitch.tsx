import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { UseControllerProps, useController } from 'react-hook-form'

interface Props<T> extends UseControllerProps<T> {
  label: string
}

function CustomSwitch<T>({ control, name, label, rules }: Props<T>) {
  const { field } = useController<T>({
    name,
    control,
    defaultValue: false as any,
    rules,
  })
  return (
    <FormControlLabel
      control={<Switch {...field} checked={field.value as boolean} />}
      label={label}
    />
  )
}

export default CustomSwitch
