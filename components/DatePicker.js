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
        minDate: (v) =>
          v >= DateTime.now().minus({ month: 6 }) ||
          "Ingrese una fecha dentro del rango de 6 meses",
        maxDate: (v) =>
          v <= DateTime.now() || "No se puede ingresar una fecha futura",
      },
    },
    defaultValue,
  });

  const parseDate = (newDate) => {
    if (newDate.isValid) {
      field.onChange(newDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DatePicker
        {...field}
        onChange={parseDate}
        disabled={disabled}
        renderInput={(props) => (
          <TextField
            {...props}
            required
            helperText={errors[name] && errors[name].message}
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
