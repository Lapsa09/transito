import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import React from 'react';
import DateAdapter from '@mui/lab/AdapterLuxon';
import { TextField } from '@mui/material';
import { useController } from 'react-hook-form';

function CustomTimePicker({
  label,
  name,
  control,
  disabled = false,
  defaultValue,
}) {
  const {
    field,
    fieldState: { error },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: {
      required: 'Ingrese una hora',
      validate: {
        validDate: (v) => v.isValid || 'Ingrese una hora valida',
      },
    },
    defaultValue,
  });

  const parseTime = (newTime) => {
    field.onChange(newTime);
  };
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <TimePicker
        {...field}
        onChange={parseTime}
        disabled={disabled}
        label={label}
        inputFormat="HH:mm"
        renderInput={(props) => (
          <TextField
            {...props}
            required
            placeholder="HH:mm"
            helperText={errors[name]?.message}
            error={error}
            fullWidth
          />
        )}
      />
    </LocalizationProvider>
  );
}

export default CustomTimePicker;
