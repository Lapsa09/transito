import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

function CustomAutocomplete({
  control,
  name,
  rules,
  label,
  options,
  autoCompleter,
  setAutoCompleter,
}) {
  const {
    field,
    fieldState: { invalid },
    formState: { errors },
  } = useController({
    name,
    control,
    rules,
    defaultValue: "",
  });
  return (
    <Autocomplete
      {...field}
      value={autoCompleter}
      options={options}
      getOptionLabel={(option) => option.barrio}
      onChange={(e, value, reason) => {
        field.onChange(reason === "clear" ? "" : value.id_barrio);
        setAutoCompleter(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required
          error={invalid}
          helperText={errors[name] && errors[name].message}
        />
      )}
    />
  );
}

export default CustomAutocomplete;
