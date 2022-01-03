import React, { useState } from "react";
import { Box, Button, FormHelperText, TextField } from "@mui/material";
import { login } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setAuth }) {
  const [legajo, setLegajo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await login({ legajo, password });
      if (res.jwtToken) {
        localStorage.setItem("token", res.jwtToken);
        setAuth(true);
        navigate("/");
      } else {
        setError(res);
      }
    } catch (error) {
      setError(error.response.data);
    }
  };

  const register = () => {
    navigate("/register");
  };
  return (
    <div className="login">
      <Box component="form" className="form">
        <TextField
          type="number"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
          label="Legajo"
        />
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Contraseña"
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div className="buttons">
          <Button onClick={register}>No te registraste? Registrarse</Button>
          <Button onClick={handleSubmit} variant="contained">
            Iniciar sesion
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Login;
