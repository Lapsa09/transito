import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue = null) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    // Get from local storage by key
    const item = window.localStorage.getItem(key);
    try {
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      return item || initialValue;
    }
  });

  useEffect(() => {
    setStoredValue(window.localStorage.getItem(key));
  }, [window.localStorage.getItem(key)]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        if (value) {
          window.localStorage.setItem(
            key,
            JSON.stringify(valueToStore, null, 2)
          );
        } else {
          window.localStorage.removeItem(key);
        }
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
    }
  };
  return [storedValue, setValue];
}
