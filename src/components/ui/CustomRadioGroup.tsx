import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import React from 'react'
import { useController } from 'react-hook-form'

function CustomRadioGroup({ title, values, name, control }) {
  const { field } = useController({
    name,
    control,
    defaultValue: values[0].value,
  })
  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">{title}</FormLabel>
      <RadioGroup
        {...field}
        aria-labelledby="demo-controlled-radio-buttons-group"
      >
        {values.map(({ value, label }) => (
          <FormControlLabel
            key={label}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default CustomRadioGroup
