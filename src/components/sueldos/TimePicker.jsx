import React from 'react'
import { useInput } from 'react-admin'
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { TextField } from '@mui/material'

export const TimePickerComponent = ({ className, source, label }) => {
  const { field } = useInput({ source, defaultValue: null })
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <TimePicker
        {...field}
        label={label}
        renderInput={(props) => (
          <TextField
            {...props}
            className={className}
            required
            placeholder="HH:mm"
          />
        )}
      />
    </LocalizationProvider>
  )
}

export const DatePickerComponent = ({
  className,
  label,
  source,
  observer = null,
}) => {
  const { field } = useInput({ source, defaultValue: null })

  const changeValue = (value) => {
    field.onChange(value)
  }

  observer?.subscribe(changeValue)
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        {...field}
        mask="__/__/____"
        label={label}
        renderInput={(props) => (
          <TextField
            {...props}
            className={className}
            required
            placeholder="dd/MM/yyyy"
          />
        )}
      />
    </LocalizationProvider>
  )
}
