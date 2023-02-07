import React from 'react'
import { useInput } from 'react-admin'
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { TextField } from '@mui/material'
import { DateTime } from 'luxon'

export const TimePickerComponent = ({ className, source, label, value }) => {
  const {
    field,
    fieldState: { error },
  } = useInput({
    source,
    defaultValue: value ? DateTime.fromFormat(value, 'HH:mm:ss') : null,
  })

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
            error={error}
            required
            placeholder="HH:mm"
            variant="standard"
          />
        )}
      />
    </LocalizationProvider>
  )
}

export const DatePickerComponent = ({ className, label, source, value }) => {
  const {
    field,
    fieldState: { error },
  } = useInput({
    source,
    defaultValue: value ? DateTime.fromFormat(value, 'dd/MM/yyyy') : null,
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
            error={error}
            variant="standard"
            placeholder="dd/MM/yyyy"
          />
        )}
      />
    </LocalizationProvider>
  )
}
