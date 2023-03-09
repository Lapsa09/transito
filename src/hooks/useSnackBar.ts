import { useState } from 'react'

export default function useSnackBar() {
  const [openSB, setOpenSB] = useState(false)
  const [response, setResponse] = useState<{
    severity: 'error' | 'success'
    message: string
  }>({ severity: null, message: '' })

  const setError = (message: string) => {
    setResponse({ severity: 'error', message })
    setOpenSB(true)
  }

  const closeSnackbar = (_, reason: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSB(false)
  }

  const setSuccess = (message: string) => {
    setResponse({ severity: 'success', message })
    setOpenSB(true)
  }

  return { openSB, response, setError, setSuccess, closeSnackbar }
}
