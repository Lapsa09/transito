import { LocalizationProvider } from "@mui/lab";
import React, { useState } from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { TextField } from "@mui/material";

function DateTimePicker() {
    const [dateTime,setDateTime]=useState(new Date())
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="DateTimePicker"
        value={dateTime}
        onChange={(newValue) => {
            setDateTime(newValue);
        }}
      />
    </LocalizationProvider>
  );
}

export default DateTimePicker;
