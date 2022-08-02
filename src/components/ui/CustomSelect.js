import { MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useController } from 'react-hook-form';

function CustomSelect({
  control,
  name,
  rules,
  label,
  options,
  defaultValue = '',
  disabled = false,
}) {
  const {
    field,
    fieldState: { error },
    formState: { errors },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });
  return (
    <TextField
      {...field}
      select
      sx={{ width: '100%' }}
      error={error}
      label={label}
      disabled={disabled}
      required={rules !== undefined}
      helperText={errors[name]?.message}
    >
      <MenuItem value="">ELIJA UNA OPCION</MenuItem>
      {options?.map((option) =>
        option.enumlabel ? (
          <MenuItem value={option.enumlabel}>{option.enumlabel}</MenuItem>
        ) : (
          <MenuItem value={Object.values(option)[0]}>
            {Object.values(option)[1]}
          </MenuItem>
        ),
      )}
    </TextField>
  );
}

export default CustomSelect;
