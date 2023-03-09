import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { IRootState, IRootUser } from '../redux'

function AuthGuard() {
  const { user } = useSelector<IRootState, IRootUser>((x) => x.user)

  return user.legajo ? <Outlet /> : <Navigate to="/login" replace />
}

export default AuthGuard
