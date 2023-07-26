'use client'
import {
  AriaTimeFieldProps,
  useTimeField,
  useDateSegment,
  useLocale,
  TimeValue,
} from 'react-aria'
import { DateFieldState, DateSegment, useTimeFieldState } from 'react-stately'
import {
  CalendarDate,
  CalendarDateTime,
  Time,
  ZonedDateTime,
} from '@internationalized/date'
import { useEffect, useRef } from 'react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface TimeFieldProps
  extends AriaTimeFieldProps<TimeValue>,
    Omit<UseControllerProps, 'defaultValue'> {
  className?: string
  persist?: (data: any) => void
}

export function TimeField({
  name,
  defaultValue,
  rules,
  label,
  minValue,
  maxValue,
  className,
  persist,
  ...props
}: TimeFieldProps) {
  const { locale } = useLocale()
  const { control, trigger } = useFormContext()
  const {
    field: { value, ...field },
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
    defaultValue,
    rules: {
      ...rules,
      validate: {
        ...rules?.validate,
        minDate: (value: Time) =>
          minValue ? value.compare(minValue) > 0 || 'Fecha invalida' : true,
        maxDate: (value: Time) =>
          maxValue ? value.compare(maxValue) < 0 || 'Fecha invalida' : true,
      },
    },
  })

  const onChange = (value: Time | CalendarDateTime | ZonedDateTime) => {
    field.onChange(value)
    if (persist) persist({ [name]: value })
    trigger(name)
  }

  const state = useTimeFieldState({
    ...props,
    minValue,
    maxValue,
    value,
    onChange,
    validationState: invalid ? 'invalid' : 'valid',
    errorMessage: error?.message,
    isRequired: !!rules?.required,
    shouldForceLeadingZeros: true,
    label,
    locale,
    defaultValue,
  })

  const myRef = useRef<HTMLDivElement | null>(null)
  const { labelProps, fieldProps, errorMessageProps } = useTimeField(
    props,
    state,
    myRef
  )
  const clear = () => {
    state.clearSegment('literal')
  }

  return (
    <div className={twMerge('flex flex-col items-start mb-6', className)}>
      <span
        {...labelProps}
        className="text-sm text-gray-900 dark:text-gray-300 font-medium block mb-2"
      >
        {label}
        {rules?.required && (
          <span className="text-gray-900 dark:text-gray-300 ml-1">*</span>
        )}
      </span>
      <div
        {...fieldProps}
        ref={(ref) => {
          myRef.current = ref
          field.ref(ref)
        }}
        className={`relative flex w-full uppercase items-center rounded-lg border bg-white/0 dark:bg-gray-700 p-2.5 text-sm outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
          invalid ? 'border-red-500 dark:!border-red-400 ' : 'border-gray-600'
        }`}
      >
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
        <button
          onClick={clear}
          className="absolute right-4 text-gray-300 hover:text-gray-800 dark:text-gray-800 dark:hover:text-gray-300"
        >
          X
        </button>
      </div>
      <p {...errorMessageProps} className="text-red-500 mt-2 text-xs">
        {error?.message}
      </p>
    </div>
  )
}

function DateSegment({
  segment,
  state,
}: {
  segment: DateSegment
  state: DateFieldState
}) {
  const ref = useRef(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  const invalid = state.validationState === 'invalid'

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={`px-0.5 box-content tabular-nums text-right outline-none rounded-sm focus:bg-blue-500 focus:text-white group ${
        invalid
          ? 'text-red-500 placeholder:text-red-500 dark:!text-red-400 dark:placeholder:!text-red-400'
          : 'text-gray-900 dark:text-gray-300'
      }`}
    >
      <span
        aria-hidden="true"
        className={`block w-full text-center italic ${
          invalid ? 'text-red-500' : 'text-gray-500'
        } group-focus:text-white`}
        style={{
          visibility: segment.isPlaceholder ? 'visible' : 'hidden',
          height: segment.isPlaceholder ? '' : 0,
          pointerEvents: 'none',
        }}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? '' : segment.text}
    </div>
  )
}

export default TimeField
