import React, { Fragment } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Home,
  Login,
  Register,
  ControlDiarioPage,
  ControlPaseoPage,
  AutosPage,
  MotosPage,
  CamionesPage,
  Sueldos,
  Waze,
  History,
} from './pages'
import './styles/globals.css'
import PrivateRoute from './layouts/PrivateRoute'
import { Header } from './components'
import { history } from './utils'
// import { authActions } from './redux/userSlice'

function App() {
  const user = useSelector((x) => x.user.user)
  // const dispatch = useDispatch()

  history.navigate = useNavigate()
  history.location = useLocation()

  // useEffect(() => {
  //   dispatch(authActions.verify())
  // }, [])

  return (
    <Fragment>
      {user && <Header />}
      <Routes>
        <Route
          index
          path="/"
          element={
            <PrivateRoute permission="public">
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" replace />}
        />
        <Route
          path="/control/diario"
          element={
            <PrivateRoute permission="INSPECTOR">
              <ControlDiarioPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/control/paseo"
          element={
            <PrivateRoute permission="INSPECTOR">
              <ControlPaseoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/operativos/autos"
          element={
            <PrivateRoute permission="INSPECTOR">
              <AutosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/operativos/motos"
          element={
            <PrivateRoute permission="INSPECTOR">
              <MotosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/operativos/camiones"
          element={
            <PrivateRoute permission="INSPECTOR">
              <CamionesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/sueldos/*"
          element={
            <PrivateRoute permission="ADMINISTRATIVO">
              <Sueldos />
            </PrivateRoute>
          }
        />
        <Route
          path="/waze"
          element={
            <PrivateRoute permission="TRAFICO">
              <Waze />
            </PrivateRoute>
          }
        />
        <Route
          path="waze/historial"
          element={
            <PrivateRoute permission="TRAFICO">
              <History />
            </PrivateRoute>
          }
        />
      </Routes>
    </Fragment>
  )
}

export default App
