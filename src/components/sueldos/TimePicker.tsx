import React, { useEffect } from 'react'
import { useInput } from 'react-admin'
import { DateField, LocalizationProvider, TimeField } from '@mui/x-date-pickers'
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
      <TimeField
        {...field}
        inputRef={field.ref}
        label={label}
        format="HH:mm"
        className={className}
        slotProps={{
          textField: {
            error: invalid,
            helperText: error?.message,
            required: true,
          },
        }}
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
      <DateField
        {...field}
        value={_value}
        onChange={_onChange}
        label={label}
        format="dd/MM/yyyy"
        className={className}
        slotProps={{
          textField: {
            error: invalid,
            helperText: error?.message,
            required: true,
          },
        }}
      />
    </LocalizationProvider>
  )
}
