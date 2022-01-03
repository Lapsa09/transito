import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AccidentesPage from "./pages/accidentes/Accidentes.page";
import OperativosPage from "./pages/operativos/Operativos.page";
import ControlDiarioPage from "./pages/control_diario/ControlDiarioPage";
import Register from "./pages/register/Register";
import "./App.css";
import Home from "./pages/home/Home";
import { verifyAuth } from "./services";
import Login from "./pages/login/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthenticated = async () => {
    try {
      const parseRes = await verifyAuth();
      setIsAuthenticated(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/accidentes"
          element={
            isAuthenticated ? <AccidentesPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/operativos"
          element={
            isAuthenticated ? <OperativosPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/control"
          element={
            isAuthenticated ? <ControlDiarioPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register setAuth={setAuth} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
