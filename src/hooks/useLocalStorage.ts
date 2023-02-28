import { useEffect, useState } from 'react'

export default function useLocalStorage<T>(key: string) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Get from local storage by key
    const item = window.localStorage.getItem(key)
    try {
      // Parse stored json or if none return initialValue
      return JSON.parse(item)
    } catch (error) {
      // If error also return initialValue
      return item
    }
  })

  useEffect(() => {
    const item = JSON.parse(window.localStorage.getItem(key))
    setStoredValue(item)
  }, [window.localStorage.getItem(key)])

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value)
      // Save to local storage
      if (typeof window !== 'undefined') {
        if (value) {
          window.localStorage.setItem(key, JSON.stringify(value, null, 2))
        } else {
          window.localStorage.removeItem(key)
        }
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
    }
  }
  return [storedValue, setValue] as [T, (value: T) => void]
}
