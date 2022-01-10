import { DatePicker, LocalizationProvider } from "@mui/lab";
import React from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { TextField } from "@mui/material";
import { DateTime } from "luxon";

function CustomDatePicker({
  label,
  value,
  onChange,
  helperText,
  error,
  disabled = false,
}) {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DatePicker
        renderInput={(props) => (
          <TextField
            {...props}
            required
            disabled
            helperText={error && helperText}
            error={error}
          />
        )}
        label={label}
        value={value}
        onChange={onChange}
        minDate={DateTime.now().minus({ month: 6 })}
        maxDate={DateTime.now()}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
