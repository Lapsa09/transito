import { Location, NavigateFunction } from 'react-router-dom'

type IHistory = {
  navigate: NavigateFunction
  location: Location
}

export const history: IHistory = {
  navigate: null,
  location: null,
}
