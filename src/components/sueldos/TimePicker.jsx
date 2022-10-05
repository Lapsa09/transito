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

export const TimePickerComponent = ({
  className,
  source,
  label,
  value = '',
}) => {
  const { field } = useInput({
    source,
    defaultValue: '',
  })
  useEffect(() => {
    field.onChange(DateTime.fromFormat(value, 'HH:mm:ss'))
  }, [])
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

export const DatePickerComponent = ({ className, label, source }) => {
  const { field } = useInput({ source, defaultValue: '' })

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
