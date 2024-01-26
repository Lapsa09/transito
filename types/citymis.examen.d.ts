export interface CitymisResponse {
  action: number
  content: Content
}

export interface Content {
  extra_th: any[]
  next_page_params: string
  note: string
  page_number: number
  pagination_next_style: string
  pagination_prev_style: string
  pagination_style: string
  prev_page_params: string
  schedule_list: ScheduleList[]
}

export interface ScheduleList {
  citizen: string
  date: string
  extra_td: any[]
  params: string
  process_type: string
  schedule_endtime: string
  schedule_id: string
  schedule_time: string
  status: string
  tos: Tos
}

export enum Tos {
  TurnosParaLicenciasDeConducir = 'Turnos para licencias de conducir',
}
