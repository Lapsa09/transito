import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { TextField } from '@mui/material'
import {
  Path,
  PathValue,
  useController,
  UseControllerProps,
} from 'react-hook-form'
import { currentDate } from '../../utils'
import { DateTime } from 'luxon'

type Props<T> = UseControllerProps<T> & {
  label: string
  disabled: boolean
}

function CustomDatePicker<T>({
  label,
  name,
  control,
  disabled = false,
  defaultValue = null,
}: Props<T>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules: {
      required: 'Ingrese una fecha',
      validate: {
        validDate: (v: PathValue<T, Path<T>> & DateTime) => v.isValid,
        minDate: (v: PathValue<T, Path<T>> & DateTime) =>
          v.toMillis() > currentDate.minus({ months: 6 }).toMillis(),
        maxDate: (v: PathValue<T, Path<T>> & DateTime) =>
          v.toMillis() < currentDate.toMillis(),
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
        minDate={currentDate.minus({ month: 6 })}
        disableFuture
      />
    </LocalizationProvider>
  )
}

export default CustomDatePicker
