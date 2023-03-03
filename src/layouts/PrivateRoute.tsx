import { IRootState } from '@redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { history } from '../utils'

function PrivateRoute({ children, permission }) {
  const { user: authUser } = useSelector((x: IRootState) => x.user)

  if (!authUser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" state={{ from: history.location }} />
  }
  if (
    authUser.rol !== permission &&
    permission !== 'public' &&
    authUser.rol !== 'ADMIN'
  )
    return <Navigate to="/" state={{ from: history.location }} replace />

  return children
}

export default PrivateRoute
