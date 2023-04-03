import { useEffect, useState } from 'react'

export default function useData<T>(input: () => Promise<T[]>) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState(null)

  useEffect(() => {
    input()
      .then((res) => setData(res))
      .catch((e) => setError(e.response?.data))
      .finally(() => setLoading(false))
  }, [])

  const refreshPost = (_data: T) => setData((data) => [...data, _data])

  const refreshPut = (_data: T, key) =>
    setData((data) => data.map((d) => (d[key] === _data[key] ? _data : d)))

  return { loading, data, error, refreshPost, refreshPut }
}
