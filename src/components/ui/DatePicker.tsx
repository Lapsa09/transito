import React from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import {
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form'
import { currentDate } from '../../utils'
import { DateTime } from 'luxon'
import { TextField } from '@mui/material'

type Props<T> = UseControllerProps<T> & {
  label: string
  disabled: boolean
}

function CustomDatePicker<T>({
  label,
  name,
  disabled = false,
  defaultValue,
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
          'La fecha no puede ser menor a 6 meses atras',
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
        inputRef={field.ref}
        inputFormat="dd/MM/yyyy"
        label={label}
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

export default CustomDatePicker
