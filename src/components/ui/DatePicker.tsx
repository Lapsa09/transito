import { DateField, LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import {
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
      <DateField
        {...field}
        disabled={disabled}
        inputRef={field.ref}
        format="dd-MM-yyyy"
        required
        label={label}
        slotProps={{
          textField: { error: invalid, helperText: error?.message },
        }}
      />
    </LocalizationProvider>
  )
}

export default CustomDatePicker
