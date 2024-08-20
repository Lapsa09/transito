'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface DatePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date.
   * @default undefined
   * @type Date
   * @example new Date()
   */
  date?: Date

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps['variant'], 'destructive' | 'link'>

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps['size'], 'icon'>

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string
}

export function DatePicker({
  placeholder,
  triggerVariant,
  triggerClassName,
  triggerSize,
  className,
  ...props
}: DatePickerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [date, setDate] = React.useState<Date | undefined>(() => {
    const fecha = searchParams.get('fecha')

    let day: Date | undefined

    if (props.date) {
      day = props.date
    }

    return fecha ? new Date(fecha + 'T00:00:00') : day
  })

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (date) {
      newSearchParams.set('fecha', format(date, 'yyyy-MM-dd'))
    } else {
      newSearchParams.delete('fecha')
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            triggerClassName,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'PPP', {
              locale: es,
            })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', className)} {...props}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
