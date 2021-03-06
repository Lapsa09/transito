import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AccidentesPage from "./pages/accidentes/Accidentes.page";
import OperativosPage from "./pages/operativos/Operativos.page";
import ControlDiarioPage from "./pages/control_diario/ControlDiarioPage";
import ControlInspectores from "./components/control_diario.components/ControlInspectores";
import Register from "./pages/register/Register";
import "./App.css";
import Home from "./pages/home/Home";
import { verifyAuth } from "./services";
import Login from "./pages/login/Login";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "./utils/redux/userSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const checkAuthenticated = async () => {
    try {
      const parseRes = await verifyAuth();
      if (!parseRes) {
        dispatch(logout());
      }
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };

  useEffect(() => {
    checkAuthenticated();
    console.log(user);
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/accidentes"
          element={
            user ? (
              user.rol === "ADMIN" ? (
                <AccidentesPage />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/operativos"
          element={
            user ? (
              user.rol === "ADMIN" ? (
                <OperativosPage />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/control"
          element={
            user ? (
              user.rol === "ADMIN" ? (
                <ControlDiarioPage />
              ) : (
                <ControlInspectores />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
