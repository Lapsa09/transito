import { useDispatch } from 'react-redux'
import { AppDispatch, setError, setSuccess } from '../redux'

export default function useSnackBar() {
  const dispatch = useDispatch<AppDispatch>()

  const handleError = (error: any) => {
    dispatch(setError(error.response?.data || error.message))
  }

  const handleSuccess = (message: string) => {
    dispatch(setSuccess(message))
  }

  return { handleSuccess, handleError }
}
