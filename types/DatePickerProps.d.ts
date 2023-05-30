interface ITheme {
  background: string
  todayBtn: string
  clearBtn: string
  icons: string
  text: string
  disabledText: string
  input: string
  inputIcon: string
  selected: string
}

interface IIcons {
  prev: () => React.ReactNode
  next: () => React.ReactNode
}

export interface IOptions {
  title?: string
  autoHide?: boolean
  todayBtn?: boolean
  todayBtnText?: string
  clearBtn?: boolean
  clearBtnText?: string
  maxDate?: Date
  minDate?: Date
  theme?: ITheme
  icons?: IIcons
  datepickerClassNames?: string
  defaultDate?: Date
  language?: string
  weekDays?: string[]
  disabledDates?: Date[]
  inputNameProp?: string
}
