import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, IRootState, ISelectRouter, selectActions } from '../redux'
import { abortFetch } from '../services'

export default function useSelects() {
  const dispatch = useDispatch<AppDispatch>()
  const { selects, error } = useSelector<IRootState, ISelectRouter>(
    (x) => x.selects
  )

  useEffect(() => {
    if (selects.isEmpty()) {
      dispatch(selectActions.fetchSelects())
    }
    return () => abortFetch()
  }, [])
  return { selects, error }
}
