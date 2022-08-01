import React from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
} from "./pages";
import { useSelector } from "react-redux";
import "./styles/globals.css";
import PrivateRoute from "./layouts/PrivateRoute";
import { Header } from "./components";
import { history } from "./utils";

function App() {
  const user = useSelector((x) => x.user.user);

  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div>
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
    </div>
  );
}

export default App;
