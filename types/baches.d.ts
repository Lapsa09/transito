export interface RootObject {
  alerts: Alert[]
  endTime: string
  endTimeMillis: number
  jams: Jam[]
  startTime: string
  startTimeMillis: number
}

export interface Alert {
  city?: string
  confidence: number
  country: Country
  location: Location
  magvar: number
  nThumbsUp?: number
  pubMillis: number
  reliability: number
  reportByMunicipalityUser: string
  reportDescription?: string
  reportRating: number
  roadType: number
  street: string
  subtype: string
  type: AlertType
  uuid: string
}

export enum Country {
  Ar = 'AR',
}

export interface Location {
  x: number
  y: number
}

export enum AlertType {
  Accident = 'ACCIDENT',
  Hazard = 'HAZARD',
  Jam = 'JAM',
  RoadClosed = 'ROAD_CLOSED',
}

export interface Jam {
  blockingAlertUuid?: string
  city: string
  country: Country
  delay: number
  endNode: string
  length: number
  level: number
  line: Location[]
  pubMillis: number
  roadType: number
  segments: Segment[]
  speed: number
  speedKMH: number
  startNode?: string
  street: string
  turnType: TurnTypeEnum
  type: TurnTypeEnum
  uuid: number
}

export interface Segment {
  ID: number
  fromNode: number
  isForward: boolean
  toNode: number
}

export enum TurnTypeEnum {
  None = 'NONE',
}
