import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Register,
  ControlDiarioPage,
  ControlPaseoPage,
  AutosPage,
  MotosPage,
  CamionesPage,
} from "./pages";
import { useSelector } from "react-redux";
import { selectUser } from "./redux/userSlice";
import PrivateRoute from "./layouts/PrivateRoute";

function App() {
  const user = useSelector(selectUser);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            <PrivateRoute>
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
            <PrivateRoute>
              <ControlDiarioPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/control/paseo"
          element={
            <PrivateRoute>
              <ControlPaseoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/operativos/autos"
          element={
            <PrivateRoute>
              <AutosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/operativos/motos"
          element={
            <PrivateRoute>
              <MotosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/operativos/camiones"
          element={
            <PrivateRoute>
              <CamionesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
