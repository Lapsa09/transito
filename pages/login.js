import React, { useState } from "react";
import { Box, Button, FormHelperText, TextField } from "@mui/material";
import { loginCall } from "../services/userService";
import style from "../styles/Login.module.css";
import { login } from "../utils/redux/userSlice";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";

function Login() {
  const [legajo, setLegajo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await loginCall({ legajo, password });
      localStorage.setItem("token", res);
      const user = jwt_decode(res);
      dispatch(login(user));
    } catch (error) {
      setError(error.response.data);
    }
  };

  const register = () => {
    router.push("/register");
  };
  return (
    <div className={style.login}>
      <Box component="form" className={`form ${style.form}`}>
        <TextField
          type="number"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
          label="Legajo"
          className={style["MuiTextField-root"]}
        />
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Contraseña"
          className={style["MuiTextField-root"]}
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div className={`buttons ${style.buttons}`}>
          <Button className={style["MuiButton-root"]} onClick={register}>
            No te registraste? Registrarse
          </Button>
          <Button
            className={style["MuiButton-root"]}
            onClick={handleSubmit}
            variant="contained"
          >
            Iniciar sesion
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Login;
