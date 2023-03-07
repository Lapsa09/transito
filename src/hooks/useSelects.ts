import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, IRootState, selectActions, SelectData } from '../redux'

export default function useSelects() {
  const dispatch = useDispatch<AppDispatch>()
  const selects = useSelector<IRootState, SelectData>((x) => x.selects.selects)
  const error = useSelector<IRootState, ErrorEvent>((x) => x.selects.error)

  useEffect(() => {
    if (!selects) {
      dispatch(selectActions.fetchSelects())
    }
  }, [])
  return { selects, error }
}
