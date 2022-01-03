import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccidentesPage from "./pages/accidentes/Accidentes.page";
import OperativosPage from "./pages/operativos/Operativos.page";
import ControlDiarioPage from "./pages/control_diario/ControlDiarioPage";
import Register from "./pages/register/Register";
import "./App.css";
import { verifyAuth } from "./services";

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
        <Route path="/" element={<App />} />
        <Route path="/accidentes" element={<AccidentesPage />} />
        <Route path="/operativos" element={<OperativosPage />} />
        <Route path="/control" element={<ControlDiarioPage />} />
        <Route path="/register" element={<Register setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;
