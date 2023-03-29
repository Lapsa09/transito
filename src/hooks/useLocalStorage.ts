import { useState } from 'react'

export default function useLocalStorage<T>(
  key: string
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key)
    try {
      return JSON.parse(item)
    } catch (error) {
      return item
    }
  })

  const setValue = (value: T) => {
    try {
      if (value) {
        localStorage.setItem(key, JSON.stringify(value, null, 2))
        setStoredValue(value)
      } else {
        localStorage.removeItem(key)
        setStoredValue(null)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue]
}
