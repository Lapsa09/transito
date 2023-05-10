import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { TextField } from '@mui/material'
import {
  Path,
  PathValue,
  useController,
  UseControllerProps,
  useFormContext,
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
      required: 'Ingrese una fecha',
      validate: {
        validDate: (v) =>
          DateTime.fromISO(v as string).isValid || 'Fecha inválida',
        minDate: (v) =>
          DateTime.fromISO(v as string).toMillis() >
            currentDate().minus({ months: 6 }).toMillis() ||
          'La fecha no puede ser menor a 6 meses',
        maxDate: (v) =>
          DateTime.fromISO(v as string).toMillis() < currentDate().toMillis() ||
          'La fecha no puede ser mayor a la actual',
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
