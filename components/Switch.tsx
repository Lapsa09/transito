'use client'
import React from 'react'
import { Switch } from './ui/switch'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'

type Props = UseControllerProps & {
  label: string
}

function CustomSwitch({ name, label, rules }: Props) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
    rules,
    defaultValue: false,
  })
  return (
    <div className="flex">
      <label htmlFor={name}>{label}</label>
      <Switch checked={field.value} onCheckedChange={field.onChange} />
    </div>
  )
}

export default CustomSwitch
