import React from 'react'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import {
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form'
import { DateTime } from 'luxon'
import { TextField } from '@mui/material'

type Props<T> = UseControllerProps<T> & {
  label: string
  disabled?: boolean
}

function CustomTimePicker<T>({
  label,
  name,
  disabled = false,
  defaultValue = null,
}: Props<T>) {
  const { control } = useFormContext<T>()
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules: {
      required: 'Ingrese una hora',
      validate: {
        validDate: (v) =>
          DateTime.fromISO(v as string).isValid || 'Ingrese una hora valida',
      },
    },
    defaultValue,
  })

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <TimePicker
        {...field}
        inputRef={field.ref}
        disabled={disabled}
        label={label}
        inputFormat="HH:mm"
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

export default CustomTimePicker
