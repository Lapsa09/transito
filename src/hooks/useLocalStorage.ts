import { useEffect, useState } from 'react'

export default function useLocalStorage<T>(key: string) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key)
    try {
      return JSON.parse(item)
    } catch (error) {
      return item
    }
  })

  useEffect(() => {
    const item = JSON.parse(window.localStorage.getItem(key))
    setStoredValue(item)
  }, [window.localStorage.getItem(key)])

  const setValue = (value: T) => {
    try {
      if (value) {
        window.localStorage.setItem(key, JSON.stringify(value, null, 2))
      } else {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue] as [T, (value: T) => void]
}
