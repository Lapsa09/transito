import { TextField } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

function CustomTextField({
  control,
  name,
  defaultValue = null,
  rules,
  label,
  type = "text",
  disabled = false,
  className,
}) {
  const {
    field,
    fieldState: { error },
    formState: { errors },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const handleChange = (e) => {
    field.onChange(
      typeof e.target.value == "string" && type !== "password"
        ? e.target.value.toUpperCase()
        : e.target.value
    );
  };

  return (
    <TextField
      {...field}
      onChange={handleChange}
      type={type}
      helperText={errors[name]?.message}
      required={rules !== undefined}
      disabled={disabled}
      className={className}
      error={error}
      label={label}
    />
  );
}

export default CustomTextField;
