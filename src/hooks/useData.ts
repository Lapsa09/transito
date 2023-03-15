import { useEffect, useState } from 'react'
import { abortFetch } from '../services'

export default function useData<T>(input: () => Promise<T[]>) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState(null)

  useEffect(() => {
    input()
      .then((res) => setData(res))
      .catch((e) => setError(e.response?.data))
      .finally(() => setLoading(false))
    return () => abortFetch()
  }, [])

  const refresh = (_data: T) => setData((data) => [...data, _data])

  return { loading, data, error, refresh }
}
