import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { IRootState, IRootUser } from '../redux'
import { Roles } from '../types'

function RoleGuard({ rol }) {
  const { user } = useSelector<IRootState, IRootUser>((x) => x.user)

  return user.rol === rol || user.rol === Roles.ADMIN ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  )
}

export default RoleGuard
