import { Autocomplete, TextField, UseAutocompleteProps } from '@mui/material'
import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'

interface Props<T, K>
  extends UseControllerProps<T>,
    Omit<UseAutocompleteProps<K, false, false, false>, 'defaultValue'> {
  label: string
  labelOption: string
}

function CustomAutocomplete<T, K>({
  control,
  name,
  rules,
  label,
  options,
  labelOption,
}: Props<T, K>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue: null,
  })
  const optionLabel = (option): string => {
    return option[labelOption]
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
