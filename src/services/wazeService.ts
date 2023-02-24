import { Waze } from 'types/Waze'
import { getter } from '.'

const mainWazeGetter = async (): Promise<Waze> => await getter('/waze')

const getDates = async () => await getter('/waze/dates')

const getOneDate = async (id) => await getter('/waze/' + id)

export { mainWazeGetter, getDates, getOneDate }
