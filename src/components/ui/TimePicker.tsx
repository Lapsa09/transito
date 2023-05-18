import React from 'react'
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
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
      <TimeField
        {...field}
        inputRef={field.ref}
        disabled={disabled}
        slotProps={{
          textField: { error: invalid, helperText: error?.message },
        }}
        label={label}
        fullWidth
        format="HH:mm"
        required
      />
    </LocalizationProvider>
  )
}

export default CustomTimePicker
