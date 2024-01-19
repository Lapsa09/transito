import React from 'react'
import { RadioGroup, Radio } from '@nextui-org/react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'

type Props = {
  label: string
  options: {
    id: number
    [key: string]: any
  }[]
} & UseControllerProps

export default function CustomRadioGroup({ label, options, name }: Props) {
  const { control } = useFormContext()
  const { field } = useController({ control, name })

  const handleChange = (id: string) => {
    const option = options.find((option) => option.id.toString() === id)
    field.onChange(option)
  }

  return (
    <RadioGroup
      label={<span dangerouslySetInnerHTML={{ __html: label }} />}
      value={field.value?.id?.toString()}
      onValueChange={handleChange}
    >
      {options.map((option) => {
        return (
          <Radio key={option.id} value={option.id.toString()}>
            <p
              className="flex items-center"
              dangerouslySetInnerHTML={{ __html: option.respuesta }}
            />
          </Radio>
        )
      })}
    </RadioGroup>
  )
}
