import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'

function CustomAutocomplete({ control, name, rules, label, options = [] }) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules,
    defaultValue: null,
  })

  const optionLabel = (option) => {
    return Object.values(option)[1]
  }

  return (
    <Autocomplete
      {...field}
      options={options}
      getOptionLabel={optionLabel}
      onChange={(_, value, reason) =>
        field.onChange(reason === 'clear' ? null : value)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={rules?.required != null}
          error={invalid}
          helperText={error?.message}
        />
      )}
    />
  )
}

export default CustomAutocomplete
