import { createSlice } from '@reduxjs/toolkit'

export type SnackbarResponse = {
  severity: 'success' | 'error' | 'warning' | 'info' | undefined
  message: string
}

export type SnackbarState = {
  open: boolean
  response: SnackbarResponse
}

const initialState: SnackbarState = {
  open: false,
  response: { severity: undefined, message: '' },
}

const slice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.open = true
      state.response.severity = 'error'
      state.response.message = action.payload
    },
    setSuccess: (state, action) => {
      state.open = true
      state.response.severity = 'success'
      state.response.message = action.payload
    },
    closeSnackbar: (state) => {
      state.open = false
    },
  },
})

export const { setError, setSuccess, closeSnackbar } = slice.actions
export const snackbarReducer = slice.reducer
