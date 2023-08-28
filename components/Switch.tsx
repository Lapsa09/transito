'use client'
import React from 'react'
import { Switch } from '@nextui-org/react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'

type Props = UseControllerProps & {
  label: string
  className?: string
}

function CustomSwitch({ name, label, rules, className }: Props) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
    rules,
    defaultValue: false,
  })
  return (
    <Switch
      className={className}
      isSelected={field.value}
      onValueChange={field.onChange}
    >
      {label}
    </Switch>
  )
}

export default CustomSwitch
