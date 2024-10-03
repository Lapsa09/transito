'use client'
import { cn } from '@/lib/utils'
import React, { useEffect } from 'react'
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
  useForm,
} from 'react-hook-form'

export const RegularForm = <T extends FieldValues, K extends FieldValues>({
  onSubmit,
  children,
  className,
  data,
  id,
  defaultValues,
  resetOnSubmit = false,
}: {
  onSubmit: SubmitHandler<T>
  className?: string
  data?: K[]
  id?: string
  defaultValues?: DefaultValues<T>
  children: React.ReactNode | ((methods: UseFormReturn<T>) => React.ReactNode)
  resetOnSubmit?: boolean
}) => {
  const methods = useForm<T>({
    mode: 'all',
    defaultValues,
  })
  useEffect(() => {
    if (data) {
      data.forEach((item) => {
        const [key, value] = Object.values(item)

        methods.setValue(key, value)
      })
    }
  }, [data])

  return (
    <FormProvider {...methods}>
      <form
        className={cn('w-full', className)}
        onSubmit={async (e) => {
          e.stopPropagation()
          await methods.handleSubmit(onSubmit)(e)
          if (resetOnSubmit) methods.reset()
        }}
        id={id}
      >
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  )
}
