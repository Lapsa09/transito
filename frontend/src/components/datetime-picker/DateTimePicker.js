import { LocalizationProvider } from "@mui/lab";
import React from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { TextField } from "@mui/material";
import DateTimePicker from "@mui/lab/DateTimePicker";

function CustomDateTimePicker({ label, value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label={label}
        value={value}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}

export default CustomDateTimePicker;
