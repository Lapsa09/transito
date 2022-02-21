import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

function CustomSelect({
  control,
  name,
  rules,
  label,
  options,
  defaultValue,
  disabled = false,
}) {
  const {
    field,
    fieldState: { invalid },
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
      error={invalid}
      label={label}
      disabled={disabled}
      required
      helperText={errors[name] && errors[name].message}
    >
      <MenuItem>SELECCIONE UNA OPCION</MenuItem>
      {options.map((option) =>
        option.enumlabel ? (
          <MenuItem value={option.enumlabel}>{option.enumlabel}</MenuItem>
        ) : (
          <MenuItem value={Object.entries(option)[0][1]}>
            {Object.entries(option)[1][1]}
          </MenuItem>
        )
      )}
    </TextField>
  );
}

export default CustomSelect;
