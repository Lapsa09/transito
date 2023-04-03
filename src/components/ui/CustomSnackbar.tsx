import { Alert, Snackbar } from '@mui/material'
import React from 'react'
import { sxStyles } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppDispatch,
  IRootState,
  SnackbarState,
  closeSnackbar,
} from '../../redux'

function SnackBarProvider({ children }) {
  const dispatch = useDispatch<AppDispatch>()
  const { open, response } = useSelector<IRootState, SnackbarState>(
    (state) => state.snackbar
  )
  const handleClose = () => {
    dispatch(closeSnackbar())
  }
  return (
    <>
      {children}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={response.severity}
          sx={sxStyles.fullWidth}
        >
          {response.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default SnackBarProvider
