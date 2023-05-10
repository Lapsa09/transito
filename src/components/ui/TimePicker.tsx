import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import React from 'react'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { TextField } from '@mui/material'
import {
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form'
import { DateTime } from 'luxon'

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
