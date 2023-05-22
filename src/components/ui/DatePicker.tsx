import { DateField, LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form'
import dayjs from 'dayjs'

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
    field: { value, onChange, ...field },
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules: {
      required: 'Ingrese una fecha',
      validate: {
        validDate: (v) => dayjs(v as string).isValid() || 'Fecha inválida',
        minDate: (v) =>
          dayjs(v as string).diff(dayjs(), 'month') > 6 ||
          'La fecha no puede ser menor a 6 meses atras',
        maxDate: (v) =>
          dayjs(v as string).diff(dayjs()) < 0 ||
          'La fecha no puede ser mayor a la actual',
      },
    },
    defaultValue,
  })

  const _onChange = (value) => onChange(dayjs(value))

  const _value = dayjs(value as any)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateField
        value={_value}
        onChange={_onChange}
        {...field}
        disabled={disabled}
        inputRef={field.ref}
        format="dd/MM/yyyy"
        required
        label={label}
        slotProps={{
          textField: { error: invalid, helperText: error?.message },
        }}
        fullWidth
      />
    </LocalizationProvider>
  )
}

export default CustomDatePicker
