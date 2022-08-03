import { getter } from '.'

const mainWazeGetter = async () => {
  const { res, promedio } = await getter('/waze')
  return { res, promedio }
}

const getDates = async () => {
  const data = await getter('/waze/dates')
  return data
}

const getOneDate = async (id) => {
  const data = await getter('/waze/' + id)
  return data
}

export { mainWazeGetter, getDates, getOneDate }
