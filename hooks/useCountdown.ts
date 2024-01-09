'use client'

import { useState, useEffect } from 'react'

export const useCountdown = ({
  initialSeconds,
}: {
  initialSeconds?: number
}) => {
  const [seconds, setSeconds] = useState(initialSeconds ?? 0)

  useEffect(() => {
    // Exit early if countdown is finished
    // Set up the timer
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds ? prevSeconds - 1 : prevSeconds))
    }, 1000)

    // Clean up the timer
    return () => clearInterval(timer)
  }, [seconds])

  return { seconds }
}
