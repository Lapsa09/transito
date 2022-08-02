import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { useController } from 'react-hook-form';

function CustomSwitch({ control, name, label, rules }) {
  const {
    field,
    fieldState: { error },
    formState: { errors },
  } = useController({
    name,
    control,
    rules,
    defaultValue: false,
  });
  return (
    <FormControlLabel
      control={
        <Switch
          {...field}
          error={error}
          helperText={errors[name]?.message}
          checked={field.value}
        />
      }
      label={label}
    />
  );
}

export default CustomSwitch;
