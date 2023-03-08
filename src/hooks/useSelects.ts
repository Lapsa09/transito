import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, IRootState, ISelectRouter, selectActions } from '../redux'

export default function useSelects() {
  const dispatch = useDispatch<AppDispatch>()
  const { selects, error } = useSelector<IRootState, ISelectRouter>(
    (x) => x.selects
  )

  const isEmpty = (object: any) => Object.values(object).every((x) => x == null)

  useEffect(() => {
    if (isEmpty(selects)) {
      dispatch(selectActions.fetchSelects())
    }
  }, [])
  return { selects, error }
}
