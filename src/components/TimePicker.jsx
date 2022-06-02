import React from "react";
import { useInput } from "react-admin";
import { TextField } from "react-admin/node_modules/@mui/material";

export const TimePickerComponent = ({ className, source, label }) => {
  const { field } = useInput({ source });
  return (
    <TextField className={className} type="time" {...field} label={label} />
  );
};
