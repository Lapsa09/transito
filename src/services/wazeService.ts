import { Waze, WazeRes } from '../types'
import { getter } from '.'

const mainWazeGetter = async () => await getter<Waze>('/waze')

const getDates = async () => await getter('/waze/dates')

const getOneDate = async (id) => await getter<WazeRes>('/waze/' + id)

export { mainWazeGetter, getDates, getOneDate }
