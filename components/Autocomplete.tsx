'use client'
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  UseControllerProps,
  useController,
  useFormContext,
} from 'react-hook-form'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from './ui/scroll-area'

interface Props extends UseControllerProps {
  options: any[]
  label: string
  inputLabel?: string
  inputId?: string
  className?: string
  persist?: (data: any) => void
}

export default function MyCombobox({
  label,
  name,
  options = [],
  inputId = name,
  inputLabel = name,
  className,
  persist,
  rules,
}: Props) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, rules })
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option[inputLabel].toLowerCase().includes(query.toLowerCase()),
        )

  const handleChange = (currentValue: string) => {
    const option = options.find(
      (option) =>
        option[inputLabel].toLowerCase() === currentValue.toLowerCase(),
    )
    if (field.value && option[inputId] === field.value[inputId]) {
      field.onChange(null)
      if (persist) persist({ [name]: null })
      setQuery('')
    } else {
      field.onChange(option)
      if (persist) persist({ [name]: option })
    }
    setOpen(false)
  }

  return (
    <div className={cn('pb-6', className)}>
      <label
        className={`block text-small font-medium text-foreground pb-1.5 ${
          rules?.required &&
          "after:content-['*'] after:text-danger after:ml-0.5"
        } will-change-auto origin-top-left transition-all !duration-200 !ease-[cubic-bezier(0,0,0.2,1)] motion-reduce:transition-none`}
        htmlFor={field.name}
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            name={field.name}
            className={`w-full justify-between border ${
              invalid ? 'border-danger' : 'border-gray-600'
            }`}
          >
            <span className={`${invalid && 'text-danger'} font-normal `}>
              {field.value ? field.value[inputLabel] : 'Elija una opcion...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Elija una opcion..."
            />
            <ScrollArea className="h-60">
              <CommandEmpty>Vacio.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((framework) => (
                  <CommandItem key={framework[inputId]} onSelect={handleChange}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        field.value &&
                          field.value[inputId] === framework[inputId]
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {framework[inputLabel]}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
      <span className="text-tiny text-danger left-1 pt-1 px-1">
        {error?.message}
      </span>
    </div>
  )
}
