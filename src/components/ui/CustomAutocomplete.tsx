import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import {
  Control,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form'

type IAutoComplete = {
  control: Control<any, any>
  name: string
  rules?: Omit<
    RegisterOptions<FieldValues, any>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  options?: any[]
  label: string
}

function CustomAutocomplete({
  control,
  name,
  rules = null,
  label,
  options = [],
}: IAutoComplete) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: null,
  })

  const optionLabel = (option: any) => {
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
