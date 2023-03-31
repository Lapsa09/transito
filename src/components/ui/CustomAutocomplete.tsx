import { Autocomplete, AutocompleteProps, TextField } from '@mui/material'
import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'

interface Props<T, K>
  extends UseControllerProps<T>,
    Omit<
      AutocompleteProps<K, false, false, false>,
      'defaultValue' | 'renderInput'
    > {
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
  ...props
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
          required={Boolean(rules?.required)}
          error={invalid}
          helperText={error?.message}
        />
      )}
      {...props}
    />
  )
}

export default CustomAutocomplete
