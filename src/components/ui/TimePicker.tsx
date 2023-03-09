import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import React from 'react'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { TextField } from '@mui/material'
import { useController } from 'react-hook-form'
import { DateTime } from 'luxon'

function CustomTimePicker({
  label,
  name,
  control,
  disabled = false,
  defaultValue = null,
}) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules: {
      required: 'Ingrese una hora',
      validate: {
        validDate: (v: DateTime) => v.isValid || 'Ingrese una hora valida',
      },
    },
    defaultValue,
  })

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <TimePicker
        {...field}
        disabled={disabled}
        label={label}
        disableMaskedInput
        inputFormat="HH:mm"
        renderInput={(props) => (
          <TextField
            {...props}
            required
            placeholder="HH:mm"
            helperText={error?.message}
            error={invalid}
            fullWidth
          />
        )}
      />
    </LocalizationProvider>
  )
}

export default CustomTimePicker
