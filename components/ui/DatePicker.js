import { DatePicker, LocalizationProvider } from "@mui/lab";
import React from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { TextField } from "@mui/material";
import { useController } from "react-hook-form";
import { currentDate } from "../../utils";

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
        validDate: (v) => v.isValid || "Ingrese una fecha valida",
        minDate: (v) =>
          v.toMillis() > currentDate().minus({ months: 6 }).toMillis() ||
          "Elija una fecha mas reciente",
        maxDate: (v) =>
          v.toMillis() < currentDate().toMillis() || "Elija una fecha pasada",
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
        label={label}
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
        minDate={currentDate().minus({ month: 6 })}
        maxDate={currentDate()}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
