import { LocalizationProvider, TimePicker } from "@mui/lab";
import React from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

function CustomTimePicker({
  label,
  name,
  control,
  disabled = false,
  defaultValue,
}) {
  const {
    field,
    fieldState: { invalid },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: {
      required: "Ingrese una hora",
    },
    defaultValue,
  });

  const parseTime = (newTime) => {
    if (newTime.isValid) {
      field.onChange(newTime);
    }
  };
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <TimePicker
        {...field}
        onChange={parseTime}
        disabled={disabled}
        label={label}
        renderInput={(props) => (
          <TextField
            {...props}
            required
            helperText={errors[name] && errors[name].message}
            error={invalid}
          />
        )}
      />
    </LocalizationProvider>
  );
}

export default CustomTimePicker;
