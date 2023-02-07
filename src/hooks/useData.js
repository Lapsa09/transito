import { useEffect, useState } from 'react'

export default function useData(input) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      setData(await input())
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refresh = (_data) => setData((data) => [...data, _data])

  return { loading, data, error, refresh }
}
