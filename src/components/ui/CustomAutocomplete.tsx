import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { Control, Path, RegisterOptions, useController } from 'react-hook-form'

type IAutoComplete<T, K> = {
  control: Control<T>
  name: Path<T>
  rules?: Omit<
    RegisterOptions<T>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  options: K[]
  label: string
  labelOption: string
}

function CustomAutocomplete<T, K>({
  control,
  name,
  rules = null,
  label,
  options,
  labelOption,
}: IAutoComplete<T, K>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue: null,
  })
  const optionLabel = (option: any): string => {
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
