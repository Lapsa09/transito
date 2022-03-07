import { DatePicker, LocalizationProvider } from "@mui/lab";
import React from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { TextField } from "@mui/material";
import { DateTime } from "luxon";
import { useController } from "react-hook-form";

function CustomDatePicker({
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
      required: "Ingrese una fecha",
      validate: {
        validDate: (v) => v.isValid,
      },
    },
    defaultValue,
  });

  const parseDate = (newDate) => {
    field.onChange(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DatePicker
        {...field}
        onChange={parseDate}
        disabled={disabled}
        inputFormat="dd/MM/yyyy"
        renderInput={(props) => (
          <TextField
            {...props}
            required
            placeholder="dd/MM/yyyy"
            helperText={errors[name]?.message}
            error={invalid}
          />
        )}
        label={label}
        minDate={DateTime.now().minus({ month: 6 })}
        maxDate={DateTime.now()}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
