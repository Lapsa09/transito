interface Horario {
  id: number
  calles: string
  trafico: number
  tiempo: number
  tiempo_hist: number
  velocidad: number
  velocidad_hist: number
}

interface WazePromedio {
  '08:30:00': Horario[]
  '12:30:00': Horario[]
  '17:30:00': Horario[]
}

interface WazeRes {
  id: number
  fecha: string
  '08:30:00': Horario[]
  '12:30:00': Horario[]
  '17:30:00': Horario[]
}

export interface Waze {
  res: WazeRes
  promedio: WazePromedio
}
