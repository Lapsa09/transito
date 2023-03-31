import { Alert, Snackbar } from '@mui/material'
import React from 'react'
import { sxStyles } from '../../utils'

function CustomSnackbar({ res, open, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={res.severity}
        sx={sxStyles.fullWidth}
      >
        {res.message}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar
