import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { TextField } from '@mui/material'
import { useController } from 'react-hook-form'
import { currentDate } from '../../utils'
import { DateTime } from 'luxon'

function CustomDatePicker({
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
      required: 'Ingrese una fecha',
      validate: {
        validDate: (v: DateTime) => v.isValid || 'Ingrese una fecha valida',
        minDate: (v: DateTime) =>
          v.toMillis() > currentDate().minus({ months: 6 }).toMillis() ||
          'Elija una fecha mas reciente',
        maxDate: (v: DateTime) =>
          v.toMillis() < currentDate().toMillis() || 'Elija una fecha pasada',
      },
    },
    defaultValue,
  })

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        {...field}
        disabled={disabled}
        label={label}
        mask="__/__/____"
        inputFormat="dd/MM/yyyy"
        renderInput={(props) => (
          <TextField
            {...props}
            required
            placeholder="dd/MM/yyyy"
            helperText={error?.message}
            fullWidth
            error={invalid}
          />
        )}
        minDate={currentDate().minus({ month: 6 })}
        disableFuture
      />
    </LocalizationProvider>
  )
}

export default CustomDatePicker
