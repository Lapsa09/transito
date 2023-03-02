import React, { useEffect } from 'react'
import { useInput } from 'react-admin'
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { TextField } from '@mui/material'
import { DateTime } from 'luxon'

export const TimePickerComponent = ({ className, source, label }) => {
  const {
    field,
    fieldState: { error, invalid },
  } = useInput({
    source,
  })

  useEffect(() => {
    if (typeof field.value === 'string') {
      field.onChange(DateTime.fromFormat(field.value, 'HH:mm:ss'))
    }
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <TimePicker
        {...field}
        label={label}
        inputFormat="HH:mm"
        className={className}
        renderInput={(props) => (
          <TextField
            {...props}
            error={invalid}
            helperText={error?.message}
            required
            variant="standard"
          />
        )}
      />
    </LocalizationProvider>
  )
}

export const DatePickerComponent = ({ className, label, source }) => {
  const {
    field,
    fieldState: { error, invalid },
  } = useInput({
    source,
  })

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        {...field}
        mask="__/__/____"
        label={label}
        inputFormat="dd/MM/yyyy"
        className={className}
        renderInput={(props) => (
          <TextField
            {...props}
            required
            helperText={error?.message}
            error={invalid}
            variant="standard"
            placeholder="dd/MM/yyyy"
          />
        )}
      />
    </LocalizationProvider>
  )
}
