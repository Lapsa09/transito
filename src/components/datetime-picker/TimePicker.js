import { LocalizationProvider, TimePicker } from "@mui/lab";
import React from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { TextField } from "@mui/material";

function CustomTimePicker({
  label,
  value,
  onChange,
  helperText,
  error,
  disabled = false,
}) {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <TimePicker
        renderInput={(props) => (
          <TextField
            {...props}
            disabled
            helperText={error && helperText}
            error={error}
            required
          />
        )}
        label={label}
        value={value}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}

export default CustomTimePicker;
