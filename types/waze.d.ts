export interface RootObject {
  areaName: string
  bbox: { [key: string]: number }
  broadcasterId: string
  irregularities: Irregularity[]
  isMetric: boolean
  lengthOfJams: LengthOfJam[]
  name: string
  routes: Irregularity[]
  updateTime: number
  usersOnJams: UsersOnJam[]
}

export interface Irregularity {
  alternateRoute?: AlternateRoute
  bbox: { [key: string]: number }
  fromName: string
  historicTime: number
  id: string
  jamLevel: number
  length: number
  line: Line[]
  name: string
  subRoutes: SubRoute[]
  time: number
  toName: string
  type: Type
}

export interface AlternateRoute {
  historicTime: number
  jamLevel: number
  length: number
  line: Line[]
  name: string
  time: number
}

export interface Line {
  x: number
  y: number
}

export interface SubRoute {
  bbox: { [key: string]: number }
  fromName: string
  historicTime: number
  jamLevel: number
  length: number
  line: Line[]
  time: number
  toName: string
}

export enum Type {
  Dynamic = 'DYNAMIC',
  Static = 'STATIC',
}

export interface LengthOfJam {
  jamLength: number
  jamLevel: number
}

export interface UsersOnJam {
  jamLevel: number
  wazersCount: number
}
