import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { useController } from 'react-hook-form';

function CustomAutocomplete({ control, name, rules, label, options }) {
  const {
    field,
    fieldState: { error },
    formState: { errors },
  } = useController({
    name,
    control,
    rules,
    defaultValue: null,
  });

  const optionLabel = (option) => {
    return Object.entries(option)[1][1];
  };

  return (
    <Autocomplete
      {...field}
      options={options}
      getOptionLabel={optionLabel}
      onChange={(e, value, reason) =>
        field.onChange(reason === 'clear' ? null : value)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required
          error={error}
          helperText={errors[name]?.message}
        />
      )}
    />
  );
}

export default CustomAutocomplete;
