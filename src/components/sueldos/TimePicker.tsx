import React, { useEffect } from 'react'
import { useInput } from 'react-admin'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
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
        inputRef={field.ref}
        label={label}
        inputFormat="HH:mm"
        className={className}
        renderInput={(params) => (
          <TextField
            {...params}
            error={invalid}
            helperText={error?.message}
            required
            fullWidth
          />
        )}
      />
    </LocalizationProvider>
  )
}

export const DatePickerComponent = ({ className, label, source }) => {
  const {
    field: { value, onChange, ...field },
    fieldState: { error, invalid },
  } = useInput({
    source,
  })

  const _onChange = (value) => onChange(DateTime.fromISO(value))

  const _value = DateTime.fromISO(value as any)

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        {...field}
        value={_value}
        onChange={_onChange}
        label={label}
        inputFormat="dd/MM/yyyy"
        className={className}
        renderInput={(params) => (
          <TextField
            {...params}
            error={invalid}
            helperText={error?.message}
            required
            fullWidth
          />
        )}
      />
    </LocalizationProvider>
  )
}
