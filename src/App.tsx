import React, { lazy, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Header } from './components'
import { history } from './utils'
import { AppDispatch, IRootState, authActions } from './redux'
import { Roles, User } from './types'
import { AuthGuard, RoleGuard } from './guards'
import { abortFetch } from './services'
import './styles/globals.css'

const Login = lazy(() => import('./pages/login'))
const Register = lazy(() => import('./pages/register'))
const Home = lazy(() => import('./pages/home'))
const Controles = lazy(() => import('./pages/control/Controles'))
const Operativos = lazy(() => import('./pages/operativos/Operativos'))
const Sueldos = lazy(() => import('./pages/sueldos/sueldos'))
const Waze = lazy(() => import('./pages/waze/Main'))
const Radio = lazy(() => import('./pages/radio/Radio'))

function App() {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const dispatch = useDispatch<AppDispatch>()

  history.navigate = useNavigate()
  history.location = useLocation()

  useEffect(() => {
    dispatch(authActions.verify())
    return () => abortFetch()
  }, [])

  return (
    <>
      {user?.legajo ? <Header /> : null}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AuthGuard />}>
          <Route index path="/" element={<Home />} />
        </Route>
        <Route element={<RoleGuard rol={Roles.INSPECTOR} />}>
          <Route path="/control/*" element={<Controles />} />
          <Route path="/operativos/*" element={<Operativos />} />
          <Route path="/radio" element={<Radio />} />
        </Route>
        <Route element={<RoleGuard rol={Roles.ADMINISTRATIVO} />}>
          <Route path="/sueldos/*" element={<Sueldos />} />
        </Route>
        <Route element={<RoleGuard rol={Roles.WAZE} />}>
          <Route path="/waze/*" element={<Waze />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
