import { useEffect, useState } from 'react'
import { abortFetch } from '../services'

export default function useData<T>(input: <T>() => Promise<T[]>) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      setData(await input<T>())
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data)
    }
  }

  useEffect(() => {
    fetchData()

    return () => abortFetch()
  }, [])

  const refresh = (_data: T) => setData((data) => [...data, _data])

  return { loading, data, error, refresh }
}
