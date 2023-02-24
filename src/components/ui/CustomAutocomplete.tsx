import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'

function CustomAutocomplete({
  control,
  name,
  rules = null,
  label,
  options = [],
}) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: null,
  })

  const optionLabel = (option) => {
    return Object.values(option)[1] as string
  }

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
          required={rules?.required != null}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  )
}

export default CustomAutocomplete
